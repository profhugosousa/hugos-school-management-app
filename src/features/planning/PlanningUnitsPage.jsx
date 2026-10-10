import { useMemo, useState } from 'react'
import { ActiveYearWarningBanner } from '../../components/common/ActiveYearWarningBanner'
import { ConfirmModal } from '../../components/common/modals/ConfirmModal'
import { usePlanningUnits } from '../../hooks/usePlanningUnits'

import { PlanningUnitFilters } from './components/PlanningUnitFilters'
import { PlanningUnitFormModal } from './components/PlanningUnitFormModal'
import { PlanningUnitHeader } from './components/PlanningUnitHeader'
import { PlanningUnitTable } from './components/PlanningUnitTable'

export function PlanningUnitsPage() {
    const {
        units,
        levels,
        groups,
        loading,
        submitting,
        createUnit,
        updateUnit,
        deleteUnit
    } = usePlanningUnits()

    const [searchTerm, setSearchTerm] = useState('')
    const [selectedLevel, setSelectedLevel] = useState('')
    const [selectedGroup, setSelectedGroup] = useState('')

    const [isFormOpen, setIsFormOpen] = useState(false)
    const [editingUnit, setEditingUnit] = useState(null)
    const [deletingId, setDeletingId] = useState(null)

    const filteredUnits = useMemo(() => {
        return units.filter((unit) => {
            const matchesSearch =
                !searchTerm ||
                unit.theme?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                unit.activities?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                unit.manualPages?.toLowerCase().includes(searchTerm.toLowerCase())

            const matchesLevel = !selectedLevel || unit.levelId === selectedLevel
            const matchesGroup = !selectedGroup || unit.groupId === selectedGroup

            return matchesSearch && matchesLevel && matchesGroup
        })
    }, [units, searchTerm, selectedLevel, selectedGroup])

    const handleOpenCreate = () => {
        setEditingUnit(null)
        setIsFormOpen(true)
    }

    const handleOpenEdit = (unit) => {
        setEditingUnit(unit)
        setIsFormOpen(true)
    }

    const handleFormSubmit = async (formData) => {
        const success = editingUnit
            ? await updateUnit(editingUnit.id, formData)
            : await createUnit(formData)

        if (success) {
            setIsFormOpen(false)
            setEditingUnit(null)
        }
    }

    const handleConfirmDelete = async () => {
        if (!deletingId) return
        const success = await deleteUnit(deletingId)
        if (success) {
            setDeletingId(null)
        }
    }

    return (
        <div className="space-y-6 p-6 font-mono text-xs">
            <ActiveYearWarningBanner />

            <PlanningUnitHeader
                count={filteredUnits.length}
                onAddClick={handleOpenCreate}
            />

            <PlanningUnitFilters
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                selectedLevel={selectedLevel}
                onLevelChange={setSelectedLevel}
                selectedGroup={selectedGroup}
                onGroupChange={setSelectedGroup}
                levels={levels}
                groups={groups}
            />

            <PlanningUnitTable
                units={filteredUnits}
                levels={levels}
                groups={groups}
                loading={loading}
                onEdit={handleOpenEdit}
                onDelete={(id) => setDeletingId(id)}
            />

            <PlanningUnitFormModal
                key={isFormOpen ? (editingUnit?.id || 'new-modal') : 'closed-modal'}
                isOpen={isFormOpen}
                initialData={editingUnit}
                levels={levels}
                groups={groups}
                submitting={submitting}
                onClose={() => setIsFormOpen(false)}
                onSubmit={handleFormSubmit}
            />

            <ConfirmModal
                isOpen={Boolean(deletingId)}
                variant="danger"
                submitting={submitting}
                onClose={() => setDeletingId(null)}
                onConfirm={handleConfirmDelete}
            />
        </div>
    )
}

export default PlanningUnitsPage