import { AlertCircle, Award, BookOpen, Plus, ShieldAlert } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export const StudentIncidentLog = ({ incidents = [], onAddIncident }) => {
    const { t } = useTranslation()
    const [isAdding, setIsAdding] = useState(false)
    const [incidentType, setIncidentType] = useState('pedagogical')
    const [description, setDescription] = useState('')
    const [incidentDate, setIncidentDate] = useState(new Date().toISOString().split('T')[0])

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!description.trim()) return

        if (onAddIncident) {
            await onAddIncident({
                incident_type: incidentType,
                description,
                incident_date: incidentDate
            })
        }

        setDescription('')
        setIsAdding(false)
    }

    const getTypeBadge = (type) => {
        switch (type) {
            case 'praise':
                return {
                    icon: Award,
                    style: 'bg-amber-500/10 text-amber-500 border-amber-500/30',
                    label: t('students.incidents.types.praise')
                }
            case 'behavioral':
                return {
                    icon: ShieldAlert,
                    style: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
                    label: t('students.incidents.types.behavioral')
                }
            case 'warning':
                return {
                    icon: AlertCircle,
                    style: 'bg-rose-500/10 text-rose-500 border-rose-500/30',
                    label: t('students.incidents.types.warning')
                }
            default:
                return {
                    icon: BookOpen,
                    style: 'bg-accent/10 text-accent border-accent/30',
                    label: t('students.incidents.types.pedagogical')
                }
        }
    }

    return (
        <div className="p-3 sm:p-4 bg-main border border-line font-mono text-xs space-y-3 sm:space-y-4 w-full max-w-full min-w-0 overflow-hidden">
            <div className="flex items-center justify-between min-w-0">
                <h4 className="font-bold text-content uppercase tracking-wider truncate">
                    {t('students.incidents.title')}
                </h4>
                {!isAdding && (
                    <button
                        onClick={() => setIsAdding(true)}
                        className="inline-flex items-center text-xs font-bold text-accent hover:underline cursor-pointer shrink-0"
                    >
                        <Plus className="w-3.5 h-3.5 mr-1" />
                        {t('students.incidents.addIncident')}
                    </button>
                )}
            </div>

            {/* Add New Form */}
            {isAdding && (
                <form onSubmit={handleSubmit} className="p-3 bg-content/5 border border-line space-y-3 w-full max-w-full min-w-0">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div>
                            <label className="block text-[10px] font-bold uppercase text-muted mb-1">
                                {t('students.incidents.type')}
                            </label>
                            <select
                                value={incidentType}
                                onChange={(e) => setIncidentType(e.target.value)}
                                className="w-full text-xs p-1.5 border border-line bg-main text-content focus:outline-none focus:border-accent"
                            >
                                <option value="praise">{t('students.incidents.types.praise')}</option>
                                <option value="pedagogical">{t('students.incidents.types.pedagogical')}</option>
                                <option value="behavioral">{t('students.incidents.types.behavioral')}</option>
                                <option value="warning">{t('students.incidents.types.warning')}</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold uppercase text-muted mb-1">
                                {t('students.incidents.date')}
                            </label>
                            <input
                                type="date"
                                value={incidentDate}
                                onChange={(e) => setIncidentDate(e.target.value)}
                                className="w-full text-xs p-1.5 border border-line bg-main text-content focus:outline-none focus:border-accent"
                            />
                        </div>
                    </div>

                    <div>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder={t('students.incidents.placeholder')}
                            rows={3}
                            className="w-full text-xs p-2 border border-line bg-main text-content focus:outline-none focus:border-accent resize-none"
                            required
                        />
                    </div>

                    <div className="flex justify-end space-x-2">
                        <button
                            type="button"
                            onClick={() => setIsAdding(false)}
                            className="px-3 py-1 text-xs border border-line text-muted hover:text-content uppercase cursor-pointer"
                        >
                            {t('students.incidents.cancel')}
                        </button>
                        <button
                            type="submit"
                            className="px-3 py-1 text-xs bg-accent text-main font-bold uppercase cursor-pointer hover:opacity-90"
                        >
                            {t('students.incidents.save')}
                        </button>
                    </div>
                </form>
            )}

            {/* Incident List */}
            {incidents.length > 0 ? (
                <div className="space-y-2 w-full max-w-full min-w-0">
                    {incidents.map((inc) => {
                        const meta = getTypeBadge(inc.incident_type)
                        const Icon = meta.icon
                        return (
                            <div key={inc.id} className="p-2.5 sm:p-3 bg-content/5 border border-line space-y-1 w-full max-w-full min-w-0">
                                <div className="flex items-center justify-between">
                                    <span className={`inline-flex items-center px-2 py-0.5 text-[10px] font-bold border uppercase ${meta.style}`}>
                                        <Icon className="w-3 h-3 mr-1" />
                                        {meta.label}
                                    </span>
                                    <span className="text-[10px] text-muted">{inc.incident_date}</span>
                                </div>
                                <p className="text-xs text-content leading-relaxed mt-1 break-words">{inc.description}</p>
                            </div>
                        )
                    })}
                </div>
            ) : (
                <p className="text-xs text-muted italic text-center py-2">
                    {t('students.incidents.noIncidents')}
                </p>
            )}
        </div>
    )
}