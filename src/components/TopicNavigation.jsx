import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
    GripVertical, MoreHorizontal, Trash2, Edit2
} from 'lucide-react';
import useSheetStore from '../store/useSheetStore';
import { calculateTopicProgress } from '../utils/helpers';
import { useState } from 'react';

export default function TopicNavigation({ topic, index, onEdit, onDelete }) {
    const { activeTopicId, setActiveTopic, questions } = useSheetStore();
    const isActive = activeTopicId === topic;
    const progress = calculateTopicProgress(questions, topic);
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
                    w-full h-[50px] flex items-center cursor-pointer border-l-4 transition-all duration-75
                    ${isActive
                        ? 'bg-white text-black border-white'
                        : 'bg-black text-[#555] border-transparent hover:text-white hover:bg-[#111] hover:border-[#333]'
                    }
                `}
            >
                {/* Index / Icon Column - Fixed 60px Width */}
                <div className="w-[60px] h-full flex items-center justify-center shrink-0 border-r border-transparent group-hover/sidebar:border-[#222]">
                    <span className={`font-mono font-bold text-sm ${isActive ? 'text-black' : 'text-[#333] group-hover:text-white'}`}>
                        {String(index + 1).padStart(2, '0')}
                    </span>
                </div>

                {/* Content - Visible on Expand */}
                <div className="flex-1 flex items-center justify-between overflow-hidden px-6 opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-100 whitespace-nowrap">
                    <span className="font-bold text-xs uppercase tracking-widest truncate max-w-[140px]">
                        {topic}
                    </span>

                    {/* Stats */}
                    {progress.total > 0 && (
                        <span className={`text-[9px] font-mono ${isActive ? 'text-[#333]' : 'text-[#333]'}`}>
                            {progress.solved}/{progress.total}
                        </span>
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
                    <div className="absolute left-[240px] top-0 w-32 bg-black border border-white z-[70] shadow-[4px_4px_0px_white]">
                        <button
                            onClick={(e) => { e.stopPropagation(); onEdit(topic); setShowMenu(false); }}
                            className="w-full text-left px-4 py-3 text-[10px] uppercase font-bold text-white hover:bg-white hover:text-black hover:invert transition-all flex items-center gap-2"
                        >
                            <Edit2 size={10} /> Edit
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); onDelete(topic); setShowMenu(false); }}
                            className="w-full text-left px-4 py-3 text-[10px] uppercase font-bold text-red-500 hover:bg-red-500 hover:text-black transition-all flex items-center gap-2 border-t border-[#333]"
                        >
                            <Trash2 size={10} /> Delete
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
