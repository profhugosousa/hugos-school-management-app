import { CheckCircle, X } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { RichTextEditor } from '../../../components/common/RichTextEditor'
import { Button } from '../../../components/ui/Button'
import { Input } from '../../../components/ui/Input'
import { Select } from '../../../components/ui/Select'
import useEscapeKey from '../../../hooks/useEscapeKey'

export function PlanningUnitFormModal({
    isOpen,
    initialData = null,
    levels = [],
    groups = [],
    submitting = false,
    onClose,
    onSubmit
}) {
    const { t } = useTranslation()
    useEscapeKey(onClose, isOpen)

    const [prevProps, setPrevProps] = useState({ initialData, isOpen })
    const [formData, setFormData] = useState(() => ({
        theme: initialData?.theme || '',
        scopeType: initialData?.groupId ? 'group' : initialData?.levelId ? 'level' : 'global',
        levelId: initialData?.levelId || '',
        groupId: initialData?.groupId || '',
        manualPages: initialData?.manualPages || '',
        activities: initialData?.activities || '',
        resourcesPhysical: initialData?.resourcesPhysical || '',
        resourcesDigital: initialData?.resourcesDigital || '',
        exercisesPhysical: initialData?.exercisesPhysical || '',
        exercisesDigital: initialData?.exercisesDigital || '',
        registers: initialData?.registers || ''
    }))

    // React-recommended pattern: adjust state during render when props change
    if (prevProps.initialData !== initialData || prevProps.isOpen !== isOpen) {
        setPrevProps({ initialData, isOpen })
        setFormData({
            theme: initialData?.theme || '',
            scopeType: initialData?.groupId ? 'group' : initialData?.levelId ? 'level' : 'global',
            levelId: initialData?.levelId || '',
            groupId: initialData?.groupId || '',
            manualPages: initialData?.manualPages || '',
            activities: initialData?.activities || '',
            resourcesPhysical: initialData?.resourcesPhysical || '',
            resourcesDigital: initialData?.resourcesDigital || '',
            exercisesPhysical: initialData?.exercisesPhysical || '',
            exercisesDigital: initialData?.exercisesDigital || '',
            registers: initialData?.registers || ''
        })
    }

    if (!isOpen) return null

    const handleSubmit = (e) => {
        e.preventDefault()

        const payload = {
            theme: formData.theme,
            manualPages: formData.manualPages,
            activities: formData.activities,
            resourcesPhysical: formData.resourcesPhysical,
            resourcesDigital: formData.resourcesDigital,
            exercisesPhysical: formData.exercisesPhysical,
            exercisesDigital: formData.exercisesDigital,
            registers: formData.registers,
            levelId: formData.scopeType === 'level' ? formData.levelId : null,
            groupId: formData.scopeType === 'group' ? formData.groupId : null
        }

        onSubmit(payload)
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 font-mono text-xs">
            <div className="bg-main border border-line shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh]">
                <div className="flex items-center justify-between p-4 border-b border-line bg-content/5">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-content">
                        {initialData
                            ? t('planning.form.editTitle', 'Editar Unidade de Planificação')
                            : t('planning.form.createTitle', 'Nova Unidade de Planificação')}
                    </h3>
                    <button onClick={onClose} className="p-1 text-muted hover:text-content transition-colors cursor-pointer">
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto flex-1">
                    <div>
                        <Input
                            required
                            label={t('planning.form.theme', 'Tema / Nome da Unidade *')}
                            value={formData.theme}
                            onChange={(e) => setFormData((p) => ({ ...p, theme: e.target.value }))}
                            placeholder="ex: Unidade 1 — Algoritmos e Programação"
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Select
                            label={t('planning.form.scopeType', 'Âmbito de Aplicação')}
                            value={formData.scopeType}
                            onChange={(e) => setFormData((p) => ({ ...p, scopeType: e.target.value }))}
                        >
                            <option value="global">{t('planning.scope.global', 'Geral (Ano Letivo)')}</option>
                            <option value="level">{t('planning.scope.level', 'Ano / Nível Específico')}</option>
                            <option value="group">{t('planning.scope.group', 'Turma Específica')}</option>
                        </Select>

                        {formData.scopeType === 'level' && (
                            <Select
                                required
                                label={t('planning.form.levelSelect', 'Selecione o Nível *')}
                                value={formData.levelId}
                                onChange={(e) => setFormData((p) => ({ ...p, levelId: e.target.value }))}
                            >
                                <option value="">-- Escolher Nível --</option>
                                {levels.map((lvl) => (
                                    <option key={lvl.id} value={lvl.id}>
                                        {lvl.name}
                                    </option>
                                ))}
                            </Select>
                        )}

                        {formData.scopeType === 'group' && (
                            <Select
                                required
                                label={t('planning.form.groupSelect', 'Selecione a Turma *')}
                                value={formData.groupId}
                                onChange={(e) => setFormData((p) => ({ ...p, groupId: e.target.value }))}
                            >
                                <option value="">-- Escolher Turma --</option>
                                {groups.map((grp) => (
                                    <option key={grp.id} value={grp.id}>
                                        {grp.displayName || grp.name}
                                    </option>
                                ))}
                            </Select>
                        )}
                    </div>

                    <RichTextEditor
                        label={t('planning.form.manualPages', 'Manual / Páginas')}
                        value={formData.manualPages}
                        onChange={(html) => setFormData((p) => ({ ...p, manualPages: html }))}
                        placeholder="Páginas do manual ou livro de texto..."
                    />

                    <RichTextEditor
                        label={t('planning.form.activities', 'Atividades e Tarefas')}
                        value={formData.activities}
                        onChange={(html) => setFormData((p) => ({ ...p, activities: html }))}
                        placeholder="Descrição detalhada das atividades curriculares..."
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <RichTextEditor
                            label={t('planning.form.resPhysical', 'Recursos Físicos')}
                            value={formData.resourcesPhysical}
                            onChange={(html) => setFormData((p) => ({ ...p, resourcesPhysical: html }))}
                            placeholder="Fichas, robôs, material de laboratório..."
                        />
                        <RichTextEditor
                            label={t('planning.form.resDigital', 'Recursos Digitais')}
                            value={formData.resourcesDigital}
                            onChange={(html) => setFormData((p) => ({ ...p, resourcesDigital: html }))}
                            placeholder="Links, vídeos, simulações, Scratch..."
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <RichTextEditor
                            label={t('planning.form.exPhysical', 'Exercícios Físicos')}
                            value={formData.exercisesPhysical}
                            onChange={(html) => setFormData((p) => ({ ...p, exercisesPhysical: html }))}
                            placeholder="Caderno de atividades, folhas de exercícios..."
                        />
                        <RichTextEditor
                            label={t('planning.form.exDigital', 'Exercícios Digitais')}
                            value={formData.exercisesDigital}
                            onChange={(html) => setFormData((p) => ({ ...p, exercisesDigital: html }))}
                            placeholder="Quizzes, plataformas online, jogos interativos..."
                        />
                    </div>

                    <RichTextEditor
                        label={t('planning.form.registers', 'Observações / Registos')}
                        value={formData.registers}
                        onChange={(html) => setFormData((p) => ({ ...p, registers: html }))}
                        placeholder="Notas pedagógicas e observações sobre a unidade..."
                    />

                    <div className="flex justify-end gap-3 pt-4 border-t border-line">
                        <Button variant="outline" type="button" onClick={onClose} disabled={submitting}>
                            {t('common.modals.cancel', 'Cancelar')}
                        </Button>
                        <Button variant="primary" type="submit" loading={submitting}>
                            <CheckCircle className="w-3.5 h-3.5" />
                            <span>{t('common.modals.save', 'Guardar')}</span>
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}