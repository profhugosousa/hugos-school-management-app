import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '../../../components/ui/Button'
import { Input } from '../../../components/ui/Input'
import { Select } from '../../../components/ui/Select'
import { useEscapeKey } from '../../../hooks/useEscapeKey'

export const GroupFormModal = ({ isOpen, onClose, onSubmit, initialData = null, levels = [] }) => {
    const { t } = useTranslation()
    const [name, setName] = useState(initialData?.name || '')
    const [levelId, setLevelId] = useState(initialData?.levelId || levels[0]?.id || '')
    const [submitting, setSubmitting] = useState(false)

    useEscapeKey(onClose, isOpen)

    if (!isOpen) return null

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!name.trim()) return

        setSubmitting(true)
        const success = await onSubmit({ name: name.trim(), levelId })
        setSubmitting(false)

        if (success) onClose()
    }

    return (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-main border border-line w-full max-w-md p-6 font-mono text-xs space-y-6">
                <div className="border-b border-line pb-3">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-content">
                        {initialData
                            ? t('groups.form.editTitle', 'Edit Group')
                            : t('groups.form.createTitle', 'Create New Group')}
                    </h3>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block uppercase text-muted mb-1 font-bold">
                            {t('groups.form.levelLabel', 'Academic Level')}
                        </label>
                        <Select
                            value={levelId}
                            onChange={(e) => setLevelId(e.target.value)}
                            required
                        >
                            <option value="" disabled>
                                {t('groups.form.selectLevel', 'Select a level')}
                            </option>
                            {levels.map((lvl) => (
                                <option key={lvl.id} value={lvl.id}>
                                    {lvl.name}
                                </option>
                            ))}
                        </Select>
                    </div>

                    <div>
                        <label className="block uppercase text-muted mb-1 font-bold">
                            {t('groups.form.nameLabel', 'Group / Class Identifier')}
                        </label>
                        <Input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder={t('groups.form.namePlaceholder', 'e.g. Class A or 10º A')}
                            required
                            autoFocus
                        />
                    </div>

                    <div className="flex justify-end items-center gap-3 pt-4 border-t border-line">
                        <Button type="button" variant="outline" onClick={onClose} disabled={submitting}>
                            {t('common.cancel', 'Cancel')}
                        </Button>
                        <Button type="submit" disabled={submitting || !name.trim()}>
                            {submitting
                                ? t('common.saving', 'Saving...')
                                : initialData
                                    ? t('common.update', 'Update')
                                    : t('common.create', 'Create')}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}