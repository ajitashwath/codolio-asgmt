// Helper utility functions for the Question Sheet Manager

/**
 * Generate a unique ID
 */
export const generateId = () => {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Get difficulty color class
 */
export const getDifficultyClass = (difficulty) => {
    const lower = difficulty?.toLowerCase();
    switch (lower) {
        case 'easy':
            return 'badge-easy';
        case 'medium':
            return 'badge-medium';
        case 'hard':
            return 'badge-hard';
        default:
            return 'badge-medium';
    }
};

/**
 * Get platform display info
 */
export const getPlatformInfo = (platform) => {
    const lower = platform?.toLowerCase();
    switch (lower) {
        case 'leetcode':
            return { label: 'LC', className: 'platform-leetcode' };
        case 'interviewbit':
            return { label: 'IB', className: 'platform-interviewbit' };
        case 'spoj':
            return { label: 'SP', className: 'platform-spoj' };
        case 'tuf':
            return { label: 'TUF', className: 'platform-tuf' };
        default:
            return { label: platform?.substring(0, 2).toUpperCase() || '?', className: 'platform-leetcode' };
    }
};

/**
 * Group questions by topic
 */
export const groupQuestionsByTopic = (questions, topicOrder) => {
    const grouped = {};

    // Initialize all topics from order
    topicOrder.forEach(topic => {
        grouped[topic] = [];
    });

    // Group questions
    questions.forEach(q => {
        if (grouped[q.topic]) {
            grouped[q.topic].push(q);
        } else {
            grouped[q.topic] = [q];
        }
    });

    return grouped;
};

/**
 * Calculate progress statistics
 */
export const calculateProgress = (questions) => {
    const total = questions.length;
    const solved = questions.filter(q => q.isSolved).length;
    const percentage = total > 0 ? Math.round((solved / total) * 100) : 0;

    return { total, solved, percentage };
};

/**
 * Calculate topic progress
 */
export const calculateTopicProgress = (questions, topic) => {
    const topicQuestions = questions.filter(q => q.topic === topic);
    return calculateProgress(topicQuestions);
};

/**
 * Search/filter questions
 */
export const filterQuestions = (questions, filters) => {
    let result = [...questions];

    if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        result = result.filter(q =>
            q.title.toLowerCase().includes(searchLower) ||
            q.topic.toLowerCase().includes(searchLower)
        );
    }

    if (filters.difficulty && filters.difficulty !== 'all') {
        result = result.filter(q =>
            q.difficulty?.toLowerCase() === filters.difficulty.toLowerCase()
        );
    }

    if (filters.platform && filters.platform !== 'all') {
        result = result.filter(q =>
            q.platform?.toLowerCase() === filters.platform.toLowerCase()
        );
    }

    if (filters.status === 'solved') {
        result = result.filter(q => q.isSolved);
    } else if (filters.status === 'unsolved') {
        result = result.filter(q => !q.isSolved);
    }

    return result;
};

/**
 * Reorder array items (for drag and drop)
 */
export const reorderArray = (array, fromIndex, toIndex) => {
    const result = [...array];
    const [removed] = result.splice(fromIndex, 1);
    result.splice(toIndex, 0, removed);
    return result;
};

/**
 * Move item between arrays
 */
export const moveItem = (sourceArray, destArray, fromIndex, toIndex) => {
    const sourceResult = [...sourceArray];
    const destResult = [...destArray];
    const [removed] = sourceResult.splice(fromIndex, 1);
    destResult.splice(toIndex, 0, removed);
    return { source: sourceResult, destination: destResult };
};

/**
 * LocalStorage helpers
 */
export const storage = {
    save: (key, data) => {
        try {
            localStorage.setItem(key, JSON.stringify(data));
        } catch (e) {
            console.error('Failed to save to localStorage:', e);
        }
    },

    load: (key) => {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (e) {
            console.error('Failed to load from localStorage:', e);
            return null;
        }
    },

    remove: (key) => {
        try {
            localStorage.removeItem(key);
        } catch (e) {
            console.error('Failed to remove from localStorage:', e);
        }
    }
};

/**
 * Export data as JSON file
 */
export const exportToJSON = (data, filename = 'question-sheet.json') => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
};

/**
 * Import data from JSON file
 */
export const importFromJSON = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                resolve(data);
            } catch (err) {
                reject(new Error('Invalid JSON file'));
            }
        };
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsText(file);
    });
};
