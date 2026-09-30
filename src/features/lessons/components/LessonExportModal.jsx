import { Loader2, Search, Share, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '../../../components/ui/Button'
import { useEscapeKey } from '../../../hooks/useEscapeKey'

const EXPORTABLE_FIELDS = [
    { key: 'subject', labelKey: 'lessons.fields.subject', defaultLabel: 'Subject' },
    { key: 'summary', labelKey: 'lessons.fields.summary', defaultLabel: 'Summary' },
    { key: 'attentionBox', labelKey: 'lessons.fields.attentionBox', defaultLabel: 'Attention Box' },
    { key: 'teacherNotes', labelKey: 'lessons.fields.teacherNotes', defaultLabel: 'Teacher Notes' },
    { key: 'stepByStep', labelKey: 'lessons.fields.stepByStep', defaultLabel: 'Step-by-Step' },
    { key: 'materials', labelKey: 'lessons.fields.materials', defaultLabel: 'Materials' },
]

export const LessonExportModal = ({
    isOpen,
    onClose,
    onExport,
    sourceLesson,
    groups = [],
    lessons = [],
    submitting
}) => {
    const { t } = useTranslation()

    // Export Mode: 'new' | 'existing'
    const [mode, setMode] = useState('new')

    // Field selection checkboxes (default: all enabled)
    const [selectedFields, setSelectedFields] = useState({
        subject: true,
        summary: true,
        attentionBox: true,
        teacherNotes: true,
        stepByStep: true,
        materials: true
    })

    // Target Selection
    const [selectedGroupIds, setSelectedGroupIds] = useState([])
    const [selectedLessonIds, setSelectedLessonIds] = useState([])

    // Search and Filters for existing lessons
    const [groupFilter, setGroupFilter] = useState('all')
    const [searchQuery, setSearchQuery] = useState('')

    useEscapeKey(onClose, isOpen)

    // Filter available existing lessons (excluding source lesson)
    const availableLessons = useMemo(() => {
        if (!sourceLesson) return []
        return lessons.filter((l) => {
            if (l.id === sourceLesson.id) return false
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
    }, [lessons, sourceLesson, groupFilter, searchQuery])

    if (!isOpen || !sourceLesson) return null

    // Field selection helpers
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

    // Target Group selection
    const toggleGroup = (id) => {
        setSelectedGroupIds((prev) =>
            prev.includes(id) ? prev.filter((gId) => gId !== id) : [...prev, id]
        )
    }

    // Target Lesson selection
    const toggleTargetLesson = (id) => {
        setSelectedLessonIds((prev) =>
            prev.includes(id) ? prev.filter((lId) => lId !== id) : [...prev, id]
        )
    }

    const isAnyFieldSelected = Object.values(selectedFields).some(Boolean)
    const isTargetValid =
        mode === 'new' ? selectedGroupIds.length > 0 : selectedLessonIds.length > 0

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!isAnyFieldSelected || !isTargetValid) return

        onExport({
            mode,
            selectedFields,
            targetGroupIds: selectedGroupIds,
            targetLessonIds: selectedLessonIds
        })
    }

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <div className="bg-main border border-line w-full max-w-lg p-6 space-y-5 shadow-xl font-mono text-xs max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-line pb-3 shrink-0">
                    <div className="flex items-center gap-2">
                        <Share className="w-4 h-4 text-accent" />
                        <h3 className="text-sm font-bold uppercase tracking-wider text-content">
                            {t('lessons.export.title', 'Export Lesson Information')}
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
                    {/* Mode Selector Tabs */}
                    <div className="space-y-1.5">
                        <label className="block text-[10px] font-semibold uppercase tracking-wider text-muted">
                            {t('lessons.export.destinationType', '1. Destination Strategy')}
                        </label>
                        <div className="grid grid-cols-2 gap-2 p-1 bg-content/5 border border-line rounded">
                            <button
                                type="button"
                                onClick={() => setMode('new')}
                                className={`py-1.5 px-3 text-center text-xs font-bold transition-colors cursor-pointer ${mode === 'new'
                                    ? 'bg-accent text-white shadow'
                                    : 'text-muted hover:text-content'
                                    }`}
                            >
                                {t('lessons.export.modeNew', 'Create New Lesson(s)')}
                            </button>
                            <button
                                type="button"
                                onClick={() => setMode('existing')}
                                className={`py-1.5 px-3 text-center text-xs font-bold transition-colors cursor-pointer ${mode === 'existing'
                                    ? 'bg-accent text-white shadow'
                                    : 'text-muted hover:text-content'
                                    }`}
                            >
                                {t('lessons.export.modeExisting', 'Existing Lesson(s)')}
                            </button>
                        </div>
                    </div>

                    {/* Checkbox Selector: What Information to Export */}
                    <div className="space-y-2 border-t border-line pt-3">
                        <div className="flex items-center justify-between">
                            <label className="block text-[10px] font-semibold uppercase tracking-wider text-muted">
                                {t('lessons.export.selectFields', '2. Content to Export')}
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
                            {EXPORTABLE_FIELDS.map((field) => (
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

                    {/* Target Selector */}
                    <div className="space-y-2 border-t border-line pt-3">
                        <label className="block text-[10px] font-semibold uppercase tracking-wider text-muted">
                            {mode === 'new'
                                ? t('lessons.export.selectGroups', '3. Select Target Groups')
                                : t('lessons.export.selectExistingLessons', '3. Select Target Lesson(s)')}
                        </label>

                        {mode === 'new' ? (
                            /* New Lesson Mode: Choose Groups */
                            <div className="max-h-40 overflow-y-auto border border-line p-2 space-y-1.5">
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
                                        <span className="text-content">{g.displayName || g.name || g.id}</span>
                                    </label>
                                ))}
                            </div>
                        ) : (
                            /* Existing Lesson Mode: Filter + Browser */
                            <div className="space-y-2">
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
                                            return (
                                                <label
                                                    key={l.id}
                                                    className="flex items-center justify-between p-2 border border-line/50 hover:bg-content/5 cursor-pointer text-xs"
                                                >
                                                    <div className="flex items-center gap-2.5">
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedLessonIds.includes(l.id)}
                                                            onChange={() => toggleTargetLesson(l.id)}
                                                            className="accent-accent cursor-pointer"
                                                        />
                                                        <div>
                                                            <div className="font-bold text-content">
                                                                Lesson #{l.lesson_number || l.lessonNumber || '—'}{' '}
                                                                <span className="font-normal text-muted">
                                                                    ({l.subject || 'No Subject'})
                                                                </span>
                                                            </div>
                                                            <div className="text-[10px] text-muted">
                                                                {l.lesson_date || l.lessonDate}{' '}
                                                                {groupName && `• ${groupName}`}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </label>
                                            )
                                        })
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3 pt-3 border-t border-line shrink-0">
                        <Button type="button" variant="secondary" onClick={onClose}>
                            {t('common.cancel', 'Cancel')}
                        </Button>
                        <Button
                            type="submit"
                            disabled={submitting || !isAnyFieldSelected || !isTargetValid}
                        >
                            {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                            <span>{t('lessons.export.action', 'Export')}</span>
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}