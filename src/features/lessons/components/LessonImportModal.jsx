import { FileText, Loader2, X } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export const LessonImportModal = ({ isOpen, onClose, onImport, submitting }) => {
    const { t } = useTranslation()
    const [csvText, setCsvText] = useState('')

    if (!isOpen) return null

    const handleParseAndSubmit = (e) => {
        e.preventDefault()
        if (!csvText.trim()) return

        const lines = csvText.trim().split('\n')
        const parsedLessons = lines.map((line) => {
            const [subject, groupName, date, startTime, endTime, room] = line.split(',').map((s) => s.trim())
            return {
                subject: subject || 'Untitled Lesson',
                groupName: groupName || '',
                date: date || '',
                startTime: startTime || '',
                endTime: endTime || '',
                room: room || ''
            }
        })

        onImport(parsedLessons)
    }

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <div className="bg-main border border-line w-full max-w-lg p-6 space-y-6 shadow-xl font-mono text-xs">
                <div className="flex items-center justify-between border-b border-line pb-4">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-content flex items-center gap-2">
                        <FileText className="w-4 h-4 text-accent" />
                        {t('lessons.importModal.title')}
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-1 border border-line text-muted hover:text-content transition-colors cursor-pointer"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <form onSubmit={handleParseAndSubmit} className="space-y-4">
                    <p className="text-muted leading-relaxed">
                        {t('lessons.importModal.description')}
                    </p>

                    <textarea
                        rows={6}
                        required
                        value={csvText}
                        onChange={(e) => setCsvText(e.target.value)}
                        placeholder={t('lessons.importModal.placeholder')}
                        className="w-full bg-main border border-line p-3 text-content focus:outline-none focus:border-accent font-mono text-xs"
                    />

                    <div className="flex justify-end gap-3 pt-4 border-t border-line">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-line text-muted hover:text-content uppercase cursor-pointer"
                        >
                            {t('lessons.importModal.cancel')}
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="px-4 py-2 border border-line bg-content text-main hover:bg-transparent hover:text-content transition-colors uppercase font-bold cursor-pointer flex items-center gap-2"
                        >
                            {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                            <span>{t('lessons.importModal.submit')}</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}