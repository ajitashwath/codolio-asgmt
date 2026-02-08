import { useEffect } from 'react';
import { X } from 'lucide-react';

export default function Modal({ isOpen, onClose, title, children, size = 'md' }) {
    // Close on escape key
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') onClose();
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = '';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const sizeClasses = {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-xl',
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div
                className={`modal-content ${sizeClasses[size]}`}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header - Sharp and Dark */}
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#222]">
                    <h2 className="text-lg font-mono font-bold uppercase tracking-widest text-white">{title}</h2>
                    <button
                        onClick={onClose}
                        className="p-2 text-[#666] hover:text-white hover:bg-[#222] transition-colors border border-transparent hover:border-[#333]"
                    >
                        <X size={20} strokeWidth={2} />
                    </button>
                </div>

                {/* Content */}
                <div className="text-[#CCC] font-sans">
                    {children}
                </div>
            </div>
        </div>
    );
}
