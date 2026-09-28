import { useCallback, useEffect, useState } from 'react'
import { lessonService } from '../services/lessonService'
import { useActiveAcademicYear } from './useActiveAcademicYear'
import { useNotification } from './useNotification'

export const useLessons = () => {
    const { activeYear } = useActiveAcademicYear()
    const { showError } = useNotification()
    const [lessons, setLessons] = useState([])
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)

    const activeYearId = activeYear?.id

    const loadLessons = useCallback(async () => {
        if (!activeYearId) {
            setLessons([])
            setLoading(false)
            return
        }

        try {
            const data = await lessonService.getByAcademicYear(activeYearId)
            setLessons(data || [])
        } catch (err) {
            showError(err.message || 'Failed to load lessons')
        } finally {
            setLoading(false)
        }
    }, [activeYearId, showError])

    useEffect(() => {
        let ignore = false

        const fetchInitial = async () => {
            if (!activeYearId) {
                setLessons([])
                setLoading(false)
                return
            }

            try {
                const data = await lessonService.getByAcademicYear(activeYearId)
                if (!ignore) {
                    setLessons(data || [])
                }
            } catch (err) {
                if (!ignore) {
                    showError(err.message || 'Failed to load lessons')
                }
            } finally {
                if (!ignore) {
                    setLoading(false)
                }
            }
        }

        fetchInitial()

        return () => {
            ignore = true
        }
    }, [activeYearId, showError])

    const createLesson = async (payload) => {
        if (!activeYearId) {
            showError('Cannot create lesson without an active academic year.')
            return false
        }
        try {
            setSubmitting(true)
            await lessonService.create({ ...payload, academicYearId: activeYearId })
            await loadLessons()
            return true
        } catch (err) {
            showError(err.message || 'Failed to create lesson')
            return false
        } finally {
            setSubmitting(false)
        }
    }

    const deleteLesson = async (id) => {
        try {
            setSubmitting(true)
            await lessonService.delete(id)
            await loadLessons()
            return true
        } catch (err) {
            showError(err.message || 'Failed to delete lesson')
            return false
        } finally {
            setSubmitting(false)
        }
    }

    return {
        lessons,
        loading,
        submitting,
        activeYear,
        createLesson,
        deleteLesson,
        refresh: loadLessons
    }
}