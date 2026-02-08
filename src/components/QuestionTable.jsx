import {
    Plus, CheckCircle2, Circle, MoreVertical, Trash2, Edit2, ExternalLink, ArrowRight
} from 'lucide-react';
import useSheetStore from '../store/useSheetStore';
import { calculateTopicProgress } from '../utils/helpers';
import { useState } from 'react';

// Strict Monospace Badge
const DifficultyTag = ({ level }) => {
    const l = (level || 'Medium').toLowerCase();

    // Brutalist: Text only, opacity variation, Mono font
    let opacity = 'opacity-50';
    let weight = 'font-normal';

    if (l === 'hard') { opacity = 'opacity-100'; weight = 'font-black'; }
    if (l === 'medium') { opacity = 'opacity-70'; weight = 'font-bold'; }

    return (
        <span className={`text-[10px] uppercase font-mono tracking-widest ${opacity} ${weight}`}>
            {level || 'MEDIUM'}
        </span>
    );
};

export default function QuestionTable({ topic, onAddQuestion, onEditQuestion, onDeleteQuestion }) {
    const { questions, toggleSolved } = useSheetStore();
    const topicQuestions = questions.filter(q => q.topic === topic);
    const progress = calculateTopicProgress(questions, topic);

    if (!topic) return null;

    return (
        <div className="flex flex-col h-full bg-black text-white relative">
            {/* Header Block - Brutalist Typography */}
            <div className="border-b-2 border-white p-8 flex flex-col md:flex-row md:items-end justify-between gap-6 shrink-0 bg-black z-10">
                <div className="flex flex-col gap-2">
                    <span className="text-[10px] font-mono tracking-widest text-[#666] uppercase">
                        Current Domain /
                    </span>
                    <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-[0.85] text-white mix-blend-difference">
                        {topic}
                    </h1>
                </div>

                <div className="flex flex-col items-end gap-2">
                    <div className="text-right">
                        <span className="text-4xl font-mono font-bold">{String(progress.solved).padStart(2, '0')}</span>
                        <span className="text-xl font-mono text-[#444]">/{String(progress.total).padStart(2, '0')}</span>
                    </div>

                    <button
                        onClick={() => onAddQuestion({ topic })}
                        className="group flex items-center gap-3 px-6 py-3 bg-white text-black font-bold uppercase tracking-widest text-xs hover:bg-[#CCC] transition-colors mt-4 border border-transparent hover:border-white"
                    >
                        <Plus size={14} strokeWidth={3} />
                        <span>Inject Problem</span>
                    </button>
                </div>
            </div>

            {/* Scrolling List - Grid Layout */}
            <div className="flex-1 overflow-y-auto p-0 scrollbar-brutal">
                {/* Table Header Row - Sticky */}
                <div className="grid grid-cols-[60px_1fr_120px_140px_60px] border-b border-[#333] sticky top-0 bg-black z-10 text-[10px] font-mono uppercase tracking-widest text-[#444] font-bold">
                    <div className="p-4 text-center border-r border-[#222]">STS</div>
                    <div className="p-4 border-r border-[#222]">Challenge Identifier</div>
                    <div className="p-4 text-center border-r border-[#222]">CMPLX</div>
                    <div className="p-4 border-r border-[#222]">Origin</div>
                    <div className="p-4 text-center">ACT</div>
                </div>

                {/* Rows */}
                {topicQuestions.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 border-b border-[#222] text-[#333]">
                        <p className="font-mono text-xs uppercase tracking-widest">/* Dataset Empty */</p>
                    </div>
                ) : (
                    <div className="flex flex-col">
                        {topicQuestions.map((question, idx) => {
                            const [menuOpen, setMenuOpen] = useState(false);

                            return (
                                <div
                                    key={question.id}
                                    className="group grid grid-cols-[60px_1fr_120px_140px_60px] border-b border-[#222] items-center hover:bg-[#080808] transition-colors"
                                >
                                    {/* Status */}
                                    <div className="h-full flex items-center justify-center border-r border-[#222]">
                                        <button
                                            onClick={() => toggleSolved(question.id)}
                                            className={`transition-all duration-0 hover:text-white ${question.isSolved ? 'text-white' : 'text-[#222]'}`}
                                        >
                                            {question.isSolved
                                                ? <CheckCircle2 size={18} strokeWidth={2} />
                                                : <Circle size={18} strokeWidth={1} />
                                            }
                                        </button>
                                    </div>

                                    {/* Title */}
                                    <div className="h-full flex items-center px-4 border-r border-[#222] overflow-hidden">
                                        <a
                                            href={question.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={`block font-mono text-sm tracking-tight truncate w-full group-hover:text-white transition-colors
                                                ${question.isSolved ? 'text-[#333] line-through' : 'text-[#AAA]'}
                                            `}
                                        >
                                            <span className="opacity-0 group-hover:opacity-100 text-[10px] text-[#444] mr-2 transition-opacity inline-block font-bold">
                                                {String(idx + 1).padStart(2, '0')}
                                            </span>
                                            {question.title}
                                        </a>
                                    </div>

                                    {/* Difficulty */}
                                    <div className="h-full flex items-center justify-center border-r border-[#222]">
                                        <DifficultyTag level={question.difficulty} />
                                    </div>

                                    {/* Platform */}
                                    <div className="h-full flex items-center px-4 border-r border-[#222]">
                                        <span className="text-[10px] font-mono text-[#444] uppercase tracking-wider group-hover:text-[#666]">
                                            {question.platform || 'LEETCODE'}
                                        </span>
                                    </div>

                                    {/* Actions */}
                                    <div className="h-full flex items-center justify-center relative">
                                        <button
                                            onClick={() => setMenuOpen(!menuOpen)}
                                            className="opacity-0 group-hover:opacity-100 p-2 text-[#444] hover:text-white transition-opacity"
                                        >
                                            <MoreVertical size={14} />
                                        </button>

                                        {menuOpen && (
                                            <>
                                                <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
                                                <div className="absolute right-8 top-2 w-[120px] bg-black border border-white z-50 shadow-[4px_4px_0px_white]">
                                                    <button
                                                        onClick={() => { onEditQuestion(question); setMenuOpen(false); }}
                                                        className="w-full text-left px-3 py-2 text-[10px] uppercase font-bold text-white hover:bg-white hover:text-black flex items-center gap-2"
                                                    >
                                                        <Edit2 size={10} /> Edit
                                                    </button>
                                                    <button
                                                        onClick={() => { onDeleteQuestion(question); setMenuOpen(false); }}
                                                        className="w-full text-left px-3 py-2 text-[10px] uppercase font-bold text-red-500 hover:bg-red-500 hover:text-black flex items-center gap-2 border-t border-[#333]"
                                                    >
                                                        <Trash2 size={10} /> Delete
                                                    </button>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
