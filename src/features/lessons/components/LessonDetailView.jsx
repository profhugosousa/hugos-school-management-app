import { Edit2, MonitorPlay, Share, Trash2 } from 'lucide-react'
import { RichText } from '../../../components/common/RichTextEditor'
import { useFormatters } from '../../../hooks/useFormatters'

export const LessonDetailView = ({
    lesson,
    onStudentView,
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
        <div className="space-y-6">
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
                <button
                    onClick={() => onStudentView(lesson)}
                    className="px-4 py-2 bg-accent text-white hover:bg-accent/90 transition-colors uppercase font-bold flex items-center gap-2 cursor-pointer"
                >
                    <MonitorPlay className="w-4 h-4" />
                    {t('lessons.actions.studentView', 'Student View')}
                </button>
                <button
                    onClick={() => onEdit(lesson)}
                    className="px-4 py-2 border border-line bg-main hover:bg-content hover:text-main text-content transition-colors uppercase flex items-center gap-2 cursor-pointer"
                >
                    <Edit2 className="w-4 h-4" />
                    {t('lessons.actions.edit', 'Edit')}
                </button>
                <button
                    onClick={() => onExport(lesson)}
                    className="px-4 py-2 border border-line bg-main hover:bg-content hover:text-main text-content transition-colors uppercase flex items-center gap-2 cursor-pointer"
                >
                    <Share className="w-4 h-4" />
                    {t('lessons.actions.export', 'Export')}
                </button>
                <div className="flex-1" />
                <button
                    onClick={() => onDelete(lesson.id)}
                    className="px-4 py-2 border border-red-500/30 text-red-500 hover:bg-red-500 hover:text-white transition-colors uppercase flex items-center gap-2 cursor-pointer"
                >
                    <Trash2 className="w-4 h-4" />
                    {t('lessons.actions.delete', 'Delete')}
                </button>
            </div>
        </div>
    )
}