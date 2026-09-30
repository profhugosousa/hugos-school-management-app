import { ArrowUpDown } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export const LessonTableHeader = ({ sortField, sortDirection, onToggleSort }) => {
    const { t } = useTranslation()

    return (
        <thead>
            <tr className="border-b border-line bg-content/5 uppercase tracking-wider text-muted select-none">
                <th className="p-3.5 w-10"></th>
                <th
                    className="p-3.5 cursor-pointer hover:text-content"
                    onClick={() => onToggleSort('number')}
                >
                    <span className="inline-flex items-center gap-1">
                        {t('lessons.columns.number', 'No.')}
                        <ArrowUpDown className={`w-3 h-3 ${sortField === 'number' ? 'text-accent' : ''}`} />
                        {sortField === 'number' && (
                            <span className="text-[10px]">{sortDirection.toUpperCase()}</span>
                        )}
                    </span>
                </th>
                <th className="p-3.5">{t('lessons.columns.subject', 'Subject')}</th>
                <th className="p-3.5">{t('lessons.columns.group', 'Group')}</th>
                <th
                    className="p-3.5 cursor-pointer hover:text-content"
                    onClick={() => onToggleSort('date')}
                >
                    <span className="inline-flex items-center gap-1">
                        {t('lessons.columns.date', 'Date')}
                        <ArrowUpDown className={`w-3 h-3 ${sortField === 'date' ? 'text-accent' : ''}`} />
                        {sortField === 'date' && (
                            <span className="text-[10px]">{sortDirection.toUpperCase()}</span>
                        )}
                    </span>
                </th>
                <th className="p-3.5">{t('lessons.columns.time', 'Time')}</th>
            </tr>
        </thead>
    )
}