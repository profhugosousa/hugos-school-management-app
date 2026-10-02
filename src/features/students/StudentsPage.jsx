import { useMemo, useState } from 'react';
import ActiveYearWarningBanner from '../../components/common/ActiveYearWarningBanner';
import { useActiveAcademicYear } from '../../hooks/useActiveAcademicYear';
import { useStudents } from '../../hooks/useStudents';
import StudentDeleteModal from './components/StudentDeleteModal';
import StudentFormModal from './components/StudentFormModal';
import StudentHeader from './components/StudentHeader';
import StudentTable from './components/StudentTable';

export default function StudentsPage() {
    const { activeYear } = useActiveAcademicYear();
    const { students, loading, createStudent, updateStudent, deleteStudent } =
        useStudents(activeYear?.id);

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedGroup, setSelectedGroup] = useState('');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);

    const filteredStudents = useMemo(() => {
        return students.filter((student) => {
            const matchesSearch =
                student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                student.number?.toString().includes(searchTerm);
            const matchesGroup = selectedGroup
                ? student.group_id === selectedGroup
                : true;

            return matchesSearch && matchesGroup;
        });
    }, [students, searchTerm, selectedGroup]);

    const handleOpenCreate = () => {
        setSelectedStudent(null);
        setIsFormOpen(true);
    };

    const handleOpenEdit = (student) => {
        setSelectedStudent(student);
        setIsFormOpen(true);
    };

    const handleOpenDelete = (student) => {
        setSelectedStudent(student);
        setIsDeleteOpen(true);
    };

    const handleFormSubmit = async (formData) => {
        if (selectedStudent) {
            await updateStudent(selectedStudent.id, formData);
        } else {
            await createStudent({ ...formData, academic_year_id: activeYear?.id });
        }
        setIsFormOpen(false);
    };

    const handleDeleteConfirm = async () => {
        if (selectedStudent) {
            await deleteStudent(selectedStudent.id);
            setIsDeleteOpen(false);
            setSelectedStudent(null);
        }
    };

    return (
        <div className="space-y-6 p-6">
            <ActiveYearWarningBanner />

            <StudentHeader
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                selectedGroup={selectedGroup}
                onGroupChange={setSelectedGroup}
                onAddClick={handleOpenCreate}
            />

            <StudentTable
                students={filteredStudents}
                loading={loading}
                onEdit={handleOpenEdit}
                onDelete={handleOpenDelete}
            />

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
        </div>
    );
}