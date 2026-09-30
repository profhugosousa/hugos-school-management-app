import { useCallback, useEffect, useState } from 'react'
import { groupService } from '../services/groupService'
import { levelService } from '../services/levelService'
import { useNotification } from './useNotification'

export const useGroups = () => {
    const [groups, setGroups] = useState([])
    const [levels, setLevels] = useState([])
    const [loading, setLoading] = useState(true)
    const { showNotification } = useNotification()

    const loadData = useCallback(async () => {
        setLoading(true)
        try {
            const [groupsData, levelsData] = await Promise.all([
                groupService.getAll(),
                levelService.getAll()
            ])
            setGroups(groupsData)
            setLevels(levelsData)
        } catch (err) {
            showNotification(err.message || 'Error loading groups', 'error')
        } finally {
            setLoading(false)
        }
    }, [showNotification])

    useEffect(() => {
        let isMounted = true

        const init = async () => {
            setLoading(true)
            try {
                const [groupsData, levelsData] = await Promise.all([
                    groupService.getAll(),
                    levelService.getAll()
                ])
                if (isMounted) {
                    setGroups(groupsData)
                    setLevels(levelsData)
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

        init()

        return () => {
            isMounted = false
        }
    }, [showNotification])

    const createGroup = async (name, levelId) => {
        try {
            await groupService.create(name, levelId)
            showNotification('Group created successfully', 'success')
            await loadData()
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
            await loadData()
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
            await loadData()
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
        refresh: loadData,
        createGroup,
        updateGroup,
        deleteGroup
    }
}