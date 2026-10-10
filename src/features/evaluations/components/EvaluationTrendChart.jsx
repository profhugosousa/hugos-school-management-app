import { TrendingUp } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export function EvaluationTrendChart({ timeline = [] }) {
    const { t } = useTranslation()
    const [hoveredIndex, setHoveredIndex] = useState(null)

    if (!timeline.length) {
        return (
            <div className="p-12 border border-line bg-main text-center text-muted font-mono text-xs">
                {t('evaluations.analytics.noChartData', 'Sem dados suficientes para gerar gráfico de tendência.')}
            </div>
        )
    }

    // Dimensions
    const height = 220
    const width = 800
    const padding = 35

    const pointsCount = timeline.length
    const xStep = pointsCount > 1 ? (width - padding * 2) / (pointsCount - 1) : 0

    // Rating range 1 to 5
    const getY = (val) => {
        if (!val) return height - padding
        return height - padding - ((val - 1) / 4) * (height - padding * 2)
    }

    // Build SVG path string
    const buildPath = (key) => {
        return timeline
            .map((pt, idx) => {
                const val = pt[key]
                if (val === null) return ''
                const x = padding + idx * xStep
                const y = getY(val)
                return `${idx === 0 ? 'M' : 'L'} ${x} ${y}`
            })
            .filter(Boolean)
            .join(' ')
    }

    const studentPath = buildPath('studentAvg')
    const teacherPath = buildPath('teacherAvg')

    const activePoint = hoveredIndex !== null ? timeline[hoveredIndex] : null

    return (
        <div className="p-5 border border-line bg-main space-y-4 font-mono text-xs">
            {/* Title & Legend */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-line pb-3">
                <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-accent" />
                    <h4 className="font-bold uppercase tracking-wider text-content">
                        {t('evaluations.analytics.chartTitle', 'Evolução Temporal das Avaliações')}
                    </h4>
                </div>

                <div className="flex items-center gap-4 text-[11px] font-bold">
                    <div className="flex items-center gap-1.5">
                        <span className="w-3 h-3 bg-amber-400 rounded-full" />
                        <span className="text-content">{t('evaluations.analytics.studentLine', 'Autoavaliação (Aluno)')}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span className="w-3 h-3 bg-accent rounded-full" />
                        <span className="text-content">{t('evaluations.analytics.teacherLine', 'Docente')}</span>
                    </div>
                </div>
            </div>

            {/* SVG Chart Container */}
            <div className="relative w-full overflow-x-auto">
                <svg
                    viewBox={`0 0 ${width} ${height}`}
                    className="w-full h-auto min-w-[600px] overflow-visible"
                >
                    {/* Horizontal Grid Lines for Levels 1..5 */}
                    {[1, 2, 3, 4, 5].map((lvl) => {
                        const y = getY(lvl)
                        return (
                            <g key={lvl}>
                                <line
                                    x1={padding}
                                    y1={y}
                                    x2={width - padding}
                                    y2={y}
                                    stroke="currentColor"
                                    className="text-line/60"
                                    strokeDasharray="3 3"
                                />
                                <text
                                    x={padding - 10}
                                    y={y + 4}
                                    textAnchor="end"
                                    className="fill-muted text-[10px] font-mono"
                                >
                                    {lvl}★
                                </text>
                            </g>
                        )
                    })}

                    {/* Student Trend Line (Amber) */}
                    {studentPath && (
                        <path
                            d={studentPath}
                            fill="none"
                            stroke="#f59e0b"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                        />
                    )}

                    {/* Teacher Trend Line (Accent / Blue) */}
                    {teacherPath && (
                        <path
                            d={teacherPath}
                            fill="none"
                            stroke="var(--color-accent, #3b82f6)"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                        />
                    )}

                    {/* Interactive Points */}
                    {timeline.map((pt, idx) => {
                        const x = padding + idx * xStep
                        const sY = getY(pt.studentAvg)
                        const tY = getY(pt.teacherAvg)
                        const isHovered = hoveredIndex === idx

                        return (
                            <g key={idx} className="cursor-pointer">
                                {/* Invisible hover bar */}
                                <rect
                                    x={x - 12}
                                    y={padding}
                                    width={24}
                                    height={height - padding * 2}
                                    fill="transparent"
                                    onMouseEnter={() => setHoveredIndex(idx)}
                                />

                                {isHovered && (
                                    <line
                                        x1={x}
                                        y1={padding}
                                        x2={x}
                                        y2={height - padding}
                                        stroke="currentColor"
                                        className="text-accent/50"
                                        strokeDasharray="2 2"
                                    />
                                )}

                                {/* Student Dot */}
                                {pt.studentAvg && (
                                    <circle
                                        cx={x}
                                        cy={sY}
                                        r={isHovered ? 5 : 3.5}
                                        fill="#f59e0b"
                                        className="transition-all"
                                    />
                                )}

                                {/* Teacher Dot */}
                                {pt.teacherAvg && (
                                    <circle
                                        cx={x}
                                        cy={tY}
                                        r={isHovered ? 5 : 3.5}
                                        fill="var(--color-accent, #3b82f6)"
                                        className="transition-all"
                                    />
                                )}

                                {/* X-Axis Date Label */}
                                <text
                                    x={x}
                                    y={height - 10}
                                    textAnchor="middle"
                                    className={`fill-muted text-[9px] font-mono ${isHovered ? 'fill-content font-bold' : ''}`}
                                >
                                    {pt.date.slice(5)}
                                </text>
                            </g>
                        )
                    })}
                </svg>

                {/* Tooltip Popup */}
                {activePoint && (
                    <div className="mt-2 p-2.5 border border-line bg-content/10 flex flex-wrap items-center justify-between gap-3 text-[11px] font-bold">
                        <div>
                            <span className="text-muted">{t('evaluations.analytics.date', 'Data')}: </span>
                            <span className="text-content">{activePoint.date}</span>
                            <span className="text-muted ml-2">({activePoint.count} registos)</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-amber-500">
                                Aluno: {activePoint.studentAvg || '—'} ★
                            </span>
                            <span className="text-accent">
                                Professor: {activePoint.teacherAvg || '—'} ★
                            </span>
                            {activePoint.studentAvg && activePoint.teacherAvg && (
                                <span className="text-content border-l border-line pl-3">
                                    Diferença: {(activePoint.teacherAvg - activePoint.studentAvg).toFixed(2)}
                                </span>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}