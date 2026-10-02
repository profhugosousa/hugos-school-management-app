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
                    style: 'bg-amber-50 text-amber-700 border-amber-200',
                    label: t('students.incidents.types.praise')
                }
            case 'behavioral':
                return {
                    icon: ShieldAlert,
                    style: 'bg-purple-50 text-purple-700 border-purple-200',
                    label: t('students.incidents.types.behavioral')
                }
            case 'warning':
                return {
                    icon: AlertCircle,
                    style: 'bg-rose-50 text-rose-700 border-rose-200',
                    label: t('students.incidents.types.warning')
                }
            default:
                return {
                    icon: BookOpen,
                    style: 'bg-blue-50 text-blue-700 border-blue-200',
                    label: t('students.incidents.types.pedagogical')
                }
        }
    }

    return (
        <div className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold text-gray-800">
                    {t('students.incidents.title')}
                </h4>
                {!isAdding && (
                    <button
                        onClick={() => setIsAdding(true)}
                        className="inline-flex items-center text-xs font-medium text-blue-600 hover:text-blue-700"
                    >
                        <Plus className="w-3.5 h-3.5 mr-1" />
                        {t('students.incidents.addIncident')}
                    </button>
                )}
            </div>

            {/* Add New Form */}
            {isAdding && (
                <form onSubmit={handleSubmit} className="p-3 bg-gray-50 rounded-lg space-y-3 border border-gray-200">
                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">
                                {t('students.incidents.type')}
                            </label>
                            <select
                                value={incidentType}
                                onChange={(e) => setIncidentType(e.target.value)}
                                className="w-full text-xs p-2 rounded border border-gray-300 bg-white"
                            >
                                <option value="praise">{t('students.incidents.types.praise')}</option>
                                <option value="pedagogical">{t('students.incidents.types.pedagogical')}</option>
                                <option value="behavioral">{t('students.incidents.types.behavioral')}</option>
                                <option value="warning">{t('students.incidents.types.warning')}</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">
                                {t('students.incidents.date')}
                            </label>
                            <input
                                type="date"
                                value={incidentDate}
                                onChange={(e) => setIncidentDate(e.target.value)}
                                className="w-full text-xs p-2 rounded border border-gray-300 bg-white"
                            />
                        </div>
                    </div>

                    <div>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder={t('students.incidents.placeholder')}
                            rows={3}
                            className="w-full text-xs p-2 rounded border border-gray-300 bg-white resize-none"
                            required
                        />
                    </div>

                    <div className="flex justify-end space-x-2">
                        <button
                            type="button"
                            onClick={() => setIsAdding(false)}
                            className="px-3 py-1 text-xs text-gray-600 hover:bg-gray-200 rounded"
                        >
                            {t('students.incidents.cancel')}
                        </button>
                        <button
                            type="submit"
                            className="px-3 py-1 text-xs text-white bg-blue-600 hover:bg-blue-700 rounded font-medium"
                        >
                            {t('students.incidents.save')}
                        </button>
                    </div>
                </form>
            )}

            {/* List */}
            {incidents.length > 0 ? (
                <div className="space-y-2">
                    {incidents.map((inc) => {
                        const meta = getTypeBadge(inc.incident_type)
                        const Icon = meta.icon
                        return (
                            <div key={inc.id} className="p-3 bg-gray-50 rounded-lg border border-gray-100 space-y-1">
                                <div className="flex items-center justify-between">
                                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium border ${meta.style}`}>
                                        <Icon className="w-3 h-3 mr-1" />
                                        {meta.label}
                                    </span>
                                    <span className="text-[10px] text-gray-400">{inc.incident_date}</span>
                                </div>
                                <p className="text-xs text-gray-700 leading-relaxed">{inc.description}</p>
                            </div>
                        )
                    })}
                </div>
            ) : (
                <p className="text-xs text-gray-400 italic text-center py-2">
                    {t('students.incidents.noIncidents')}
                </p>
            )}
        </div>
    )
}