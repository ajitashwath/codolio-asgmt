import { useState, useMemo } from 'react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragOverlay
} from '@dnd-kit/core';
import {
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { Menu } from 'lucide-react';

import Header from './components/Header';
import Sidebar from './components/Sidebar';
import TopicCard from './components/TopicCard';
import Modal from './components/Modal';
import TopicForm from './components/TopicForm';
import SubTopicForm from './components/SubTopicForm';
import QuestionForm from './components/QuestionForm';
import DeleteConfirmDialog from './components/DeleteConfirmDialog';
import useSheetStore from './store/useSheetStore';
import { filterQuestions } from './utils/helpers';

function App() {
    const {
        topicOrder,
        questions,
        filters,
        addTopic,
        updateTopic,
        deleteTopic,
        reorderTopics,
        addSubTopic,
        addQuestion,
        updateQuestion,
        deleteQuestion,
        reorderQuestions,
    } = useSheetStore();

    // UI State
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [modal, setModal] = useState({ type: null, data: null });

    // DnD Sensors
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: { distance: 8 }
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    // Filter questions
    const filteredQuestions = useMemo(() =>
        filterQuestions(questions, filters),
        [questions, filters]
    );

    // Modal handlers
    const openModal = (type, data = null) => setModal({ type, data });
    const closeModal = () => setModal({ type: null, data: null });

    // Topic handlers
    const handleAddTopic = (data) => {
        addTopic(data.name);
        closeModal();
    };

    const handleEditTopic = (data) => {
        updateTopic(modal.data, data.name);
        closeModal();
    };

    const handleDeleteTopic = () => {
        deleteTopic(modal.data);
        closeModal();
    };

    // SubTopic handlers
    const handleAddSubTopic = (data) => {
        addSubTopic(modal.data.topic, data.name);
        closeModal();
    };

    // Question handlers
    const handleAddQuestion = (data) => {
        addQuestion(data);
        closeModal();
    };

    const handleEditQuestion = (data) => {
        updateQuestion(modal.data.id, data);
        closeModal();
    };

    const handleDeleteQuestion = () => {
        deleteQuestion(modal.data.id);
        closeModal();
    };

    // Drag and Drop handler
    const handleDragEnd = (event) => {
        const { active, over } = event;

        if (!over || active.id === over.id) return;

        const activeData = active.data.current;
        const overData = over.data.current;

        // Topic reordering
        if (activeData?.type === 'topic' && overData?.type === 'topic') {
            const oldIndex = topicOrder.indexOf(active.id);
            const newIndex = topicOrder.indexOf(over.id);
            if (oldIndex !== -1 && newIndex !== -1) {
                reorderTopics(oldIndex, newIndex);
            }
            return;
        }

        // Question reordering within same topic
        const activeQuestion = questions.find(q => q.id === active.id);
        const overQuestion = questions.find(q => q.id === over.id);

        if (activeQuestion && overQuestion && activeQuestion.topic === overQuestion.topic) {
            const topicQuestions = questions.filter(q => q.topic === activeQuestion.topic);
            const oldIndex = topicQuestions.findIndex(q => q.id === active.id);
            const newIndex = topicQuestions.findIndex(q => q.id === over.id);
            if (oldIndex !== -1 && newIndex !== -1) {
                reorderQuestions(activeQuestion.topic, oldIndex, newIndex);
            }
        }
    };

    return (
        <div className="min-h-screen">
            {/* Header */}
            <Header />

            <div className="flex">
                {/* Sidebar */}
                <Sidebar
                    isOpen={sidebarOpen}
                    onToggle={() => setSidebarOpen(!sidebarOpen)}
                    onAddTopic={() => openModal('addTopic')}
                />

                {/* Main Content */}
                <main className={`flex-1 p-6 transition-all ${sidebarOpen ? 'lg:ml-0' : ''}`}>
                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="lg:hidden mb-4 btn-secondary"
                    >
                        <Menu size={18} />
                        Topics
                    </button>

                    <div className="max-w-4xl mx-auto">
                        {/* Topic Cards with DnD */}
                        <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragEnd={handleDragEnd}
                        >
                            <SortableContext
                                items={topicOrder}
                                strategy={verticalListSortingStrategy}
                            >
                                {topicOrder.map((topic, index) => (
                                    <TopicCard
                                        key={topic}
                                        topic={topic}
                                        index={index}
                                        questions={filteredQuestions}
                                        onEditTopic={() => openModal('editTopic', topic)}
                                        onDeleteTopic={() => openModal('deleteTopic', topic)}
                                        onAddSubTopic={() => openModal('addSubTopic', { topic })}
                                        onAddQuestion={() => openModal('addQuestion', { topic })}
                                        onEditQuestion={(q) => openModal('editQuestion', q)}
                                        onDeleteQuestion={(q) => openModal('deleteQuestion', q)}
                                    />
                                ))}
                            </SortableContext>
                        </DndContext>

                        {/* Empty State */}
                        {topicOrder.length === 0 && (
                            <div className="text-center py-20">
                                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center">
                                    <span className="text-4xl">📚</span>
                                </div>
                                <h2 className="text-2xl font-bold text-white mb-2">No Topics Yet</h2>
                                <p className="text-slate-400 mb-6">Get started by adding your first topic</p>
                                <button
                                    onClick={() => openModal('addTopic')}
                                    className="btn btn-primary"
                                >
                                    Add First Topic
                                </button>
                            </div>
                        )}
                    </div>
                </main>
            </div>

            {/* Modals */}
            {/* Add Topic */}
            <Modal isOpen={modal.type === 'addTopic'} onClose={closeModal} title="Add Topic">
                <TopicForm onSubmit={handleAddTopic} onCancel={closeModal} />
            </Modal>

            {/* Edit Topic */}
            <Modal isOpen={modal.type === 'editTopic'} onClose={closeModal} title="Edit Topic">
                <TopicForm
                    initialData={{ name: modal.data }}
                    onSubmit={handleEditTopic}
                    onCancel={closeModal}
                />
            </Modal>

            {/* Delete Topic */}
            <Modal isOpen={modal.type === 'deleteTopic'} onClose={closeModal} title="Delete Topic">
                <DeleteConfirmDialog
                    type="Topic"
                    name={modal.data}
                    onConfirm={handleDeleteTopic}
                    onCancel={closeModal}
                />
            </Modal>

            {/* Add SubTopic */}
            <Modal isOpen={modal.type === 'addSubTopic'} onClose={closeModal} title="Add Sub-topic">
                <SubTopicForm onSubmit={handleAddSubTopic} onCancel={closeModal} />
            </Modal>

            {/* Add Question */}
            <Modal isOpen={modal.type === 'addQuestion'} onClose={closeModal} title="Add Question" size="lg">
                <QuestionForm
                    defaultTopic={modal.data?.topic}
                    onSubmit={handleAddQuestion}
                    onCancel={closeModal}
                />
            </Modal>

            {/* Edit Question */}
            <Modal isOpen={modal.type === 'editQuestion'} onClose={closeModal} title="Edit Question" size="lg">
                <QuestionForm
                    initialData={modal.data}
                    onSubmit={handleEditQuestion}
                    onCancel={closeModal}
                />
            </Modal>

            {/* Delete Question */}
            <Modal isOpen={modal.type === 'deleteQuestion'} onClose={closeModal} title="Delete Question">
                <DeleteConfirmDialog
                    type="Question"
                    name={modal.data?.title}
                    onConfirm={handleDeleteQuestion}
                    onCancel={closeModal}
                />
            </Modal>
        </div>
    );
}

export default App;
