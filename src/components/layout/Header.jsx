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
        <header className="border-b border-line bg-header text-nav-content sticky top-0 z-30 transition-colors">
            <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <span className="text-xs font-mono tracking-widest text-accent uppercase truncate font-bold">
                        {t('nav.brand')}
                    </span>
                </div>

                <div className="flex items-center gap-2 sm:gap-4 text-xs font-mono">
                    <button
                        onClick={toggleTheme}
                        title="Toggle Theme"
                        className="p-1.5 border border-line/40 hover:border-line hover:bg-content/10 transition-colors cursor-pointer text-nav-content"
                    >
                        {theme === 'dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
                    </button>

                    <button
                        onClick={toggleLanguage}
                        className="px-2 py-1 border border-line/40 hover:border-line hover:bg-content/10 transition-colors uppercase cursor-pointer flex items-center gap-1 text-nav-content"
                    >
                        <Languages className="w-3.5 h-3.5" />
                        <span>{i18n.language.toUpperCase()}</span>
                    </button>

                    <div className="hidden sm:block h-4 w-px bg-line/40" />

                    <div className="hidden md:flex items-center gap-1.5 text-nav-content/80">
                        <User className="w-3.5 h-3.5 text-accent" />
                        <span className="truncate max-w-[160px]">{user?.email}</span>
                    </div>

                    <button
                        onClick={logout}
                        title={t('common.logout')}
                        className="px-2.5 sm:px-3 py-1 border border-line/40 hover:border-line hover:bg-content/10 transition-colors uppercase cursor-pointer flex items-center gap-1.5 text-nav-content"
                    >
                        <LogOut className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">{t('common.logout')}</span>
                    </button>
                </div>
            </div>
        </header>
    )
}