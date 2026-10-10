import { useCallback, useEffect, useState } from 'react'
import { groupService } from '../services/groupService'
import { levelService } from '../services/levelService'
import { planningService } from '../services/planningService'
import { useActiveAcademicYear } from './useActiveAcademicYear'

export const usePlanningUnits = () => {
    const { activeYear } = useActiveAcademicYear()
    const [units, setUnits] = useState([])
    const [levels, setLevels] = useState([])
    const [groups, setGroups] = useState([])
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState(null)

    const fetchData = useCallback(async () => {
        setLoading(true)
        try {
            const [fetchedUnits, fetchedLevels, fetchedGroups] = await Promise.all([
                planningService.getByAcademicYear(activeYear?.id),
                levelService.getAll().catch(() => []),
                groupService.getAll().catch(() => [])
            ])
            setUnits(fetchedUnits)
            setLevels(fetchedLevels)
            setGroups(fetchedGroups)
            setError(null)
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }, [activeYear])

    useEffect(() => {
        let isMounted = true

        const loadUnits = async () => {
            try {
                const [fetchedUnits, fetchedLevels, fetchedGroups] = await Promise.all([
                    planningService.getByAcademicYear(activeYear?.id),
                    levelService.getAll().catch(() => []),
                    groupService.getAll().catch(() => [])
                ])

                if (isMounted) {
                    setUnits(fetchedUnits)
                    setLevels(fetchedLevels)
                    setGroups(fetchedGroups)
                    setError(null)
                }
            } catch (err) {
                if (isMounted) setError(err.message)
            } finally {
                if (isMounted) setLoading(false)
            }
        }

        loadUnits()

        return () => {
            isMounted = false
        }
    }, [activeYear])

    const createUnit = async (data) => {
        setSubmitting(true)
        try {
            await planningService.create({ ...data, academicYearId: activeYear?.id })
            await fetchData()
            return true
        } catch (err) {
            setError(err.message)
            return false
        } finally {
            setSubmitting(false)
        }
    }

    const updateUnit = async (id, data) => {
        setSubmitting(true)
        try {
            await planningService.update(id, data)
            await fetchData()
            return true
        } catch (err) {
            setError(err.message)
            return false
        } finally {
            setSubmitting(false)
        }
    }

    const deleteUnit = async (id) => {
        setSubmitting(true)
        try {
            await planningService.delete(id)
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
        units,
        levels,
        groups,
        loading,
        submitting,
        error,
        activeYear,
        createUnit,
        updateUnit,
        deleteUnit,
        refresh: fetchData
    }
}