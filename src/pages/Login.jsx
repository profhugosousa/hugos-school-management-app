import { useState } from 'react'
import { authService } from '../services/authService'

/**
 * High-precision Minimalist Login Page.
 * Styled exclusively with project theme utilities (Light / Dark responsive).
 * 
 * @param {Object} props
 * @param {Function} [props.onLoginSuccess] - Callback triggered upon successful authentication.
 */
export const LoginPage = ({ onLoginSuccess }) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError(null)
        setLoading(true)

        try {
            const { user, session } = await authService.login(email, password)
            if (onLoginSuccess) {
                onLoginSuccess(user, session)
            }
        } catch (err) {
            setError(err.message || 'Invalid login credentials')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-light-bg text-light-primary dark:bg-dark-bg dark:text-dark-primary transition-colors duration-200 antialiased font-sans">

            {/* Main Structural Frame */}
            <div className="relative w-full max-w-md border border-light-border dark:border-dark-border bg-light-bg dark:bg-dark-bg p-8 sm:p-10 transition-colors">

                {/* Technical Corner Markers (Architectural touches) */}
                <span className="absolute -top-1.5 -left-1.5 text-xs select-none text-light-accent dark:text-dark-accent">+</span>
                <span className="absolute -top-1.5 -right-1.5 text-xs select-none text-light-accent dark:text-dark-accent">+</span>
                <span className="absolute -bottom-1.5 -left-1.5 text-xs select-none text-light-accent dark:text-dark-accent">+</span>
                <span className="absolute -bottom-1.5 -right-1.5 text-xs select-none text-light-accent dark:text-dark-accent">+</span>

                {/* Header Section */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-[10px] uppercase tracking-widest font-mono text-light-accent dark:text-dark-accent">
                            SYS // AUTH_GATEWAY
                        </span>
                        <div className="h-1.5 w-1.5 rounded-full bg-light-primary dark:bg-dark-primary animate-pulse" />
                    </div>

                    <h1 className="text-2xl font-bold tracking-tight text-light-primary dark:text-dark-primary uppercase">
                        Admin Access
                    </h1>
                    <p className="mt-1 text-xs text-light-secondary dark:text-dark-secondary">
                        Authenticate credentials to enter management console.
                    </p>
                </div>

                {/* Error Alert Container */}
                {error && (
                    <div className="mb-6 p-3 text-xs border border-red-500/50 bg-red-500/10 text-red-600 dark:text-red-400 font-mono flex items-center justify-between">
                        <span>{error}</span>
                        <button
                            type="button"
                            onClick={() => setError(null)}
                            className="ml-2 hover:opacity-75"
                        >
                            ✕
                        </button>
                    </div>
                )}

                {/* Form Container */}
                <form onSubmit={handleSubmit} className="space-y-5">

                    {/* Email Input */}
                    <div className="space-y-1.5">
                        <label
                            htmlFor="email"
                            className="block text-[11px] font-semibold uppercase tracking-wider text-light-secondary dark:text-dark-secondary"
                        >
                            Email Address
                        </label>
                        <input
                            id="email"
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="admin@domain.com"
                            disabled={loading}
                            className="w-full px-3.5 py-2.5 text-sm bg-transparent border border-light-border dark:border-dark-border text-light-primary dark:text-dark-primary placeholder:text-light-accent dark:placeholder:text-dark-accent focus:outline-none focus:border-light-primary dark:focus:border-dark-primary transition-colors disabled:opacity-50"
                        />
                    </div>

                    {/* Password Input with Visibility Toggle */}
                    <div className="space-y-1.5">
                        <label
                            htmlFor="password"
                            className="block text-[11px] font-semibold uppercase tracking-wider text-light-secondary dark:text-dark-secondary"
                        >
                            Password
                        </label>
                        <div className="relative">
                            <input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••••••"
                                disabled={loading}
                                className="w-full pl-3.5 pr-10 py-2.5 text-sm bg-transparent border border-light-border dark:border-dark-border text-light-primary dark:text-dark-primary placeholder:text-light-accent dark:placeholder:text-dark-accent focus:outline-none focus:border-light-primary dark:focus:border-dark-primary transition-colors disabled:opacity-50"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                tabIndex={-1}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-light-accent dark:text-dark-accent hover:text-light-primary dark:hover:text-dark-primary transition-colors"
                            >
                                {showPassword ? 'HIDE' : 'SHOW'}
                            </button>
                        </div>
                    </div>

                    {/* Action Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full mt-2 py-3 px-4 bg-light-primary dark:bg-dark-primary text-light-bg dark:text-dark-bg font-semibold text-xs uppercase tracking-wider hover:opacity-90 active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                                <span>Authenticating...</span>
                            </>
                        ) : (
                            <span>Sign In &rarr;</span>
                        )}
                    </button>
                </form>

                {/* Footer Meta */}
                <div className="mt-8 pt-4 border-t border-light-border/40 dark:border-dark-border/40 flex justify-between items-center text-[10px] text-light-accent dark:text-dark-accent font-mono">
                    <span>SECURE PROTOCOL</span>
                    <span>v1.0.0</span>
                </div>

            </div>
        </div>
    )
}