import { useCallback, useEffect, useState } from 'react'
import { academicYearService } from '../services/academicYearService'

export const useAcademicYears = () => {
    const [years, setYears] = useState([])
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState(null)

    const loadYears = useCallback(async () => {
        try {
            const data = await academicYearService.getAll()
            setYears(data.sort((a, b) => (b.startDate || '').localeCompare(a.startDate || '')))
            setError(null)
        } catch (err) {
            setError(err.message || 'Failed to load academic years')
        } finally {
            setLoading(false)
        }
    }, [])

    const refresh = useCallback(async () => {
        setLoading(true)
        await loadYears()
    }, [loadYears])

    useEffect(() => {
        let ignore = false

        const fetchInitialData = async () => {
            try {
                const data = await academicYearService.getAll()
                if (!ignore) {
                    setYears(data.sort((a, b) => (b.startDate || '').localeCompare(a.startDate || '')))
                    setError(null)
                }
            } catch (err) {
                if (!ignore) {
                    setError(err.message || 'Failed to load academic years')
                }
            } finally {
                if (!ignore) {
                    setLoading(false)
                }
            }
        }

        fetchInitialData()

        return () => {
            ignore = true
        }
    }, [])

    const createYear = async (payload) => {
        try {
            setSubmitting(true)
            setError(null)
            await academicYearService.create(payload)
            await loadYears()
            return true
        } catch (err) {
            setError(err.message || 'Failed to create academic year')
            return false
        } finally {
            setSubmitting(false)
        }
    }

    const updateYear = async (id, payload) => {
        try {
            setSubmitting(true)
            setError(null)
            await academicYearService.update(id, payload)
            await loadYears()
            return true
        } catch (err) {
            setError(err.message || 'Failed to update academic year')
            return false
        } finally {
            setSubmitting(false)
        }
    }

    const deleteYear = async (id) => {
        try {
            setSubmitting(true)
            setError(null)
            await academicYearService.delete(id)
            await loadYears()
            return true
        } catch (err) {
            setError(err.message || 'Failed to delete academic year')
            return false
        } finally {
            setSubmitting(false)
        }
    }

    const toggleActiveStatus = async (year) => {
        return updateYear(year.id, { isActive: !year.isActive })
    }

    return {
        years,
        loading,
        submitting,
        error,
        refresh,
        createYear,
        updateYear,
        deleteYear,
        toggleActiveStatus
    }
}