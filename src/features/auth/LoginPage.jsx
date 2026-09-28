import { ArrowRight, Eye, EyeOff, Languages, X } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { authService } from '../../services/authService'

export const LoginPage = ({ onLoginSuccess }) => {
    const { t, i18n } = useTranslation()
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
            setError(err.message || t('auth.invalidCredentials'))
        } finally {
            setLoading(false)
        }
    }

    const toggleLanguage = () => {
        const nextLang = i18n.language === 'pt' ? 'en' : 'pt'
        i18n.changeLanguage(nextLang)
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-main text-content transition-colors duration-200 font-sans">

            {/* Structural Container */}
            <div className="relative w-full max-w-md border border-line bg-main p-8 sm:p-10">

                {/* Architectural Corner Markers */}
                <span className="absolute -top-1.5 -left-1.5 text-xs select-none text-accent">+</span>
                <span className="absolute -top-1.5 -right-1.5 text-xs select-none text-accent">+</span>
                <span className="absolute -bottom-1.5 -left-1.5 text-xs select-none text-accent">+</span>
                <span className="absolute -bottom-1.5 -right-1.5 text-xs select-none text-accent">+</span>

                {/* Top Header Controls */}
                <div className="flex items-center justify-between mb-8">
                    <span className="text-[10px] uppercase tracking-widest font-mono text-accent">
                        {t('auth.gateway')}
                    </span>
                    <button
                        type="button"
                        onClick={toggleLanguage}
                        className="text-[10px] font-mono tracking-wider px-2 py-1 border border-line uppercase hover:bg-content hover:text-main transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                        <Languages className="w-3 h-3" />
                        <span>{i18n.language.toUpperCase()}</span>
                    </button>
                </div>

                {/* Header Title */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold tracking-tight text-content uppercase">
                        {t('auth.adminAccess')}
                    </h1>
                    <p className="mt-1 text-xs text-muted">
                        {t('auth.subtitle')}
                    </p>
                </div>

                {/* Error Alert Box */}
                {error && (
                    <div className="mb-6 p-3 text-xs border border-red-500/50 bg-red-500/10 text-red-500 font-mono flex items-center justify-between">
                        <span>{error}</span>
                        <button
                            type="button"
                            onClick={() => setError(null)}
                            className="p-0.5 hover:opacity-75 cursor-pointer"
                        >
                            <X className="w-3.5 h-3.5" />
                        </button>
                    </div>
                )}

                {/* Login Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    <Input
                        id="email"
                        type="email"
                        required
                        label={t('auth.emailLabel')}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={t('auth.emailPlaceholder')}
                        disabled={loading}
                    />

                    <div className="space-y-1.5">
                        <label
                            htmlFor="password"
                            className="block text-[11px] font-semibold uppercase tracking-wider text-muted"
                        >
                            {t('auth.passwordLabel')}
                        </label>
                        <div className="relative">
                            <input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder={t('auth.passwordPlaceholder')}
                                disabled={loading}
                                className="w-full pl-3.5 pr-10 py-2.5 text-sm bg-transparent border border-line text-content placeholder:text-accent focus:outline-none focus:border-content transition-colors disabled:opacity-50"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                tabIndex={-1}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-accent hover:text-content transition-colors cursor-pointer"
                            >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>

                    <Button type="submit" loading={loading}>
                        {loading ? (
                            t('auth.authenticating')
                        ) : (
                            <span className="flex items-center gap-1.5">
                                {t('auth.signIn')} <ArrowRight className="w-3.5 h-3.5" />
                            </span>
                        )}
                    </Button>
                </form>

                {/* Footer Meta */}
                <div className="mt-8 pt-4 border-t border-line/40 flex justify-between items-center text-[10px] text-accent font-mono">
                    <span>{t('auth.secureProtocol')}</span>
                    <span>{t('common.version')}</span>
                </div>

            </div>
        </div>
    )
}