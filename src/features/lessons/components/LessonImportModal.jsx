import { AlertCircle, FileText, Loader2, X } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useEscapeKey } from '../../hooks/useEscapeKey'

export const LessonImportModal = ({ isOpen, onClose, onImport, submitting }) => {
    const { t } = useTranslation()
    const [csvText, setCsvText] = useState('')

    useEscapeKey(onClose, isOpen)

    if (!isOpen) return null

    const handleParseAndSubmit = (e) => {
        e.preventDefault()
        if (!csvText.trim()) return

        // Expected CSV Format: groupId, subject, duration, lessonDate, lessonTime, summary
        const lines = csvText.trim().split('\n')
        const parsedLessons = lines.map((line) => {
            const [groupId, subject, duration, lessonDate, lessonTime, ...summaryParts] = line.split(',').map(s => s.trim())

            return {
                groupId: groupId || '',
                subject: subject || 'Untitled Subject',
                duration: ['45', '50', '90', '100'].includes(duration) ? duration : '50',
                lessonDate: lessonDate || new Date().toISOString().split('T')[0],
                lessonTime: lessonTime || '08:00',
                summary: summaryParts.join(',') || ''
            }
        })

        onImport(parsedLessons)
    }

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <div className="bg-main border border-line w-full max-w-2xl p-6 space-y-6 shadow-xl font-mono text-xs">
                <div className="flex items-center justify-between border-b border-line pb-4">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-content flex items-center gap-2">
                        <FileText className="w-4 h-4 text-accent" />
                        {t('lessons.importModal.title')}
                    </h3>
                    <button onClick={onClose} className="p-1 border border-line text-muted hover:text-content transition-colors">
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <form onSubmit={handleParseAndSubmit} className="space-y-4">
                    <div className="bg-blue-500/10 border border-blue-500/30 p-3 flex items-start gap-3 text-blue-700 dark:text-blue-400">
                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                        <p className="leading-relaxed">
                            {t('lessons.importModal.instructions', 'CSV format must be: groupId, subject, duration (45/50/90/100), lessonDate (YYYY-MM-DD), lessonTime (HH:MM), summary. Lesson numbers are auto-calculated by the system.')}
                        </p>
                    </div>

                    <textarea
                        rows={8}
                        required
                        value={csvText}
                        onChange={(e) => setCsvText(e.target.value)}
                        placeholder="group-uuid-1234, Math, 50, 2026-09-28, 10:00, Introduction to Algebra..."
                        className="w-full bg-main border border-line p-3 text-content focus:outline-none focus:border-accent font-mono text-xs whitespace-pre"
                    />

                    <div className="flex justify-end gap-3 pt-4 border-t border-line">
                        <button type="button" onClick={onClose} className="px-4 py-2 border border-line text-muted hover:text-content uppercase">
                            {t('lessons.importModal.cancel')}
                        </button>
                        <button type="submit" disabled={submitting} className="px-4 py-2 border border-line bg-content text-main hover:bg-transparent hover:text-content transition-colors uppercase font-bold flex items-center gap-2">
                            {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                            <span>{t('lessons.importModal.submit')}</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}