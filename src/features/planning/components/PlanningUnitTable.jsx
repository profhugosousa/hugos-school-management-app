import { Loader2 } from 'lucide-react'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { PlanningUnitTableRow } from './PlanningUnitTableRow'

export function PlanningUnitTable({ units = [], levels = [], groups = [], loading = false, onEdit, onDelete }) {
    const { t } = useTranslation()

    const levelMap = useMemo(() => new Map(levels.map((l) => [l.id, l.name])), [levels])
    const groupMap = useMemo(() => new Map(groups.map((g) => [g.id, g.displayName || g.name])), [groups])

    if (loading) {
        return (
            <div className="p-12 border border-line bg-main flex flex-col items-center justify-center gap-3 text-muted font-mono text-xs">
                <Loader2 className="w-6 h-6 animate-spin text-accent" />
                <span>{t('common.loading', 'A carregar unidades de planificação...')}</span>
            </div>
        )
    }

    if (units.length === 0) {
        return (
            <div className="p-12 border border-line bg-main text-center text-muted font-mono text-xs">
                {t('planning.empty', 'Nenhuma unidade de planificação encontrada.')}
            </div>
        )
    }

    return (
        <div className="border border-line bg-main overflow-x-auto">
            <table className="w-full text-left border-collapse font-mono text-xs">
                <thead>
                    <tr className="border-b border-line bg-content/5 uppercase tracking-wider text-muted select-none">
                        <th className="p-3.5 w-10"></th>
                        <th className="p-3.5">{t('planning.columns.theme', 'Tema / Unidade')}</th>
                        <th className="p-3.5">{t('planning.columns.scope', 'Âmbito / Alvo')}</th>
                        <th className="p-3.5">{t('planning.columns.manual', 'Manual / Páginas')}</th>
                        <th className="p-3.5 text-right">{t('planning.columns.actions', 'Ações')}</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-line">
                    {units.map((unit) => (
                        <PlanningUnitTableRow
                            key={unit.id}
                            unit={unit}
                            levelMap={levelMap}
                            groupMap={groupMap}
                            onEdit={onEdit}
                            onDelete={onDelete}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    )
}