import { useEffect, useState } from 'react'
import { authService } from '../services/authService'
import { AuthContext } from './authContext'

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [session, setSession] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        authService.getSession()
            .then((activeSession) => {
                setSession(activeSession)
                setUser(activeSession?.user ?? null)
            })
            .catch((err) => console.error('Auth initialization error:', err))
            .finally(() => setLoading(false))

        const subscription = authService.onAuthStateChange((_event, currentSession) => {
            setSession(currentSession)
            setUser(currentSession?.user ?? null)
            setLoading(false)
        })

        return () => {
            subscription?.unsubscribe?.()
        }
    }, [])

    const logout = async () => {
        await authService.logout()
    }

    return (
        <AuthContext.Provider value={{ user, session, loading, logout }}>
            {children}
        </AuthContext.Provider>
    )
}