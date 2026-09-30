import { useCallback, useEffect, useState } from 'react'
import { groupService } from '../services/groupService'
import { lessonService } from '../services/lessonService'
import { useActiveAcademicYear } from './useActiveAcademicYear'

export const useLessons = () => {
    const { activeYear } = useActiveAcademicYear()
    const [lessons, setLessons] = useState([])
    const [groups, setGroups] = useState([])
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState(null)

    const fetchData = useCallback(async () => {
        try {
            const [fetchedGroups, fetchedLessons] = await Promise.all([
                groupService.getAll(),
                activeYear ? lessonService.getByAcademicYear(activeYear.id) : lessonService.getAll()
            ])
            setGroups(fetchedGroups)
            setLessons(fetchedLessons)
            setError(null)
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }, [activeYear])

    useEffect(() => {
        let isMounted = true

        const loadInitialData = async () => {
            try {
                const [fetchedGroups, fetchedLessons] = await Promise.all([
                    groupService.getAll(),
                    activeYear ? lessonService.getByAcademicYear(activeYear.id) : lessonService.getAll()
                ])
                if (isMounted) {
                    setGroups(fetchedGroups)
                    setLessons(fetchedLessons)
                    setError(null)
                }
            } catch (err) {
                if (isMounted) {
                    setError(err.message)
                }
            } finally {
                if (isMounted) {
                    setLoading(false)
                }
            }
        }

        loadInitialData()

        return () => {
            isMounted = false
        }
    }, [activeYear])

    const createLesson = async (formData) => {
        setSubmitting(true)
        try {
            await lessonService.create({
                ...formData,
                academicYearId: activeYear?.id
            })
            await fetchData()
            return true
        } catch (err) {
            setError(err.message)
            return false
        } finally {
            setSubmitting(false)
        }
    }

    const updateLesson = async (id, formData) => {
        setSubmitting(true)
        try {
            await lessonService.update(id, formData)
            await fetchData()
            return true
        } catch (err) {
            setError(err.message)
            return false
        } finally {
            setSubmitting(false)
        }
    }

    const exportLessonToGroups = async (lesson, targetGroupIds) => {
        setSubmitting(true)
        try {
            await Promise.all(
                targetGroupIds.map((groupId) =>
                    lessonService.create({
                        academicYearId: activeYear?.id || lesson.academic_year_id,
                        groupId,
                        subject: lesson.subject,
                        duration: lesson.duration || '45',
                        lessonDate: lesson.lesson_date || lesson.lessonDate,
                        lessonTime: lesson.lesson_time || lesson.lessonTime,
                        summary: lesson.summary,
                        attentionBox: lesson.attention_box || lesson.attentionBox,
                        teacherNotes: lesson.teacher_notes || lesson.teacherNotes,
                        stepByStep: lesson.step_by_step || lesson.stepByStep,
                        materials: lesson.materials
                    })
                )
            )
            await fetchData()
            return true
        } catch (err) {
            setError(err.message)
            return false
        } finally {
            setSubmitting(false)
        }
    }

    const deleteLesson = async (id) => {
        setSubmitting(true)
        try {
            await lessonService.delete(id)
            await fetchData()
            return true
        } catch (err) {
            setError(err.message)
            return false
        } finally {
            setSubmitting(false)
        }
    }

    return {
        lessons,
        groups,
        loading,
        submitting,
        error,
        activeYear,
        createLesson,
        updateLesson,
        deleteLesson,
        exportLessonToGroups,
        refresh: fetchData
    }
}