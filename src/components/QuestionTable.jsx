import {
    Plus, CheckCircle2, Circle, MoreVertical, Trash2, Edit2, ExternalLink, ArrowRight
} from 'lucide-react';
import useSheetStore from '../store/useSheetStore';
import { calculateTopicProgress } from '../utils/helpers';
import { useState } from 'react';

// Circular Progress Ring Component
const CircularProgress = ({ solved, total }) => {
    const percentage = total > 0 ? (solved / total) * 100 : 0;
    const radius = 32;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    return (
        <div className="relative w-20 h-20">
            <svg className="transform -rotate-90 w-20 h-20">
                {/* Background circle */}
                <circle
                    cx="40"
                    cy="40"
                    r={radius}
                    stroke="#222"
                    strokeWidth="4"
                    fill="none"
                />
                {/* Progress circle */}
                <circle
                    cx="40"
                    cy="40"
                    r={radius}
                    stroke="#fff"
                    strokeWidth="4"
                    fill="none"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    className="transition-all duration-300 ease-out"
                />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-sm font-mono font-bold">{solved}</div>
                    <div className="text-[8px] font-mono text-[#444]">/{total}</div>
                </div>
            </div>
        </div>
    );
};

// Difficulty Badge with Icons
const DifficultyTag = ({ level }) => {
    const l = (level || 'Medium').toLowerCase();

    let color = 'text-[#888]';
    let weight = 'font-normal';
    let icon = '●';

    if (l === 'hard') {
        color = 'text-white';
        weight = 'font-black';
        icon = '●●●';
    } else if (l === 'medium') {
        color = 'text-[#AAA]';
        weight = 'font-bold';
        icon = '●●';
    } else {
        icon = '●';
    }

    return (
        <div className="flex items-center gap-2">
            <span className={`text-xs ${color}`}>{icon}</span>
            <span className={`text-sm uppercase font-mono tracking-widest ${color} ${weight}`}>
                {level || 'MEDIUM'}
            </span>
        </div>
    );
};

