import { Plus, Users } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '../../../components/ui/Button'

export const GroupHeader = ({ count, onAddGroup }) => {
    const { t } = useTranslation()

    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-line">
            <div>
                <div className="flex items-center gap-2">
                    <Users className="w-6 h-6 text-accent" />
                    <h1 className="text-xl font-bold uppercase tracking-wider font-mono">
                        {t('groups.title', 'Groups & Classes')}
                    </h1>
                    <span className="px-2 py-0.5 text-xs font-mono bg-accent/10 text-accent border border-accent/20">
                        {count}
                    </span>
                </div>
                <p className="text-xs text-muted font-mono mt-1">
                    {t('groups.subtitle', 'Manage student groups and academic level assignments.')}
                </p>
            </div>

            <Button onClick={onAddGroup} className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                <span>{t('groups.actions.add', 'New Group')}</span>
            </Button>
        </div>
    )
}