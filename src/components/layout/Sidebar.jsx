import { BookOpen, Calendar, GraduationCap, Users } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useSidebar } from '../../hooks/useSidebar'

export const Sidebar = () => {
    const { t } = useTranslation()
    const { isOpen, closeSidebar } = useSidebar()

    const navItems = [
        { label: t('nav.students'), icon: Users, active: true },
        { label: t('nav.lessons'), icon: BookOpen },
        { label: t('nav.planning'), icon: Calendar },
        { label: t('nav.evaluations'), icon: GraduationCap },
    ]

    return (
        <>
            {/* Mobile Backdrop Overlay */}
            {isOpen && (
                <div
                    onClick={closeSidebar}
                    className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity"
                />
            )}

            {/* Navigation Drawer */}
            <aside
                className={`
          fixed md:static inset-y-0 left-0 z-50 w-64 md:w-56 bg-main border-r border-line p-4
          transform transition-transform duration-200 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0
        `}
            >
                <nav className="space-y-1 mt-12 md:mt-0">
                    {navItems.map((item) => {
                        const Icon = item.icon
                        return (
                            <button
                                key={item.label}
                                onClick={closeSidebar}
                                className={`w-full flex items-center gap-3 px-3 py-2.5 text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer border ${item.active
                                    ? 'border-line bg-content/5 text-content font-bold'
                                    : 'border-transparent text-muted hover:text-content hover:border-line/50'
                                    }`}
                            >
                                <Icon className="w-4 h-4 text-accent" />
                                <span>{item.label}</span>
                            </button>
                        )
                    })}
                </nav>
            </aside>
        </>
    )
}