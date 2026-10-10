import { Layers, User, Users } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export function EvaluationBreakdownTables({ summary }) {
    const { t } = useTranslation()
    const [activeTab, setActiveTab] = useState('students') // 'students' | 'groups' | 'levels'

    const renderStudents = () => (
        <div className="overflow-x-auto border border-line">
            <table className="w-full text-left border-collapse font-mono text-xs">
                <thead>
                    <tr className="border-b border-line bg-content/5 uppercase tracking-wider text-muted">
                        <th className="p-3">{t('evaluations.table.student', 'Aluno')}</th>
                        <th className="p-3">{t('evaluations.table.group', 'Turma')}</th>
                        <th className="p-3">{t('evaluations.table.studentAvg', 'Autoavaliação')}</th>
                        <th className="p-3">{t('evaluations.table.teacherAvg', 'Avaliação Professor')}</th>
                        <th className="p-3">{t('evaluations.table.delta', 'Perceção / Diferença')}</th>
                        <th className="p-3 text-right">{t('evaluations.table.attendance', 'Presenças')}</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-line">
                    {summary.studentBreakdown.map((s) => {
                        const deltaVal = parseFloat(s.delta || 0)
                        return (
                            <tr key={s.id} className="hover:bg-content/5 transition-colors">
                                <td className="p-3 font-bold text-content">
                                    {s.name} <span className="text-[10px] text-muted font-normal">(#{s.processNumber})</span>
                                </td>
                                <td className="p-3 text-muted">{s.groupName}</td>
                                <td className="p-3 font-bold text-amber-500">{s.studentAvg} ★</td>
                                <td className="p-3 font-bold text-accent">{s.teacherAvg} ★</td>
                                <td className="p-3">
                                    {s.delta !== '—' ? (
                                        <span className={`px-1.5 py-0.5 text-[10px] font-bold border ${deltaVal > 0
                                            ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30'
                                            : deltaVal < 0
                                                ? 'bg-amber-500/10 text-amber-500 border-amber-500/30'
                                                : 'border-line text-muted'
                                            }`}>
                                            {deltaVal > 0 ? `+${s.delta} (Professor +)` : deltaVal < 0 ? `${s.delta} (Aluno +)` : 'Alinhado'}
                                        </span>
                                    ) : (
                                        '—'
                                    )}
                                </td>
                                <td className="p-3 text-right font-bold text-content">{s.attendanceRate}%</td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    )

    const renderGroups = () => (
        <div className="overflow-x-auto border border-line">
            <table className="w-full text-left border-collapse font-mono text-xs">
                <thead>
                    <tr className="border-b border-line bg-content/5 uppercase tracking-wider text-muted">
                        <th className="p-3">{t('evaluations.table.group', 'Turma')}</th>
                        <th className="p-3">{t('evaluations.table.level', 'Nível')}</th>
                        <th className="p-3">{t('evaluations.table.evalCount', 'Total Registos')}</th>
                        <th className="p-3">{t('evaluations.table.studentAvg', 'Média Autoavaliação')}</th>
                        <th className="p-3">{t('evaluations.table.teacherAvg', 'Média Docente')}</th>
                        <th className="p-3 text-right">{t('evaluations.table.delta', 'Diferença')}</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-line">
                    {summary.groupBreakdown.map((g) => (
                        <tr key={g.id} className="hover:bg-content/5 transition-colors">
                            <td className="p-3 font-bold text-content">{g.name}</td>
                            <td className="p-3 text-muted">{g.levelName}</td>
                            <td className="p-3 text-content">{g.total}</td>
                            <td className="p-3 font-bold text-amber-500">{g.studentAvg} ★</td>
                            <td className="p-3 font-bold text-accent">{g.teacherAvg} ★</td>
                            <td className="p-3 text-right font-bold text-content">{g.delta}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )

    const renderLevels = () => (
        <div className="overflow-x-auto border border-line">
            <table className="w-full text-left border-collapse font-mono text-xs">
                <thead>
                    <tr className="border-b border-line bg-content/5 uppercase tracking-wider text-muted">
                        <th className="p-3">{t('evaluations.table.level', 'Ano / Nível')}</th>
                        <th className="p-3">{t('evaluations.table.evalCount', 'Total Registos')}</th>
                        <th className="p-3">{t('evaluations.table.studentAvg', 'Média Autoavaliação')}</th>
                        <th className="p-3">{t('evaluations.table.teacherAvg', 'Média Docente')}</th>
                        <th className="p-3 text-right">{t('evaluations.table.delta', 'Diferença')}</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-line">
                    {summary.levelBreakdown.map((l) => (
                        <tr key={l.id} className="hover:bg-content/5 transition-colors">
                            <td className="p-3 font-bold text-content">{l.name}</td>
                            <td className="p-3 text-content">{l.total}</td>
                            <td className="p-3 font-bold text-amber-500">{l.studentAvg} ★</td>
                            <td className="p-3 font-bold text-accent">{l.teacherAvg} ★</td>
                            <td className="p-3 text-right font-bold text-content">{l.delta}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )

    return (
        <div className="p-5 border border-line bg-main space-y-4 font-mono text-xs">
            {/* Tab Navigation */}
            <div className="flex items-center gap-2 border-b border-line pb-3">
                <button
                    type="button"
                    onClick={() => setActiveTab('students')}
                    className={`px-3 py-1.5 font-bold uppercase tracking-wider border transition-colors cursor-pointer flex items-center gap-1.5 ${activeTab === 'students'
                        ? 'bg-content text-main border-content'
                        : 'border-line text-muted hover:text-content'
                        }`}
                >
                    <User className="w-3.5 h-3.5" />
                    <span>{t('evaluations.tabs.students', 'Por Aluno')} ({summary.studentBreakdown.length})</span>
                </button>

                <button
                    type="button"
                    onClick={() => setActiveTab('groups')}
                    className={`px-3 py-1.5 font-bold uppercase tracking-wider border transition-colors cursor-pointer flex items-center gap-1.5 ${activeTab === 'groups'
                        ? 'bg-content text-main border-content'
                        : 'border-line text-muted hover:text-content'
                        }`}
                >
                    <Users className="w-3.5 h-3.5" />
                    <span>{t('evaluations.tabs.groups', 'Por Turma')} ({summary.groupBreakdown.length})</span>
                </button>

                <button
                    type="button"
                    onClick={() => setActiveTab('levels')}
                    className={`px-3 py-1.5 font-bold uppercase tracking-wider border transition-colors cursor-pointer flex items-center gap-1.5 ${activeTab === 'levels'
                        ? 'bg-content text-main border-content'
                        : 'border-line text-muted hover:text-content'
                        }`}
                >
                    <Layers className="w-3.5 h-3.5" />
                    <span>{t('evaluations.tabs.levels', 'Por Nível')} ({summary.levelBreakdown.length})</span>
                </button>
            </div>

            {/* Active Tab Content */}
            {activeTab === 'students' && renderStudents()}
            {activeTab === 'groups' && renderGroups()}
            {activeTab === 'levels' && renderLevels()}
        </div>
    )
}