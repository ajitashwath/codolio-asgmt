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
        lg: 'max-w-2xl',
        xl: 'max-w-4xl',
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-md"
            onClick={onClose}
        >
            <div
                className={`relative w-full ${sizeClasses[size]} bg-black border-2 border-white shadow-[8px_8px_0px_rgba(255,255,255,0.1)] p-8`}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header - Sharp and Dark */}
                <div className="flex items-center justify-between mb-6 pb-4 border-b-2 border-[#333]">
                    <h2 className="text-xl font-mono font-bold uppercase tracking-widest text-white">{title}</h2>
                    <button
                        onClick={onClose}
                        className="p-2 text-[#666] hover:text-white hover:bg-[#222] transition-colors border-2 border-transparent hover:border-[#444]"
                    >
                        <X size={24} strokeWidth={2} />
                    </button>
                </div>

                {/* Content */}
                <div className="text-[#CCC] font-mono text-base">
                    {children}
                </div>
            </div>
        </div>
    );
}
