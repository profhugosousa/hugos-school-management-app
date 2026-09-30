import { Loader2 } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { LessonTableHeader } from './LessonTableHeader'
import { LessonTableRow } from './LessonTableRow'

export const LessonTable = ({
    lessons,
    groups = [],
    loading,
    sortField,
    sortDirection,
    onToggleSort,
    onEdit,
    onDelete,
    onStudentView,
    onExport
}) => {
    const { t } = useTranslation()
    const [expandedId, setExpandedId] = useState(null)

    const groupMap = useMemo(() => {
        return new Map(groups.map((g) => [g.id, g.displayName || g.name || g.id]))
    }, [groups])

    const toggleExpand = (id) => {
        setExpandedId((prev) => (prev === id ? null : id))
    }

    if (loading) {
        return (
            <div className="p-12 border border-line bg-main flex flex-col items-center justify-center gap-3 text-muted font-mono text-xs">
                <Loader2 className="w-6 h-6 animate-spin text-accent" />
                <span>{t('lessons.loading', { defaultValue: 'Loading lessons...' })}</span>
            </div>
        )
    }

    if (lessons.length === 0) {
        return (
            <div className="p-12 border border-line bg-main text-center text-muted font-mono text-xs">
                {t('lessons.empty', { defaultValue: 'No lessons found.' })}
            </div>
        )
    }

    return (
        <div className="border border-line bg-main overflow-x-auto">
            <table className="w-full text-left border-collapse font-mono text-xs">
                <LessonTableHeader
                    sortField={sortField}
                    sortDirection={sortDirection}
                    onToggleSort={onToggleSort}
                />
                <tbody className="divide-y divide-line">
                    {lessons.map((lesson) => (
                        <LessonTableRow
                            key={lesson.id}
                            lesson={lesson}
                            groupName={groupMap.get(lesson.group_id)}
                            isExpanded={expandedId === lesson.id}
                            onToggleExpand={() => toggleExpand(lesson.id)}
                            onStudentView={onStudentView}
                            onEdit={onEdit}
                            onExport={onExport}
                            onDelete={onDelete}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default LessonTable