import { useState, useEffect } from 'react';

export default function SubTopicForm({ initialData, onSubmit, onCancel }) {
    const [name, setName] = useState(initialData?.name || '');

    useEffect(() => {
        setName(initialData?.name || '');
    }, [initialData]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (name.trim()) {
            onSubmit({ name: name.trim() });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                    Sub-topic Name
                </label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter sub-topic name"
                    className="input"
                    autoFocus
                />
            </div>

            <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={onCancel} className="btn btn-secondary">
                    Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={!name.trim()}>
                    {initialData ? 'Update Sub-topic' : 'Add Sub-topic'}
                </button>
            </div>
        </form>
    );
}
