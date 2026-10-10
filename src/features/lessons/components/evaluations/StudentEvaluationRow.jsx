import { MessageSquare, User } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { RatingStars } from './RatingStars'

export function StudentEvaluationRow({ student, onChange }) {
    const { t } = useTranslation()

    const handleStudentRating = (rating) => {
        const updateTeacher = !student.teacherEdited
        onChange(student.studentId, {
            studentRating: rating,
            teacherRating: updateTeacher ? rating : student.teacherRating
        })
    }

    const handleTeacherRating = (rating) => {
        onChange(student.studentId, {
            teacherRating: rating,
            teacherEdited: true
        })
    }

    return (
        <div className="p-3 border border-line bg-main space-y-3 font-mono text-xs">
            {/* Header: Photo, Name, Process, Call Number, Attendance */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                    {student.photo_url ? (
                        <img
                            src={student.photo_url}
                            alt={student.name}
                            className="w-7 h-7 rounded-full object-cover border border-line"
                            onError={(e) => {
                                e.currentTarget.onerror = null
                                e.currentTarget.style.display = 'none'
                            }}
                        />
                    ) : (
                        <div className="w-7 h-7 rounded-full bg-content/10 border border-line flex items-center justify-center text-muted">
                            <User className="w-3.5 h-3.5" />
                        </div>
                    )}

                    <div>
                        <div className="flex items-center gap-1.5 font-bold text-content">
                            {student.groupNumber !== null && (
                                <span className="text-accent">#{student.groupNumber}</span>
                            )}
                            <span>{student.name}</span>
                        </div>
                        <span className="text-[10px] text-muted">
                            Proc. #{student.process_number || '—'}
                        </span>
                    </div>
                </div>

                {/* Attendance Toggle */}
                <button
                    type="button"
                    onClick={() => onChange(student.studentId, { isAttending: !student.isAttending })}
                    className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider border cursor-pointer ${student.isAttending
                        ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30'
                        : 'bg-red-500/10 text-red-500 border-red-500/30'
                        }`}
                >
                    {student.isAttending
                        ? t('lessons.evaluations.present', 'Presente')
                        : t('lessons.evaluations.absent', 'Ausente')}
                </button>
            </div>

            {/* Ratings & Notes (When Attending) */}
            {student.isAttending && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t border-line/60">
                    {/* Student Self Evaluation */}
                    <div className="space-y-1">
                        <span className="block text-[10px] uppercase font-bold text-muted">
                            {t('lessons.evaluations.studentRating', 'Autoavaliação (Aluno)')}
                        </span>
                        <RatingStars
                            value={student.studentRating}
                            onChange={handleStudentRating}
                        />
                    </div>

                    {/* Teacher Evaluation */}
                    <div className="space-y-1">
                        <div className="flex items-center justify-between">
                            <span className="block text-[10px] uppercase font-bold text-muted">
                                {t('lessons.evaluations.teacherRating', 'Avaliação do Professor')}
                            </span>
                            {!student.teacherEdited && student.studentRating && (
                                <span className="text-[9px] text-accent lowercase">
                                    ({t('lessons.evaluations.autoSynced', 'sincronizado')})
                                </span>
                            )}
                        </div>
                        <RatingStars
                            value={student.teacherRating}
                            onChange={handleTeacherRating}
                        />
                    </div>

                    {/* Individual Note */}
                    <div className="md:col-span-2 relative">
                        <MessageSquare className="w-3 h-3 absolute left-2.5 top-2.5 text-muted pointer-events-none" />
                        <input
                            type="text"
                            value={student.notes}
                            onChange={(e) => onChange(student.studentId, { notes: e.target.value })}
                            placeholder={t('lessons.evaluations.notesPlaceholder', 'Observações / Notas individuais...')}
                            className="w-full pl-8 pr-3 py-1 bg-main border border-line text-content text-[11px] focus:outline-none focus:border-accent"
                        />
                    </div>
                </div>
            )}
        </div>
    )
}