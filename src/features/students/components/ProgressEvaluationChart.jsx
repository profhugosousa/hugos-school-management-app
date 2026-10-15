import { useTranslation } from 'react-i18next'
import {
    Legend,
    PolarAngleAxis,
    PolarGrid,
    PolarRadiusAxis,
    Radar,
    RadarChart,
    ResponsiveContainer,
    Tooltip
} from 'recharts'

export const StudentProgressChart = ({ evaluations = [] }) => {
    const { t } = useTranslation()
    const validEvaluations = evaluations.filter((e) => e.is_attending)

    if (validEvaluations.length === 0) {
        return (
            <div className="p-4 sm:p-6 text-center text-xs text-muted bg-main border border-line font-mono">
                {t('students.radar.noData')}
            </div>
        )
    }

    const total = validEvaluations.length
    const avgStudent = (
        validEvaluations.reduce((sum, e) => sum + (e.student_rating || 0), 0) / total
    ).toFixed(1)
    const avgTeacher = (
        validEvaluations.reduce((sum, e) => sum + (e.teacher_rating || 0), 0) / total
    ).toFixed(1)

    const totalLessons = evaluations.length
    const attendanceRate = totalLessons > 0 ? ((total / totalLessons) * 5).toFixed(1) : 5

    const chartData = [
        { subject: t('students.radar.selfRating'), Student: parseFloat(avgStudent), Teacher: parseFloat(avgTeacher) },
        { subject: t('students.radar.teacherRating'), Student: parseFloat(avgStudent), Teacher: parseFloat(avgTeacher) },
        { subject: t('students.radar.attendance'), Student: parseFloat(attendanceRate), Teacher: parseFloat(attendanceRate) }
    ]

    return (
        <div className="p-3 sm:p-4 bg-main border border-line font-mono text-xs w-full max-w-full min-w-0 overflow-hidden">
            <h4 className="font-bold text-content uppercase tracking-wider mb-2">
                {t('students.radar.title')}
            </h4>
            <div className="h-52 sm:h-64 w-full max-w-full min-w-0 overflow-hidden">
                <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="55%" data={chartData}>
                        <PolarGrid stroke="rgb(var(--rgb-border-line))" />
                        <PolarAngleAxis dataKey="subject" tick={{ fill: 'rgb(var(--rgb-text-muted))', fontSize: 8 }} />
                        <PolarRadiusAxis angle={30} domain={[0, 5]} tick={{ fontSize: 8 }} />
                        <Radar
                            name={t('students.radar.studentLegend')}
                            dataKey="Student"
                            stroke="#3b82f6"
                            fill="#3b82f6"
                            fillOpacity={0.3}
                        />
                        <Radar
                            name={t('students.radar.teacherLegend')}
                            dataKey="Teacher"
                            stroke="#10b981"
                            fill="#10b981"
                            fillOpacity={0.3}
                        />
                        <Tooltip />
                        <Legend wrapperStyle={{ fontSize: '9px', paddingTop: '4px' }} />
                    </RadarChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}