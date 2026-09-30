import { Loader2, Share, X } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '../../../components/ui/Button'
import { useEscapeKey } from '../../hooks/useEscapeKey'


export const LessonExportModal = ({ isOpen, onClose, onExport, groups = [], submitting }) => {
    const { t } = useTranslation()
    const [selectedGroupIds, setSelectedGroupIds] = useState([])

    useEscapeKey(onClose, isOpen)


    if (!isOpen) return null

    const toggleGroup = (id) => {
        setSelectedGroupIds(prev =>
            prev.includes(id) ? prev.filter(gId => gId !== id) : [...prev, id]
        )
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if (selectedGroupIds.length === 0) return
        onExport(selectedGroupIds)
    }

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <div className="bg-main border border-line w-full max-w-md p-6 space-y-6 shadow-xl font-mono text-xs">
                <div className="flex items-center justify-between border-b border-line pb-3">
                    <div className="flex items-center gap-2">
                        <Share className="w-4 h-4 text-accent" />
                        <h3 className="text-sm font-bold uppercase tracking-wider text-content">
                            {t('lessons.export.title', 'Export Lesson to Groups')}
                        </h3>
                    </div>
                    <button onClick={onClose} className="p-1 border border-line text-muted hover:text-content cursor-pointer">
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <p className="text-muted">
                        {t('lessons.export.instruction', 'Select the target group(s) to clone this lesson to:')}
                    </p>

                    <div className="max-h-48 overflow-y-auto border border-line p-2 space-y-1.5">
                        {groups.map((g) => (
                            <label
                                key={g.id}
                                className="flex items-center gap-2.5 p-2 border border-line/50 hover:bg-content/5 cursor-pointer text-xs"
                            >
                                <input
                                    type="checkbox"
                                    checked={selectedGroupIds.includes(g.id)}
                                    onChange={() => toggleGroup(g.id)}
                                    className="accent-accent cursor-pointer"
                                />
                                <span>{g.displayName || g.name || g.id}</span>
                            </label>
                        ))}
                    </div>

                    <div className="flex justify-end gap-3 pt-3 border-t border-line">
                        <Button type="button" variant="secondary" onClick={onClose}>
                            {t('common.cancel', 'Cancel')}
                        </Button>
                        <Button type="submit" disabled={submitting || selectedGroupIds.length === 0}>
                            {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                            <span>{t('lessons.export.action', 'Export')}</span>
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}