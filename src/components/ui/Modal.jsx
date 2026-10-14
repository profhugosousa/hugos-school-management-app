import { X } from 'lucide-react'
import useEscapeKey from '../../hooks/useEscapeKey'

export default function Modal({ isOpen, onClose, title, children, maxWidth = 'max-w-md' }) {
    useEscapeKey(onClose, isOpen)

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 font-mono text-xs">
            <div className={`bg-main border border-line shadow-2xl w-full ${maxWidth} overflow-hidden flex flex-col max-h-[90vh]`}>
                <div className="flex items-center justify-between p-4 border-b border-line bg-content/5">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-content">
                        {title}
                    </h3>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-1 text-muted hover:text-content transition-colors cursor-pointer"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
                <div className="p-4 overflow-y-auto flex-1">
                    {children}
                </div>
            </div>
        </div>
    )
}