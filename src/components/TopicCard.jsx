import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
    GripVertical, ChevronDown, ChevronRight, Plus, Edit2, Trash2,
    FolderPlus, CheckCircle2
} from 'lucide-react';
import useSheetStore from '../store/useSheetStore';
import { calculateTopicProgress } from '../utils/helpers';
import QuestionRow from './QuestionRow';

export default function TopicCard({
    topic,
    index,
    questions,
    onEditTopic,
    onDeleteTopic,
    onAddSubTopic,
    onAddQuestion,
    onEditQuestion,
    onDeleteQuestion
}) {
    const { expandedTopics, toggleTopic, subTopics } = useSheetStore();
    const isExpanded = expandedTopics[topic];
    const progress = calculateTopicProgress(questions, topic);
    const topicSubTopics = subTopics[topic] || [];

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: topic, data: { type: 'topic' } });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    // Filter questions for this topic
    const topicQuestions = questions.filter(q => q.topic === topic);
    const questionIds = topicQuestions.map(q => q.id);

    return (
        <div
            ref={setNodeRef}
            style={style}
            id={`topic-${topic.replace(/\s+/g, '-')}`}
            className="card mb-4 overflow-hidden"
        >
            {/* Topic Header */}
            <div
                className="topic-header flex items-center gap-3 p-4 hover:bg-white/5 transition-colors"
                onClick={() => toggleTopic(topic)}
            >
                {/* Drag Handle */}
                <button
                    {...attributes}
                    {...listeners}
                    className="drag-handle p-1 cursor-grab"
                    onClick={(e) => e.stopPropagation()}
                >
                    <GripVertical size={18} />
                </button>

                {/* Expand Icon */}
                <div className="text-slate-400">
                    {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                </div>

                {/* Topic Info */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3">
                        <span className="text-sm font-mono text-indigo-400">
                            {String(index + 1).padStart(2, '0')}
                        </span>
                        <h3 className="text-lg font-semibold text-white truncate">{topic}</h3>
                    </div>
                </div>

                {/* Progress */}
                <div className="flex items-center gap-3">
                    {progress.percentage === 100 && (
                        <CheckCircle2 className="text-green-400" size={20} />
                    )}
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-medium text-white">
                            {progress.solved}/{progress.total}
                        </p>
                        <p className="text-xs text-slate-400">{progress.percentage}%</p>
                    </div>
                    <div className="w-20 h-2 bg-white/10 rounded-full overflow-hidden hidden sm:block">
                        <div
                            className="h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-full transition-all"
                            style={{ width: `${progress.percentage}%` }}
                        />
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                    <button
                        onClick={() => onAddQuestion(topic)}
                        className="btn-icon"
                        title="Add Question"
                    >
                        <Plus size={18} />
                    </button>
                    <button
                        onClick={() => onAddSubTopic(topic)}
                        className="btn-icon"
                        title="Add Sub-topic"
                    >
                        <FolderPlus size={18} />
                    </button>
                    <button
                        onClick={() => onEditTopic(topic)}
                        className="btn-icon"
                        title="Edit Topic"
                    >
                        <Edit2 size={18} />
                    </button>
                    <button
                        onClick={() => onDeleteTopic(topic)}
                        className="btn-icon text-red-400 hover:text-red-300"
                        title="Delete Topic"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            </div>

            {/* Topic Content */}
            <div className={`topic-content ${isExpanded ? 'expanded' : ''}`}>
                <div className="px-4 pb-4">
                    {/* Questions List */}
                    <SortableContext items={questionIds} strategy={verticalListSortingStrategy}>
                        <div className="space-y-1">
                            {topicQuestions.length === 0 ? (
                                <div className="text-center py-8 text-slate-500">
                                    <p>No questions yet</p>
                                    <button
                                        onClick={() => onAddQuestion(topic)}
                                        className="text-indigo-400 hover:text-indigo-300 mt-2 text-sm"
                                    >
                                        Add your first question
                                    </button>
                                </div>
                            ) : (
                                topicQuestions.map((question, qIndex) => (
                                    <QuestionRow
                                        key={question.id}
                                        question={question}
                                        index={qIndex}
                                        onEdit={onEditQuestion}
                                        onDelete={onDeleteQuestion}
                                    />
                                ))
                            )}
                        </div>
                    </SortableContext>
                </div>
            </div>
        </div>
    );
}
