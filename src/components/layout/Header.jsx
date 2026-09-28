import { Languages, LogOut, Menu, Moon, Sun, User, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../../hooks/useAuth'
import { useSidebar } from '../../hooks/useSidebar'
import { useTheme } from '../../hooks/useTheme'

export const Header = () => {
    const { user, logout } = useAuth()
    const { theme, toggleTheme } = useTheme()
    const { isOpen, toggleSidebar } = useSidebar()
    const { t, i18n } = useTranslation()

    const toggleLanguage = () => {
        const nextLang = i18n.language === 'pt' ? 'en' : 'pt'
        i18n.changeLanguage(nextLang)
    }

    return (
        <header className="h-14 border-b border-line px-4 sm:px-6 flex items-center justify-between bg-main sticky top-0 z-30">

            {/* Left: Hamburger Toggle & Brand */}
            <div className="flex items-center gap-3">
                <button
                    onClick={toggleSidebar}
                    aria-label="Toggle Navigation"
                    className="md:hidden p-1.5 border border-line hover:bg-content hover:text-main transition-colors cursor-pointer text-muted"
                >
                    {isOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
                </button>

                <span className="text-xs font-mono tracking-widest text-accent uppercase truncate max-w-[140px] sm:max-w-none">
                    {t('nav.brand')}
                </span>
            </div>

            {/* Right: Controls & Actions */}
            <div className="flex items-center gap-2 sm:gap-4 text-xs font-mono">

                {/* Theme Switcher */}
                <button
                    onClick={toggleTheme}
                    title="Toggle Theme"
                    className="p-1.5 border border-line hover:bg-content hover:text-main transition-colors cursor-pointer text-muted"
                >
                    {theme === 'dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
                </button>

                {/* Language Switcher */}
                <button
                    onClick={toggleLanguage}
                    className="px-2 py-1 border border-line hover:bg-content hover:text-main transition-colors uppercase cursor-pointer flex items-center gap-1 text-muted hover:text-main"
                >
                    <Languages className="w-3.5 h-3.5" />
                    <span>{i18n.language.toUpperCase()}</span>
                </button>

                <div className="hidden sm:block h-4 w-px bg-line" />

                {/* User Email (Hidden on Mobile) */}
                <div className="hidden md:flex items-center gap-1.5 text-muted">
                    <User className="w-3.5 h-3.5 text-accent" />
                    <span className="truncate max-w-[160px]">{user?.email}</span>
                </div>

                {/* Logout (Adaptive: Icon-only on mobile, full label on desktop) */}
                <button
                    onClick={logout}
                    title={t('common.logout')}
                    className="px-2.5 sm:px-3 py-1 border border-line hover:bg-content hover:text-main transition-colors uppercase cursor-pointer flex items-center gap-1.5"
                >
                    <LogOut className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">{t('common.logout')}</span>
                </button>
            </div>
        </header>
    )
}