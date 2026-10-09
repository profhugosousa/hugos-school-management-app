import { useMemo, useState } from 'react'
import { ActiveYearWarningBanner } from '../../components/common/ActiveYearWarningBanner'
import { useActiveAcademicYear } from '../../hooks/useActiveAcademicYear'
import { useNotification } from '../../hooks/useNotification'
import { useStudents } from '../../hooks/useStudents'

import StudentBulkImportModal from './components/StudentBulkImportModal'
import StudentDeleteModal from './components/StudentDeleteModal'
import StudentFormModal from './components/StudentFormModal'
import StudentHeader from './components/StudentHeader'
import StudentTable from './components/StudentTable'

import { StudentBadges } from './components/badges'
import { StudentProgressChart } from './components/progressEvaluationChart'
import { StudentQuickActions } from './components/quickAction'
import { StudentIncidentLog } from './components/StudentIncidentLog'
import { exportStudentsToCSV } from './utils/studentCsvUtils'

export function StudentsPage() {
    const { activeYear } = useActiveAcademicYear()
    const { showSuccess } = useNotification()
    const { students, loading, refetch, createStudent, updateStudent, deleteStudent } =
        useStudents(activeYear?.id)

    const [searchTerm, setSearchTerm] = useState('')
    const [selectedGroup, setSelectedGroup] = useState('')
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [isDeleteOpen, setIsDeleteOpen] = useState(false)
    const [isImportOpen, setIsImportOpen] = useState(false)

    const [selectedStudent, setSelectedStudent] = useState(null)
    const [activeDetailStudent, setActiveDetailStudent] = useState(null)

    // Filter and sort by Level -> Group -> Call Number (#) -> Name
    const filteredAndSortedStudents = useMemo(() => {
        const filtered = students.filter((student) => {
            const matchesSearch =
                student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                student.number?.toString().includes(searchTerm) ||
                student.groupNumber?.toString().includes(searchTerm) ||
                student.process_number?.toString().includes(searchTerm)
            const matchesGroup = selectedGroup
                ? student.groupId === selectedGroup || student.group_id === selectedGroup
                : true

            return matchesSearch && matchesGroup
        })

        return filtered.sort((a, b) => {
            // 1. Level Name
            const levelA = a.level_name || a.levelName || ''
            const levelB = b.level_name || b.levelName || ''
            const levelCmp = levelA.localeCompare(levelB, undefined, { numeric: true, sensitivity: 'base' })
            if (levelCmp !== 0) return levelCmp

            // 2. Group Name
            const groupA = a.group_name || a.display_name || a.groupId || ''
            const groupB = b.group_name || b.display_name || b.groupId || ''
            const groupCmp = groupA.localeCompare(groupB, undefined, { numeric: true, sensitivity: 'base' })
            if (groupCmp !== 0) return groupCmp

            // 3. Call Number (#)
            const numA = a.groupNumber ?? a.number ?? Infinity
            const numB = b.groupNumber ?? b.number ?? Infinity
            if (numA !== numB) return numA - numB

            // 4. Student Name
            return (a.name || '').localeCompare(b.name || '', undefined, { sensitivity: 'base' })
        })
    }, [students, searchTerm, selectedGroup])

    const handleOpenCreate = () => {
        setSelectedStudent(null)
        setIsFormOpen(true)
    }

    const handleOpenEdit = (student) => {
        setSelectedStudent(student)
        setIsFormOpen(true)
    }

    const handleOpenDelete = (student) => {
        setSelectedStudent(student)
        setIsDeleteOpen(true)
    }

    const handleFormSubmit = async (formData) => {
        if (selectedStudent) {
            await updateStudent(selectedStudent.id, formData)
        } else {
            await createStudent({ ...formData, academic_year_id: activeYear?.id })
        }
        setIsFormOpen(false)
    }

    const handleDeleteConfirm = async () => {
        if (selectedStudent) {
            await deleteStudent(selectedStudent.id)
            setIsDeleteOpen(false)
            if (activeDetailStudent?.id === selectedStudent.id) {
                setActiveDetailStudent(null)
            }
            setSelectedStudent(null)
        }
    }

    const handleImportCompleted = async (stats) => {
        showSuccess(
            `Importação concluída: ${stats.importedCount} criados, ${stats.updatedCount} atualizados, ${stats.skippedCount} ignorados.`
        )
        await refetch()
    }

    return (
        <div className="space-y-6 p-6 font-mono text-xs">
            <ActiveYearWarningBanner />

            <StudentHeader
                count={filteredAndSortedStudents.length}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                selectedGroup={selectedGroup}
                onGroupChange={setSelectedGroup}
                onAddClick={handleOpenCreate}
                onImportClick={() => setIsImportOpen(true)}
                onExportClick={() => exportStudentsToCSV(filteredAndSortedStudents)}
            />

            <div className={`grid gap-6 transition-all ${activeDetailStudent ? 'lg:grid-cols-3' : 'grid-cols-1'}`}>
                <div className={activeDetailStudent ? 'lg:col-span-2' : 'w-full'}>
                    <StudentTable
                        students={filteredAndSortedStudents}
                        loading={loading}
                        onEdit={handleOpenEdit}
                        onDelete={handleOpenDelete}
                        onSelect={setActiveDetailStudent}
                        selectedStudentId={activeDetailStudent?.id}
                    />
                </div>

                {activeDetailStudent && (
                    <div className="space-y-4 bg-main p-4 border border-line">
                        <div className="flex items-center justify-between pb-3 border-b border-line">
                            <div>
                                <h3 className="text-sm font-bold uppercase text-content">
                                    {activeDetailStudent.name}
                                </h3>
                                <p className="text-xs text-accent font-bold">
                                    #{activeDetailStudent.process_number || activeDetailStudent.number}
                                </p>
                            </div>
                            <button
                                onClick={() => setActiveDetailStudent(null)}
                                className="p-1 text-muted hover:text-content cursor-pointer"
                            >
                                ✕
                            </button>
                        </div>

                        <StudentQuickActions student={activeDetailStudent} />
                        <StudentBadges extraInfo={activeDetailStudent.extra_info} />
                        <StudentProgressChart evaluations={activeDetailStudent.evaluations || []} />
                        <StudentIncidentLog incidents={activeDetailStudent.incidents || []} />
                    </div>
                )}
            </div>

            {isFormOpen && (
                <StudentFormModal
                    isOpen={isFormOpen}
                    initialData={selectedStudent}
                    onClose={() => setIsFormOpen(false)}
                    onSubmit={handleFormSubmit}
                />
            )}

            {isDeleteOpen && (
                <StudentDeleteModal
                    isOpen={isDeleteOpen}
                    student={selectedStudent}
                    onClose={() => setIsDeleteOpen(false)}
                    onConfirm={handleDeleteConfirm}
                />
            )}

            <StudentBulkImportModal
                isOpen={isImportOpen}
                activeYearId={activeYear?.id}
                selectedGroupId={selectedGroup}
                onClose={() => setIsImportOpen(false)}
                onImportCompleted={handleImportCompleted}
            />
        </div>
    )
}

export default StudentsPage;