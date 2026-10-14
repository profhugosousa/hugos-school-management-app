import { AlertTriangle, Edit2, Loader2, Trash2, User } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import StudentDetailCard from './StudentDetailCard'

export default function StudentTable({
    students = [],
    loading = false,
    onEdit,
    onDelete,
    onSelect,
    selectedStudentId
}) {
    const { t } = useTranslation()

    if (loading) {
        return (
            <div className="p-12 border border-line bg-main flex flex-col items-center justify-center gap-3 text-muted font-mono text-xs">
                <Loader2 className="w-6 h-6 animate-spin text-accent" />
                <span>{t('common.loading', 'Loading students...')}</span>
            </div>
        )
    }

    if (students.length === 0) {
        return (
            <div className="p-12 border border-line bg-main text-center text-muted font-mono text-xs">
                {t('students.table.empty', 'Nenhum aluno encontrado.')}
            </div>
        )
    }

    return (
        <div className="space-y-3 font-mono text-xs w-full max-w-full min-w-0">
            {students.map((student) => {
                const isSelected = selectedStudentId === student.id
                const callNumber = student.groupNumber ?? student.number ?? student.group_number ?? null
                const extraInfo = student.extra_info || {}
                const hasSen = extraInfo.sen || extraInfo.nee

                return (
                    <div key={student.id} className="w-full max-w-full min-w-0">
                        {/* Student Row Card */}
                        <div
                            onClick={() => onSelect(isSelected ? null : student)}
                            className={`p-3 sm:p-3.5 border bg-main transition-all cursor-pointer w-full max-w-full min-w-0 ${isSelected
                                ? 'border-accent bg-content/5 ring-1 ring-accent'
                                : 'border-line hover:border-accent/60'
                                }`}
                        >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 min-w-0">
                                {/* Primary Student Metadata */}
                                <div className="flex items-center gap-3 min-w-0 flex-1">
                                    {student.photo_url ? (
                                        <img
                                            src={student.photo_url}
                                            alt={student.name}
                                            className="w-9 h-9 rounded-full object-cover border border-line shrink-0"
                                            onError={(e) => {
                                                e.currentTarget.onerror = null
                                                e.currentTarget.style.display = 'none'
                                            }}
                                        />
                                    ) : (
                                        <div className="w-9 h-9 rounded-full bg-content/10 border border-line flex items-center justify-center text-muted shrink-0">
                                            <User className="w-5 h-5" />
                                        </div>
                                    )}

                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <h4 className="font-bold uppercase text-content truncate text-sm">
                                                {student.name}
                                            </h4>
                                            {hasSen && (
                                                <span
                                                    className="p-0.5 text-amber-500 bg-amber-500/10 border border-amber-500/20 shrink-0"
                                                    title={t('students.badges.senRequired', 'SEN / NEE')}
                                                >
                                                    <AlertTriangle className="w-3.5 h-3.5" />
                                                </span>
                                            )}
                                        </div>

                                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted mt-1 font-mono">
                                            <span>
                                                {t('students.table.process', 'Proc.')}:{' '}
                                                <strong className="text-accent font-bold">
                                                    #{student.process_number || '—'}
                                                </strong>
                                            </span>
                                            <span>
                                                {t('students.table.number', 'Nº')}:{' '}
                                                <strong className="text-accent font-bold">
                                                    {callNumber !== null ? `#${callNumber}` : '—'}
                                                </strong>
                                            </span>
                                            <span className="truncate">
                                                {t('students.table.group', 'Turma')}:{' '}
                                                <strong className="text-content font-bold">
                                                    {student.display_name || student.group_name || student.groupId || '—'}
                                                </strong>
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Row Actions */}
                                <div
                                    className="flex items-center justify-end gap-1 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-line"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <button
                                        onClick={() => onEdit(student)}
                                        className="p-1.5 text-muted hover:text-content hover:bg-content/10 transition-colors cursor-pointer"
                                        title={t('students.actions.edit', 'Editar Aluno')}
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => onDelete(student)}
                                        className="p-1.5 text-muted hover:text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer"
                                        title={t('students.actions.delete', 'Eliminar Aluno')}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Mobile Detail Expansion (Full Width, No Left Indentation) */}
                        {isSelected && (
                            <div className="lg:hidden mt-2 w-full max-w-full min-w-0 overflow-hidden">
                                <StudentDetailCard
                                    student={student}
                                    onClose={() => onSelect(null)}
                                />
                            </div>
                        )}
                    </div>
                )
            })}
        </div>
    )
}