import { Filter, Search } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Input } from '../../../components/ui/Input'
import { Select } from '../../../components/ui/Select'

export function PlanningUnitFilters({
    searchTerm,
    onSearchChange,
    selectedLevel,
    onLevelChange,
    selectedGroup,
    onGroupChange,
    levels = [],
    groups = []
}) {
    const { t } = useTranslation()

    return (
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 bg-main border border-line font-mono text-xs">
            <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted z-10 pointer-events-none" />
                <Input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder={t('planning.filters.search', 'Pesquisar tema, atividades, manuais...')}
                    className="pl-9 font-mono"
                />
            </div>

            <div className="flex flex-1 sm:flex-initial items-center gap-2">
                <div className="relative flex-1 sm:w-48">
                    <Filter className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted z-10 pointer-events-none" />
                    <Select
                        value={selectedLevel}
                        onChange={(e) => onLevelChange(e.target.value)}
                        className="pl-8 font-mono appearance-none"
                    >
                        <option value="">{t('planning.filters.allLevels', 'Todos os Níveis')}</option>
                        {levels.map((lvl) => (
                            <option key={lvl.id} value={lvl.id}>
                                {lvl.name}
                            </option>
                        ))}
                    </Select>
                </div>

                <div className="relative flex-1 sm:w-48">
                    <Filter className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted z-10 pointer-events-none" />
                    <Select
                        value={selectedGroup}
                        onChange={(e) => onGroupChange(e.target.value)}
                        className="pl-8 font-mono appearance-none"
                    >
                        <option value="">{t('planning.filters.allGroups', 'Todas as Turmas')}</option>
                        {groups.map((grp) => (
                            <option key={grp.id} value={grp.id}>
                                {grp.displayName || grp.name}
                            </option>
                        ))}
                    </Select>
                </div>
            </div>
        </div>
    )
}