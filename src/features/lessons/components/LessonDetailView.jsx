import { Award, Download, Edit2, ExternalLink, MonitorPlay, Share, Trash2 } from 'lucide-react'
import { RichText } from '../../../components/common/RichTextEditor'
import { Button } from '../../../components/ui/Button'
import { useFormatters } from '../../../hooks/useFormatters'
import { useNotification } from '../../../hooks/useNotification'

export const LessonDetailView = ({
    lesson,
    onStudentView,
    onEvaluate,
    onEdit,
    onExport,
    onImportContent,
    onDelete
}) => {
    const { hasContent, formatHtmlContent, t } = useFormatters()
    const { showSuccess } = useNotification()

    const summary = lesson.summary
    const attentionBox = lesson.attention_box || lesson.attentionBox
    const stepByStep = lesson.step_by_step || lesson.stepByStep
    const materials = lesson.materials
    const teacherNotes = lesson.teacher_notes || lesson.teacherNotes

    const handleCopyToInovar = () => {
        const tempDiv = document.createElement('div')
        tempDiv.innerHTML = formatHtmlContent(summary)
        const plainSummary = tempDiv.textContent || tempDiv.innerText || ''

        if (plainSummary.trim()) {
            navigator.clipboard.writeText(plainSummary.trim())
            showSuccess(t('lessons.inovar.copied', 'Sumário copiado para a área de transferência!'))
        }

        window.open('https://aedonamaria.inovarmais.com/Alunos/Inicial.wgx', '_blank', 'noopener,noreferrer')
    }

    return (
        <div className="space-y-6 font-mono text-xs w-full min-w-0">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 w-full min-w-0">
                {/* Left Column */}
                <div className="space-y-4 min-w-0">
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <h4 className="font-bold uppercase tracking-wider text-muted">
                                {t('lessons.details.summary', 'Summary')}
                            </h4>
                            {hasContent(summary) && (
                                <button
                                    type="button"
                                    onClick={handleCopyToInovar}
                                    className="flex items-center gap-1 text-[11px] font-bold text-accent hover:underline cursor-pointer"
                                >
                                    <ExternalLink className="w-3 h-3" />
                                    <span>{t('lessons.actions.copyInovar', 'Inovar')}</span>
                                </button>
                            )}
                        </div>
                        <div className="bg-main border border-line p-4 min-w-0">
                            {hasContent(summary) ? (
                                <RichText html={formatHtmlContent(summary)} />
                            ) : (
                                <p className="text-muted italic">
                                    {t('lessons.details.noSummary', 'No summary provided.')}
                                </p>
                            )}
                        </div>
                    </div>

                    {hasContent(attentionBox) && (
                        <div>
                            <h4 className="font-bold uppercase tracking-wider text-yellow-600 mb-2">
                                {t('lessons.details.attention', 'Attention Box')}
                            </h4>
                            <div className="bg-yellow-500/10 border border-yellow-500/30 p-4 min-w-0">
                                <RichText html={formatHtmlContent(attentionBox)} />
                            </div>
                        </div>
                    )}

                    {hasContent(stepByStep) && (
                        <div>
                            <h4 className="font-bold uppercase tracking-wider text-muted mb-2">
                                {t('lessons.details.stepByStep', 'Step-by-Step Plan')}
                            </h4>
                            <div className="bg-main border border-line p-4 min-w-0">
                                <RichText html={formatHtmlContent(stepByStep)} />
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Column */}
                <div className="space-y-4 min-w-0">
                    {hasContent(materials) && (
                        <div>
                            <h4 className="font-bold uppercase tracking-wider text-muted mb-2">
                                {t('lessons.details.materials', 'Materials & Resources')}
                            </h4>
                            <div className="bg-main border border-line p-4 min-w-0">
                                <RichText html={formatHtmlContent(materials)} />
                            </div>
                        </div>
                    )}

                    {hasContent(teacherNotes) && (
                        <div>
                            <h4 className="font-bold uppercase tracking-wider text-muted mb-2">
                                {t('lessons.details.notes', 'Teacher Notes')}
                            </h4>
                            <div className="bg-main border border-line p-4 min-w-0">
                                <RichText html={formatHtmlContent(teacherNotes)} />
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Visual Button Hierarchy */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 pt-4 border-t border-line/50">
                {/* Primary Action */}
                <Button
                    variant="primary"
                    onClick={() => onEvaluate(lesson)}
                >
                    <Award className="w-4 h-4" />
                    <span>{t('lessons.actions.evaluate', 'Avaliação')}</span>
                </Button>

                {/* Secondary Action */}
                <Button
                    variant="secondary"
                    onClick={() => onStudentView(lesson)}
                >
                    <MonitorPlay className="w-4 h-4" />
                    <span>{t('lessons.actions.studentView', 'Student View')}</span>
                </Button>

                {/* Utility Actions */}
                <Button
                    variant="outline"
                    onClick={handleCopyToInovar}
                >
                    <ExternalLink className="w-4 h-4 text-accent" />
                    <span>{t('lessons.actions.copyInovar', 'Inovar')}</span>
                </Button>

                <Button
                    variant="outline"
                    onClick={() => onImportContent(lesson)}
                >
                    <Download className="w-4 h-4" />
                    <span>{t('lessons.actions.importContent', 'Importar')}</span>
                </Button>

                <Button
                    variant="outline"
                    onClick={() => onExport(lesson)}
                >
                    <Share className="w-4 h-4" />
                    <span>{t('lessons.actions.export', 'Exportar')}</span>
                </Button>

                <Button
                    variant="outline"
                    onClick={() => onEdit(lesson)}
                >
                    <Edit2 className="w-4 h-4" />
                    <span>{t('lessons.actions.edit', 'Edit')}</span>
                </Button>

                <div className="flex-1 min-w-[20px]" />

                {/* Destructive Action */}
                <Button
                    variant="danger"
                    onClick={() => onDelete(lesson.id)}
                >
                    <Trash2 className="w-4 h-4" />
                    <span>{t('lessons.actions.delete', 'Delete')}</span>
                </Button>
            </div>
        </div>
    )
}