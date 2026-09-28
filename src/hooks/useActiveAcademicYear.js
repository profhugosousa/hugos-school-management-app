import { useContext } from 'react'
import { AcademicYearContext } from '../context/AcademicYearProvider'

export const useActiveAcademicYear = () => {
    const context = useContext(AcademicYearContext)
    if (!context) {
        throw new Error('useActiveAcademicYear must be used within an AcademicYearProvider')
    }
    return context
}