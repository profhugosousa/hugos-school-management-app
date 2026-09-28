import { Calendar, Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export const AcademicYearHeader = ({ onAddClick }) => {
    const { t } = useTranslation()

    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-line p-4 sm:p-6 bg-main">
            <div>
                <h1 className="text-xl font-bold uppercase tracking-tight text-content flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-accent" />
                    {t('academicYears.title')}
                </h1>
                <p className="text-xs text-muted font-mono mt-1">
                    {t('academicYears.subtitle')}
                </p>
            </div>

            <button
                onClick={onAddClick}
                className="px-4 py-2 border border-line bg-content text-main hover:bg-transparent hover:text-content transition-colors font-mono text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
            >
                <Plus className="w-4 h-4" />
                <span>{t('academicYears.add')}</span>
            </button>
        </div>
    )
}