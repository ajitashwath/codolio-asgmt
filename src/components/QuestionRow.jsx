import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
    GripVertical, ExternalLink, MoreVertical,
    CheckCircle2, Circle, Clock, Check
} from 'lucide-react';
import useSheetStore from '../store/useSheetStore';

const difficultyColors = {
    easy: 'text-green-600 bg-green-50 border-green-200',
    medium: 'text-amber-600 bg-amber-50 border-amber-200',
    hard: 'text-red-600 bg-red-50 border-red-200',
};

const platformColors = {
    leetcode: 'text-amber-600',
    interviewbit: 'text-teal-600',
    spoj: 'text-blue-600',
    tuf: 'text-red-600',
};

export default function QuestionRow({ question, index, onEdit, onDelete }) {
    const { toggleQuestionStatus } = useSheetStore();
    const [showMenu, setShowMenu] = useState(false);

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: question.id, data: { type: 'question', topic: question.topic } });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        zIndex: isDragging ? 30 : 1,
    };

    const handleStatusToggle = (e) => {
        e.stopPropagation();
        toggleQuestionStatus(question.id);
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`
                group grid grid-cols-12 gap-6 items-center px-6 py-4 
                bg-white border-b border-slate-50 last:border-b-0
                hover:bg-slate-50 transition-colors
            `}
            onMouseLeave={() => setShowMenu(false)}
        >
            {/* 1. Drag Handle & Status (Col 1) */}
            <div className="col-span-1 flex items-center justify-center gap-3 relative">
                <button
                    {...attributes}
                    {...listeners}
                    className="drag-handle absolute -left-4 opacity-0 group-hover:opacity-100 p-1 cursor-grab active:cursor-grabbing text-slate-300 hover:text-slate-500 transition-opacity"
                >
                    <GripVertical size={14} />
                </button>
                <div className="relative">
                    <input
                        type="checkbox"
                        checked={question.done}
                        onChange={handleStatusToggle}
                        className="checkbox w-5 h-5 rounded-md border-slate-300 checked:bg-[var(--color-accent)] checked:border-[var(--color-accent)] cursor-pointer transition-all"
                    />
                </div>
            </div>

            {/* 2. Problem Title (Col 6) */}
            <div className="col-span-6 min-w-0 pl-2">
                <div className="flex items-center gap-2">
                    <a
                        href={question.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`text-sm font-medium truncate hover:underline underline-offset-4 decoration-slate-300 ${question.done ? 'text-slate-400 line-through decoration-slate-400' : 'text-[var(--color-text-primary)]'
                            }`}
                        title={question.title}
                    >
                        {question.title}
                    </a>
                </div>
            </div>

            {/* 3. Difficulty (Col 2) */}
            <div className="col-span-2 text-center">
                <span className={`badge badge-${question.difficulty?.toLowerCase() || 'medium'}`}>
                    {question.difficulty || 'Medium'}
                </span>
            </div>

            {/* 4. Platform (Col 2) */}
            <div className="col-span-2 flex items-center gap-2">
                <PlatformIcon platform={question.platform} />
                <span className="text-xs text-slate-600 font-medium capitalize">
                    {question.platform || 'LeetCode'}
                </span>
            </div>

            {/* 5. Actions (Col 1) */}
            <div className="col-span-1 flex justify-end relative">
                <button
                    onClick={() => setShowMenu(!showMenu)}
                    className="btn-icon p-2 text-slate-400 hover:text-[var(--color-text-primary)] hover:bg-white rounded-full transition-all opacity-0 group-hover:opacity-100"
                >
                    <MoreVertical size={18} />
                </button>

                {showMenu && (
                    <>
                        <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
                        <div className="absolute right-0 top-full mt-1 w-32 bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] border border-slate-100 py-1.5 z-50 animate-in fade-in zoom-in-95">
                            <button
                                onClick={() => { onEdit(question); setShowMenu(false); }}
                                className="w-full text-left px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-[var(--color-text-primary)]"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => { onDelete(question); setShowMenu(false); }}
                                className="w-full text-left px-4 py-2 text-xs font-medium text-red-600 hover:bg-red-50"
                            >
                                Delete
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

function PlatformIcon({ platform }) {
    // Simple colored dots or SVGs could work. Using dots for minimalism.
    let colorClass = 'bg-slate-400';
    if (platform === 'leetcode') colorClass = 'bg-[#ffa116]';
    if (platform === 'interviewbit') colorClass = 'bg-[#3bc1bd]';
    if (platform === 'spoj') colorClass = 'bg-[#5b7eaa]';
    if (platform === 'tuf') colorClass = 'bg-[#ff6b6b]';

    return <div className={`w-2 h-2 rounded-full ${colorClass}`} />;
}
