import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, ExternalLink, Play, Edit2, Trash2, Check } from 'lucide-react';
import { getDifficultyClass, getPlatformInfo } from '../utils/helpers';
import useSheetStore from '../store/useSheetStore';

export default function QuestionRow({ question, index, onEdit, onDelete }) {
    const { toggleSolved } = useSheetStore();

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: question.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    const platformInfo = getPlatformInfo(question.platform);
    const difficultyClass = getDifficultyClass(question.difficulty);

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`
        flex items-center gap-3 p-3 rounded-xl
        bg-white/[0.02] hover:bg-white/[0.05]
        border border-transparent hover:border-white/10
        transition-all group
        ${question.isSolved ? 'bg-green-500/5' : ''}
      `}
        >
            {/* Drag Handle */}
            <button
                {...attributes}
                {...listeners}
                className="drag-handle p-1 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab"
            >
                <GripVertical size={16} />
            </button>

            {/* Checkbox */}
            <input
                type="checkbox"
                checked={question.isSolved}
                onChange={() => toggleSolved(question.id)}
                className="checkbox"
            />

            {/* Index */}
            <span className="text-xs font-mono text-slate-500 w-6 text-center">
                {String(index + 1).padStart(2, '0')}
            </span>

            {/* Platform */}
            <div className={`platform-icon ${platformInfo.className}`}>
                {platformInfo.label}
            </div>

            {/* Title */}
            <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium truncate ${question.isSolved ? 'text-slate-400 line-through' : 'text-white'}`}>
                    {question.title}
                </p>
            </div>

            {/* Difficulty Badge */}
            <span className={`badge ${difficultyClass}`}>
                {question.difficulty}
            </span>

            {/* Actions */}
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {question.problemUrl && (
                    <a
                        href={question.problemUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-icon"
                        title="Open Problem"
                    >
                        <ExternalLink size={16} />
                    </a>
                )}
                {question.resource && (
                    <a
                        href={question.resource}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-icon text-red-400 hover:text-red-300"
                        title="Watch Video"
                    >
                        <Play size={16} />
                    </a>
                )}
                <button onClick={() => onEdit(question)} className="btn-icon" title="Edit">
                    <Edit2 size={16} />
                </button>
                <button onClick={() => onDelete(question)} className="btn-icon text-red-400 hover:text-red-300" title="Delete">
                    <Trash2 size={16} />
                </button>
            </div>
        </div>
    );
}
