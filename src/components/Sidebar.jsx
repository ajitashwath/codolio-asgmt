import { useState } from 'react';
import { Plus, ChevronLeft, ChevronRight, BarChart3 } from 'lucide-react';
import useSheetStore from '../store/useSheetStore';
import { calculateTopicProgress } from '../utils/helpers';

export default function Sidebar({ isOpen, onToggle, onAddTopic }) {
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
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={onToggle}
                />
            )}

            {/* Sidebar */}
            <aside className={`
        fixed lg:sticky top-0 left-0 h-screen w-72 glass-dark z-50 lg:z-10
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        flex flex-col
      `}>
                {/* Header */}
                <div className="p-4 border-b border-white/10">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-semibold text-white flex items-center gap-2">
                            <BarChart3 size={18} className="text-indigo-400" />
                            Topics
                        </h2>
                        <button onClick={onToggle} className="lg:hidden btn-icon">
                            <ChevronLeft size={20} />
                        </button>
                    </div>

                    <div className="flex gap-2">
                        <button onClick={expandAllTopics} className="flex-1 btn-secondary text-xs py-2">
                            Expand All
                        </button>
                        <button onClick={collapseAllTopics} className="flex-1 btn-secondary text-xs py-2">
                            Collapse All
                        </button>
                    </div>
                </div>

                {/* Topics List */}
                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                    {topicOrder.map((topic, index) => {
                        const progress = calculateTopicProgress(questions, topic);
                        const isExpanded = expandedTopics[topic];

                        return (
                            <button
                                key={topic}
                                onClick={() => scrollToTopic(topic)}
                                className={`
                  w-full text-left p-3 rounded-xl transition-all
                  hover:bg-white/10 group
                  ${isExpanded ? 'bg-white/5' : ''}
                `}
                            >
                                <div className="flex items-start gap-3">
                                    <span className="text-xs font-mono text-slate-500 mt-1">
                                        {String(index + 1).padStart(2, '0')}
                                    </span>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-slate-200 truncate group-hover:text-white">
                                            {topic}
                                        </p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-full transition-all"
                                                    style={{ width: `${progress.percentage}%` }}
                                                />
                                            </div>
                                            <span className="text-xs text-slate-400">
                                                {progress.solved}/{progress.total}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </button>
                        );
                    })}
                </div>

                {/* Add Topic Button */}
                <div className="p-4 border-t border-white/10">
                    <button onClick={onAddTopic} className="btn btn-primary w-full">
                        <Plus size={18} />
                        Add Topic
                    </button>
                </div>
            </aside>

            {/* Toggle Button (Desktop) */}
            <button
                onClick={onToggle}
                className="hidden lg:flex fixed left-72 top-1/2 -translate-y-1/2 z-20 w-6 h-12 items-center justify-center bg-indigo-600 rounded-r-lg hover:bg-indigo-500 transition-colors"
                style={{ marginLeft: isOpen ? '0' : '-288px' }}
            >
                {isOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
            </button>
        </>
    );
}
