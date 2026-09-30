import { AlertCircle } from 'lucide-react'
import { useMemo, useState } from 'react'
import { CompleteModal } from '../../components/common/modals/CompleteModal'
import { ConfirmModal } from '../../components/common/modals/ConfirmModal'
import { useLessons } from '../../hooks/useLessons'
import { LessonExportModal } from '../lessons/components/LessonExportModal'
import { LessonFilters } from '../lessons/components/LessonFilters'
import { LessonFormModal } from '../lessons/components/LessonFormModal'
import { LessonHeader } from '../lessons/components/LessonHeader'
import { LessonImportModal } from '../lessons/components/LessonImportModal'
import { LessonStudentViewModal } from '../lessons/components/LessonStudentViewModal'
import { LessonTable } from '../lessons/components/LessonTable'

export const LessonsPage = () => {
    const {
        lessons,
        groups,
        loading,
        submitting,
        error,
        activeYear,
        createLesson,
        updateLesson,
        deleteLesson,
        exportLesson
    } = useLessons()

    const [isFormOpen, setIsFormOpen] = useState(false)
    const [isImportOpen, setIsImportOpen] = useState(false)
    const [editingLesson, setEditingLesson] = useState(null)
    const [studentViewLesson, setStudentViewLesson] = useState(null)
    const [exportingLesson, setExportingLesson] = useState(null)
    const [pendingFormData, setPendingFormData] = useState(null)
    const [confirmUpdateOpen, setConfirmUpdateOpen] = useState(false)
    const [confirmDeleteId, setConfirmDeleteId] = useState(null)
    const [completeModalState, setCompleteModalState] = useState({ isOpen: false, type: 'update' })

    const [sortField, setSortField] = useState('date')
    const [sortDirection, setSortDirection] = useState('asc')
    const [filters, setFilters] = useState({})

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

    const handleConfirmDelete = async () => {
        if (!confirmDeleteId) return
        const success = await deleteLesson(confirmDeleteId)
        if (success) {
            setConfirmDeleteId(null)
            setCompleteModalState({ isOpen: true, type: 'deletion' })
        }
    }

    const handleExportSubmit = async (exportConfig) => {
        if (!exportingLesson) return
        const success = await exportLesson(exportingLesson, exportConfig)
        if (success) {
            setExportingLesson(null)
            setCompleteModalState({ isOpen: true, type: 'update' })
        }
    }

    const toggleSort = (field) => {
        if (sortField === field) {
            setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'))
        } else {
            setSortField(field)
            setSortDirection('asc')
        }
    }

    const processedLessons = useMemo(() => {
        const filtered = lessons.filter(l => {
            const searchMatch = !filters.searchTerm || [
                l.summary, l.attention_box, l.teacher_notes,
                JSON.stringify(l.step_by_step), JSON.stringify(l.materials)
            ].some(field => field?.toLowerCase().includes(filters.searchTerm.toLowerCase()))

            const lessonDate = l.lesson_date || l.date
            const singleDateMatch = !filters.singleDate || lessonDate === filters.singleDate
            const startMatch = !filters.dateStart || lessonDate >= filters.dateStart
            const endMatch = !filters.dateEnd || lessonDate <= filters.dateEnd
            const groupMatch = !filters.groupId || l.group_id === filters.groupId
            const subjectMatch = !filters.subject || l.subject?.toLowerCase().includes(filters.subject.toLowerCase())

            return searchMatch && singleDateMatch && startMatch && endMatch && groupMatch && subjectMatch
        })

        return [...filtered].sort((a, b) => {
            const comparison = sortField === 'number'
                ? (parseInt(a.lesson_number, 10) || 0) - (parseInt(b.lesson_number, 10) || 0)
                : `${a.lesson_date || a.date || ''} ${a.lesson_time || ''}`.localeCompare(`${b.lesson_date || b.date || ''} ${b.lesson_time || ''}`)

            return sortDirection === 'asc' ? comparison : -comparison
        })
    }, [lessons, filters, sortField, sortDirection])

    return (
        <div className="space-y-6">
            <LessonHeader
                count={processedLessons.length}
                activeYear={activeYear}
                onAddLesson={handleOpenCreate}
                onImportClick={() => setIsImportOpen(true)}
            />

            <LessonFilters
                filters={filters}
                setFilters={setFilters}
                groups={groups}
            />

            {error && (
                <div className="p-4 border border-red-500/50 bg-red-500/10 text-red-500 font-mono text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                </div>
            )}

            <LessonTable
                lessons={processedLessons}
                groups={groups}
                loading={loading}
                sortField={sortField}
                sortDirection={sortDirection}
                onToggleSort={toggleSort}
                onEdit={handleOpenEdit}
                onDelete={(id) => setConfirmDeleteId(id)}
                onStudentView={(lesson) => setStudentViewLesson(lesson)}
                onExport={(lesson) => setExportingLesson(lesson)}
            />

            <LessonFormModal
                key={isFormOpen ? (editingLesson?.id || 'new-modal') : 'closed-modal'}
                isOpen={isFormOpen}
                groups={groups}
                submitting={submitting}
                initialData={editingLesson}
                onClose={() => setIsFormOpen(false)}
                onSubmit={handleFormSubmit}
            />

            <LessonImportModal
                isOpen={isImportOpen}
                onClose={() => setIsImportOpen(false)}
            />

            <LessonStudentViewModal
                isOpen={Boolean(studentViewLesson)}
                lesson={studentViewLesson}
                onClose={() => setStudentViewLesson(null)}
            />

            {/* Fixed: Pass sourceLesson and lessons props */}
            <LessonExportModal
                isOpen={Boolean(exportingLesson)}
                sourceLesson={exportingLesson}
                groups={groups}
                lessons={lessons}
                submitting={submitting}
                onClose={() => setExportingLesson(null)}
                onExport={handleExportSubmit}
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