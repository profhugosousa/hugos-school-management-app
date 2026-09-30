import { Plus, Users } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { PageHeader } from '../../../components/common/PageHeader'
import { Button } from '../../../components/ui/Button'

export const GroupHeader = ({ count, onAddGroup }) => {
    const { t } = useTranslation()

    return (
        <PageHeader
            icon={Users}
            title={t('groups.title', 'Groups & Classes')}
            count={count}
            subtitle={t('groups.subtitle', 'Manage student groups and academic level assignments.')}
            actions={
                <Button onClick={onAddGroup} className="flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    <span>{t('groups.actions.add', 'New Group')}</span>
                </Button>
            }
        />
    )
}