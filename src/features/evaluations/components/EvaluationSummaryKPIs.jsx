import { Award, Scale, UserCheck } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export function EvaluationSummaryKPIs({ summary }) {
    const { t } = useTranslation()

    const deltaVal = parseFloat(summary.alignmentGap || 0)
    const deltaColor =
        deltaVal > 0
            ? 'text-emerald-500 bg-emerald-500/10 border-emerald-500/30'
            : deltaVal < 0
                ? 'text-amber-500 bg-amber-500/10 border-amber-500/30'
                : 'text-content bg-content/10 border-line'

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs">
            {/* KPI 1: Student Rating Avg */}
            <div className="p-4 border border-line bg-main space-y-1.5">
                <div className="flex items-center justify-between text-muted">
                    <span className="uppercase font-bold text-[10px]">{t('evaluations.kpi.studentAvg', 'Média Autoavaliação')}</span>
                    <Award className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-2xl font-bold text-content flex items-baseline gap-2">
                    <span>{summary.avgStudentRating || '0.00'}</span>
                    <span className="text-xs text-muted font-normal">/ 5.0</span>
                </div>
                <p className="text-[10px] text-muted">{t('evaluations.kpi.studentAvgDesc', 'Perceção do aluno')}</p>
            </div>

            {/* KPI 2: Teacher Rating Avg */}
            <div className="p-4 border border-line bg-main space-y-1.5">
                <div className="flex items-center justify-between text-muted">
                    <span className="uppercase font-bold text-[10px]">{t('evaluations.kpi.teacherAvg', 'Média Professor')}</span>
                    <Award className="w-4 h-4 text-accent" />
                </div>
                <div className="text-2xl font-bold text-content flex items-baseline gap-2">
                    <span>{summary.avgTeacherRating || '0.00'}</span>
                    <span className="text-xs text-muted font-normal">/ 5.0</span>
                </div>
                <p className="text-[10px] text-muted">{t('evaluations.kpi.teacherAvgDesc', 'Avaliação pedagógica')}</p>
            </div>

            {/* KPI 3: Alignment Gap Delta */}
            <div className="p-4 border border-line bg-main space-y-1.5">
                <div className="flex items-center justify-between text-muted">
                    <span className="uppercase font-bold text-[10px]">{t('evaluations.kpi.alignmentGap', 'Índice de Alinhamento')}</span>
                    <Scale className="w-4 h-4 text-accent" />
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-content">
                        {deltaVal > 0 ? `+${deltaVal}` : deltaVal}
                    </span>
                    <span className={`px-2 py-0.5 text-[10px] font-bold border uppercase ${deltaColor}`}>
                        {deltaVal > 0 ? 'Professor +' : deltaVal < 0 ? 'Aluno +' : 'Alinhado'}
                    </span>
                </div>
                <p className="text-[10px] text-muted">{t('evaluations.kpi.alignmentDesc', 'Diferença (Docente - Aluno)')}</p>
            </div>

            {/* KPI 4: Attendance Rate */}
            <div className="p-4 border border-line bg-main space-y-1.5">
                <div className="flex items-center justify-between text-muted">
                    <span className="uppercase font-bold text-[10px]">{t('evaluations.kpi.attendance', 'Taxa de Presenças')}</span>
                    <UserCheck className="w-4 h-4 text-emerald-500" />
                </div>
                <div className="text-2xl font-bold text-content flex items-baseline gap-2">
                    <span>{summary.attendanceRate}%</span>
                    <span className="text-xs text-muted font-normal">({summary.totalEvaluations} registos)</span>
                </div>
                <p className="text-[10px] text-muted">{t('evaluations.kpi.attendanceDesc', 'Presenças vs. Ausências')}</p>
            </div>
        </div>
    )
}