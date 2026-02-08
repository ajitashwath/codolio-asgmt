import { useState, useEffect } from 'react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { Plus } from 'lucide-react';

import TopicNavigation from './components/TopicNavigation';
import QuestionTable from './components/QuestionTable';
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
        activeTopicId,
        setActiveTopic,
        addTopic,
        updateTopic,
        deleteTopic,
        reorderTopics,
        addSubTopic,
        addQuestion,
        updateQuestion,
        deleteQuestion,
        reorderQuestions,
        toggleSolved
    } = useSheetStore();

    // Initialize active topic
    useEffect(() => {
        if (!activeTopicId && topicOrder.length > 0) {
            setActiveTopic(topicOrder[0]);
        }
    }, [topicOrder, activeTopicId, setActiveTopic]);

    const [modal, setModal] = useState({ type: null, data: null });

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const openModal = (type, data = null) => setModal({ type, data });
    const closeModal = () => setModal({ type: null, data: null });

    const handleAddTopic = (data) => { addTopic(data.name); closeModal(); };
    const handleEditTopic = (data) => { updateTopic(modal.data, data.name); closeModal(); };
    const handleDeleteTopic = () => { deleteTopic(modal.data); closeModal(); };
    const handleAddSubTopic = (data) => { addSubTopic(modal.data.topic, data.name); closeModal(); };
    const handleAddQuestion = (data) => { addQuestion(data); closeModal(); };
    const handleEditQuestion = (data) => { updateQuestion(modal.data.id, data); closeModal(); };
    const handleDeleteQuestion = () => { deleteQuestion(modal.data.id); closeModal(); };

    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;
        const oldIndex = topicOrder.indexOf(active.id);
        const newIndex = topicOrder.indexOf(over.id);
        if (oldIndex !== -1 && newIndex !== -1) {
            reorderTopics(oldIndex, newIndex);
        }
    };

    return (
        <div className="flex h-screen bg-black text-[#E5E5E5] font-mono overflow-hidden">
            {/* 
                BRUTALIST SIDEBAR 
                - Fixed minimal width primarily
                - Expands sharply on hover
                - Solid Border Right
            */}
            <aside className="group/sidebar relative z-50 flex flex-col border-r border-[#333] bg-black w-[60px] hover:w-[300px] transition-all duration-200 ease-out overflow-hidden">

                {/* Brand / Logo Area */}
                <div className="h-[60px] flex items-center border-b border-[#333] shrink-0">
                    <div className="w-[60px] h-full flex items-center justify-center shrink-0">
                        <div className="w-6 h-6 border-2 border-white bg-white rotate-45"></div>
                    </div>
                    <span className="opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-100 text-xl font-bold tracking-[0.2em] whitespace-nowrap pl-4">
                        CODOLIO
                    </span>
                </div>

                {/* Navigation Items */}
                <div className="flex-1 overflow-y-auto overflow-x-hidden py-4">
                    <div className="opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-100 px-6 pb-2 text-[10px] uppercase text-[#666] tracking-widest font-bold border-b border-transparent group-hover/sidebar:border-[#222] mb-2 mx-4">
                        / Domains
                    </div>

                    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                        <SortableContext items={topicOrder} strategy={verticalListSortingStrategy}>
                            <div className="flex flex-col gap-[1px]">
                                {topicOrder.map((topic, index) => (
                                    <TopicNavigation
                                        key={topic}
                                        topic={topic}
                                        index={index}
                                        onEdit={() => openModal('editTopic', topic)}
                                        onDelete={() => openModal('deleteTopic', topic)}
                                    />
                                ))}
                            </div>
                        </SortableContext>
                    </DndContext>
                </div>

                {/* Bottom Action: Add Topic */}
                <button
                    onClick={() => openModal('addTopic')}
                    className="h-[60px] flex items-center border-t border-[#333] hover:bg-white hover:text-black transition-colors shrink-0"
                >
                    <div className="w-[60px] h-full flex items-center justify-center shrink-0">
                        <Plus size={20} strokeWidth={2} />
                    </div>
                    <span className="opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-100 text-xs font-bold uppercase tracking-widest whitespace-nowrap pl-4">
                        Initialize New Topic
                    </span>
                </button>
            </aside>

            {/* MAIN CONTENT */}
            <main className="flex-1 flex flex-col relative w-full h-full bg-black">
                {activeTopicId ? (
                    <QuestionTable
                        topic={activeTopicId}
                        onAddQuestion={() => openModal('addQuestion', { topic: activeTopicId })}
                        onEditQuestion={(q) => openModal('editQuestion', q)}
                        onDeleteQuestion={(q) => openModal('deleteQuestion', q)}
                    />
                ) : (
                    <div className="flex-1 flex items-center justify-center border-[20px] border-[#111] m-10">
                        <div className="text-center">
                            <h1 className="text-4xl font-bold uppercase tracking-tighter mb-4 text-[#333]">System Idle</h1>
                            <p className="text-[#444] text-xs uppercase tracking-widest">Select a domain to engage</p>
                        </div>
                    </div>
                )}
            </main>

            {/* Modals */}
            <Modal isOpen={modal.type === 'addTopic'} onClose={closeModal} title="New Domain">
                <TopicForm onSubmit={handleAddTopic} onCancel={closeModal} />
            </Modal>

            <Modal isOpen={modal.type === 'editTopic'} onClose={closeModal} title="Edit Domain">
                <TopicForm initialData={{ name: modal.data }} onSubmit={handleEditTopic} onCancel={closeModal} />
            </Modal>

            <Modal isOpen={modal.type === 'deleteTopic'} onClose={closeModal} title="Delete Domain">
                <DeleteConfirmDialog type="Topic" name={modal.data} onConfirm={handleDeleteTopic} onCancel={closeModal} />
            </Modal>

            <Modal isOpen={modal.type === 'addQuestion'} onClose={closeModal} title="Inject Problem" size="lg">
                <QuestionForm defaultTopic={modal.data?.topic} onSubmit={handleAddQuestion} onCancel={closeModal} />
            </Modal>

            <Modal isOpen={modal.type === 'editQuestion'} onClose={closeModal} title="Modify Problem" size="lg">
                <QuestionForm initialData={modal.data} onSubmit={handleEditQuestion} onCancel={closeModal} />
            </Modal>

            <Modal isOpen={modal.type === 'deleteQuestion'} onClose={closeModal} title="Purge Problem">
                <DeleteConfirmDialog type="Question" name={modal.data?.title} onConfirm={handleDeleteQuestion} onCancel={closeModal} />
            </Modal>
        </div>
    );
}

export default App;
