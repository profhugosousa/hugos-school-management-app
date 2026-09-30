import { Filter, ToggleLeft, ToggleRight } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { DateFilterInput } from '../../../components/ui/DateFilterInput'
import { Input } from '../../../components/ui/Input'
import { Select } from '../../../components/ui/Select'
import { SUBJECTS } from '../../../constants/subjects'

export const LessonFilters = ({ filters, setFilters, groups = [] }) => {
    const { t } = useTranslation()
    const [isRangeMode, setIsRangeMode] = useState(false)

    const handleChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }))
    }

    const toggleDateMode = () => {
        setIsRangeMode(!isRangeMode)
        setFilters(prev => ({ ...prev, dateStart: '', dateEnd: '', singleDate: '' }))
    }

    return (
        <div className="bg-main border border-line p-4 space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-line pb-3">
                <div className="flex items-center gap-2 text-content font-bold uppercase tracking-wider">
                    <Filter className="w-4 h-4 text-accent" />
                    {t('lessons.filters.title', 'Filter Lessons')}
                </div>

                <button
                    type="button"
                    onClick={toggleDateMode}
                    className="flex items-center gap-2 text-xs text-muted hover:text-content transition-colors cursor-pointer"
                >
                    {isRangeMode ? <ToggleRight className="w-5 h-5 text-accent" /> : <ToggleLeft className="w-5 h-5 text-muted" />}
                    <span>{isRangeMode ? t('lessons.filters.rangeMode', 'Date Range') : t('lessons.filters.singleMode', 'Single Date')}</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
                <Input
                    label={t('lessons.filters.searchLabel', 'Search')}
                    placeholder={t('lessons.filters.search', 'Search text content...')}
                    value={filters.searchTerm || ''}
                    onChange={(e) => handleChange('searchTerm', e.target.value)}
                />

                <Select
                    label={t('lessons.filters.group', 'Group')}
                    value={filters.groupId || ''}
                    onChange={(e) => handleChange('groupId', e.target.value)}
                >
                    <option value="">{t('lessons.filters.allGroups', 'All Groups')}</option>
                    {groups.map((group) => (
                        <option key={group.id} value={group.id}>
                            {group.displayName || group.name || group.id}
                        </option>
                    ))}
                </Select>

                <Select
                    label={t('lessons.filters.subject', 'Subject')}
                    value={filters.subject || ''}
                    onChange={(e) => handleChange('subject', e.target.value)}
                >
                    <option value="">{t('lessons.filters.allSubjects', 'All Subjects')}</option>
                    {SUBJECTS.map((subj) => (
                        <option key={subj.value} value={subj.value}>
                            {t(subj.labelKey, subj.value)}
                        </option>
                    ))}
                </Select>

                <DateFilterInput
                    isRangeMode={isRangeMode}
                    singleLabel={t('lessons.filters.date', 'Lesson Date')}
                    rangeLabel={t('lessons.filters.dateRange', 'Date Range')}
                    singleDate={filters.singleDate}
                    dateStart={filters.dateStart}
                    dateEnd={filters.dateEnd}
                    onChangeSingle={(e) => handleChange('singleDate', e.target.value)}
                    onChangeStart={(e) => handleChange('dateStart', e.target.value)}
                    onChangeEnd={(e) => handleChange('dateEnd', e.target.value)}
                />
            </div>
        </div>
    )
}