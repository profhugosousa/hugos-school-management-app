import { AlertCircle } from 'lucide-react'
import { useState } from 'react'
import { useAcademicYears } from '../../hooks/useAcademicYears'
import { AcademicYearDeleteModal } from './components/AcademicYearDeleteModal'
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

    const [isFormOpen, setIsFormOpen] = useState(false)
    const [editingYear, setEditingYear] = useState(null)
    const [deletingId, setDeletingId] = useState(null)

    const handleOpenCreate = () => {
        setEditingYear(null)
        setIsFormOpen(true)
    }

    const handleOpenEdit = (year) => {
        setEditingYear(year)
        setIsFormOpen(true)
    }

    const handleFormSubmit = async (formData) => {
        const success = editingYear
            ? await updateYear(editingYear.id, formData)
            : await createYear(formData)

        if (success) {
            setIsFormOpen(false)
        }
    }

    const handleDeleteConfirm = async () => {
        if (!deletingId) return
        const success = await deleteYear(deletingId)
        if (success) {
            setDeletingId(null)
        }
    }

    return (
        <div className="space-y-6">
            <AcademicYearHeader onAddClick={handleOpenCreate} />

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
                onDelete={(id) => setDeletingId(id)}
                onToggleActive={toggleActiveStatus}
            />

            <AcademicYearFormModal
                key={isFormOpen ? (editingYear?.id || 'new-modal') : 'closed-modal'}
                isOpen={isFormOpen}
                submitting={submitting}
                initialData={editingYear}
                onClose={() => setIsFormOpen(false)}
                onSubmit={handleFormSubmit}
            />

            <AcademicYearDeleteModal
                isOpen={Boolean(deletingId)}
                submitting={submitting}
                onClose={() => setDeletingId(null)}
                onConfirm={handleDeleteConfirm}
            />
        </div>
    )
}