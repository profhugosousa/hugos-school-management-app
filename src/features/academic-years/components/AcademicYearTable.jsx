import { Loader2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { AcademicYearRow } from './AcademicYearRow'

export const AcademicYearTable = ({ years, loading, onEdit, onDelete, onToggleActive }) => {
    const { t } = useTranslation()

    return (
        <div className="border border-line bg-main overflow-x-auto">
            {loading ? (
                <div className="p-12 flex flex-col items-center justify-center gap-3 text-muted font-mono text-xs">
                    <Loader2 className="w-6 h-6 animate-spin text-accent" />
                    <span>{t('academicYears.loading')}</span>
                </div>
            ) : years.length === 0 ? (
                <div className="p-12 text-center text-muted font-mono text-xs">
                    {t('academicYears.empty')}
                </div>
            ) : (
                <table className="w-full text-left border-collapse font-mono text-xs">
                    <thead>
                        <tr className="border-b border-line bg-content/5 uppercase tracking-wider text-muted">
                            <th className="p-3.5">{t('academicYears.columns.label')}</th>
                            <th className="p-3.5">{t('academicYears.columns.startDate')}</th>
                            <th className="p-3.5">{t('academicYears.columns.endDate')}</th>
                            <th className="p-3.5">{t('academicYears.columns.status')}</th>
                            <th className="p-3.5 text-right">{t('academicYears.columns.actions')}</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-line">
                        {years.map((year) => (
                            <AcademicYearRow
                                key={year.id}
                                year={year}
                                onEdit={onEdit}
                                onDelete={onDelete}
                                onToggleActive={onToggleActive}
                            />
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    )
}