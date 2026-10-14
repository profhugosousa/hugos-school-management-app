import { BookOpen, Calendar, CalendarDays, GraduationCap, Layers, Users } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export const Navbar = ({ currentView = 'lessons', onViewChange }) => {
    const { t } = useTranslation()

    const navItems = [
        { id: 'students', label: t('nav.students', 'Alunos'), icon: Users },
        { id: 'lessons', label: t('nav.lessons', 'Aulas'), icon: BookOpen },
        { id: 'planning', label: t('nav.planning', 'Planos'), icon: Calendar },
        { id: 'evaluations', label: t('nav.evaluations', 'Avaliações'), icon: GraduationCap },
        { id: 'groups', label: t('nav.groups', 'Turmas'), icon: Layers },
        { id: 'academic-years', label: t('nav.academicYears', 'Anos Lectivos'), icon: CalendarDays }
    ]

    return (
        <>
            {/* MOBILE: Fixed Bottom Bar */}
            <nav className="sm:hidden fixed bottom-0 inset-x-0 bg-nav text-nav-content border-t border-line z-40 h-16 flex items-center justify-around px-2 shadow-lg transition-colors">
                {navItems.map((item) => {
                    const Icon = item.icon
                    const isActive = currentView === item.id

                    return (
                        <button
                            key={item.id}
                            onClick={() => onViewChange?.(item.id)}
                            title={item.label}
                            className={`flex flex-col items-center justify-center w-full h-full py-1 text-[10px] font-mono transition-colors cursor-pointer ${isActive
                                ? 'text-accent font-bold border-t-2 border-accent -mt-[2px]'
                                : 'text-nav-content/70 hover:text-nav-content'
                                }`}
                        >
                            <Icon className="w-5 h-5 mb-0.5" />
                            <span className="truncate max-w-[50px]">{item.label}</span>
                        </button>
                    )
                })}
            </nav>

            {/* TABLET / DESKTOP: Top Nav Bar */}
            <nav className="hidden sm:block bg-nav text-nav-content border-b border-line font-mono text-xs transition-colors">
                <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center gap-1 overflow-x-auto">
                    {navItems.map((item) => {
                        const Icon = item.icon
                        const isActive = currentView === item.id

                        return (
                            <button
                                key={item.id}
                                onClick={() => onViewChange?.(item.id)}
                                title={item.label}
                                className={`flex items-center gap-2 px-3 py-1.5 border transition-all cursor-pointer uppercase tracking-wider ${isActive
                                    ? 'border-accent bg-accent/15 text-nav-content font-bold shadow-xs'
                                    : 'border-transparent text-nav-content/70 hover:text-nav-content hover:border-line/40'
                                    }`}
                            >
                                <Icon className="w-4 h-4 text-accent shrink-0" />
                                <span className="whitespace-nowrap">{item.label}</span>
                            </button>
                        )
                    })}
                </div>
            </nav>
        </>
    )
}