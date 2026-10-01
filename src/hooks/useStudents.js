import { useCallback, useEffect, useState } from 'react'
import { studentService } from '../services/studentService'
import { useNotification } from './useNotification'

export const useStudents = (academicYearId = null) => {
    const [students, setStudents] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const { showError, showSuccess } = useNotification()

    // Helper for explicit user refetches/background reloads
    const refetch = useCallback(async () => {
        try {
            setError(null)
            const data = await studentService.getAll(academicYearId)
            setStudents(data || [])
        } catch (err) {
            const msg = err.message || 'Failed to fetch students'
            setError(msg)
            showError(msg)
        }
    }, [academicYearId, showError])

    // Initial load on mount or academicYearId change
    useEffect(() => {
        let isMounted = true

        const loadInitialData = async () => {
            try {
                const data = await studentService.getAll(academicYearId)
                if (isMounted) {
                    setStudents(data || [])
                    setError(null)
                }
            } catch (err) {
                if (isMounted) {
                    const msg = err.message || 'Failed to fetch students'
                    setError(msg)
                    showError(msg)
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
    }, [academicYearId, showError])

    const createStudent = async (studentData) => {
        try {
            const newStudent = await studentService.create(studentData)
            setStudents((prev) => [...prev, newStudent])
            showSuccess('Student created successfully')
            return newStudent
        } catch (err) {
            const msg = err.message || 'Failed to create student'
            showError(msg)
            throw err
        }
    }

    const updateStudent = async (id, studentData) => {
        try {
            const updated = await studentService.update(id, studentData)
            setStudents((prev) =>
                prev.map((item) => (item.id === id ? updated : item))
            )
            showSuccess('Student updated successfully')
            return updated
        } catch (err) {
            const msg = err.message || 'Failed to update student'
            showError(msg)
            throw err
        }
    }

    const deleteStudent = async (id) => {
        try {
            await studentService.delete(id)
            setStudents((prev) => prev.filter((item) => item.id !== id))
            showSuccess('Student deleted successfully')
        } catch (err) {
            const msg = err.message || 'Failed to delete student'
            showError(msg)
            throw err
        }
    }

    return {
        students,
        loading,
        error,
        refetch,
        createStudent,
        updateStudent,
        deleteStudent
    }
}