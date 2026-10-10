import { Book, ChevronDown, ChevronRight, Edit2, FileText, Laptop, Layers, Trash2 } from 'lucide-react'
import { Fragment, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { RichText } from '../../../components/common/RichTextEditor'
import { Button } from '../../../components/ui/Button'
import { useFormatters } from '../../../hooks/useFormatters'

export function PlanningUnitTableRow({ unit, levelMap, groupMap, onEdit, onDelete }) {
    const { t } = useTranslation()
    const { hasContent, formatHtmlContent } = useFormatters()
    const [expanded, setExpanded] = useState(false)

    const groupName = unit.groupId ? groupMap.get(unit.groupId) : null
    const levelName = unit.levelId ? levelMap.get(unit.levelId) : null

    const scopeLabel = groupName
        ? `Turma: ${groupName}`
        : levelName
            ? `Nível: ${levelName}`
            : t('planning.scope.global', 'Geral / Ano Letivo')

    return (
        <Fragment>
            <tr
                onClick={() => setExpanded(!expanded)}
                className={`hover:bg-content/5 transition-colors cursor-pointer font-mono text-xs ${expanded ? 'bg-content/5' : ''
                    }`}
            >
                <td className="p-3.5 text-muted w-10">
                    {expanded ? <ChevronDown className="w-4 h-4 text-accent" /> : <ChevronRight className="w-4 h-4" />}
                </td>

                <td className="p-3.5 font-bold text-content">{unit.theme}</td>

                <td className="p-3.5 text-muted">
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 border border-line bg-content/5 text-content text-[11px] font-semibold">
                        <Layers className="w-3 h-3 text-accent" />
                        {scopeLabel}
                    </span>
                </td>

                <td className="p-3.5 text-muted">
                    {hasContent(unit.manualPages) ? (
                        <RichText html={formatHtmlContent(unit.manualPages)} />
                    ) : (
                        '—'
                    )}
                </td>

                <td className="p-3.5 text-right">
                    <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" className="p-1.5 h-auto" onClick={() => onEdit(unit)}>
                            <Edit2 className="w-3.5 h-3.5" />
                        </Button>
                        <Button variant="ghost" className="p-1.5 h-auto text-red-500 hover:text-red-600" onClick={() => onDelete(unit.id)}>
                            <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                    </div>
                </td>
            </tr>

            {expanded && (
                <tr className="bg-content/5 border-b border-line font-mono text-xs">
                    <td colSpan={5} className="p-6 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Activities & Registers */}
                            <div className="space-y-3">
                                <div>
                                    <h5 className="font-bold uppercase tracking-wider text-accent mb-1 flex items-center gap-1.5">
                                        <FileText className="w-3.5 h-3.5" />
                                        {t('planning.details.activities', 'Atividades')}
                                    </h5>
                                    <div className="p-3 bg-main border border-line text-content">
                                        {hasContent(unit.activities) ? (
                                            <RichText html={formatHtmlContent(unit.activities)} />
                                        ) : (
                                            <span className="text-muted italic">
                                                {t('common.noData', 'Sem informação')}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <h5 className="font-bold uppercase tracking-wider text-muted mb-1">
                                        {t('planning.details.registers', 'Registos')}
                                    </h5>
                                    <div className="p-3 bg-main border border-line text-content">
                                        {hasContent(unit.registers) ? (
                                            <RichText html={formatHtmlContent(unit.registers)} />
                                        ) : (
                                            <span className="text-muted italic">
                                                {t('common.noData', 'Sem informação')}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Resources & Exercises */}
                            <div className="space-y-3">
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <h5 className="font-bold uppercase text-[10px] text-muted mb-1 flex items-center gap-1">
                                            <Book className="w-3 h-3" /> {t('planning.details.resPhysical', 'Rec. Físicos')}
                                        </h5>
                                        <div className="p-2.5 bg-main border border-line text-content">
                                            {hasContent(unit.resourcesPhysical) ? (
                                                <RichText html={formatHtmlContent(unit.resourcesPhysical)} />
                                            ) : (
                                                '—'
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <h5 className="font-bold uppercase text-[10px] text-muted mb-1 flex items-center gap-1">
                                            <Laptop className="w-3 h-3" /> {t('planning.details.resDigital', 'Rec. Digitais')}
                                        </h5>
                                        <div className="p-2.5 bg-main border border-line text-content">
                                            {hasContent(unit.resourcesDigital) ? (
                                                <RichText html={formatHtmlContent(unit.resourcesDigital)} />
                                            ) : (
                                                '—'
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <h5 className="font-bold uppercase text-[10px] text-muted mb-1">
                                            {t('planning.details.exPhysical', 'Ex. Físicos')}
                                        </h5>
                                        <div className="p-2.5 bg-main border border-line text-content">
                                            {hasContent(unit.exercisesPhysical) ? (
                                                <RichText html={formatHtmlContent(unit.exercisesPhysical)} />
                                            ) : (
                                                '—'
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <h5 className="font-bold uppercase text-[10px] text-muted mb-1">
                                            {t('planning.details.exDigital', 'Ex. Digitais')}
                                        </h5>
                                        <div className="p-2.5 bg-main border border-line text-content">
                                            {hasContent(unit.exercisesDigital) ? (
                                                <RichText html={formatHtmlContent(unit.exercisesDigital)} />
                                            ) : (
                                                '—'
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </td>
                </tr>
            )}
        </Fragment>
    )
}