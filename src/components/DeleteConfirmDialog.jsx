import { AlertTriangle } from 'lucide-react';

export default function DeleteConfirmDialog({ type, name, onConfirm, onCancel }) {
    return (
        <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-50 flex items-center justify-center">
                <AlertTriangle className="text-red-500" size={32} />
            </div>

            <h3 className="text-lg font-bold text-[var(--color-text-primary)] mb-2">
                Delete {type}?
            </h3>

            <p className="text-[var(--color-text-secondary)] mb-8">
                Are you sure you want to delete <span className="font-semibold text-[var(--color-text-primary)]">"{name}"</span>?
                {type === 'Topic' && (
                    <span className="block mt-2 text-sm text-red-500 font-medium">
                        This will also delete all questions under this topic.
                    </span>
                )}
                <span className="block mt-1 text-sm">This action cannot be undone.</span>
            </p>

            <div className="flex justify-center gap-3">
                <button onClick={onCancel} className="btn btn-secondary">
                    Cancel
                </button>
                <button onClick={onConfirm} className="btn btn-danger">
                    Delete
                </button>
            </div>
        </div>
    );
}
