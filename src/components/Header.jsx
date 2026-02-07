import { useState, useRef } from 'react';
import { Search, X, ChevronDown, Download, Upload, RotateCcw, Moon, Sun } from 'lucide-react';
import useSheetStore from '../store/useSheetStore';
import { calculateProgress, exportToJSON, importFromJSON } from '../utils/helpers';

export default function Header() {
    const { sheet, questions, filters, setFilter, clearFilters, exportData, importData, resetToDefault } = useSheetStore();
    const [darkMode, setDarkMode] = useState(true);
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
        <header className="glass sticky top-0 z-50 px-6 py-4">
            <div className="max-w-7xl mx-auto">
                {/* Top Row */}
                <div className="flex items-center justify-between gap-4 mb-4">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                            <span className="text-white font-bold text-xl">Q</span>
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-white">{sheet.name}</h1>
                            <p className="text-sm text-slate-400">{sheet.description?.substring(0, 60)}...</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Progress */}
                        <div className="hidden sm:flex items-center gap-3 px-4 py-2 rounded-xl bg-white/5">
                            <div className="text-right">
                                <p className="text-sm font-medium text-white">{progress.solved}/{progress.total}</p>
                                <p className="text-xs text-slate-400">completed</p>
                            </div>
                            <div className="w-16 h-16">
                                <svg className="w-full h-full transform -rotate-90">
                                    <circle
                                        cx="32"
                                        cy="32"
                                        r="28"
                                        stroke="rgba(255,255,255,0.1)"
                                        strokeWidth="4"
                                        fill="none"
                                    />
                                    <circle
                                        cx="32"
                                        cy="32"
                                        r="28"
                                        stroke="url(#progressGradient)"
                                        strokeWidth="4"
                                        fill="none"
                                        strokeLinecap="round"
                                        strokeDasharray={`${progress.percentage * 1.76} 176`}
                                    />
                                    <defs>
                                        <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                            <stop offset="0%" stopColor="#22c55e" />
                                            <stop offset="100%" stopColor="#4ade80" />
                                        </linearGradient>
                                    </defs>
                                </svg>
                                <span className="absolute text-xs font-bold text-white" style={{ marginTop: '-42px', marginLeft: '20px' }}>
                                    {progress.percentage}%
                                </span>
                            </div>
                        </div>

                        {/* Actions */}
                        <button onClick={handleExport} className="btn-icon" title="Export">
                            <Download size={20} />
                        </button>
                        <button onClick={() => fileInputRef.current?.click()} className="btn-icon" title="Import">
                            <Upload size={20} />
                        </button>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".json"
                            onChange={handleImport}
                            className="hidden"
                        />
                        <button onClick={handleReset} className="btn-icon" title="Reset to default">
                            <RotateCcw size={20} />
                        </button>
                    </div>
                </div>

                {/* Search and Filters Row */}
                <div className="flex items-center gap-3">
                    <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search questions..."
                            value={filters.search}
                            onChange={(e) => setFilter('search', e.target.value)}
                            className="input pl-11 pr-10"
                        />
                        {filters.search && (
                            <button
                                onClick={() => setFilter('search', '')}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                            >
                                <X size={16} />
                            </button>
                        )}
                    </div>

                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={`btn-secondary ${showFilters ? 'border-indigo-500' : ''}`}
                    >
                        Filters
                        <ChevronDown size={16} className={`transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                    </button>
                </div>

                {/* Filters Panel */}
                {showFilters && (
                    <div className="flex flex-wrap items-center gap-3 mt-4 p-4 rounded-xl bg-white/5">
                        <select
                            value={filters.difficulty}
                            onChange={(e) => setFilter('difficulty', e.target.value)}
                            className="input select w-36"
                        >
                            <option value="all">All Difficulty</option>
                            <option value="easy">Easy</option>
                            <option value="medium">Medium</option>
                            <option value="hard">Hard</option>
                        </select>

                        <select
                            value={filters.platform}
                            onChange={(e) => setFilter('platform', e.target.value)}
                            className="input select w-36"
                        >
                            <option value="all">All Platforms</option>
                            <option value="leetcode">LeetCode</option>
                            <option value="interviewbit">InterviewBit</option>
                            <option value="tuf">TUF</option>
                            <option value="spoj">SPOJ</option>
                        </select>

                        <select
                            value={filters.status}
                            onChange={(e) => setFilter('status', e.target.value)}
                            className="input select w-36"
                        >
                            <option value="all">All Status</option>
                            <option value="solved">Solved</option>
                            <option value="unsolved">Unsolved</option>
                        </select>

                        <button onClick={clearFilters} className="btn-secondary text-sm py-2">
                            Clear All
                        </button>
                    </div>
                )}
            </div>
        </header>
    );
}
