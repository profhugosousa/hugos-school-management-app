import { AlertCircle, Loader2 } from 'lucide-react'
import { ActiveYearWarningBanner } from '../../components/common/ActiveYearWarningBanner'
import { useEvaluationAnalytics } from '../../hooks/useEvaluationAnalytics'

import { EvaluationAnalyticsFilters } from './components/EvaluationAnalyticsFilters'
import { EvaluationAnalyticsHeader } from './components/EvaluationAnalyticsHeader'
import { EvaluationBreakdownTables } from './components/EvaluationBreakdownTables'
import { EvaluationSummaryKPIs } from './components/EvaluationSummaryKPIs'
import { EvaluationTrendChart } from './components/EvaluationTrendChart'

export function EvaluationsPage() {
    const {
        loading,
        error,
        levels,
        groups,
        students,
        searchTerm,
        setSearchTerm,
        selectedLevel,
        setSelectedLevel,
        selectedGroup,
        setSelectedGroup,
        selectedStudent,
        setSelectedStudent,
        isRangeMode,
        setIsRangeMode,
        singleDate,
        setSingleDate,
        dateStart,
        setDateStart,
        dateEnd,
        setDateEnd,
        analyticsSummary,
        refresh
    } = useEvaluationAnalytics()

    const handleToggleDateMode = () => {
        setIsRangeMode(!isRangeMode)
        setSingleDate('')
        setDateStart('')
        setDateEnd('')
    }

    return (
        <div className="space-y-6 p-6 font-mono text-xs">
            <ActiveYearWarningBanner />

            <EvaluationAnalyticsHeader
                count={analyticsSummary.totalEvaluations}
                onRefresh={refresh}
            />

            <EvaluationAnalyticsFilters
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                selectedLevel={selectedLevel}
                onLevelChange={setSelectedLevel}
                selectedGroup={selectedGroup}
                onGroupChange={setSelectedGroup}
                selectedStudent={selectedStudent}
                onStudentChange={setSelectedStudent}
                isRangeMode={isRangeMode}
                onToggleRangeMode={handleToggleDateMode}
                singleDate={singleDate}
                onSingleDateChange={setSingleDate}
                dateStart={dateStart}
                onDateStartChange={setDateStart}
                dateEnd={dateEnd}
                onDateEndChange={setDateEnd}
                levels={levels}
                groups={groups}
                students={students}
            />

            {error && (
                <div className="p-4 border border-red-500/50 bg-red-500/10 text-red-500 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                </div>
            )}

            {loading ? (
                <div className="p-16 border border-line bg-main flex flex-col items-center justify-center gap-3 text-muted font-mono">
                    <Loader2 className="w-6 h-6 animate-spin text-accent" />
                    <span>A calcular análises e estatísticas de avaliações...</span>
                </div>
            ) : (
                <div className="space-y-6">
                    <EvaluationSummaryKPIs summary={analyticsSummary} />

                    <EvaluationTrendChart timeline={analyticsSummary.trendTimeline} />

                    <EvaluationBreakdownTables summary={analyticsSummary} />
                </div>
            )}
        </div>
    )
}

export default EvaluationsPage