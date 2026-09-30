import { AlertCircle, Loader2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useEscapeKey } from '../../../hooks/useEscapeKey'


export const AcademicYearDeleteModal = ({ isOpen, onClose, onConfirm, submitting }) => {
    const { t } = useTranslation()

    useEscapeKey(onClose, isOpen)

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <div className="bg-main border border-line w-full max-w-sm p-6 space-y-4 shadow-xl">
                <h3 className="text-sm font-bold font-mono uppercase tracking-wider text-red-500 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    {t('academicYears.deleteModal.title')}
                </h3>
                <p className="text-xs font-mono text-muted">
                    {t('academicYears.deleteModal.description')}
                </p>
                <div className="flex justify-end gap-3 pt-2">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-3 py-1.5 border border-line text-xs font-mono text-muted hover:text-content uppercase cursor-pointer"
                    >
                        {t('academicYears.deleteModal.cancel')}
                    </button>
                    <button
                        type="button"
                        disabled={submitting}
                        onClick={onConfirm}
                        className="px-3 py-1.5 border border-red-500 bg-red-500 text-white hover:bg-transparent hover:text-red-500 transition-colors text-xs font-mono uppercase font-bold cursor-pointer flex items-center gap-2"
                    >
                        {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                        <span>{t('academicYears.deleteModal.confirm')}</span>
                    </button>
                </div>
            </div>
        </div>
    )
}