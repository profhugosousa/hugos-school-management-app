import { AlertCircle } from 'lucide-react'
import { useState } from 'react'
import { CompleteModal } from '../../components/common/modals/CompleteModal'
import { ConfirmModal } from '../../components/common/modals/ConfirmModal'
import { useLessons } from '../../hooks/useLessons'
import { LessonFormModal } from './components/LessonFormModal'
import { LessonHeader } from './components/LessonHeader'
import { LessonImportModal } from './components/LessonImportModal'
import { LessonTable } from './components/LessonTable'

export const LessonsPage = () => {
    const {
        lessons,
        loading,
        submitting,
        error,
        activeYear,
        createLesson,
        importLessons,
        updateLesson,
        deleteLesson
    } = useLessons()

    const [isFormOpen, setIsFormOpen] = useState(false)
    const [isImportOpen, setIsImportOpen] = useState(false)
    const [editingLesson, setEditingLesson] = useState(null)
    const [pendingFormData, setPendingFormData] = useState(null)

    const [confirmUpdateOpen, setConfirmUpdateOpen] = useState(false)
    const [confirmDeleteId, setConfirmDeleteId] = useState(null)

    const [completeModalState, setCompleteModalState] = useState({
        isOpen: false,
        type: 'update'
    })

    const handleOpenCreate = () => {
        setEditingLesson(null)
        setPendingFormData(null)
        setIsFormOpen(true)
    }

    const handleOpenEdit = (lesson) => {
        setEditingLesson(lesson)
        setPendingFormData(null)
        setIsFormOpen(true)
    }

    const handleFormSubmit = async (formData) => {
        if (editingLesson) {
            setPendingFormData(formData)
            setIsFormOpen(false)
            setConfirmUpdateOpen(true)
        } else {
            const success = await createLesson(formData)
            if (success) {
                setIsFormOpen(false)
                setCompleteModalState({ isOpen: true, type: 'update' })
            }
        }
    }

    const handleConfirmUpdate = async () => {
        if (!editingLesson || !pendingFormData) return
        const success = await updateLesson(editingLesson.id, pendingFormData)
        if (success) {
            setConfirmUpdateOpen(false)
            setPendingFormData(null)
            setEditingLesson(null)
            setCompleteModalState({ isOpen: true, type: 'update' })
        }
    }

    const handleImportSubmit = async (importedList) => {
        const success = await importLessons(importedList)
        if (success) {
            setIsImportOpen(false)
            setCompleteModalState({ isOpen: true, type: 'update' })
        }
    }

    const handleConfirmDelete = async () => {
        if (!confirmDeleteId) return
        const success = await deleteLesson(confirmDeleteId)
        if (success) {
            setConfirmDeleteId(null)
            setCompleteModalState({ isOpen: true, type: 'deletion' })
        }
    }

    return (
        <div className="space-y-6">
            <LessonHeader
                activeYear={activeYear}
                onAddClick={handleOpenCreate}
                onImportClick={() => setIsImportOpen(true)}
            />

            {error && (
                <div className="p-4 border border-red-500/50 bg-red-500/10 text-red-500 font-mono text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                </div>
            )}

            <LessonTable
                lessons={lessons}
                loading={loading}
                onEdit={handleOpenEdit}
                onDelete={(id) => setConfirmDeleteId(id)}
            />

            <LessonFormModal
                key={isFormOpen ? (editingLesson?.id || 'new-modal') : 'closed-modal'}
                isOpen={isFormOpen}
                submitting={submitting}
                initialData={editingLesson}
                onClose={() => setIsFormOpen(false)}
                onSubmit={handleFormSubmit}
            />

            <LessonImportModal
                isOpen={isImportOpen}
                submitting={submitting}
                onClose={() => setIsImportOpen(false)}
                onImport={handleImportSubmit}
            />

            <ConfirmModal
                isOpen={confirmUpdateOpen}
                variant="warning"
                submitting={submitting}
                onClose={() => setConfirmUpdateOpen(false)}
                onConfirm={handleConfirmUpdate}
            />

            <ConfirmModal
                isOpen={Boolean(confirmDeleteId)}
                variant="danger"
                submitting={submitting}
                onClose={() => setConfirmDeleteId(null)}
                onConfirm={handleConfirmDelete}
            />

            <CompleteModal
                isOpen={completeModalState.isOpen}
                type={completeModalState.type}
                onClose={() => setCompleteModalState((prev) => ({ ...prev, isOpen: false }))}
            />
        </div>
    )
}