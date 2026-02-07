import { useState, useEffect } from 'react';
import useSheetStore from '../store/useSheetStore';

export default function QuestionForm({ initialData, defaultTopic, onSubmit, onCancel }) {
    const { topicOrder, subTopics } = useSheetStore();

    const [formData, setFormData] = useState({
        title: '',
        topic: defaultTopic || topicOrder[0] || '',
        subTopic: null,
        difficulty: 'Medium',
        platform: 'leetcode',
        problemUrl: '',
        resource: '',
        notes: '',
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                title: initialData.title || '',
                topic: initialData.topic || defaultTopic || topicOrder[0] || '',
                subTopic: initialData.subTopic || null,
                difficulty: initialData.difficulty || 'Medium',
                platform: initialData.platform || 'leetcode',
                problemUrl: initialData.problemUrl || '',
                resource: initialData.resource || '',
                notes: initialData.notes || '',
            });
        } else if (defaultTopic) {
            setFormData(prev => ({ ...prev, topic: defaultTopic }));
        }
    }, [initialData, defaultTopic, topicOrder]);

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (field === 'topic') {
            setFormData(prev => ({ ...prev, subTopic: null }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.title.trim() && formData.topic) {
            onSubmit(formData);
        }
    };

    const availableSubTopics = subTopics[formData.topic] || [];

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title */}
            <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                    Question Title *
                </label>
                <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleChange('title', e.target.value)}
                    placeholder="Enter question title"
                    className="input"
                    autoFocus
                />
            </div>

            {/* Topic & SubTopic */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                        Topic *
                    </label>
                    <select
                        value={formData.topic}
                        onChange={(e) => handleChange('topic', e.target.value)}
                        className="input select"
                    >
                        {topicOrder.map(topic => (
                            <option key={topic} value={topic}>{topic}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                        Sub-topic
                    </label>
                    <select
                        value={formData.subTopic || ''}
                        onChange={(e) => handleChange('subTopic', e.target.value || null)}
                        className="input select"
                        disabled={availableSubTopics.length === 0}
                    >
                        <option value="">None</option>
                        {availableSubTopics.map(st => (
                            <option key={st} value={st}>{st}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Difficulty & Platform */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                        Difficulty
                    </label>
                    <select
                        value={formData.difficulty}
                        onChange={(e) => handleChange('difficulty', e.target.value)}
                        className="input select"
                    >
                        <option value="Easy">Easy</option>
                        <option value="Medium">Medium</option>
                        <option value="Hard">Hard</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                        Platform
                    </label>
                    <select
                        value={formData.platform}
                        onChange={(e) => handleChange('platform', e.target.value)}
                        className="input select"
                    >
                        <option value="leetcode">LeetCode</option>
                        <option value="interviewbit">InterviewBit</option>
                        <option value="tuf">TakeUForward</option>
                        <option value="spoj">SPOJ</option>
                        <option value="other">Other</option>
                    </select>
                </div>
            </div>

            {/* Problem URL */}
            <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                    Problem URL
                </label>
                <input
                    type="url"
                    value={formData.problemUrl}
                    onChange={(e) => handleChange('problemUrl', e.target.value)}
                    placeholder="https://leetcode.com/problems/..."
                    className="input"
                />
            </div>

            {/* Resource URL */}
            <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                    Video/Resource URL
                </label>
                <input
                    type="url"
                    value={formData.resource}
                    onChange={(e) => handleChange('resource', e.target.value)}
                    placeholder="https://youtube.com/..."
                    className="input"
                />
            </div>

            {/* Notes */}
            <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                    Notes
                </label>
                <textarea
                    value={formData.notes}
                    onChange={(e) => handleChange('notes', e.target.value)}
                    placeholder="Add your notes here..."
                    rows={3}
                    className="input resize-none"
                />
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={onCancel} className="btn btn-secondary">
                    Cancel
                </button>
                <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={!formData.title.trim() || !formData.topic}
                >
                    {initialData ? 'Update Question' : 'Add Question'}
                </button>
            </div>
        </form>
    );
}
