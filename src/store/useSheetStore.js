import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { sampleData } from '../data/sampleData';
import { generateId, reorderArray } from '../utils/helpers';

const STORAGE_KEY = 'question-sheet-store';

const useSheetStore = create(
    persist(
        (set, get) => ({
            // Sheet metadata
            sheet: {
                id: sampleData.sheet.id,
                name: sampleData.sheet.name,
                description: sampleData.sheet.description,
                banner: sampleData.sheet.banner,
            },

            // Topics order
            topicOrder: [...sampleData.sheet.config.topicOrder],

            // Questions array
            questions: [...sampleData.questions],

            // Sub-topics (topic -> subTopics mapping)
            subTopics: {},

            // UI State
            expandedTopics: {},
            activeTopicId: null, // New state for Master-Detail view
            filters: {
                search: '',
                difficulty: 'all',
                platform: 'all',
                status: 'all',
            },

            // ========== Sheet Actions ==========
            setActiveTopic: (topic) => set(() => ({ activeTopicId: topic })),
            updateSheet: (updates) => set((state) => ({
                sheet: { ...state.sheet, ...updates }
            })),

            // ========== Topic Actions ==========
            addTopic: (name) => set((state) => ({
                topicOrder: [...state.topicOrder, name],
                expandedTopics: { ...state.expandedTopics, [name]: true }
            })),

            updateTopic: (oldName, newName) => set((state) => {
                const newTopicOrder = state.topicOrder.map(t => t === oldName ? newName : t);
                const newQuestions = state.questions.map(q =>
                    q.topic === oldName ? { ...q, topic: newName } : q
                );
                const { [oldName]: expandedValue, ...restExpanded } = state.expandedTopics;
                const newSubTopics = { ...state.subTopics };
                if (newSubTopics[oldName]) {
                    newSubTopics[newName] = newSubTopics[oldName];
                    delete newSubTopics[oldName];
                }
                return {
                    topicOrder: newTopicOrder,
                    questions: newQuestions,
                    expandedTopics: { ...restExpanded, [newName]: expandedValue },
                    subTopics: newSubTopics,
                };
            }),

            deleteTopic: (name) => set((state) => ({
                topicOrder: state.topicOrder.filter(t => t !== name),
                questions: state.questions.filter(q => q.topic !== name),
                expandedTopics: Object.fromEntries(
                    Object.entries(state.expandedTopics).filter(([k]) => k !== name)
                ),
                subTopics: Object.fromEntries(
                    Object.entries(state.subTopics).filter(([k]) => k !== name)
                ),
            })),

            reorderTopics: (fromIndex, toIndex) => set((state) => ({
                topicOrder: reorderArray(state.topicOrder, fromIndex, toIndex)
            })),

            toggleTopic: (name) => set((state) => ({
                expandedTopics: {
                    ...state.expandedTopics,
                    [name]: !state.expandedTopics[name]
                }
            })),

            expandAllTopics: () => set((state) => ({
                expandedTopics: Object.fromEntries(state.topicOrder.map(t => [t, true]))
            })),

            collapseAllTopics: () => set(() => ({
                expandedTopics: {}
            })),

            // ========== SubTopic Actions ==========
            addSubTopic: (topicName, subTopicName) => set((state) => ({
                subTopics: {
                    ...state.subTopics,
                    [topicName]: [...(state.subTopics[topicName] || []), subTopicName]
                }
            })),

            updateSubTopic: (topicName, oldName, newName) => set((state) => {
                const newSubTopics = {
                    ...state.subTopics,
                    [topicName]: (state.subTopics[topicName] || []).map(st =>
                        st === oldName ? newName : st
                    )
                };
                const newQuestions = state.questions.map(q =>
                    q.topic === topicName && q.subTopic === oldName
                        ? { ...q, subTopic: newName }
                        : q
                );
                return { subTopics: newSubTopics, questions: newQuestions };
            }),

            deleteSubTopic: (topicName, subTopicName) => set((state) => ({
                subTopics: {
                    ...state.subTopics,
                    [topicName]: (state.subTopics[topicName] || []).filter(st => st !== subTopicName)
                },
                questions: state.questions.map(q =>
                    q.topic === topicName && q.subTopic === subTopicName
                        ? { ...q, subTopic: null }
                        : q
                )
            })),

            reorderSubTopics: (topicName, fromIndex, toIndex) => set((state) => ({
                subTopics: {
                    ...state.subTopics,
                    [topicName]: reorderArray(state.subTopics[topicName] || [], fromIndex, toIndex)
                }
            })),

            // ========== Question Actions ==========
            addQuestion: (question) => set((state) => ({
                questions: [...state.questions, {
                    id: generateId(),
                    isSolved: false,
                    ...question
                }]
            })),

            updateQuestion: (id, updates) => set((state) => ({
                questions: state.questions.map(q =>
                    q.id === id ? { ...q, ...updates } : q
                )
            })),

            deleteQuestion: (id) => set((state) => ({
                questions: state.questions.filter(q => q.id !== id)
            })),

            toggleSolved: (id) => set((state) => ({
                questions: state.questions.map(q =>
                    q.id === id ? { ...q, isSolved: !q.isSolved } : q
                )
            })),

            reorderQuestions: (topicName, fromIndex, toIndex) => set((state) => {
                // Get questions for this topic
                const topicQuestions = state.questions.filter(q => q.topic === topicName);
                const otherQuestions = state.questions.filter(q => q.topic !== topicName);

                // Reorder within topic
                const reordered = reorderArray(topicQuestions, fromIndex, toIndex);

                // Maintain overall order by topic
                return {
                    questions: [...otherQuestions, ...reordered].sort((a, b) => {
                        const aIndex = state.topicOrder.indexOf(a.topic);
                        const bIndex = state.topicOrder.indexOf(b.topic);
                        return aIndex - bIndex;
                    })
                };
            }),

            moveQuestion: (questionId, newTopic, newSubTopic = null) => set((state) => ({
                questions: state.questions.map(q =>
                    q.id === questionId
                        ? { ...q, topic: newTopic, subTopic: newSubTopic }
                        : q
                )
            })),

            // ========== Filter Actions ==========
            setFilter: (key, value) => set((state) => ({
                filters: { ...state.filters, [key]: value }
            })),

            clearFilters: () => set(() => ({
                filters: {
                    search: '',
                    difficulty: 'all',
                    platform: 'all',
                    status: 'all',
                }
            })),

            // ========== Import/Export ==========
            exportData: () => {
                const state = get();
                return {
                    sheet: state.sheet,
                    topicOrder: state.topicOrder,
                    subTopics: state.subTopics,
                    questions: state.questions,
                    exportedAt: new Date().toISOString(),
                };
            },

            importData: (data) => set(() => ({
                sheet: data.sheet || {},
                topicOrder: data.topicOrder || [],
                subTopics: data.subTopics || {},
                questions: data.questions || [],
                expandedTopics: {},
                filters: {
                    search: '',
                    difficulty: 'all',
                    platform: 'all',
                    status: 'all',
                }
            })),

            // ========== Reset ==========
            resetToDefault: () => set(() => ({
                sheet: {
                    id: sampleData.sheet.id,
                    name: sampleData.sheet.name,
                    description: sampleData.sheet.description,
                    banner: sampleData.sheet.banner,
                },
                topicOrder: [...sampleData.sheet.config.topicOrder],
                questions: [...sampleData.questions],
                subTopics: {},
                expandedTopics: {},
                filters: {
                    search: '',
                    difficulty: 'all',
                    platform: 'all',
                    status: 'all',
                }
            })),
        }),
        {
            name: STORAGE_KEY,
            partialize: (state) => ({
                sheet: state.sheet,
                topicOrder: state.topicOrder,
                questions: state.questions,
                subTopics: state.subTopics,
            }),
        }
    )
);

export default useSheetStore;
