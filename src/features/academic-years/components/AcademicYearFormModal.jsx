import { Loader2, X } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export const AcademicYearFormModal = ({ isOpen, onClose, onSubmit, initialData, submitting }) => {
    const { t } = useTranslation()

    const [formData, setFormData] = useState({
        label: initialData?.label || '',
        startDate: initialData?.startDate || '',
        endDate: initialData?.endDate || '',
        isActive: initialData?.isActive || false
    })

    if (!isOpen) return null

    const handleSubmit = (e) => {
        e.preventDefault()
        onSubmit(formData)
    }

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <div className="bg-main border border-line w-full max-w-md p-6 space-y-6 shadow-xl">
                <div className="flex items-center justify-between border-b border-line pb-4">
                    <h3 className="text-sm font-bold font-mono uppercase tracking-wider text-content">
                        {initialData ? t('academicYears.modal.editTitle') : t('academicYears.modal.createTitle')}
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-1 border border-line text-muted hover:text-content transition-colors cursor-pointer"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs">
                    <div>
                        <label className="block uppercase text-muted mb-1">{t('academicYears.modal.label')} *</label>
                        <input
                            type="text"
                            required
                            placeholder={t('academicYears.modal.labelPlaceholder')}
                            value={formData.label}
                            onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                            className="w-full bg-main border border-line p-2.5 text-content focus:outline-none focus:border-accent"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block uppercase text-muted mb-1">{t('academicYears.modal.startDate')} *</label>
                            <input
                                type="date"
                                required
                                value={formData.startDate}
                                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                className="w-full bg-main border border-line p-2.5 text-content focus:outline-none focus:border-accent"
                            />
                        </div>

                        <div>
                            <label className="block uppercase text-muted mb-1">{t('academicYears.modal.endDate')} *</label>
                            <input
                                type="date"
                                required
                                value={formData.endDate}
                                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                className="w-full bg-main border border-line p-2.5 text-content focus:outline-none focus:border-accent"
                            />
                        </div>
                    </div>

                    <div className="pt-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={formData.isActive}
                                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                className="w-4 h-4 border border-line bg-main rounded-none accent-accent cursor-pointer"
                            />
                            <span className="uppercase text-content font-bold">{t('academicYears.modal.setActive')}</span>
                        </label>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-line">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-line text-muted hover:text-content uppercase cursor-pointer"
                        >
                            {t('academicYears.modal.cancel')}
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="px-4 py-2 border border-line bg-content text-main hover:bg-transparent hover:text-content transition-colors uppercase font-bold cursor-pointer flex items-center gap-2"
                        >
                            {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                            <span>{initialData ? t('academicYears.modal.update') : t('academicYears.modal.create')}</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}