import { Loader2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { GroupTableRow } from './GroupTableRow'

export const GroupTable = ({ groups, loading, onEdit, onDelete }) => {
    const { t } = useTranslation()

    if (loading) {
        return (
            <div className="p-12 border border-line bg-main flex flex-col items-center justify-center gap-3 text-muted font-mono text-xs">
                <Loader2 className="w-6 h-6 animate-spin text-accent" />
                <span>{t('groups.loading', 'Loading groups...')}</span>
            </div>
        )
    }

    if (groups.length === 0) {
        return (
            <div className="p-12 border border-line bg-main text-center text-muted font-mono text-xs">
                {t('groups.empty', 'No groups found.')}
            </div>
        )
    }

    return (
        <div className="border border-line bg-main overflow-x-auto">
            <table className="w-full text-left border-collapse font-mono text-xs">
                <thead>
                    <tr className="border-b border-line bg-content/5 uppercase tracking-wider text-muted select-none">
                        <th className="p-3.5">{t('groups.columns.level', 'Level')}</th>
                        <th className="p-3.5">{t('groups.columns.name', 'Group Name')}</th>
                        <th className="p-3.5">{t('groups.columns.displayName', 'Display Label')}</th>
                        <th className="p-3.5 text-right">{t('groups.columns.actions', 'Actions')}</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-line">
                    {groups.map((group) => (
                        <GroupTableRow
                            key={group.id}
                            group={group}
                            onEdit={onEdit}
                            onDelete={onDelete}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    )
}