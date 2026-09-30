import { useState } from 'react'
import { useGroups } from '../../hooks/useGroups'
import { GroupDeleteModal } from './components/GroupDeleteModal'
import { GroupFormModal } from './components/GroupFormModal'
import { GroupHeader } from './components/GroupHeader'
import { GroupTable } from './components/GroupTable'

export const GroupsPage = () => {
    const { groups, levels, loading, createGroup, updateGroup, deleteGroup } = useGroups()
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [editingGroup, setEditingGroup] = useState(null)
    const [deletingGroupId, setDeletingGroupId] = useState(null)

    const handleOpenCreate = () => {
        setEditingGroup(null)
        setIsFormOpen(true)
    }

    const handleOpenEdit = (group) => {
        setEditingGroup(group)
        setIsFormOpen(true)
    }

    const handleFormSubmit = async (formData) => {
        if (editingGroup) {
            return await updateGroup(editingGroup.id, formData)
        }
        return await createGroup(formData.name, formData.levelId)
    }

    const handleDeleteConfirm = async () => {
        if (!deletingGroupId) return
        const success = await deleteGroup(deletingGroupId)
        if (success) setDeletingGroupId(null)
    }

    const activeDeletingGroup = groups.find((g) => g.id === deletingGroupId)

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            <GroupHeader count={groups.length} onAddGroup={handleOpenCreate} />

            <GroupTable
                groups={groups}
                loading={loading}
                onEdit={handleOpenEdit}
                onDelete={(id) => setDeletingGroupId(id)}
            />

            {isFormOpen && (
                <GroupFormModal
                    key={editingGroup ? editingGroup.id : 'new-group'}
                    isOpen={isFormOpen}
                    onClose={() => setIsFormOpen(false)}
                    onSubmit={handleFormSubmit}
                    initialData={editingGroup}
                    levels={levels}
                />
            )}

            <GroupDeleteModal
                isOpen={Boolean(deletingGroupId)}
                onClose={() => setDeletingGroupId(null)}
                onConfirm={handleDeleteConfirm}
                group={activeDeletingGroup}
            />
        </div>
    )
}

export default GroupsPage