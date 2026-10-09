import { Loader2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import StudentTableRow from './StudentTableRow'

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
        <div className="border border-line bg-main overflow-x-auto">
            <table className="w-full text-left border-collapse font-mono text-xs">
                <thead>
                    <tr className="border-b border-line bg-content/5 uppercase tracking-wider text-muted select-none">
                        <th className="p-3.5 w-10">{t('students.table.photo', 'Foto')}</th>
                        <th className="p-3.5">{t('students.table.number', 'Nº')}</th>
                        <th className="p-3.5">{t('students.table.process', 'Proc.')}</th>
                        <th className="p-3.5">{t('students.table.name', 'Nome')}</th>
                        <th className="p-3.5">{t('students.table.group', 'Turma')}</th>
                        <th className="p-3.5 text-right">{t('students.table.actions', 'Ações')}</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-line">
                    {students.map((student) => (
                        <StudentTableRow
                            key={student.id}
                            student={student}
                            isSelected={selectedStudentId === student.id}
                            onSelect={onSelect}
                            onEdit={onEdit}
                            onDelete={onDelete}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    )
}