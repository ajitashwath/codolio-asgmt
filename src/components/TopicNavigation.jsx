import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
    GripVertical, MoreHorizontal, Trash2, Edit2, CheckCircle2
} from 'lucide-react';
import useSheetStore from '../store/useSheetStore';
import { calculateTopicProgress } from '../utils/helpers';
import { useState } from 'react';

export default function TopicNavigation({ topic, index, onEdit, onDelete }) {
    const { activeTopicId, setActiveTopic, questions } = useSheetStore();
    const isActive = activeTopicId === topic;
    const progress = calculateTopicProgress(questions, topic);
    const [showMenu, setShowMenu] = useState(false);
    const isCompleted = progress.total > 0 && progress.solved === progress.total;
    const progressPercentage = progress.total > 0 ? (progress.solved / progress.total) * 100 : 0;

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
        zIndex: isDragging ? 50 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="relative group/item"
        >
            <div
                onClick={() => setActiveTopic(topic)}
                className={`
                    w-full min-h-[56px] flex items-center cursor-pointer border-l-2 transition-all duration-150 relative
                    ${isActive
                        ? 'bg-white text-black border-white'
                        : isCompleted
                            ? 'bg-[#0A0A0A] text-[#888] border-[#222] hover:text-white hover:bg-[#111] hover:border-[#444]'
                            : 'bg-black text-[#555] border-transparent hover:text-white hover:bg-[#0A0A0A] hover:border-[#222]'
                    }
                `}
            >
                {/* Index / Icon Column - Fixed 60px Width */}
                <div className="w-[60px] h-full flex items-center justify-center shrink-0 border-r border-transparent group-hover/sidebar:border-[#111]">
                    {isCompleted ? (
                        <CheckCircle2 size={20} className={`${isActive ? 'text-black' : 'text-white'}`} strokeWidth={2} />
                    ) : (
                        <span className={`font-mono font-bold text-sm ${isActive ? 'text-black' : 'text-[#444] group-hover:text-white'}`}>
                            {String(index + 1).padStart(2, '0')}
                        </span>
                    )}
                </div>

                {/* Content - Visible on Expand */}
                <div className="flex-1 flex flex-col justify-center overflow-hidden px-6 py-3 opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-100">
                    <div className="flex items-center justify-between gap-3 mb-1">
                        <span className="font-bold text-sm uppercase tracking-widest truncate">
                            {topic}
                        </span>

                        {/* Stats */}
                        {progress.total > 0 && (
                            <span className={`text-xs font-mono shrink-0 ${isActive ? 'text-[#444]' : 'text-[#555]'}`}>
                                {progress.solved}/{progress.total}
                            </span>
                        )}
                    </div>

                    {/* Mini Progress Bar */}
                    {progress.total > 0 && (
                        <div className="w-full h-[2px] bg-[#222] relative overflow-hidden">
                            <div
                                className={`h-full transition-all duration-300 ${isActive ? 'bg-black' : 'bg-white'}`}
                                style={{ width: `${progressPercentage}%` }}
                            />
                        </div>
                    )}
                </div>

                {/* Actions - Hover Only */}
                <div className="w-[40px] flex items-center justify-center opacity-0 group-hover/sidebar:opacity-100">
                    <button
                        onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
                        className={`p-1 hover:bg-black hover:text-white rounded-none transition-colors ${isActive ? 'text-black' : 'text-[#444]'}`}
                    >
                        <MoreHorizontal size={14} />
                    </button>
                </div>
            </div>

            {/* Context Menu - Sharp */}
            {showMenu && (
                <>
                    <div className="fixed inset-0 z-[60]" onClick={() => setShowMenu(false)} />
                    <div className="absolute left-[240px] top-0 w-36 bg-black border-2 border-white z-[70] shadow-[6px_6px_0px_rgba(255,255,255,0.1)]">
                        <button
                            onClick={(e) => { e.stopPropagation(); onEdit(topic); setShowMenu(false); }}
                            className="w-full text-left px-4 py-3 text-[10px] uppercase font-bold text-white hover:bg-white hover:text-black transition-all duration-150 flex items-center gap-2"
                        >
                            <Edit2 size={10} /> Edit
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); onDelete(topic); setShowMenu(false); }}
                            className="w-full text-left px-4 py-3 text-[10px] uppercase font-bold text-red-500 hover:bg-red-500 hover:text-black transition-all duration-150 flex items-center gap-2 border-t-2 border-[#222]"
                        >
                            <Trash2 size={10} /> Delete
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
