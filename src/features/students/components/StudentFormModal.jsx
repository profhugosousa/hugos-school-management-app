import { UserCheck, X } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import useEscapeKey from '../../../hooks/useEscapeKey'

function StudentFormContent({ initialData, onClose, onSubmit }) {
    const { t } = useTranslation()

    // Student core state
    const [name, setName] = useState(initialData?.name || '')
    const [number, setNumber] = useState(initialData?.number || '')
    const [processNumber, setProcessNumber] = useState(initialData?.process_number || '')

    // Extra Info
    const extra = initialData?.extra_info || {}
    const [sen, setSen] = useState(extra.sen || extra.nee || false)
    const [senDetails, setSenDetails] = useState(extra.senDetails || '')
    const [likes, setLikes] = useState(Array.isArray(extra.likes) ? extra.likes.join(', ') : '')
    const [dislikes, setDislikes] = useState(Array.isArray(extra.dislikes) ? extra.dislikes.join(', ') : '')
    const [values, setValues] = useState(Array.isArray(extra.values) ? extra.values.join(', ') : '')

    // Guardian Info State
    const guardian = initialData?.guardian_info || {}
    const [guardianName, setGuardianName] = useState(guardian.name || '')
    const [guardianRelationship, setGuardianRelationship] = useState(guardian.relationship || '')
    const [guardianPhone, setGuardianPhone] = useState(guardian.phone || '')
    const [guardianEmail, setGuardianEmail] = useState(guardian.email || '')

    const handleSubmit = (e) => {
        e.preventDefault()

        const parseList = (str) =>
            str
                .split(',')
                .map((item) => item.trim())
                .filter(Boolean)

        const payload = {
            name,
            number: number ? parseInt(number, 10) : null,
            process_number: processNumber,
            extra_info: {
                sen,
                senDetails: sen ? senDetails : '',
                likes: parseList(likes),
                dislikes: parseList(dislikes),
                values: parseList(values)
            },
            guardian_info: {
                name: guardianName,
                relationship: guardianRelationship,
                phone: guardianPhone,
                email: guardianEmail
            }
        }

        onSubmit(payload)
    }

    return (
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto font-mono text-xs">
            {/* Student Basic Info */}
            <div className="space-y-3">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-accent border-b border-line pb-1">
                    {t('students.form.sections.student', 'Informação do Aluno')}
                </span>

                <div>
                    <label className="block text-muted uppercase mb-1">
                        {t('students.form.nameLabel')} *
                    </label>
                    <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-3 py-1.5 bg-main border border-line text-content focus:outline-none focus:border-accent"
                    />
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="block text-muted uppercase mb-1">
                            {t('students.form.numberLabel')}
                        </label>
                        <input
                            type="number"
                            value={number}
                            onChange={(e) => setNumber(e.target.value)}
                            className="w-full px-3 py-1.5 bg-main border border-line text-content focus:outline-none focus:border-accent"
                        />
                    </div>
                    <div>
                        <label className="block text-muted uppercase mb-1">
                            {t('students.form.processLabel')}
                        </label>
                        <input
                            type="text"
                            value={processNumber}
                            onChange={(e) => setProcessNumber(e.target.value)}
                            className="w-full px-3 py-1.5 bg-main border border-line text-content focus:outline-none focus:border-accent font-bold text-accent"
                        />
                    </div>
                </div>
            </div>

            {/* Guardian Info */}
            <div className="space-y-3 pt-2">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-accent border-b border-line pb-1 flex items-center gap-1.5">
                    <UserCheck className="w-3 h-3" />
                    <span>{t('students.form.sections.guardian', 'Encarregado de Educação')}</span>
                </span>

                <div>
                    <label className="block text-muted uppercase mb-1">
                        {t('students.form.guardianName', 'Nome do Encarregado')}
                    </label>
                    <input
                        type="text"
                        value={guardianName}
                        onChange={(e) => setGuardianName(e.target.value)}
                        className="w-full px-3 py-1.5 bg-main border border-line text-content focus:outline-none focus:border-accent"
                    />
                </div>

                <div className="grid grid-cols-3 gap-3">
                    <div>
                        <label className="block text-muted uppercase mb-1">
                            {t('students.form.guardianRelationship', 'Grau Parentesco')}
                        </label>
                        <input
                            type="text"
                            placeholder="Mãe / Pai / Encarregado"
                            value={guardianRelationship}
                            onChange={(e) => setGuardianRelationship(e.target.value)}
                            className="w-full px-3 py-1.5 bg-main border border-line text-content focus:outline-none focus:border-accent"
                        />
                    </div>
                    <div>
                        <label className="block text-muted uppercase mb-1">
                            {t('students.form.guardianPhone', 'Telefone')}
                        </label>
                        <input
                            type="tel"
                            value={guardianPhone}
                            onChange={(e) => setGuardianPhone(e.target.value)}
                            className="w-full px-3 py-1.5 bg-main border border-line text-content focus:outline-none focus:border-accent"
                        />
                    </div>
                    <div>
                        <label className="block text-muted uppercase mb-1">
                            {t('students.form.guardianEmail', 'Email')}
                        </label>
                        <input
                            type="email"
                            value={guardianEmail}
                            onChange={(e) => setGuardianEmail(e.target.value)}
                            className="w-full px-3 py-1.5 bg-main border border-line text-content focus:outline-none focus:border-accent"
                        />
                    </div>
                </div>
            </div>

            {/* SEN & Behavioral Info */}
            <div className="space-y-3 pt-2">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-accent border-b border-line pb-1">
                    {t('students.form.sections.additional', 'Informações Complementares')}
                </span>

                <div className="p-3 bg-content/5 border border-line space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer text-amber-500 font-bold">
                        <input
                            type="checkbox"
                            checked={sen}
                            onChange={(e) => setSen(e.target.checked)}
                            className="accent-amber-500 cursor-pointer"
                        />
                        <span>{t('students.form.senLabel')}</span>
                    </label>
                    {sen && (
                        <input
                            type="text"
                            value={senDetails}
                            onChange={(e) => setSenDetails(e.target.value)}
                            placeholder={t('students.form.senDetailsLabel')}
                            className="w-full px-3 py-1.5 bg-main border border-line text-content focus:outline-none focus:border-amber-500"
                        />
                    )}
                </div>

                <div>
                    <label className="block text-muted uppercase mb-1">
                        {t('students.form.likesLabel')}
                    </label>
                    <input
                        type="text"
                        value={likes}
                        onChange={(e) => setLikes(e.target.value)}
                        className="w-full px-3 py-1.5 bg-main border border-line text-content focus:outline-none focus:border-accent"
                    />
                </div>

                <div>
                    <label className="block text-muted uppercase mb-1">
                        {t('students.form.dislikesLabel')}
                    </label>
                    <input
                        type="text"
                        value={dislikes}
                        onChange={(e) => setDislikes(e.target.value)}
                        className="w-full px-3 py-1.5 bg-main border border-line text-content focus:outline-none focus:border-accent"
                    />
                </div>

                <div>
                    <label className="block text-muted uppercase mb-1">
                        {t('students.form.valuesLabel', 'Valores')}
                    </label>
                    <input
                        type="text"
                        value={values}
                        onChange={(e) => setValues(e.target.value)}
                        className="w-full px-3 py-1.5 bg-main border border-line text-content focus:outline-none focus:border-accent"
                    />
                </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t border-line">
                <button
                    type="button"
                    onClick={onClose}
                    className="px-3.5 py-2 border border-line text-muted hover:text-content uppercase cursor-pointer transition-colors"
                >
                    {t('students.form.cancel')}
                </button>
                <button
                    type="submit"
                    className="px-3.5 py-2 bg-accent text-main font-bold uppercase cursor-pointer hover:opacity-90 transition-opacity"
                >
                    {t('students.form.save')}
                </button>
            </div>
        </form>
    )
}

export default function StudentFormModal({ isOpen, initialData, onClose, onSubmit }) {
    const { t } = useTranslation()
    useEscapeKey(onClose, isOpen)

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
            <div className="bg-main border border-line shadow-xl w-full max-w-lg font-mono text-xs text-content overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b border-line bg-content/5">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-content">
                        {initialData ? t('students.form.editTitle') : t('students.form.addTitle')}
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-1 text-muted hover:text-content hover:bg-content/10 transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <StudentFormContent
                    key={initialData?.id || 'new-student'}
                    initialData={initialData}
                    onClose={onClose}
                    onSubmit={onSubmit}
                />
            </div>
        </div>
    )
}