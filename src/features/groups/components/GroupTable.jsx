import { ChevronDown, ChevronRight, Edit2, Loader2, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { GroupDetailCard } from './GroupDetailCard'

export const GroupTable = ({ groups = [], activeYearId, loading = false, onEdit, onDelete, onRefresh }) => {
    const { t } = useTranslation()
    const [expandedId, setExpandedId] = useState(null)

    const toggleExpand = (id) => {
        setExpandedId((prev) => (prev === id ? null : id))
    }

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
        <div className="space-y-2.5 font-mono text-xs w-full min-w-0">
            {groups.map((group) => {
                const isExpanded = expandedId === group.id

                return (
                    <div key={group.id} className="w-full min-w-0">
                        {/* Group Card Row */}
                        <div
                            onClick={() => toggleExpand(group.id)}
                            className={`p-3.5 border bg-main transition-all cursor-pointer w-full min-w-0 ${isExpanded
                                ? 'border-accent bg-content/5 ring-1 ring-accent'
                                : 'border-line hover:border-accent/60'
                                }`}
                        >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 min-w-0">
                                {/* Left Group Metadata */}
                                <div className="flex items-center gap-3 min-w-0 flex-1">
                                    <div className="text-muted shrink-0">
                                        {isExpanded ? (
                                            <ChevronDown className="w-4 h-4 text-accent" />
                                        ) : (
                                            <ChevronRight className="w-4 h-4" />
                                        )}
                                    </div>

                                    <div className="flex items-center gap-2 shrink-0">
                                        <span className="px-2 py-0.5 font-bold bg-accent/10 border border-accent/20 text-accent uppercase text-[10px]">
                                            {group.levelName || 'Sem Nível'}
                                        </span>
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <h4 className="font-bold text-content truncate text-sm uppercase">
                                            {group.displayName}
                                        </h4>
                                    </div>
                                </div>

                                {/* Right Actions */}
                                <div
                                    className="flex items-center justify-end gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-line"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <button
                                        onClick={() => onEdit(group)}
                                        className="p-1.5 text-muted hover:text-content hover:bg-content/10 transition-colors cursor-pointer"
                                        title={t('groups.actions.edit', 'Edit Group')}
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => onDelete(group.id)}
                                        className="p-1.5 text-muted hover:text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer"
                                        title={t('groups.actions.delete', 'Delete Group')}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Expanded Group Detail View */}
                        {isExpanded && (
                            <div className="mt-2 w-full min-w-0">
                                <GroupDetailCard
                                    group={group}
                                    activeYearId={activeYearId}
                                    onClose={() => toggleExpand(group.id)}
                                    onEnrolmentChanged={onRefresh}
                                />
                            </div>
                        )}
                    </div>
                )
            })}
        </div>
    )
}