import { Edit2, Trash2, Users } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export const GroupTableRow = ({ group, onEdit, onDelete }) => {
    const { t } = useTranslation()

    return (
        <tr className="hover:bg-content/5 transition-colors">
            <td className="p-3.5 font-bold text-content">
                <span className="inline-flex items-center gap-2">
                    <Users className="w-3.5 h-3.5 text-accent" />
                    {group.levelName || '—'}
                </span>
            </td>
            <td className="p-3.5 text-content">{group.name || '—'}</td>
            <td className="p-3.5 font-mono text-accent font-bold">{group.displayName}</td>
            <td className="p-3.5 text-right">
                <div className="flex items-center justify-end gap-2">
                    <button
                        onClick={() => onEdit(group)}
                        className="p-1.5 hover:bg-content/10 text-muted hover:text-content transition-colors cursor-pointer"
                        title={t('groups.actions.edit', 'Edit Group')}
                    >
                        <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                        onClick={() => onDelete(group.id)}
                        className="p-1.5 hover:bg-red-500/10 text-muted hover:text-red-500 transition-colors cursor-pointer"
                        title={t('groups.actions.delete', 'Delete Group')}
                    >
                        <Trash2 className="w-3.5 h-3.5" />
                    </button>
                </div>
            </td>
        </tr>
    )
}