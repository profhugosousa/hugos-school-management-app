import { AlertCircle, AlertTriangle, CheckCircle2, Info, X } from 'lucide-react'
import { useCallback, useState } from 'react'
import { NotificationContext } from './NotificationContext'

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([])

    const removeNotification = useCallback((id) => {
        setNotifications((prev) => prev.filter((n) => n.id !== id))
    }, [])

    const addNotification = useCallback(({ type = 'error', title, message, duration = 5000 }) => {
        const id = Date.now() + Math.random()
        setNotifications((prev) => [...prev, { id, type, title, message }])

        if (duration > 0) {
            setTimeout(() => {
                removeNotification(id)
            }, duration)
        }
    }, [removeNotification])

    const showError = useCallback((message, title) => {
        addNotification({ type: 'error', title, message })
    }, [addNotification])

    const showWarning = useCallback((message, title) => {
        addNotification({ type: 'warning', title, message })
    }, [addNotification])

    const showSuccess = useCallback((message, title) => {
        addNotification({ type: 'success', title, message })
    }, [addNotification])

    return (
        <NotificationContext.Provider
            value={{ showError, showWarning, showSuccess, addNotification, removeNotification }}
        >
            {children}
            <NotificationToastContainer notifications={notifications} onDismiss={removeNotification} />
        </NotificationContext.Provider>
    )
}

const NotificationToastContainer = ({ notifications, onDismiss }) => {
    if (notifications.length === 0) return null

    return (
        <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-md w-full font-mono text-xs px-4 sm:px-0">
            {notifications.map((n) => {
                const isError = n.type === 'error'
                const isWarning = n.type === 'warning'
                const isSuccess = n.type === 'success'

                const colorStyles = isError
                    ? 'border-red-500 bg-red-950/90 text-red-200'
                    : isWarning
                        ? 'border-amber-500 bg-amber-950/90 text-amber-200'
                        : 'border-emerald-500 bg-emerald-950/90 text-emerald-200'

                const Icon = isError ? AlertCircle : isWarning ? AlertTriangle : isSuccess ? CheckCircle2 : Info

                return (
                    <div
                        key={n.id}
                        className={`p-4 border shadow-2xl flex items-start justify-between gap-3 backdrop-blur-md transition-all ${colorStyles}`}
                    >
                        <div className="flex items-start gap-2.5">
                            <Icon className="w-4 h-4 shrink-0 mt-0.5" />
                            <div className="space-y-0.5">
                                {n.title && <div className="font-bold uppercase tracking-wider text-[11px]">{n.title}</div>}
                                <p className="leading-relaxed opacity-90">{n.message}</p>
                            </div>
                        </div>
                        <button
                            onClick={() => onDismiss(n.id)}
                            className="p-1 hover:opacity-100 opacity-60 transition-opacity cursor-pointer"
                        >
                            <X className="w-3.5 h-3.5" />
                        </button>
                    </div>
                )
            })}
        </div>
    )
}