import { Calendar, Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { PageHeader } from '../../../components/common/PageHeader'
import { Button } from '../../../components/ui/Button'



export const AcademicYearHeader = ({ count, onAddYear }) => {
    const { t } = useTranslation()

    return (
        <PageHeader
            icon={Calendar}
            title={t('academicYears.title', 'Academic Years')}
            count={count}
            subtitle={t('academicYears.subtitle', 'Manage school academic calendar terms, dates, and active status.')}
            actions={
                <Button onClick={onAddYear} className="flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    <span>{t('academicYears.actions.add', 'New Academic Year')}</span>
                </Button>
            }
        />
    )

}