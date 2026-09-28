import { AlertTriangle, ArrowRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useActiveAcademicYear } from '../../hooks/useActiveAcademicYear'

export const ActiveYearWarningBanner = ({ onViewChange }) => {
    const { activeYear, loading } = useActiveAcademicYear()
    const { t } = useTranslation()

    if (loading || activeYear) return null

    return (
        <div className="bg-amber-500/10 border-b border-amber-500/30 text-amber-400 p-3 px-6 sm:px-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 font-mono text-xs shrink-0">
            <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-amber-500" />
                <span>
                    <strong className="uppercase">{t('activeYear.warningTitle')}:</strong> {t('activeYear.noActiveWarning')}
                </span>
            </div>
            {onViewChange && (
                <button
                    onClick={() => onViewChange('academic-years')}
                    className="px-2.5 py-1 border border-amber-500/50 hover:bg-amber-500 hover:text-black transition-colors uppercase text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                >
                    <span>{t('activeYear.configureNow')}</span>
                    <ArrowRight className="w-3 h-3" />
                </button>
            )}
        </div>
    )
}