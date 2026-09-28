import { useEffect, useState } from 'react'
import { academicYearService } from '../services/academicYearService'
import { AcademicYearContext } from './AcademicYearContext'

export const AcademicYearProvider = ({ children }) => {
    const [activeYear, setActiveYear] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        let ignore = false

        const fetchActiveYear = async () => {
            try {
                const years = await academicYearService.getAll()
                const active = years.find((y) => y.isActive) || years[0] || null
                if (!ignore) {
                    setActiveYear(active)
                }
            } catch (err) {
                console.error('Failed to fetch active academic year', err)
            } finally {
                if (!ignore) {
                    setLoading(false)
                }
            }
        }

        fetchActiveYear()

        return () => {
            ignore = true
        }
    }, [])

    return (
        <AcademicYearContext.Provider value={{ activeYear, setActiveYear, loading }}>
            {children}
        </AcademicYearContext.Provider>
    )
}