import { Award, CheckCircle, Loader2, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '../../../components/ui/Button'
import useEscapeKey from '../../../hooks/useEscapeKey'
import { evaluationService } from '../../../services/evaluationService'
import { EvaluationDescriptorsFooter } from './evaluations/EvaluationDescriptorsFooter'
import { StudentEvaluationRow } from './evaluations/StudentEvaluationRow'

export function LessonEvaluationModal({ isOpen, lesson, onClose, onSaved }) {
    const { t } = useTranslation()
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [studentsData, setStudentsData] = useState([])
    const [error, setError] = useState(null)

    useEscapeKey(onClose, isOpen)

    useEffect(() => {
        if (!isOpen || !lesson) return

        let isMounted = true
        const loadEvaluations = async () => {
            setLoading(true)
            setError(null)
            try {
                const [enrolledStudents, existingEvals] = await Promise.all([
                    evaluationService.getEnrolledStudents(lesson.group_id, lesson.academic_year_id),
                    evaluationService.getByLesson(lesson.id)
                ])

                const evalMap = new Map(existingEvals.map((e) => [e.studentId, e]))

                const merged = enrolledStudents.map((student) => {
                    const ev = evalMap.get(student.id)
                    return {
                        studentId: student.id,
                        name: student.name,
                        process_number: student.process_number,
                        groupNumber: student.groupNumber,
                        photo_url: student.photo_url,
                        isAttending: ev ? ev.isAttending : true,
                        studentRating: ev?.studentRating ?? null,
                        teacherRating: ev?.teacherRating ?? null,
                        notes: ev?.notes || '',
                        teacherEdited: Boolean(ev?.teacherRating)
                    }
                })

                if (isMounted) setStudentsData(merged)
            } catch (err) {
                if (isMounted) setError(err.message)
            } finally {
                if (isMounted) setLoading(false)
            }
        }

        loadEvaluations()

        return () => {
            isMounted = false
        }
    }, [isOpen, lesson])

    if (!isOpen || !lesson) return null

    const handleStudentChange = (studentId, changes) => {
        setStudentsData((prev) =>
            prev.map((s) => (s.studentId === studentId ? { ...s, ...changes } : s))
        )
    }

    const handleSubmit = async () => {
        setSubmitting(true)
        try {
            await evaluationService.saveBatch(lesson.id, studentsData)
            if (onSaved) await onSaved()
            onClose()
        } catch (err) {
            setError(err.message)
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 font-mono text-xs">
            <div className="bg-main border border-line shadow-2xl w-full max-w-5xl overflow-hidden flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-line bg-content/5">
                    <div>
                        <h3 className="text-sm font-bold uppercase tracking-wider text-content flex items-center gap-2">
                            <Award className="w-4 h-4 text-accent" />
                            <span>{t('lessons.evaluations.title', 'Autoavaliação e Avaliação da Aula')}</span>
                        </h3>
                        <p className="text-[11px] text-muted mt-0.5">
                            {t('lessons.evaluations.subtitle', 'Aula Nº')} <span className="font-bold text-accent">#{lesson.lesson_number}</span> — {lesson.subject} ({lesson.lesson_date})
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1 text-muted hover:text-content transition-colors cursor-pointer"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Body List */}
                <div className="p-4 space-y-3 overflow-y-auto flex-1 bg-main">
                    {error && (
                        <div className="p-3 border border-red-500/30 bg-red-500/10 text-red-500 font-bold">
                            {error}
                        </div>
                    )}

                    {loading ? (
                        <div className="p-12 flex flex-col items-center justify-center gap-3 text-muted">
                            <Loader2 className="w-6 h-6 animate-spin text-accent" />
                            <span>{t('lessons.evaluations.loading', 'A carregar lista de alunos...')}</span>
                        </div>
                    ) : studentsData.length === 0 ? (
                        <div className="p-12 text-center text-muted">
                            {t('lessons.evaluations.empty', 'Nenhum aluno inscrito nesta turma.')}
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {studentsData.map((student) => (
                                <StudentEvaluationRow
                                    key={student.studentId}
                                    student={student}
                                    onChange={handleStudentChange}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Qualitative Rubric Footer */}
                <EvaluationDescriptorsFooter />

                {/* Action Footer */}
                <div className="flex justify-end gap-3 p-4 border-t border-line bg-content/5">
                    <Button variant="outline" onClick={onClose} disabled={submitting}>
                        {t('common.modals.cancel', 'Cancelar')}
                    </Button>
                    <Button variant="primary" onClick={handleSubmit} disabled={loading || submitting} loading={submitting}>
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>{t('lessons.evaluations.save', 'Guardar Avaliações')}</span>
                    </Button>
                </div>
            </div>
        </div>
    )
}