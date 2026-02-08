import { useState } from 'react';
import { Plus, ChevronLeft, ChevronRight, LayoutGrid } from 'lucide-react';
import useSheetStore from '../store/useSheetStore';
import { calculateTopicProgress } from '../utils/helpers';

export default function Sidebar({ isOpen, onToggle, onAddTopic, topicCount }) {
    const { topicOrder, questions, expandedTopics, toggleTopic, expandAllTopics, collapseAllTopics } = useSheetStore();

    const scrollToTopic = (topic) => {
        const element = document.getElementById(`topic-${topic.replace(/\s+/g, '-')}`);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
                    onClick={onToggle}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed lg:sticky top-0 left-0 h-screen w-72 bg-white border-r border-[var(--color-border)] z-50 lg:z-10
                transform transition-transform duration-300 ease-[cubic-bezier(0.2,0,0,1)]
                ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                flex flex-col shadow-[4px_0_24px_rgba(0,0,0,0.02)]
            `}>
                {/* Header */}
                <div className="px-6 py-8">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="font-bold text-2xl text-[var(--color-text-primary)] flex items-center gap-3 tracking-tight">
                            <div className="w-10 h-10 bg-[var(--color-accent)] rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-900/10">
                                <LayoutGrid size={22} />
                            </div>
                            Codolio
                        </h2>
                        <button onClick={onToggle} className="lg:hidden btn-icon p-2 hover:bg-slate-50 rounded-full">
                            <ChevronLeft size={24} />
                        </button>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={expandAllTopics}
                            className="flex-1 text-xs font-medium text-slate-500 hover:text-[var(--color-accent)] hover:bg-slate-50 py-2 rounded-lg transition-colors border border-transparent hover:border-slate-100"
                        >
                            Expand All
                        </button>
                        <button
                            onClick={collapseAllTopics}
                            className="flex-1 text-xs font-medium text-slate-500 hover:text-[var(--color-accent)] hover:bg-slate-50 py-2 rounded-lg transition-colors border border-transparent hover:border-slate-100"
                        >
                            Collapse
                        </button>
                    </div>
                </div>

                {/* Topics List */}
                <div className="flex-1 overflow-y-auto px-4 py-2 space-y-2">
                    <div className="px-4 pb-3 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                        Your Topics ({topicCount})
                    </div>

                    {topicOrder.map((topic, index) => {
                        const progress = calculateTopicProgress(questions, topic);
                        const isExpanded = expandedTopics[topic];

                        return (
                            <button
                                key={topic}
                                onClick={() => scrollToTopic(topic)}
                                className={`
                                    w-full text-left px-4 py-3.5 rounded-xl transition-all group relative
                                    flex items-center gap-4
                                    ${isExpanded
                                        ? 'bg-slate-50 text-[var(--color-text-primary)] font-semibold'
                                        : 'text-slate-500 hover:bg-slate-50/80 hover:text-[var(--color-text-primary)]'
                                    }
                                `}
                            >
                                {isExpanded && (
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 bg-[var(--color-accent)] rounded-r-full" />
                                )}

                                <span className={`
                                    text-[11px] font-mono w-6 h-6 flex items-center justify-center rounded-lg transition-all
                                    ${isExpanded
                                        ? 'bg-white shadow border border-slate-100 text-[var(--color-accent)]'
                                        : 'bg-slate-100 text-slate-400 group-hover:bg-white group-hover:shadow-sm'
                                    }
                                `}>
                                    {index + 1}
                                </span>

                                <div className="flex-1 min-w-0">
                                    <p className="text-sm truncate">
                                        {topic}
                                    </p>
                                </div>

                                {progress.total > 0 && (
                                    <div className="w-12 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-[var(--color-accent)] rounded-full transition-all duration-500"
                                            style={{ width: `${progress.percentage}%` }}
                                        />
                                    </div>
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Add Topic Button */}
                <div className="p-6 border-t border-[var(--color-border)] bg-gradient-to-t from-white to-transparent">
                    <button
                        onClick={onAddTopic}
                        className="btn w-full justify-center py-3 border-2 border-dashed border-slate-300 hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] text-slate-500 bg-transparent hover:bg-slate-50 transition-all font-semibold"
                    >
                        <Plus size={18} />
                        Add New Topic
                    </button>
                </div>
            </aside>

            {/* Toggle Button (Desktop) - Only show when closed */}
            {!isOpen && (
                <button
                    onClick={onToggle}
                    className="hidden lg:flex fixed left-0 top-6 z-20 p-2 bg-white border border-[var(--color-border)] rounded-r-lg shadow-sm hover:bg-slate-50 transition-colors"
                >
                    <ChevronRight size={20} className="text-[var(--color-text-secondary)]" />
                </button>
            )}
        </>
    );
}
