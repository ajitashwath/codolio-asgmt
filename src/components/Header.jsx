import { useState, useRef } from 'react';
import { Search, X, ChevronDown, Download, Upload, RotateCcw, Filter, LayoutTemplate } from 'lucide-react';
import useSheetStore from '../store/useSheetStore';
import { calculateProgress, exportToJSON, importFromJSON } from '../utils/helpers';

export default function Header({ onToggleSidebar, isSidebarOpen }) {
    const { sheet, questions, filters, setFilter, clearFilters, exportData, importData, resetToDefault } = useSheetStore();
    const [showFilters, setShowFilters] = useState(false);
    const fileInputRef = useRef(null);

    const progress = calculateProgress(questions);

    const handleExport = () => {
        const data = exportData();
        exportToJSON(data, `${sheet.name.toLowerCase().replace(/\s+/g, '-')}-export.json`);
    };

    const handleImport = async (e) => {
        const file = e.target.files?.[0];
        if (file) {
            try {
                const data = await importFromJSON(file);
                importData(data);
                alert('Data imported successfully!');
            } catch (err) {
                alert('Failed to import: ' + err.message);
            }
        }
        e.target.value = '';
    };

    const handleReset = () => {
        if (confirm('Are you sure you want to reset all data to default? This cannot be undone.')) {
            resetToDefault();
        }
    };

    return (
        <header className="bg-white border-b border-[var(--color-border)] sticky top-0 z-40">
            <div className="px-6 py-4">
                {/* Top Row */}
                <div className="flex items-center justify-between gap-6">

                    {/* Left: Search Bar */}
                    <div className="flex-1 max-w-2xl flex items-center gap-3">
                        {!isSidebarOpen && (
                            <button onClick={onToggleSidebar} className="btn-icon lg:hidden mr-2">
                                <LayoutTemplate size={20} />
                            </button>
                        )}

                        <div className="relative flex-1 group max-w-xl">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[var(--color-accent)] transition-colors pointer-events-none" size={20} />
                            <input
                                type="text"
                                placeholder="Search questions..."
                                value={filters.search}
                                onChange={(e) => setFilter('search', e.target.value)}
                                className="w-full pl-12 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[var(--color-accent)] focus:ring-4 focus:ring-slate-100 transition-all outline-none text-sm font-medium"
                            />
                            {filters.search && (
                                <button
                                    onClick={() => setFilter('search', '')}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-[var(--color-text-primary)] hover:bg-slate-200 rounded-full transition-all"
                                >
                                    <X size={16} />
                                </button>
                            )}
                        </div>

                        {/* Filter Toggle */}
                        <div className="relative">
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className={`btn btn-secondary ${showFilters ? 'bg-slate-100 border-slate-300' : ''}`}
                            >
                                <Filter size={16} />
                                <span className="hidden sm:inline">Filters</span>
                                <ChevronDown size={14} className={`transition-transform duration-200 ${showFilters ? 'rotate-180' : ''}`} />
                            </button>

                            {/* Filters Dropdown */}
                            {showFilters && (
                                <div className="absolute top-full right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-[var(--color-border)] p-4 z-50 animate-in fade-in slide-in-from-top-2">
                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase mb-1.5 block">
                                                Difficulty
                                            </label>
                                            <select
                                                value={filters.difficulty}
                                                onChange={(e) => setFilter('difficulty', e.target.value)}
                                                className="input select w-full"
                                            >
                                                <option value="all">All Difficulty</option>
                                                <option value="easy">Easy</option>
                                                <option value="medium">Medium</option>
                                                <option value="hard">Hard</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase mb-1.5 block">
                                                Platform
                                            </label>
                                            <select
                                                value={filters.platform}
                                                onChange={(e) => setFilter('platform', e.target.value)}
                                                className="input select w-full"
                                            >
                                                <option value="all">All Platforms</option>
                                                <option value="leetcode">LeetCode</option>
                                                <option value="interviewbit">InterviewBit</option>
                                                <option value="tuf">TUF</option>
                                                <option value="spoj">SPOJ</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase mb-1.5 block">
                                                Status
                                            </label>
                                            <select
                                                value={filters.status}
                                                onChange={(e) => setFilter('status', e.target.value)}
                                                className="input select w-full"
                                            >
                                                <option value="all">All Status</option>
                                                <option value="solved">Solved</option>
                                                <option value="unsolved">Unsolved</option>
                                            </select>
                                        </div>

                                        <div className="pt-2 border-t border-[var(--color-border)] flex justify-between items-center">
                                            <span className="text-xs text-slate-500">
                                                {filters.difficulty !== 'all' || filters.platform !== 'all' || filters.status !== 'all' ? 'Filters active' : 'No filters'}
                                            </span>
                                            <button onClick={clearFilters} className="text-xs font-medium text-[var(--color-accent)] hover:underline">
                                                Clear All
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right: Actions & Progress */}
                    <div className="flex items-center gap-3 border-l border-[var(--color-border)] pl-6 ml-2">
                        <div className="hidden md:block mr-4 text-right">
                            <div className="text-xs text-slate-500 uppercase font-semibold">Total Progress</div>
                            <div className="text-sm font-bold text-[var(--color-text-primary)]">
                                {progress.solved} <span className="text-slate-400">/ {progress.total}</span>
                                <span className="ml-2 px-1.5 py-0.5 rounded text-[10px] bg-slate-100 text-slate-600">
                                    {Math.round(progress.percentage)}%
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center gap-1">
                            <button onClick={handleExport} className="btn-icon" title="Export">
                                <Download size={18} />
                            </button>
                            <button onClick={() => fileInputRef.current?.click()} className="btn-icon" title="Import">
                                <Upload size={18} />
                            </button>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".json"
                                onChange={handleImport}
                                className="hidden"
                            />
                            <button onClick={handleReset} className="btn-icon text-red-400 hover:bg-red-50 hover:text-red-500" title="Reset to default">
                                <RotateCcw size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
