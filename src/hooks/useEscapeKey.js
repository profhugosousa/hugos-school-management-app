import { useEffect } from 'react'

/**
 * Custom hook to trigger a callback when the Escape key is pressed.
 * @param {Function} onClose - Function to execute on Escape keydown.
 * @param {boolean} isOpen - Conditional flag (defaults to true).
 */
export const useEscapeKey = (onClose, isOpen = true) => {
    useEffect(() => {
        if (!isOpen || typeof onClose !== 'function') return

        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                onClose()
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [onClose, isOpen])
}

export default useEscapeKey