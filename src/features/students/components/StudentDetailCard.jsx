import { User, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { StudentBadges } from './badges'
import { StudentProgressChart } from './progressEvaluationChart'
import { StudentQuickActions } from './quickAction'
import { StudentIncidentLog } from './StudentIncidentLog'

export default function StudentDetailCard({ student, onClose }) {
    const { t } = useTranslation()

    if (!student) return null

    const callNumber = student.groupNumber ?? student.number ?? student.group_number ?? null
    const groupDisplay = student.displayName || student.display_name || student.group_name || student.groupId

    return (
        <div className="space-y-4 bg-main p-4 border border-line font-mono text-xs">
            {/* Header: Photo Avatar, Name, Process #, Call # & Group */}
            <div className="flex items-start gap-3 pb-3 border-b border-line">
                {student.photo_url ? (
                    <img
                        src={student.photo_url}
                        alt={student.name}
                        className="w-12 h-12 rounded-full object-cover border border-line shrink-0"
                        onError={(e) => {
                            e.currentTarget.onerror = null
                            e.currentTarget.style.display = 'none'
                        }}
                    />
                ) : (
                    <div className="w-12 h-12 rounded-full bg-content/10 border border-line flex items-center justify-center text-muted shrink-0">
                        <User className="w-6 h-6" />
                    </div>
                )}

                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                        <h3 className="text-sm font-bold uppercase text-content truncate">
                            {student.name}
                        </h3>
                        {onClose && (
                            <button
                                onClick={onClose}
                                className="p-1 text-muted hover:text-content transition-colors cursor-pointer"
                                title={t('common.modals.close', 'Fechar')}
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </div>

                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted mt-1 font-mono">
                        <span className="font-bold text-accent">
                            {t('students.bulkImport.processNumber', 'Proc. #')}{' '}{student.process_number || '—'}
                        </span>
                        {callNumber !== null && (
                            <>
                                <span>•</span>
                                <span className="font-bold text-accent">
                                    {t('students.bulkImport.number', 'No.')}{' '}{callNumber}
                                </span>
                            </>
                        )}
                    </div>

                    {groupDisplay && (
                        <div className="mt-1.5">
                            <span className="inline-block px-2 py-0.5 bg-content/5 border border-line text-content text-[10px] uppercase font-semibold">
                                {groupDisplay}
                            </span>
                        </div>
                    )}
                </div>
            </div>

            <StudentQuickActions student={student} />
            <StudentBadges extraInfo={student.extra_info} />
            <StudentProgressChart evaluations={student.evaluations || []} />
            <StudentIncidentLog incidents={student.incidents || []} />
        </div>
    )
}