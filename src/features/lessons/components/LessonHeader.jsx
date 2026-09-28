import { BookOpen, Calendar, FileUp, Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export const LessonHeader = ({ activeYear, onAddClick, onImportClick }) => {
    const { t } = useTranslation()

    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-line p-4 sm:p-6 bg-main">
            <div>
                <div className="flex items-center gap-3">
                    <h1 className="text-xl font-bold uppercase tracking-tight text-content flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-accent" />
                        {t('lessons.title')}
                    </h1>
                    {activeYear && (
                        <span className="px-2 py-0.5 border border-accent/50 bg-accent/10 text-accent font-mono text-[10px] uppercase flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {activeYear.label}
                        </span>
                    )}
                </div>
                <p className="text-xs text-muted font-mono mt-1">
                    {t('lessons.subtitle')}
                </p>
            </div>

            <div className="flex items-center gap-2">
                <button
                    onClick={onImportClick}
                    className="px-3 py-2 border border-line hover:border-content/50 text-content font-mono text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-colors"
                >
                    <FileUp className="w-4 h-4 text-accent" />
                    <span>{t('lessons.import')}</span>
                </button>

                <button
                    onClick={onAddClick}
                    className="px-4 py-2 border border-line bg-content text-main hover:bg-transparent hover:text-content transition-colors font-mono text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer"
                >
                    <Plus className="w-4 h-4" />
                    <span>{t('lessons.add')}</span>
                </button>
            </div>
        </div>
    )
}