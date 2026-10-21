import { Download, Loader2, Search, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '../../../components/ui/Button'
import { useEscapeKey } from '../../../hooks/useEscapeKey'

const IMPORTABLE_FIELDS = [
    { key: 'subject', labelKey: 'lessons.fields.subject', defaultLabel: 'Subject' },
    { key: 'summary', labelKey: 'lessons.fields.summary', defaultLabel: 'Summary' },
    { key: 'attentionBox', labelKey: 'lessons.fields.attentionBox', defaultLabel: 'Attention Box' },
    { key: 'teacherNotes', labelKey: 'lessons.fields.teacherNotes', defaultLabel: 'Teacher Notes' },
    { key: 'stepByStep', labelKey: 'lessons.fields.stepByStep', defaultLabel: 'Step-by-Step' },
    { key: 'materials', labelKey: 'lessons.fields.materials', defaultLabel: 'Materials' },
]

export const LessonImportFromModal = ({
    isOpen,
    onClose,
    onImport,
    targetLesson,
    groups = [],
    lessons = [],
    submitting
}) => {
    const { t } = useTranslation()

    const [selectedSourceId, setSelectedSourceId] = useState('')
    const [selectedFields, setSelectedFields] = useState({
        subject: true,
        summary: true,
        attentionBox: true,
        teacherNotes: true,
        stepByStep: true,
        materials: true
    })

    const [groupFilter, setGroupFilter] = useState('all')
    const [searchQuery, setSearchQuery] = useState('')

    useEscapeKey(onClose, isOpen)

    // Available lessons excluding target lesson
    const availableLessons = useMemo(() => {
        if (!targetLesson) return []
        return lessons.filter((l) => {
            if (l.id === targetLesson.id) return false
            if (groupFilter !== 'all' && l.group_id !== groupFilter && l.groupId !== groupFilter) return false
            if (searchQuery.trim()) {
                const q = searchQuery.toLowerCase()
                const num = String(l.lesson_number || l.lessonNumber || '')
                const sub = String(l.subject || '').toLowerCase()
                const date = String(l.lesson_date || l.lessonDate || '')
                return num.includes(q) || sub.includes(q) || date.includes(q)
            }
            return true
        })
    }, [lessons, targetLesson, groupFilter, searchQuery])

    const selectedSourceLesson = useMemo(() => {
        return lessons.find((l) => l.id === selectedSourceId) || null
    }, [lessons, selectedSourceId])

    if (!isOpen || !targetLesson) return null

    const toggleField = (key) => {
        setSelectedFields((prev) => ({ ...prev, [key]: !prev[key] }))
    }

    const allFieldsSelected = Object.values(selectedFields).every(Boolean)

    const toggleSelectAllFields = () => {
        const nextState = !allFieldsSelected
        setSelectedFields({
            subject: nextState,
            summary: nextState,
            attentionBox: nextState,
            teacherNotes: nextState,
            stepByStep: nextState,
            materials: nextState
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!selectedSourceLesson || !Object.values(selectedFields).some(Boolean)) return

        onImport({
            targetLessonId: targetLesson.id,
            sourceLesson: selectedSourceLesson,
            selectedFields
        })
    }

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <div className="bg-main border border-line w-full max-w-lg p-6 space-y-5 shadow-xl font-mono text-xs max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-line pb-3 shrink-0">
                    <div className="flex items-center gap-2">
                        <Download className="w-4 h-4 text-accent" />
                        <h3 className="text-sm font-bold uppercase tracking-wider text-content">
                            {t('lessons.importFrom.title', 'Import Content into Lesson')} #{targetLesson.lesson_number}
                        </h3>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-1 border border-line text-muted hover:text-content cursor-pointer"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto pr-1 flex-1">
                    {/* Source Lesson Browser */}
                    <div className="space-y-2">
                        <label className="block text-[10px] font-semibold uppercase tracking-wider text-muted">
                            {t('lessons.importFrom.selectSource', '1. Select Source Lesson')}
                        </label>

                        <div className="flex gap-2">
                            <div className="relative flex-1">
                                <Search className="w-3.5 h-3.5 absolute left-2.5 top-2 text-muted" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder={t('common.search', 'Search lesson # or subject...')}
                                    className="w-full pl-8 pr-2 py-1 bg-content/5 border border-line text-xs focus:outline-none focus:border-accent"
                                />
                            </div>
                            <select
                                value={groupFilter}
                                onChange={(e) => setGroupFilter(e.target.value)}
                                className="bg-content/5 border border-line px-2 py-1 text-xs text-content focus:outline-none focus:border-accent"
                            >
                                <option value="all">{t('common.allGroups', 'All Groups')}</option>
                                {groups.map((g) => (
                                    <option key={g.id} value={g.id}>
                                        {g.displayName || g.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="max-h-44 overflow-y-auto border border-line p-2 space-y-1.5">
                            {availableLessons.length === 0 ? (
                                <p className="text-muted text-center py-4 italic">
                                    {t('lessons.export.noLessonsFound', 'No matching lessons found')}
                                </p>
                            ) : (
                                availableLessons.map((l) => {
                                    const groupName =
                                        groups.find((g) => g.id === (l.group_id || l.groupId))?.displayName || ''
                                    const isSelected = selectedSourceId === l.id

                                    return (
                                        <div
                                            key={l.id}
                                            onClick={() => setSelectedSourceId(l.id)}
                                            className={`p-2 border cursor-pointer transition-colors text-xs ${isSelected
                                                ? 'border-accent bg-accent/10 font-bold'
                                                : 'border-line/50 hover:bg-content/5'
                                                }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <span className="text-content">
                                                    Lesson #{l.lesson_number || l.lessonNumber || '—'}{' '}
                                                    <span className="font-normal text-muted">
                                                        ({l.subject || 'No Subject'})
                                                    </span>
                                                </span>
                                                <span className="text-[10px] text-muted">
                                                    {l.lesson_date || l.lessonDate} {groupName && `• ${groupName}`}
                                                </span>
                                            </div>
                                        </div>
                                    )
                                })
                            )}
                        </div>
                    </div>

                    {/* Field Checkboxes */}
                    <div className="space-y-2 border-t border-line pt-3">
                        <div className="flex items-center justify-between">
                            <label className="block text-[10px] font-semibold uppercase tracking-wider text-muted">
                                {t('lessons.importFrom.selectFields', '2. Content Fields to Copy')}
                            </label>
                            <button
                                type="button"
                                onClick={toggleSelectAllFields}
                                className="text-[10px] text-accent hover:underline cursor-pointer"
                            >
                                {allFieldsSelected
                                    ? t('common.deselectAll', 'Deselect All')
                                    : t('common.selectAll', 'Select All')}
                            </button>
                        </div>

                        <div className="grid grid-cols-2 gap-2 bg-main border border-line p-2.5">
                            {IMPORTABLE_FIELDS.map((field) => (
                                <label
                                    key={field.key}
                                    className="flex items-center gap-2 p-1.5 border border-line/40 hover:bg-content/5 cursor-pointer rounded transition-colors"
                                >
                                    <input
                                        type="checkbox"
                                        checked={!!selectedFields[field.key]}
                                        onChange={() => toggleField(field.key)}
                                        className="accent-accent cursor-pointer"
                                    />
                                    <span className="text-content font-medium">
                                        {t(field.labelKey, field.defaultLabel)}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3 pt-3 border-t border-line shrink-0">
                        <Button type="button" variant="secondary" onClick={onClose}>
                            {t('common.cancel', 'Cancel')}
                        </Button>
                        <Button
                            type="submit"
                            disabled={submitting || !selectedSourceLesson || !Object.values(selectedFields).some(Boolean)}
                        >
                            {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                            <span>{t('lessons.importFrom.action', 'Import Content')}</span>
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}