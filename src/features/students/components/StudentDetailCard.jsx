import { UserCheck, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { StudentBadges } from './Badges'
import { StudentProgressChart } from './ProgressEvaluationChart'
import { StudentQuickActions } from './QuickAction'
import { StudentIncidentLog } from './StudentIncidentLog'

export default function StudentDetailCard({ student, onClose }) {
    const { t } = useTranslation()

    if (!student) return null

    return (
        <div className="bg-main p-4 border border-line font-mono text-xs space-y-4 w-full min-w-0">
            {/* Header Control Bar */}
            <div className="flex items-center justify-between pb-2 border-b border-line text-muted min-w-0">
                <div className="flex items-center gap-2 min-w-0">
                    <UserCheck className="w-4 h-4 text-accent shrink-0" />
                    <span className="font-bold uppercase tracking-wider text-content text-[11px] truncate">
                        {t('students.detail.title', 'Ficha Detalhada do Aluno')}
                    </span>
                </div>
                {onClose && (
                    <button
                        onClick={onClose}
                        className="p-1 text-muted hover:text-content hover:bg-content/10 transition-colors cursor-pointer shrink-0"
                        title={t('common.modals.close', 'Fechar')}
                    >
                        <X className="w-4 h-4" />
                    </button>
                )}
            </div>

            {/* Clean Stacked Section Flow */}
            <div className="space-y-4 w-full min-w-0">
                <StudentQuickActions student={student} />
                <StudentBadges extraInfo={student.extra_info} />
                <StudentProgressChart evaluations={student.evaluations || []} />
                <StudentIncidentLog incidents={student.incidents || []} />
            </div>
        </div>
    )
}