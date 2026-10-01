import { useCallback, useEffect, useState } from 'react'
import { groupService } from '../services/groupService'
import { levelService } from '../services/levelService'
import { useNotification } from './useNotification'

/**
 * Natural comparison helper (e.g., "7º A" comes before "10º A")
 */
const naturalCompare = (a, b) =>
    (a || '').localeCompare(b || '', undefined, { numeric: true, sensitivity: 'base' })

export const useGroups = () => {
    const [groups, setGroups] = useState([])
    const [levels, setLevels] = useState([])
    const [loading, setLoading] = useState(true)
    const { showNotification } = useNotification()

    const fetchAllData = useCallback(async () => {
        const [groupsData, levelsData] = await Promise.all([
            groupService.getAll(),
            levelService.getAll()
        ])

        const sortedLevels = [...levelsData].sort((a, b) => naturalCompare(a.name, b.name))

        const sortedGroups = [...groupsData].sort((a, b) => {
            const levelComp = naturalCompare(a.levelName, b.levelName)
            if (levelComp !== 0) return levelComp
            return naturalCompare(a.name, b.name)
        })

        return { groups: sortedGroups, levels: sortedLevels }
    }, [])

    // Background refresh without triggering initial layout loaders
    const refresh = useCallback(async () => {
        try {
            const { groups: g, levels: l } = await fetchAllData()
            setGroups(g)
            setLevels(l)
        } catch (err) {
            showNotification(err.message || 'Error refreshing groups', 'error')
        }
    }, [fetchAllData, showNotification])

    // Initial async data load on mount
    useEffect(() => {
        let isMounted = true

        const loadInitialData = async () => {
            try {
                const { groups: g, levels: l } = await fetchAllData()
                if (isMounted) {
                    setGroups(g)
                    setLevels(l)
                }
            } catch (err) {
                if (isMounted) {
                    showNotification(err.message || 'Error loading groups', 'error')
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
    }, [fetchAllData, showNotification])

    const createGroup = async (name, levelId) => {
        try {
            await groupService.create(name, levelId)
            showNotification('Group created successfully', 'success')
            await refresh()
            return true
        } catch (err) {
            showNotification(err.message || 'Failed to create group', 'error')
            return false
        }
    }

    const updateGroup = async (id, { name, levelId }) => {
        try {
            await groupService.update(id, { name, levelId })
            showNotification('Group updated successfully', 'success')
            await refresh()
            return true
        } catch (err) {
            showNotification(err.message || 'Failed to update group', 'error')
            return false
        }
    }

    const deleteGroup = async (id) => {
        try {
            await groupService.delete(id)
            showNotification('Group deleted successfully', 'success')
            await refresh()
            return true
        } catch (err) {
            showNotification(err.message || 'Failed to delete group', 'error')
            return false
        }
    }

    return {
        groups,
        levels,
        loading,
        refresh,
        createGroup,
        updateGroup,
        deleteGroup
    }
}