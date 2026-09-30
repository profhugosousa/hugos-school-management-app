import { ChevronDown, ChevronRight, Clock, Users } from 'lucide-react'
import { Fragment } from 'react'
import { LessonDetailView } from './LessonDetailView'

export const LessonTableRow = ({
    lesson,
    groupName,
    isExpanded,
    onToggleExpand,
    onStudentView,
    onEdit,
    onExport,
    onDelete
}) => {
    return (
        <Fragment>
            <tr
                onClick={onToggleExpand}
                className={`hover:bg-content/5 transition-colors cursor-pointer ${isExpanded ? 'bg-content/5' : ''
                    }`}
            >
                <td className="p-3.5 text-muted">
                    {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </td>
                <td className="p-3.5 font-bold text-accent">{lesson.lesson_number}</td>
                <td className="p-3.5 font-bold text-content">{lesson.subject}</td>
                <td className="p-3.5 text-muted">
                    <span className="inline-flex items-center gap-1">
                        <Users className="w-3 h-3 text-accent" />
                        {groupName || lesson.group_id || '—'}
                    </span>
                </td>
                <td className="p-3.5 text-muted">{lesson.lesson_date || lesson.date || '—'}</td>
                <td className="p-3.5 text-muted">
                    <span className="inline-flex items-center gap-1">
                        <Clock className="w-3 h-3 text-muted" />
                        {lesson.lesson_time || '—'} ({lesson.duration || '45'}m)
                    </span>
                </td>
            </tr>

            {isExpanded && (
                <tr className="bg-content/5 border-b border-line">
                    <td colSpan={6} className="p-6">
                        <LessonDetailView
                            lesson={lesson}
                            onStudentView={onStudentView}
                            onEdit={onEdit}
                            onExport={onExport}
                            onDelete={onDelete}
                        />
                    </td>
                </tr>
            )}
        </Fragment>
    )
}