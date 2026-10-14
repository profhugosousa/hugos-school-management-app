import { ArrowUpDown, Calendar, ChevronDown, ChevronRight, Clock, Loader2, Users } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { LessonDetailView } from './LessonDetailView'

export const LessonTable = ({
    lessons = [],
    groups = [],
    loading = false,
    sortField,
    sortDirection,
    onToggleSort,
    onEdit,
    onDelete,
    onStudentView,
    onEvaluate,
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
        <div className="space-y-3 font-mono text-xs w-full min-w-0">
            {/* Sort Controls Bar */}
            <div className="flex items-center justify-between p-2.5 bg-content/5 border border-line text-muted uppercase text-[11px]">
                <span className="font-bold tracking-wider text-content">
                    {t('lessons.columns.sort', 'Ordenar Por')}
                </span>
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => onToggleSort?.('number')}
                        className={`flex items-center gap-1.5 px-2 py-1 border transition-colors cursor-pointer ${sortField === 'number'
                            ? 'border-accent bg-accent/10 text-accent font-bold'
                            : 'border-line text-muted hover:text-content'
                            }`}
                    >
                        <span>{t('lessons.columns.number', 'Nº')}</span>
                        <ArrowUpDown className="w-3 h-3" />
                        {sortField === 'number' && sortDirection && (
                            <span className="text-[9px] uppercase">{sortDirection}</span>
                        )}
                    </button>

                    <button
                        type="button"
                        onClick={() => onToggleSort?.('date')}
                        className={`flex items-center gap-1.5 px-2 py-1 border transition-colors cursor-pointer ${sortField === 'date'
                            ? 'border-accent bg-accent/10 text-accent font-bold'
                            : 'border-line text-muted hover:text-content'
                            }`}
                    >
                        <span>{t('lessons.columns.date', 'Data')}</span>
                        <ArrowUpDown className="w-3 h-3" />
                        {sortField === 'date' && sortDirection && (
                            <span className="text-[9px] uppercase">{sortDirection}</span>
                        )}
                    </button>
                </div>
            </div>

            {/* Lesson Cards Stream */}
            <div className="space-y-2.5">
                {lessons.map((lesson) => {
                    const isExpanded = expandedId === lesson.id
                    const groupName = groupMap.get(lesson.group_id)

                    return (
                        <div key={lesson.id} className="w-full min-w-0">
                            <div
                                onClick={() => toggleExpand(lesson.id)}
                                className={`p-3.5 border bg-main transition-all cursor-pointer w-full min-w-0 ${isExpanded
                                    ? 'border-accent bg-content/5 ring-1 ring-accent'
                                    : 'border-line hover:border-accent/60'
                                    }`}
                            >
                                <div className="flex items-center justify-between gap-3 min-w-0">
                                    {/* Column 1: Chevron + Lesson # */}
                                    <div className="flex items-center gap-2 w-20 sm:w-24 shrink-0">
                                        <div className="text-muted shrink-0">
                                            {isExpanded ? (
                                                <ChevronDown className="w-4 h-4 text-accent" />
                                            ) : (
                                                <ChevronRight className="w-4 h-4" />
                                            )}
                                        </div>
                                        <span className="px-1.5 py-0.5 font-bold bg-accent/10 border border-accent/20 text-accent text-center min-w-[36px]">
                                            #{lesson.lesson_number}
                                        </span>
                                    </div>

                                    {/* Column 2: Group Name (Mobile) / Subject + Group (Desktop) */}
                                    <div className="flex items-center gap-2 flex-1 min-w-0">
                                        <div className="hidden sm:block truncate font-bold text-content text-sm">
                                            {lesson.subject || '—'}
                                        </div>

                                        <div className="flex items-center gap-1 text-muted shrink-0 min-w-0">
                                            <Users className="w-3.5 h-3.5 text-accent shrink-0" />
                                            <span className="font-semibold text-content truncate">
                                                {groupName || lesson.group_id || '—'}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Column 3: Date & Time Info */}
                                    <div className="flex items-center justify-end gap-3 shrink-0 text-muted">
                                        <div className="flex items-center gap-1 font-mono">
                                            <Calendar className="w-3.5 h-3.5 text-muted sm:hidden shrink-0" />
                                            <span>{lesson.lesson_date || lesson.date || '—'}</span>
                                        </div>

                                        <div className="hidden sm:flex items-center gap-1 border-l border-line pl-3">
                                            <Clock className="w-3.5 h-3.5 text-muted shrink-0" />
                                            <span>
                                                {lesson.lesson_time || '—'} ({lesson.duration || '45'}m)
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Inline Detail Expansion */}
                            {isExpanded && (
                                <div className="mt-2 p-4 border border-line bg-main w-full min-w-0 overflow-hidden">
                                    <LessonDetailView
                                        lesson={lesson}
                                        onStudentView={onStudentView}
                                        onEvaluate={onEvaluate}
                                        onEdit={onEdit}
                                        onExport={onExport}
                                        onDelete={onDelete}
                                    />
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default LessonTable