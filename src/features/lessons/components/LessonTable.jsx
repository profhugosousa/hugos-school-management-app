import { Clock, Edit2, Loader2, MapPin, Trash2, Users } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export const LessonTable = ({ lessons, loading, onEdit, onDelete }) => {
    const { t } = useTranslation()

    return (
        <div className="border border-line bg-main overflow-x-auto">
            {loading ? (
                <div className="p-12 flex flex-col items-center justify-center gap-3 text-muted font-mono text-xs">
                    <Loader2 className="w-6 h-6 animate-spin text-accent" />
                    <span>{t('lessons.loading')}</span>
                </div>
            ) : lessons.length === 0 ? (
                <div className="p-12 text-center text-muted font-mono text-xs">
                    {t('lessons.empty')}
                </div>
            ) : (
                <table className="w-full text-left border-collapse font-mono text-xs">
                    <thead>
                        <tr className="border-b border-line bg-content/5 uppercase tracking-wider text-muted">
                            <th className="p-3.5">{t('lessons.columns.subject')}</th>
                            <th className="p-3.5">{t('lessons.columns.group')}</th>
                            <th className="p-3.5">{t('lessons.columns.date')}</th>
                            <th className="p-3.5">{t('lessons.columns.time')}</th>
                            <th className="p-3.5">{t('lessons.columns.room')}</th>
                            <th className="p-3.5 text-right">{t('lessons.columns.actions')}</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-line">
                        {lessons.map((lesson) => (
                            <tr key={lesson.id} className="hover:bg-content/5 transition-colors">
                                <td className="p-3.5 font-bold text-content">{lesson.subject}</td>
                                <td className="p-3.5 text-muted">
                                    <span className="inline-flex items-center gap-1">
                                        <Users className="w-3 h-3 text-accent" />
                                        {lesson.groupName || '—'}
                                    </span>
                                </td>
                                <td className="p-3.5 text-muted">{lesson.date || '—'}</td>
                                <td className="p-3.5 text-muted">
                                    <span className="inline-flex items-center gap-1">
                                        <Clock className="w-3 h-3 text-muted" />
                                        {lesson.startTime && lesson.endTime ? `${lesson.startTime} - ${lesson.endTime}` : '—'}
                                    </span>
                                </td>
                                <td className="p-3.5 text-muted">
                                    <span className="inline-flex items-center gap-1">
                                        <MapPin className="w-3 h-3 text-muted" />
                                        {lesson.room || '—'}
                                    </span>
                                </td>
                                <td className="p-3.5 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button
                                            onClick={() => onEdit(lesson)}
                                            className="p-1.5 border border-line hover:bg-content hover:text-main text-muted transition-colors cursor-pointer"
                                        >
                                            <Edit2 className="w-3.5 h-3.5" />
                                        </button>
                                        <button
                                            onClick={() => onDelete(lesson.id)}
                                            className="p-1.5 border border-line hover:border-red-500 hover:bg-red-500 hover:text-white text-muted transition-colors cursor-pointer"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    )
}