import { ArrowUpDown, ChevronDown, ChevronRight, Clock, Edit2, Loader2, MonitorPlay, Share, Trash2, Users } from 'lucide-react'
import { Fragment, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { RichText } from '../../../components/common/RichTextEditor'

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

    const groupMap = new Map(groups.map(g => [g.id, g.displayName || g.name || g.id]))

    const toggleExpand = (id) => {
        setExpandedId(expandedId === id ? null : id)
    }

    const hasContent = (str) => Boolean(str && str.replace(/<[^>]*>/g, '').trim())

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
                <thead>
                    <tr className="border-b border-line bg-content/5 uppercase tracking-wider text-muted select-none">
                        <th className="p-3.5 w-10"></th>
                        <th className="p-3.5 cursor-pointer hover:text-content" onClick={() => onToggleSort('number')}>
                            <span className="inline-flex items-center gap-1">
                                {t('lessons.columns.number', 'Nº')}
                                <ArrowUpDown className={`w-3 h-3 ${sortField === 'number' ? 'text-accent' : ''}`} />
                                {sortField === 'number' && <span className="text-[10px]">{sortDirection.toUpperCase()}</span>}
                            </span>
                        </th>
                        <th className="p-3.5">{t('lessons.columns.subject', 'Subject')}</th>
                        <th className="p-3.5">{t('lessons.columns.group', 'Group')}</th>
                        <th className="p-3.5 cursor-pointer hover:text-content" onClick={() => onToggleSort('date')}>
                            <span className="inline-flex items-center gap-1">
                                {t('lessons.columns.date', 'Date')}
                                <ArrowUpDown className={`w-3 h-3 ${sortField === 'date' ? 'text-accent' : ''}`} />
                                {sortField === 'date' && <span className="text-[10px]">{sortDirection.toUpperCase()}</span>}
                            </span>
                        </th>
                        <th className="p-3.5">{t('lessons.columns.time', 'Time')}</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-line">
                    {lessons.map((lesson) => {
                        const isExpanded = expandedId === lesson.id
                        const summary = lesson.summary
                        const attentionBox = lesson.attention_box || lesson.attentionBox
                        const stepByStep = lesson.step_by_step || lesson.stepByStep
                        const materials = lesson.materials
                        const teacherNotes = lesson.teacher_notes || lesson.teacherNotes

                        return (
                            <Fragment key={lesson.id}>
                                <tr
                                    onClick={() => toggleExpand(lesson.id)}
                                    className={`hover:bg-content/5 transition-colors cursor-pointer ${isExpanded ? 'bg-content/5' : ''}`}
                                >
                                    <td className="p-3.5 text-muted">
                                        {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                                    </td>
                                    <td className="p-3.5 font-bold text-accent">{lesson.lesson_number}</td>
                                    <td className="p-3.5 font-bold text-content">{lesson.subject}</td>
                                    <td className="p-3.5 text-muted">
                                        <span className="inline-flex items-center gap-1">
                                            <Users className="w-3 h-3 text-accent" />
                                            {groupMap.get(lesson.group_id) || lesson.group_id || '—'}
                                        </span>
                                    </td>
                                    <td className="p-3.5 text-muted">{lesson.lesson_date || lesson.date || '—'}</td>
                                    <td className="p-3.5 text-muted">
                                        <span className="inline-flex items-center gap-1">
                                            <Clock className="w-3 h-3 text-muted" />
                                            {lesson.lesson_time || '—'} ({lesson.duration || '50'}m)
                                        </span>
                                    </td>
                                </tr>

                                {isExpanded && (
                                    <tr className="bg-content/5 border-b border-line">
                                        <td colSpan={6} className="p-6">
                                            <div className="space-y-6">
                                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                                    <div className="space-y-4">
                                                        <div>
                                                            <h4 className="font-bold uppercase tracking-wider text-muted mb-2">
                                                                {t('lessons.details.summary', 'Summary')}
                                                            </h4>
                                                            <div className="bg-main border border-line p-4">
                                                                {hasContent(summary) ? (
                                                                    <RichText html={summary} />
                                                                ) : (
                                                                    <p className="text-muted italic">{t('lessons.details.noSummary', 'No summary provided.')}</p>
                                                                )}
                                                            </div>
                                                        </div>

                                                        {hasContent(attentionBox) && (
                                                            <div>
                                                                <h4 className="font-bold uppercase tracking-wider text-yellow-600 mb-2">
                                                                    {t('lessons.details.attention', 'Attention Box')}
                                                                </h4>
                                                                <div className="bg-yellow-500/10 border border-yellow-500/30 p-4">
                                                                    <RichText html={attentionBox} />
                                                                </div>
                                                            </div>
                                                        )}

                                                        {hasContent(stepByStep) && (
                                                            <div>
                                                                <h4 className="font-bold uppercase tracking-wider text-muted mb-2">
                                                                    {t('lessons.details.stepByStep', 'Step-by-Step Plan')}
                                                                </h4>
                                                                <div className="bg-main border border-line p-4">
                                                                    <RichText html={stepByStep} />
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="space-y-4">
                                                        {hasContent(materials) && (
                                                            <div>
                                                                <h4 className="font-bold uppercase tracking-wider text-muted mb-2">
                                                                    {t('lessons.details.materials', 'Materials & Resources')}
                                                                </h4>
                                                                <div className="bg-main border border-line p-4">
                                                                    <RichText html={materials} />
                                                                </div>
                                                            </div>
                                                        )}

                                                        {hasContent(teacherNotes) && (
                                                            <div>
                                                                <h4 className="font-bold uppercase tracking-wider text-muted mb-2">
                                                                    {t('lessons.details.notes', 'Teacher Notes')}
                                                                </h4>
                                                                <div className="bg-main border border-line p-4">
                                                                    <RichText html={teacherNotes} />
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-line/50">
                                                    <button onClick={() => onStudentView(lesson)} className="px-4 py-2 bg-accent text-white hover:bg-accent/90 transition-colors uppercase font-bold flex items-center gap-2 cursor-pointer">
                                                        <MonitorPlay className="w-4 h-4" />
                                                        {t('lessons.actions.studentView', 'Student View')}
                                                    </button>
                                                    <button onClick={() => onEdit(lesson)} className="px-4 py-2 border border-line bg-main hover:bg-content hover:text-main text-content transition-colors uppercase flex items-center gap-2 cursor-pointer">
                                                        <Edit2 className="w-4 h-4" />
                                                        {t('lessons.actions.edit', 'Edit')}
                                                    </button>
                                                    <button onClick={() => onExport(lesson)} className="px-4 py-2 border border-line bg-main hover:bg-content hover:text-main text-content transition-colors uppercase flex items-center gap-2 cursor-pointer">
                                                        <Share className="w-4 h-4" />
                                                        {t('lessons.actions.export', 'Export')}
                                                    </button>
                                                    <div className="flex-1" />
                                                    <button onClick={() => onDelete(lesson.id)} className="px-4 py-2 border border-red-500/30 text-red-500 hover:bg-red-500 hover:text-white transition-colors uppercase flex items-center gap-2 cursor-pointer">
                                                        <Trash2 className="w-4 h-4" />
                                                        {t('lessons.actions.delete', 'Delete')}
                                                    </button>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </Fragment>
                        )
                    })}
                </tbody>
            </table>
        </div>
    )
}