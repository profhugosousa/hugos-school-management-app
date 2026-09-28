import { Languages, LogOut, Moon, Sun, User } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../../hooks/useAuth'
import { useTheme } from '../../hooks/useTheme'

export const Header = () => {
    const { user, logout } = useAuth()
    const { theme, toggleTheme } = useTheme()
    const { t, i18n } = useTranslation()

    const toggleLanguage = () => {
        const nextLang = i18n.language === 'pt' ? 'en' : 'pt'
        i18n.changeLanguage(nextLang)
    }

    return (
        <header className="h-14 border-b border-line px-6 flex items-center justify-between bg-main">
            <div className="flex items-center gap-2">
                <span className="text-xs font-mono tracking-widest text-accent uppercase">
                    {t('nav.brand')}
                </span>
            </div>

            <div className="flex items-center gap-4 text-xs font-mono">
                <button
                    onClick={toggleTheme}
                    title="Toggle Theme"
                    className="p-1.5 border border-line hover:bg-content hover:text-main transition-colors cursor-pointer text-muted"
                >
                    {theme === 'dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
                </button>

                <button
                    onClick={toggleLanguage}
                    className="px-2 py-1 border border-line hover:bg-content hover:text-main transition-colors uppercase cursor-pointer flex items-center gap-1.5 text-muted hover:text-main"
                >
                    <Languages className="w-3.5 h-3.5" />
                    <span>{i18n.language.toUpperCase()}</span>
                </button>

                <div className="h-4 w-px bg-line" />

                <div className="flex items-center gap-1.5 text-muted">
                    <User className="w-3.5 h-3.5 text-accent" />
                    <span>{user?.email}</span>
                </div>

                <button
                    onClick={logout}
                    className="px-3 py-1 border border-line hover:bg-content hover:text-main transition-colors uppercase cursor-pointer flex items-center gap-1.5"
                >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>{t('common.logout')}</span>
                </button>
            </div>
        </header>
    )
}