import { CheckCircle2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import useEscapeKey from '../../../hooks/useEscapeKey'

export const CompleteModal = ({
    isOpen,
    onClose,
    type = 'update', // 'update' | 'deletion'
    title,
    description
}) => {
    const { t } = useTranslation()

    useEscapeKey(onClose, isOpen)

    if (!isOpen) return null

    const isDeletion = type === 'deletion'

    const defaultTitle = isDeletion
        ? t('common.modals.deletionCompleteTitle')
        : t('common.modals.updateCompleteTitle')

    const defaultDescription = isDeletion
        ? t('common.modals.deletionCompleteDesc')
        : t('common.modals.updateCompleteDesc')

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <div className="bg-main border border-line w-full max-w-sm p-6 space-y-4 shadow-xl font-mono text-xs">
                <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-500 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{title || defaultTitle}</span>
                </h3>

                <p className="text-muted leading-relaxed">
                    {description || defaultDescription}
                </p>

                <div className="flex justify-end pt-3 border-t border-line">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 border border-line bg-content text-main hover:bg-transparent hover:text-content transition-colors uppercase font-bold cursor-pointer"
                    >
                        {t('common.modals.close')}
                    </button>
                </div>
            </div>
        </div>
    )
}