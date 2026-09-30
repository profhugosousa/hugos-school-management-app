import { AlertCircle } from 'lucide-react'
import { useState } from 'react'
import { CompleteModal } from '../../components/common/modals/CompleteModal'
import { ConfirmModal } from '../../components/common/modals/ConfirmModal'
import { useAcademicYears } from '../../hooks/useAcademicYears'
import { AcademicYearFormModal } from './components/AcademicYearFormModal'
import { AcademicYearHeader } from './components/AcademicYearHeader'
import { AcademicYearTable } from './components/AcademicYearTable'

export const AcademicYearsPage = () => {
    const {
        years,
        loading,
        submitting,
        error,
        createYear,
        updateYear,
        deleteYear,
        toggleActiveStatus
    } = useAcademicYears()

    // Modal State Control
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [editingYear, setEditingYear] = useState(null)
    const [pendingFormData, setPendingFormData] = useState(null)

    const [confirmUpdateOpen, setConfirmUpdateOpen] = useState(false)
    const [confirmDeleteId, setConfirmDeleteId] = useState(null)

    const [completeModalState, setCompleteModalState] = useState({
        isOpen: false,
        type: 'update' // 'update' | 'deletion'
    })

    // Handlers
    const handleOpenCreate = () => {
        setEditingYear(null)
        setPendingFormData(null)
        setIsFormOpen(true)
    }

    const handleOpenEdit = (year) => {
        setEditingYear(year)
        setPendingFormData(null)
        setIsFormOpen(true)
    }

    // Submission Step 1: Form submit triggers confirmation modal for edits
    const handleFormSubmit = async (formData) => {
        if (editingYear) {
            setPendingFormData(formData)
            setIsFormOpen(false)
            setConfirmUpdateOpen(true)
        } else {
            const success = await createYear(formData)
            if (success) {
                setIsFormOpen(false)
                setCompleteModalState({ isOpen: true, type: 'update' })
            }
        }
    }

    // Submission Step 2: Confirm Update Execution
    const handleConfirmUpdate = async () => {
        if (!editingYear || !pendingFormData) return
        const success = await updateYear(editingYear.id, pendingFormData)
        if (success) {
            setConfirmUpdateOpen(false)
            setPendingFormData(null)
            setEditingYear(null)
            setCompleteModalState({ isOpen: true, type: 'update' })
        }
    }

    // Deletion Execution
    const handleConfirmDelete = async () => {
        if (!confirmDeleteId) return
        const success = await deleteYear(confirmDeleteId)
        if (success) {
            setConfirmDeleteId(null)
            setCompleteModalState({ isOpen: true, type: 'deletion' })
        }
    }

    return (
        <div className="space-y-6">
            <AcademicYearHeader count={years.length} onAddYear={handleOpenCreate} />

            {error && (
                <div className="p-4 border border-red-500/50 bg-red-500/10 text-red-500 font-mono text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                </div>
            )}

            <AcademicYearTable
                years={years}
                loading={loading}
                onEdit={handleOpenEdit}
                onDelete={(id) => setConfirmDeleteId(id)}
                onToggleActive={toggleActiveStatus}
            />

            {/* Create / Edit Form Modal */}
            <AcademicYearFormModal
                key={isFormOpen ? (editingYear?.id || 'new-modal') : 'closed-modal'}
                isOpen={isFormOpen}
                submitting={submitting}
                initialData={editingYear}
                onClose={() => setIsFormOpen(false)}
                onSubmit={handleFormSubmit}
            />

            {/* Confirm Update Modal */}
            <ConfirmModal
                isOpen={confirmUpdateOpen}
                variant="warning"
                submitting={submitting}
                onClose={() => setConfirmUpdateOpen(false)}
                onConfirm={handleConfirmUpdate}
            />

            {/* Confirm Deletion Modal */}
            <ConfirmModal
                isOpen={Boolean(confirmDeleteId)}
                variant="danger"
                submitting={submitting}
                onClose={() => setConfirmDeleteId(null)}
                onConfirm={handleConfirmDelete}
            />

            {/* Completion Feedback Modal (Handles both Update Complete & Deletion Complete) */}
            <CompleteModal
                isOpen={completeModalState.isOpen}
                type={completeModalState.type}
                onClose={() => setCompleteModalState((prev) => ({ ...prev, isOpen: false }))}
            />
        </div>
    )
}