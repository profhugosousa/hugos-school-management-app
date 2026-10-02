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
            <div className="p-6 text-center text-xs text-gray-400 bg-gray-50 rounded-xl">
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
        <div className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
            <h4 className="text-sm font-semibold text-gray-800 mb-2">
                {t('students.radar.title')}
            </h4>
            <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                        <PolarGrid stroke="#e5e7eb" />
                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#4b5563', fontSize: 11 }} />
                        <PolarRadiusAxis angle={30} domain={[0, 5]} tick={{ fontSize: 10 }} />
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
                        <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                    </RadarChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}