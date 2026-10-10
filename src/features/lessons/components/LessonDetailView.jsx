import { Award, Edit2, MonitorPlay, Share, Trash2 } from 'lucide-react'
import { RichText } from '../../../components/common/RichTextEditor'
import { Button } from '../../../components/ui/Button'
import { useFormatters } from '../../../hooks/useFormatters'

export const LessonDetailView = ({
    lesson,
    onStudentView,
    onEvaluate,
    onEdit,
    onExport,
    onDelete
}) => {
    const { hasContent, formatHtmlContent, t } = useFormatters()

    const summary = lesson.summary
    const attentionBox = lesson.attention_box || lesson.attentionBox
    const stepByStep = lesson.step_by_step || lesson.stepByStep
    const materials = lesson.materials
    const teacherNotes = lesson.teacher_notes || lesson.teacherNotes

    return (
        <div className="space-y-6 font-mono text-xs">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-4">
                    <div>
                        <h4 className="font-bold uppercase tracking-wider text-muted mb-2">
                            {t('lessons.details.summary', 'Summary')}
                        </h4>
                        <div className="bg-main border border-line p-4">
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
                            <div className="bg-yellow-500/10 border border-yellow-500/30 p-4">
                                <RichText html={formatHtmlContent(attentionBox)} />
                            </div>
                        </div>
                    )}

                    {hasContent(stepByStep) && (
                        <div>
                            <h4 className="font-bold uppercase tracking-wider text-muted mb-2">
                                {t('lessons.details.stepByStep', 'Step-by-Step Plan')}
                            </h4>
                            <div className="bg-main border border-line p-4">
                                <RichText html={formatHtmlContent(stepByStep)} />
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                    {hasContent(materials) && (
                        <div>
                            <h4 className="font-bold uppercase tracking-wider text-muted mb-2">
                                {t('lessons.details.materials', 'Materials & Resources')}
                            </h4>
                            <div className="bg-main border border-line p-4">
                                <RichText html={formatHtmlContent(materials)} />
                            </div>
                        </div>
                    )}

                    {hasContent(teacherNotes) && (
                        <div>
                            <h4 className="font-bold uppercase tracking-wider text-muted mb-2">
                                {t('lessons.details.notes', 'Teacher Notes')}
                            </h4>
                            <div className="bg-main border border-line p-4">
                                <RichText html={formatHtmlContent(teacherNotes)} />
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Action Toolbar */}
            <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-line/50">
                <Button
                    variant="primary"
                    onClick={() => onEvaluate(lesson)}
                    className="border-accent/60 bg-accent/10 hover:bg-accent hover:text-white text-accent"
                >
                    <Award className="w-4 h-4" />
                    <span>{t('lessons.actions.evaluate', 'Avaliação')}</span>
                </Button>

                <Button
                    variant="secondary"
                    onClick={() => onStudentView(lesson)}
                    className="bg-accent text-white hover:bg-accent/90"
                >
                    <MonitorPlay className="w-4 h-4" />
                    <span>{t('lessons.actions.studentView', 'Student View')}</span>
                </Button>

                <Button
                    variant="outline"
                    onClick={() => onEdit(lesson)}
                >
                    <Edit2 className="w-4 h-4" />
                    <span>{t('lessons.actions.edit', 'Edit')}</span>
                </Button>

                <Button
                    variant="outline"
                    onClick={() => onExport(lesson)}
                >
                    <Share className="w-4 h-4" />
                    <span>{t('lessons.actions.export', 'Export')}</span>
                </Button>

                <div className="flex-1" />

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