import { Mail, MessageSquare, Phone } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { getStudentEmail } from '../../../utils/studentUtils'

export const StudentQuickActions = ({ student }) => {
    const { t } = useTranslation()
    const studentEmail = getStudentEmail(student?.process_number)

    const formatPhoneForWhatsApp = (phone) => {
        if (!phone) return ''
        const cleanNumber = phone.replace(/\D/g, '')
        return cleanNumber.startsWith('351') ? cleanNumber : `351${cleanNumber}`
    }

    return (
        <div className="space-y-4 p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
            {/* Student Email */}
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        {t('students.contacts.studentEmail')}
                    </p>
                    <p className="text-sm font-medium text-gray-800">{studentEmail || '—'}</p>
                </div>
                {studentEmail && (
                    <a
                        href={`mailto:${studentEmail}`}
                        className="p-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                        title={t('students.contacts.sendEmail')}
                    >
                        <Mail className="w-4 h-4" />
                    </a>
                )}
            </div>

            {/* Guardians Contacts */}
            <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                    {t('students.contacts.guardiansAndContacts')}
                </p>
                {student?.guardians && student.guardians.length > 0 ? (
                    <div className="space-y-2">
                        {student.guardians.map((g, idx) => {
                            const waPhone = formatPhoneForWhatsApp(g.phone_number)
                            return (
                                <div
                                    key={g.id || idx}
                                    className="flex items-center justify-between p-2 rounded-lg bg-gray-50 text-sm"
                                >
                                    <div>
                                        <p className="font-medium text-gray-800">{g.name}</p>
                                        <p className="text-xs text-gray-500">
                                            {g.relationship || 'Guardian'} {g.phone_number ? `• ${g.phone_number}` : ''}
                                        </p>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        {g.email && (
                                            <a
                                                href={`mailto:${g.email}`}
                                                className="p-1.5 text-gray-600 hover:text-blue-600 hover:bg-white rounded transition-all"
                                                title={`${t('students.contacts.sendEmail')} (${g.name})`}
                                            >
                                                <Mail className="w-4 h-4" />
                                            </a>
                                        )}
                                        {g.phone_number && (
                                            <>
                                                <a
                                                    href={`tel:${g.phone_number}`}
                                                    className="p-1.5 text-gray-600 hover:text-green-600 hover:bg-white rounded transition-all"
                                                    title={`${t('students.contacts.call')} ${g.name}`}
                                                >
                                                    <Phone className="w-4 h-4" />
                                                </a>
                                                <a
                                                    href={`https://wa.me/${waPhone}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="p-1.5 text-emerald-600 hover:bg-emerald-100 rounded transition-all"
                                                    title={`${t('students.contacts.whatsapp')} (${g.name})`}
                                                >
                                                    <MessageSquare className="w-4 h-4" />
                                                </a>
                                            </>
                                        )}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                ) : (
                    <p className="text-xs text-gray-400 italic">{t('students.contacts.noGuardians')}</p>
                )}
            </div>
        </div>
    )
}