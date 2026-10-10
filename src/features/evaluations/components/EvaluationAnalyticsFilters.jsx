import { Filter, ToggleLeft, ToggleRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { DateFilterInput } from '../../../components/ui/DateFilterInput'
import { Input } from '../../../components/ui/Input'
import { Select } from '../../../components/ui/Select'

export function EvaluationAnalyticsFilters({
    searchTerm,
    onSearchChange,
    selectedLevel,
    onLevelChange,
    selectedGroup,
    onGroupChange,
    selectedStudent,
    onStudentChange,
    isRangeMode,
    onToggleRangeMode,
    singleDate,
    onSingleDateChange,
    dateStart,
    onDateStartChange,
    dateEnd,
    onDateEndChange,
    levels = [],
    groups = [],
    students = []
}) {
    const { t } = useTranslation()

    return (
        <div className="bg-main border border-line p-4 space-y-4 font-mono text-xs">
            {/* Header Toolbar */}
            <div className="flex items-center justify-between border-b border-line pb-3">
                <div className="flex items-center gap-2 text-content font-bold uppercase tracking-wider">
                    <Filter className="w-4 h-4 text-accent" />
                    <span>{t('evaluations.analytics.filterTitle', 'Filtrar Avaliações')}</span>
                </div>

                <button
                    type="button"
                    onClick={onToggleRangeMode}
                    className="flex items-center gap-2 text-xs text-muted hover:text-content transition-colors cursor-pointer"
                >
                    {isRangeMode ? (
                        <ToggleRight className="w-5 h-5 text-accent" />
                    ) : (
                        <ToggleLeft className="w-5 h-5 text-muted" />
                    )}
                    <span>
                        {isRangeMode
                            ? t('evaluations.analytics.rangeMode', 'Intervalo de Datas')
                            : t('evaluations.analytics.singleMode', 'Data Única')}
                    </span>
                </button>
            </div>

            {/* Filter Controls Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-start">
                <Input
                    label={t('evaluations.analytics.searchLabel', 'Pesquisar')}
                    type="text"
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder={t('evaluations.analytics.searchPlaceholder', 'Pesquisar aluno, processo, nota...')}
                />

                <Select
                    label={t('evaluations.analytics.levelLabel', 'Nível')}
                    value={selectedLevel}
                    onChange={(e) => onLevelChange(e.target.value)}
                >
                    <option value="">{t('evaluations.analytics.allLevels', 'Todos os Níveis')}</option>
                    {levels.map((lvl) => (
                        <option key={lvl.id} value={lvl.id}>
                            {lvl.name}
                        </option>
                    ))}
                </Select>

                <Select
                    label={t('evaluations.analytics.groupLabel', 'Turma')}
                    value={selectedGroup}
                    onChange={(e) => onGroupChange(e.target.value)}
                >
                    <option value="">{t('evaluations.analytics.allGroups', 'Todas as Turmas')}</option>
                    {groups.map((grp) => (
                        <option key={grp.id} value={grp.id}>
                            {grp.displayName || grp.name}
                        </option>
                    ))}
                </Select>

                <Select
                    label={t('evaluations.analytics.studentLabel', 'Aluno')}
                    value={selectedStudent}
                    onChange={(e) => onStudentChange(e.target.value)}
                >
                    <option value="">{t('evaluations.analytics.allStudents', 'Todos os Alunos')}</option>
                    {students.map((st) => (
                        <option key={st.id} value={st.id}>
                            {st.name} ({st.process_number || '—'})
                        </option>
                    ))}
                </Select>

                <DateFilterInput
                    isRangeMode={isRangeMode}
                    singleLabel={t('evaluations.analytics.singleDateLabel', 'Data da Aula')}
                    rangeLabel={t('evaluations.analytics.rangeDateLabel', 'Intervalo de Datas')}
                    singleDate={singleDate}
                    dateStart={dateStart}
                    dateEnd={dateEnd}
                    onChangeSingle={(e) => onSingleDateChange(e.target.value)}
                    onChangeStart={(e) => onDateStartChange(e.target.value)}
                    onChangeEnd={(e) => onDateEndChange(e.target.value)}
                />
            </div>
        </div>
    )
}