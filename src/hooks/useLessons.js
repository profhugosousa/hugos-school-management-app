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

    const exportLesson = async (sourceLesson, config) => {
        setSubmitting(true)
        try {
            const { mode, selectedFields, targetGroupIds, targetLessonIds } = config

            if (mode === 'new') {
                // Clone selected fields into new lesson(s) in chosen group(s)
                await Promise.all(
                    targetGroupIds.map((groupId) => {
                        return lessonService.create({
                            academicYearId: activeYear?.id || sourceLesson.academic_year_id || sourceLesson.academicYearId,
                            groupId,
                            duration: sourceLesson.duration || '45',
                            lessonDate: sourceLesson.lesson_date || sourceLesson.lessonDate,
                            lessonTime: sourceLesson.lesson_time || sourceLesson.lessonTime,
                            subject: selectedFields.subject ? sourceLesson.subject : '',
                            summary: selectedFields.summary ? (sourceLesson.summary || '') : '',
                            attentionBox: selectedFields.attentionBox ? (sourceLesson.attention_box || sourceLesson.attentionBox || '') : '',
                            teacherNotes: selectedFields.teacherNotes ? (sourceLesson.teacher_notes || sourceLesson.teacherNotes || '') : '',
                            stepByStep: selectedFields.stepByStep ? (sourceLesson.step_by_step || sourceLesson.stepByStep || []) : [],
                            materials: selectedFields.materials ? (sourceLesson.materials || []) : []
                        })
                    })
                )
            } else if (mode === 'existing') {
                // Overwrite/Merge selected fields into existing lesson(s)
                await Promise.all(
                    targetLessonIds.map(async (targetId) => {
                        const existing = lessons.find((l) => l.id === targetId) || (await lessonService.getById(targetId))

                        const payload = {
                            groupId: existing.group_id || existing.groupId,
                            duration: existing.duration || '45',
                            lessonDate: existing.lesson_date || existing.lessonDate,
                            lessonTime: existing.lesson_time || existing.lessonTime,
                            subject: selectedFields.subject ? sourceLesson.subject : existing.subject,
                            summary: selectedFields.summary ? sourceLesson.summary : existing.summary,
                            attentionBox: selectedFields.attentionBox
                                ? (sourceLesson.attention_box || sourceLesson.attentionBox)
                                : (existing.attention_box || existing.attentionBox),
                            teacherNotes: selectedFields.teacherNotes
                                ? (sourceLesson.teacher_notes || sourceLesson.teacherNotes)
                                : (existing.teacher_notes || existing.teacherNotes),
                            stepByStep: selectedFields.stepByStep
                                ? (sourceLesson.step_by_step || sourceLesson.stepByStep)
                                : (existing.step_by_step || existing.stepByStep),
                            materials: selectedFields.materials
                                ? sourceLesson.materials
                                : existing.materials
                        }

                        return lessonService.update(targetId, payload)
                    })
                )
            }

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
        exportLesson,
        refresh: fetchData
    }
}