export default function QuestionTable({ topic, onAddQuestion, onEditQuestion, onDeleteQuestion }) {
    const { questions, toggleSolved } = useSheetStore();
    const topicQuestions = questions.filter(q => q.topic === topic);
    const progress = calculateTopicProgress(questions, topic);

    if (!topic) return null;

    return (
        <div className="flex flex-col h-full bg-black text-white relative">
            {/* Header Block - Brutalist Typography with Progress Ring */}
            <div className="border-b border-[#333] p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shrink-0 bg-black z-10">
                <div className="flex items-center gap-6">
                    {/* Circular Progress */}
                    <CircularProgress solved={progress.solved} total={progress.total} />

                    {/* Topic Info */}
                    <div className="flex flex-col gap-2">
                        <span className="text-xs font-mono tracking-widest text-[#555] uppercase">
                            / Domain
                        </span>
                        <h1 className="text-5xl md:text-6xl font-black uppercase tracking-tighter leading-[0.9] text-white">
                            {topic}
                        </h1>
                        <div className="flex items-center gap-3 mt-2">
                            <span className="text-sm font-mono text-[#666] uppercase tracking-wider">
                                {progress.total} Problems
                            </span>
                            {progress.total > 0 && (
                                <>
                                    <span className="text-[#333]">•</span>
                                    <span className="text-sm font-mono text-[#666] uppercase tracking-wider">
                                        {Math.round((progress.solved / progress.total) * 100)}% Complete
                                    </span>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                <button
                    onClick={() => onAddQuestion({ topic })}
                    className="group flex items-center gap-3 px-8 py-4 bg-white text-black font-bold uppercase tracking-widest text-sm hover:bg-[#CCC] transition-all duration-150 border-2 border-white hover:border-[#CCC] shrink-0"
                >
                    <Plus size={18} strokeWidth={3} />
                    <span>Add Problem</span>
                </button>
            </div>

            {/* Scrolling List - Grid Layout */}
            <div className="flex-1 overflow-y-auto p-0 scrollbar-brutal">
                {/* Table Header Row - Sticky */}
                <div className="grid grid-cols-[60px_1fr_180px_140px_60px] border-b border-[#333] sticky top-0 bg-black z-10 text-xs font-mono uppercase tracking-widest text-[#555] font-bold">
                    <div className="p-4 text-center border-r border-[#222]">Status</div>
                    <div className="p-4 border-r border-[#222]">Problem</div>
                    <div className="p-4 text-center border-r border-[#222]">Difficulty</div>
                    <div className="p-4 border-r border-[#222]">Platform</div>
                    <div className="p-4 text-center">•••</div>
                </div>

                {/* Rows */}
                {topicQuestions.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 border-b border-[#111] text-[#333]">
                        <p className="font-mono text-sm uppercase tracking-widest">// No problems yet</p>
                    </div>
                ) : (
                    <div className="flex flex-col">
                        {topicQuestions.map((question, idx) => {
                            const [menuOpen, setMenuOpen] = useState(false);

                            return (
                                <div
                                    key={question.id}
                                    className={`group grid grid-cols-[60px_1fr_180px_140px_60px] border-b border-[#111] items-center min-h-[64px] hover:bg-[#0A0A0A] hover:border-[#222] transition-all duration-150 ${question.isSolved ? 'bg-[#050505]' : ''
                                        }`}
                                >
                                    {/* Status */}
                                    <div className="h-full flex items-center justify-center border-r border-[#111] group-hover:border-r-[#222]">
                                        <button
                                            onClick={() => toggleSolved(question.id)}
                                            className={`transition-all duration-150 hover:scale-110 ${question.isSolved ? 'text-white' : 'text-[#222] hover:text-[#555]'
                                                }`}
                                        >
                                            {question.isSolved
                                                ? <CheckCircle2 size={24} strokeWidth={2} />
                                                : <Circle size={24} strokeWidth={1.5} />
                                            }
                                        </button>
                                    </div>

                                    {/* Title */}
                                    <div className="h-full flex items-center px-5 border-r border-[#111] group-hover:border-r-[#222] overflow-hidden">
                                        <a
                                            href={question.problemUrl || question.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={`flex items-center gap-3 font-mono text-base tracking-tight truncate w-full group-hover:text-white transition-all duration-150
                                                ${question.isSolved ? 'text-[#444] line-through' : 'text-[#AAA]'}
                                            `}
                                        >
                                            <span className="opacity-0 group-hover:opacity-100 text-xs text-[#555] transition-opacity inline-block font-bold min-w-[24px]">
                                                {String(idx + 1).padStart(2, '0')}
                                            </span>
                                            <span className="truncate">{question.title}</span>
                                            <ExternalLink size={14} className="opacity-0 group-hover:opacity-50 transition-opacity ml-auto shrink-0" />
                                        </a>
                                    </div>

                                    {/* Difficulty */}
                                    <div className="h-full flex items-center justify-center border-r border-[#111] group-hover:border-r-[#222]">
                                        <DifficultyTag level={question.difficulty} />
                                    </div>

                                    {/* Platform */}
                                    <div className="h-full flex items-center px-4 border-r border-[#111] group-hover:border-r-[#222]">
                                        <span className="text-xs font-mono text-[#444] uppercase tracking-wider group-hover:text-[#777] transition-colors">
                                            {question.platform || 'LEETCODE'}
                                        </span>
                                    </div>

                                    {/* Actions */}
                                    <div className="h-full flex items-center justify-center relative">
                                        <button
                                            onClick={() => setMenuOpen(!menuOpen)}
                                            className="opacity-0 group-hover:opacity-100 p-2 text-[#444] hover:text-white transition-all duration-150"
                                        >
                                            <MoreVertical size={14} />
                                        </button>

                                        {menuOpen && (
                                            <>
                                                <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
                                                <div className="absolute right-8 top-2 w-[140px] bg-black border-2 border-white z-50 shadow-[6px_6px_0px_rgba(255,255,255,0.1)]">
                                                    <button
                                                        onClick={() => { onEditQuestion(question); setMenuOpen(false); }}
                                                        className="w-full text-left px-4 py-3 text-[10px] uppercase font-bold text-white hover:bg-white hover:text-black flex items-center gap-2 transition-all duration-150"
                                                    >
                                                        <Edit2 size={10} /> Edit
                                                    </button>
                                                    <button
                                                        onClick={() => { onDeleteQuestion(question); setMenuOpen(false); }}
                                                        className="w-full text-left px-4 py-3 text-[10px] uppercase font-bold text-red-500 hover:bg-red-500 hover:text-black flex items-center gap-2 border-t-2 border-[#222] transition-all duration-150"
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
