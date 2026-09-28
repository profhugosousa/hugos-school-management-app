import { Loader2, X } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export const LessonFormModal = ({ isOpen, onClose, onSubmit, initialData, submitting }) => {
    const { t } = useTranslation()

    const [formData, setFormData] = useState({
        subject: initialData?.subject || '',
        groupName: initialData?.groupName || '',
        date: initialData?.date || '',
        startTime: initialData?.startTime || '',
        endTime: initialData?.endTime || '',
        room: initialData?.room || ''
    })

    if (!isOpen) return null

    const handleSubmit = (e) => {
        e.preventDefault()
        onSubmit(formData)
    }

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <div className="bg-main border border-line w-full max-w-md p-6 space-y-6 shadow-xl font-mono text-xs">
                <div className="flex items-center justify-between border-b border-line pb-4">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-content">
                        {initialData ? t('lessons.modal.editTitle') : t('lessons.modal.createTitle')}
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-1 border border-line text-muted hover:text-content transition-colors cursor-pointer"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block uppercase text-muted mb-1">{t('lessons.modal.subject')} *</label>
                        <input
                            type="text"
                            required
                            placeholder={t('lessons.modal.subjectPlaceholder')}
                            value={formData.subject}
                            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                            className="w-full bg-main border border-line p-2.5 text-content focus:outline-none focus:border-accent"
                        />
                    </div>

                    <div>
                        <label className="block uppercase text-muted mb-1">{t('lessons.modal.group')} *</label>
                        <input
                            type="text"
                            required
                            placeholder={t('lessons.modal.groupPlaceholder')}
                            value={formData.groupName}
                            onChange={(e) => setFormData({ ...formData, groupName: e.target.value })}
                            className="w-full bg-main border border-line p-2.5 text-content focus:outline-none focus:border-accent"
                        />
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                        <div>
                            <label className="block uppercase text-muted mb-1">{t('lessons.modal.date')} *</label>
                            <input
                                type="date"
                                required
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                className="w-full bg-main border border-line p-2 text-content focus:outline-none focus:border-accent"
                            />
                        </div>
                        <div>
                            <label className="block uppercase text-muted mb-1">{t('lessons.modal.startTime')}</label>
                            <input
                                type="time"
                                value={formData.startTime}
                                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                                className="w-full bg-main border border-line p-2 text-content focus:outline-none focus:border-accent"
                            />
                        </div>
                        <div>
                            <label className="block uppercase text-muted mb-1">{t('lessons.modal.endTime')}</label>
                            <input
                                type="time"
                                value={formData.endTime}
                                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                                className="w-full bg-main border border-line p-2 text-content focus:outline-none focus:border-accent"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block uppercase text-muted mb-1">{t('lessons.modal.room')}</label>
                        <input
                            type="text"
                            placeholder={t('lessons.modal.roomPlaceholder')}
                            value={formData.room}
                            onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                            className="w-full bg-main border border-line p-2.5 text-content focus:outline-none focus:border-accent"
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-line">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-line text-muted hover:text-content uppercase cursor-pointer"
                        >
                            {t('lessons.modal.cancel')}
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="px-4 py-2 border border-line bg-content text-main hover:bg-transparent hover:text-content transition-colors uppercase font-bold cursor-pointer flex items-center gap-2"
                        >
                            {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                            <span>{t('lessons.modal.save')}</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}