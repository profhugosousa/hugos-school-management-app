import { Loader2, X } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { RichTextEditor } from '../../../components/common/RichTextEditor'
import { Button } from '../../../components/ui/Button'
import { Input } from '../../../components/ui/Input'
import { Select } from '../../../components/ui/Select'
import { SUBJECTS } from '../../../constants/subjects'
import { useEscapeKey } from '../../../hooks/useEscapeKey'


export const LessonFormModal = ({ isOpen, onClose, onSubmit, initialData, groups = [], submitting }) => {
    const { t } = useTranslation()
    const date = new Date()
    const groupMap = new Map(groups.map(g => [g.id, g.displayName || g.name || g.id]))


    const [formData, setFormData] = useState({
        group_id: initialData?.group_id || '',
        subject: initialData?.subject || '',
        lesson_date: initialData?.lesson_date || date.toISOString().split('T')[0],
        lesson_time: initialData?.lesson_time || date.toTimeString().slice(0, 5),
        duration: initialData?.duration || '45',
        summary: initialData?.summary || '',
        attention_box: initialData?.attention_box || '',
        teacher_notes: initialData?.teacher_notes || '',
        step_by_step: initialData?.step_by_step || '',
        materials: initialData?.materials || ''
    })

    useEscapeKey(onClose, isOpen)

    if (!isOpen) return null

    const handleSubmit = (e) => {
        e.preventDefault()
        onSubmit(formData)
    }

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-main border border-line w-full max-w-3xl my-8 p-6 space-y-6 shadow-xl font-mono text-xs max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between border-b border-line pb-4 sticky top-0 bg-main z-10">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-content">
                        {initialData ? t('lessons.modal.editTitle', 'Edit Lesson') : t('lessons.modal.createTitle', 'Create Lesson')}
                    </h3>
                    <button type="button" onClick={onClose} className="p-1 border border-line text-muted hover:text-content transition-colors cursor-pointer">
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Primary Data Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Select
                            required
                            label={`${t('lessons.modal.group', 'Group')} *`}
                            value={formData.group_id}
                            onChange={(e) => setFormData({ ...formData, group_id: e.target.value })}
                        >
                            <option value="">{t('lessons.modal.selectGroup', 'Select Group')}</option>
                            {groups.map((group) => (
                                <option key={group.id} value={group.id}>
                                    {groupMap.get(group.id) || group.name || group.id}
                                </option>
                            ))}
                        </Select>

                        <Select
                            required
                            label={`${t('lessons.modal.subject', 'Subject')} *`}
                            value={formData.subject}
                            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        >
                            <option value="">{t('lessons.modal.selectSubject', 'Select Subject')}</option>
                            {SUBJECTS.map((subj) => (
                                <option key={subj.value} value={subj.value}>
                                    {t(subj.labelKey, subj.value)}
                                </option>
                            ))}
                        </Select>
                    </div>

                    {/* Schedule Row */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Input
                            type="date"
                            label={t('lessons.modal.date', 'Date')}
                            value={formData.lesson_date}
                            onChange={(e) => setFormData({ ...formData, lesson_date: e.target.value })}
                        />
                        <Input
                            type="time"
                            label={t('lessons.modal.time', 'Start Time')}
                            value={formData.lesson_time}
                            onChange={(e) => setFormData({ ...formData, lesson_time: e.target.value })}
                        />
                        <Select
                            label={t('lessons.modal.duration', 'Duration')}
                            value={formData.duration}
                            onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                        >
                            <option value="45">45 min</option>
                            <option value="50">50 min</option>
                            <option value="90">90 min</option>
                            <option value="100">100 min</option>
                        </Select>
                    </div>

                    {/* Formatted Text Fields */}
                    <RichTextEditor
                        label={t('lessons.modal.summary', 'Summary / Overview')}
                        value={formData.summary}
                        onChange={(val) => setFormData({ ...formData, summary: val })}
                    />

                    <RichTextEditor
                        label={t('lessons.modal.attention', 'Attention Box')}
                        value={formData.attention_box}
                        onChange={(val) => setFormData({ ...formData, attention_box: val })}
                    />

                    <RichTextEditor
                        label={t('lessons.modal.stepByStep', 'Step-by-Step Plan')}
                        value={formData.step_by_step}
                        onChange={(val) => setFormData({ ...formData, step_by_step: val })}
                    />

                    <RichTextEditor
                        label={t('lessons.modal.materials', 'Materials / Resources')}
                        value={formData.materials}
                        onChange={(val) => setFormData({ ...formData, materials: val })}
                    />

                    <RichTextEditor
                        label={t('lessons.modal.notes', 'Teacher Notes')}
                        value={formData.teacher_notes}
                        onChange={(val) => setFormData({ ...formData, teacher_notes: val })}
                    />

                    {/* Footer Actions */}
                    <div className="flex justify-end gap-3 pt-4 border-t border-line sticky bottom-0 bg-main">
                        <Button type="button" variant="secondary" onClick={onClose}>
                            {t('lessons.modal.cancel', 'Cancel')}
                        </Button>
                        <Button type="submit" disabled={submitting}>
                            {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                            <span>{t('lessons.modal.save', 'Save Lesson')}</span>
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}