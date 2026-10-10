import { useCallback, useEffect, useMemo, useState } from 'react'
import { evaluationService } from '../services/evaluationService'
import { levelService } from '../services/levelService'
import { useActiveAcademicYear } from './useActiveAcademicYear'

export const useEvaluationAnalytics = () => {
    const { activeYear } = useActiveAcademicYear()
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const [rawData, setRawData] = useState({ evaluations: [], lessons: [], groups: [], students: [] })
    const [levels, setLevels] = useState([])

    // Filters State
    const [selectedAcademicYear, setSelectedAcademicYear] = useState(activeYear?.id || '')
    const [prevActiveYearId, setPrevActiveYearId] = useState(activeYear?.id)

    const [selectedLevel, setSelectedLevel] = useState('')
    const [selectedGroup, setSelectedGroup] = useState('')
    const [selectedStudent, setSelectedStudent] = useState('')
    const [searchTerm, setSearchTerm] = useState('')

    // Date Filters State
    const [isRangeMode, setIsRangeMode] = useState(false)
    const [singleDate, setSingleDate] = useState('')
    const [dateStart, setDateStart] = useState('')
    const [dateEnd, setDateEnd] = useState('')

    // Adjust state during render when activeYear becomes available
    if (activeYear?.id && activeYear.id !== prevActiveYearId && !selectedAcademicYear) {
        setPrevActiveYearId(activeYear.id)
        setSelectedAcademicYear(activeYear.id)
    }

    const fetchData = useCallback(async () => {
        setLoading(true)
        try {
            const [analyticsRes, levelsRes] = await Promise.all([
                evaluationService.getAnalyticsData(),
                levelService.getAll().catch(() => [])
            ])

            setRawData(analyticsRes)
            setLevels(levelsRes)
            setError(null)
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        let isMounted = true

        const loadAnalytics = async () => {
            try {
                const [analyticsRes, levelsRes] = await Promise.all([
                    evaluationService.getAnalyticsData(),
                    levelService.getAll().catch(() => [])
                ])

                if (isMounted) {
                    setRawData(analyticsRes)
                    setLevels(levelsRes)
                    setError(null)
                }
            } catch (err) {
                if (isMounted) setError(err.message)
            } finally {
                if (isMounted) setLoading(false)
            }
        }

        loadAnalytics()

        return () => {
            isMounted = false
        }
    }, [])

    // Filtered data processing
    const filteredAnalytics = useMemo(() => {
        const lessonMap = new Map(rawData.lessons.map((l) => [l.id, l]))
        const groupMap = new Map(rawData.groups.map((g) => [g.id, g]))

        const filtered = rawData.evaluations.filter((ev) => {
            const lesson = lessonMap.get(ev.lesson_id)
            if (!lesson) return false

            const group = groupMap.get(lesson.group_id)

            // Academic year filter
            if (selectedAcademicYear && lesson.academic_year_id !== selectedAcademicYear) return false

            // Level filter
            if (selectedLevel && group?.level_id !== selectedLevel) return false

            // Group filter
            if (selectedGroup && lesson.group_id !== selectedGroup) return false

            // Student filter
            if (selectedStudent && ev.student_id !== selectedStudent) return false

            // Date filters
            const lessonDate = lesson.lesson_date
            if (!isRangeMode && singleDate && lessonDate !== singleDate) return false
            if (isRangeMode) {
                if (dateStart && lessonDate < dateStart) return false
                if (dateEnd && lessonDate > dateEnd) return false
            }

            // Search term
            if (searchTerm) {
                const query = searchTerm.toLowerCase()
                const matchName = ev.student_name?.toLowerCase().includes(query)
                const matchProc = ev.student_process_number?.toLowerCase().includes(query)
                const matchNotes = ev.notes?.toLowerCase().includes(query)
                if (!matchName && !matchProc && !matchNotes) return false
            }

            return true
        })

        return {
            evaluations: filtered,
            lessonMap,
            groupMap
        }
    }, [
        rawData,
        selectedAcademicYear,
        selectedLevel,
        selectedGroup,
        selectedStudent,
        singleDate,
        dateStart,
        dateEnd,
        isRangeMode,
        searchTerm
    ])

    // KPI Metrics & Aggregations
    const analyticsSummary = useMemo(() => {
        const evals = filteredAnalytics.evaluations
        if (!evals.length) {
            return {
                totalEvaluations: 0,
                attendanceRate: 0,
                avgStudentRating: 0,
                avgTeacherRating: 0,
                alignmentGap: 0,
                trendTimeline: [],
                studentBreakdown: [],
                groupBreakdown: [],
                levelBreakdown: []
            }
        }

        let attendingCount = 0
        let sSum = 0, sCount = 0
        let tSum = 0, tCount = 0

        const timelineMap = new Map()
        const studentMap = new Map()
        const groupMap = new Map()
        const levelMap = new Map()

        evals.forEach((ev) => {
            const lesson = filteredAnalytics.lessonMap.get(ev.lesson_id)
            const group = filteredAnalytics.groupMap.get(lesson?.group_id)
            const dateKey = lesson?.lesson_date || 'N/A'

            if (ev.is_attending) attendingCount++

            const sVal = ev.student_rating
            const tVal = ev.teacher_rating

            if (sVal) { sSum += sVal; sCount++ }
            if (tVal) { tSum += tVal; tCount++ }

            if (dateKey !== 'N/A') {
                if (!timelineMap.has(dateKey)) {
                    timelineMap.set(dateKey, { sSum: 0, sCnt: 0, tSum: 0, tCnt: 0, count: 0 })
                }
                const pt = timelineMap.get(dateKey)
                pt.count++
                if (sVal) { pt.sSum += sVal; pt.sCnt++ }
                if (tVal) { pt.tSum += tVal; pt.tCnt++ }
            }

            if (ev.student_id) {
                if (!studentMap.has(ev.student_id)) {
                    studentMap.set(ev.student_id, {
                        id: ev.student_id,
                        name: ev.student_name || 'N/A',
                        processNumber: ev.student_process_number || '—',
                        groupName: group?.display_name || group?.name || '—',
                        sSum: 0, sCnt: 0, tSum: 0, tCnt: 0, attendCount: 0, total: 0
                    })
                }
                const st = studentMap.get(ev.student_id)
                st.total++
                if (ev.is_attending) st.attendCount++
                if (sVal) { st.sSum += sVal; st.sCnt++ }
                if (tVal) { st.tSum += tVal; st.tCnt++ }
            }

            if (group?.id) {
                if (!groupMap.has(group.id)) {
                    groupMap.set(group.id, {
                        id: group.id,
                        name: group.display_name || group.name,
                        levelName: group.level_name || '—',
                        sSum: 0, sCnt: 0, tSum: 0, tCnt: 0, total: 0
                    })
                }
                const grp = groupMap.get(group.id)
                grp.total++
                if (sVal) { grp.sSum += sVal; grp.sCnt++ }
                if (tVal) { grp.tSum += tVal; grp.tCnt++ }
            }

            if (group?.level_id) {
                if (!levelMap.has(group.level_id)) {
                    levelMap.set(group.level_id, {
                        id: group.level_id,
                        name: group.level_name || 'Level',
                        sSum: 0, sCnt: 0, tSum: 0, tCnt: 0, total: 0
                    })
                }
                const lvl = levelMap.get(group.level_id)
                lvl.total++
                if (sVal) { lvl.sSum += sVal; lvl.sCnt++ }
                if (tVal) { lvl.tSum += tVal; lvl.tCnt++ }
            }
        })

        const totalEvaluations = evals.length
        const attendanceRate = totalEvaluations ? ((attendingCount / totalEvaluations) * 100).toFixed(1) : 0
        const avgStudentRating = sCount ? (sSum / sCount).toFixed(2) : 0
        const avgTeacherRating = tCount ? (tSum / tCount).toFixed(2) : 0
        const alignmentGap = (parseFloat(avgTeacherRating) - parseFloat(avgStudentRating)).toFixed(2)

        const trendTimeline = Array.from(timelineMap.entries())
            .map(([date, pt]) => ({
                date,
                studentAvg: pt.sCnt ? parseFloat((pt.sSum / pt.sCnt).toFixed(2)) : null,
                teacherAvg: pt.tCnt ? parseFloat((pt.tSum / pt.tCnt).toFixed(2)) : null,
                count: pt.count
            }))
            .sort((a, b) => a.date.localeCompare(b.date))

        const studentBreakdown = Array.from(studentMap.values()).map((s) => {
            const sAvg = s.sCnt ? (s.sSum / s.sCnt).toFixed(2) : '—'
            const tAvg = s.tCnt ? (s.tSum / s.tCnt).toFixed(2) : '—'
            const delta = (sAvg !== '—' && tAvg !== '—') ? (parseFloat(tAvg) - parseFloat(sAvg)).toFixed(2) : '—'
            return {
                ...s,
                studentAvg: sAvg,
                teacherAvg: tAvg,
                delta,
                attendanceRate: s.total ? ((s.attendCount / s.total) * 100).toFixed(0) : 0
            }
        }).sort((a, b) => a.name.localeCompare(b.name))

        const groupBreakdown = Array.from(groupMap.values()).map((g) => ({
            ...g,
            studentAvg: g.sCnt ? (g.sSum / g.sCnt).toFixed(2) : '—',
            teacherAvg: g.tCnt ? (g.tSum / g.tCnt).toFixed(2) : '—',
            delta: (g.sCnt && g.tCnt) ? ((g.tSum / g.tCnt) - (g.sSum / g.sCnt)).toFixed(2) : '—'
        }))

        const levelBreakdown = Array.from(levelMap.values()).map((l) => ({
            ...l,
            studentAvg: l.sCnt ? (l.sSum / l.sCnt).toFixed(2) : '—',
            teacherAvg: l.tCnt ? (l.tSum / l.tCnt).toFixed(2) : '—',
            delta: (l.sCnt && l.tCnt) ? ((l.tSum / l.tCnt) - (l.sSum / l.sCnt)).toFixed(2) : '—'
        }))

        return {
            totalEvaluations,
            attendanceRate,
            avgStudentRating,
            avgTeacherRating,
            alignmentGap,
            trendTimeline,
            studentBreakdown,
            groupBreakdown,
            levelBreakdown
        }
    }, [filteredAnalytics])

    return {
        loading,
        error,
        levels,
        groups: rawData.groups,
        students: rawData.students,
        selectedAcademicYear,
        setSelectedAcademicYear,
        selectedLevel,
        setSelectedLevel,
        selectedGroup,
        setSelectedGroup,
        selectedStudent,
        setSelectedStudent,
        searchTerm,
        setSearchTerm,
        isRangeMode,
        setIsRangeMode,
        singleDate,
        setSingleDate,
        dateStart,
        setDateStart,
        dateEnd,
        setDateEnd,
        analyticsSummary,
        refresh: fetchData
    }
}