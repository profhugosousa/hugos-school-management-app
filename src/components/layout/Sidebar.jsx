import { BookOpen, Calendar, GraduationCap, Users } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export const Sidebar = () => {
    const { t } = useTranslation()

    const navItems = [
        { label: t('nav.students'), icon: Users, active: true },
        { label: t('nav.lessons'), icon: BookOpen },
        { label: t('nav.planning'), icon: Calendar },
        { label: t('nav.evaluations'), icon: GraduationCap },
    ]

    return (
        <aside className="w-56 border-r border-line p-4 hidden md:block bg-main">
            <nav className="space-y-1">
                {navItems.map((item) => {
                    const Icon = item.icon
                    return (
                        <button
                            key={item.label}
                            className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer border ${item.active
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
    )
}