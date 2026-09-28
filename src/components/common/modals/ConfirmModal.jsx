import { AlertCircle, AlertTriangle, Loader2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export const ConfirmModal = ({
    isOpen,
    onClose,
    onConfirm,
    submitting = false,
    variant = 'danger', // 'danger' | 'warning'
    title,
    description,
    confirmText
}) => {
    const { t } = useTranslation()

    if (!isOpen) return null

    const isDanger = variant === 'danger'

    const defaultTitle = isDanger
        ? t('common.modals.confirmDeletionTitle')
        : t('common.modals.confirmUpdateTitle')

    const defaultDescription = isDanger
        ? t('common.modals.confirmDeletionDesc')
        : t('common.modals.confirmUpdateDesc')

    const defaultConfirmText = isDanger
        ? t('common.modals.delete')
        : t('common.modals.update')

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <div className="bg-main border border-line w-full max-w-sm p-6 space-y-4 shadow-xl font-mono text-xs">
                <h3
                    className={`text-sm font-bold uppercase tracking-wider flex items-center gap-2 ${isDanger ? 'text-red-500' : 'text-amber-500'
                        }`}
                >
                    {isDanger ? <AlertCircle className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                    <span>{title || defaultTitle}</span>
                </h3>

                <p className="text-muted leading-relaxed">
                    {description || defaultDescription}
                </p>

                <div className="flex justify-end gap-3 pt-3 border-t border-line">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={submitting}
                        className="px-3.5 py-2 border border-line text-muted hover:text-content uppercase cursor-pointer transition-colors"
                    >
                        {t('common.modals.cancel')}
                    </button>
                    <button
                        type="button"
                        disabled={submitting}
                        onClick={onConfirm}
                        className={`px-3.5 py-2 border font-bold uppercase cursor-pointer transition-colors flex items-center gap-2 ${isDanger
                            ? 'border-red-500 bg-red-500 text-white hover:bg-transparent hover:text-red-500'
                            : 'border-amber-500 bg-amber-500 text-black hover:bg-transparent hover:text-amber-500'
                            }`}
                    >
                        {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                        <span>{confirmText || defaultConfirmText}</span>
                    </button>
                </div>
            </div>
        </div>
    )
}