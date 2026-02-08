import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
    GripVertical, ChevronDown, ChevronRight, Plus, MoreHorizontal,
    Trash2, Edit2, FolderPlus
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
    const [showMenu, setShowMenu] = useState(false);

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
        opacity: isDragging ? 0.6 : 1,
        zIndex: isDragging ? 20 : 1,
    };

    // Filter questions for this topic
    const topicQuestions = questions.filter(q => q.topic === topic);
    const questionIds = topicQuestions.map(q => q.id);

    return (
        <div
            ref={setNodeRef}
            style={style}
            id={`topic-${topic.replace(/\s+/g, '-')}`}
            className="bg-white border-b border-[var(--color-border)] last:border-b-0"
        >
            {/* Topic Header */}
            <div
                className="group flex items-center gap-3 py-3 px-4 hover:bg-slate-50 transition-colors cursor-pointer border-l-4 border-transparent hover:border-[var(--color-accent)]"
                onClick={() => toggleTopic(topic)}
            >
                {/* Drag Handle */}
                <button
                    {...attributes}
                    {...listeners}
                    className="drag-handle opacity-0 group-hover:opacity-100 p-1 cursor-grab active:cursor-grabbing"
                    onClick={(e) => e.stopPropagation()}
                >
                    <GripVertical size={16} className="text-slate-400" />
                </button>

                {/* Expand Icon */}
                <div className="text-slate-400">
                    {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                </div>

                {/* Topic Info */}
                <div className="flex-1 min-w-0 flex items-center gap-3">
                    <span className="text-xs font-mono font-medium text-slate-400 w-6">
                        {String(index + 1).padStart(2, '0')}
                    </span>
                    <h3 className="text-base font-semibold text-[var(--color-text-primary)] truncate">{topic}</h3>

                    {/* Tiny Progress Pill */}
                    {progress.total > 0 && (
                        <div className="hidden sm:flex items-center gap-2 ml-4">
                            <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-[var(--color-accent)] rounded-full"
                                    style={{ width: `${progress.percentage}%` }}
                                />
                            </div>
                            <span className="text-[10px] bg-slate-100 px-1.5 rounded text-slate-500 font-medium">
                                {progress.solved}/{progress.total}
                            </span>
                        </div>
                    )}
                </div>

                {/* Actions (Hover only) */}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
                    <button
                        onClick={() => onAddQuestion(topic)}
                        className="btn btn-secondary text-xs py-1 px-2 h-7"
                    >
                        <Plus size={14} className="mr-1" /> Add Question
                    </button>

                    <div className="relative">
                        <button
                            onClick={() => setShowMenu(!showMenu)}
                            className="btn-icon p-1.5 hover:bg-slate-200"
                        >
                            <MoreHorizontal size={18} />
                        </button>

                        {showMenu && (
                            <>
                                <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
                                <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-xl border border-[var(--color-border)] py-1 z-20 animate-in fade-in zoom-in-95">
                                    <button
                                        onClick={() => { onAddSubTopic(topic); setShowMenu(false); }}
                                        className="w-full text-left px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-[var(--color-text-primary)] flex items-center gap-2"
                                    >
                                        <FolderPlus size={16} /> Add Sub-topic
                                    </button>
                                    <button
                                        onClick={() => { onEditTopic(topic); setShowMenu(false); }}
                                        className="w-full text-left px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-[var(--color-text-primary)] flex items-center gap-2"
                                    >
                                        <Edit2 size={16} /> Edit Topic
                                    </button>
                                    <div className="h-px bg-slate-100 my-1" />
                                    <button
                                        onClick={() => { onDeleteTopic(topic); setShowMenu(false); }}
                                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                                    >
                                        <Trash2 size={16} /> Delete Topic
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Topic Content (Questions Table) */}
            <div className={`
                overflow-hidden transition-[max-height] duration-300 ease-in-out
                ${isExpanded ? 'max-h-[5000px]' : 'max-h-0'}
            `}>
                <div className="pb-4">
                    {/* Table Header (Only visible if there are questions) */}
                    {topicQuestions.length > 0 && (
                        <div className="grid grid-cols-12 gap-6 px-6 py-3 border-y border-slate-100 bg-slate-50 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                            <div className="col-span-1 text-center">Status</div>
                            <div className="col-span-6 pl-2">Problem</div>
                            <div className="col-span-2 text-center">Difficulty</div>
                            <div className="col-span-2">Platform</div>
                            <div className="col-span-1 text-right">Actions</div>
                        </div>
                    )}

                    <SortableContext items={questionIds} strategy={verticalListSortingStrategy}>
                        <div>
                            {topicQuestions.length === 0 ? (
                                <div className="text-center py-8 text-slate-400 bg-slate-50/30 m-2 rounded-lg border border-dashed border-slate-200">
                                    <p className="text-sm mb-2">No questions in this topic yet</p>
                                    <button
                                        onClick={() => onAddQuestion(topic)}
                                        className="text-xs font-semibold text-[var(--color-accent)] hover:underline"
                                    >
                                        Add a Question
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
