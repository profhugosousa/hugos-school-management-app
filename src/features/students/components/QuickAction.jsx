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
        <div className="space-y-4 p-4 bg-main border border-line font-mono text-xs min-w-0 max-w-full overflow-hidden">
            {/* Student Email */}
            <div className="flex items-center justify-between gap-2 pb-3 border-b border-line min-w-0">
                <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-bold text-muted uppercase tracking-wider">
                        {t('students.contacts.studentEmail')}
                    </p>
                    <p className="font-bold text-content mt-0.5 truncate max-w-full" title={studentEmail}>
                        {studentEmail || '—'}
                    </p>
                </div>
                {studentEmail && (
                    <a
                        href={`mailto:${studentEmail}`}
                        className="p-2 text-accent border border-accent/30 bg-accent/10 hover:bg-accent/20 transition-colors shrink-0"
                        title={t('students.contacts.sendEmail')}
                    >
                        <Mail className="w-4 h-4" />
                    </a>
                )}
            </div>

            {/* Guardians Contacts */}
            <div className="min-w-0">
                <p className="text-[10px] font-bold text-muted uppercase tracking-wider mb-2">
                    {t('students.contacts.guardiansAndContacts')}
                </p>
                {student?.guardians && student.guardians.length > 0 ? (
                    <div className="space-y-2 min-w-0">
                        {student.guardians.map((g, idx) => {
                            const waPhone = formatPhoneForWhatsApp(g.phone_number)
                            return (
                                <div
                                    key={g.id || idx}
                                    className="flex items-center justify-between gap-2 p-2.5 border border-line bg-content/5 text-xs min-w-0"
                                >
                                    <div className="min-w-0 flex-1">
                                        <p className="font-bold text-content truncate">{g.name}</p>
                                        <p className="text-[11px] text-muted truncate">
                                            {g.relationship || 'Guardian'} {g.phone_number ? `• ${g.phone_number}` : ''}
                                        </p>
                                    </div>
                                    <div className="flex items-center space-x-1 shrink-0">
                                        {g.email && (
                                            <a
                                                href={`mailto:${g.email}`}
                                                className="p-1.5 text-muted hover:text-content hover:bg-content/10 transition-all"
                                                title={`${t('students.contacts.sendEmail')} (${g.name})`}
                                            >
                                                <Mail className="w-4 h-4" />
                                            </a>
                                        )}
                                        {g.phone_number && (
                                            <>
                                                <a
                                                    href={`tel:${g.phone_number}`}
                                                    className="p-1.5 text-muted hover:text-emerald-500 hover:bg-emerald-500/10 transition-all"
                                                    title={`${t('students.contacts.call')} ${g.name}`}
                                                >
                                                    <Phone className="w-4 h-4" />
                                                </a>
                                                <a
                                                    href={`https://wa.me/${waPhone}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="p-1.5 text-emerald-500 hover:bg-emerald-500/10 transition-all"
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
                    <p className="text-xs text-muted italic">{t('students.contacts.noGuardians')}</p>
                )}
            </div>
        </div>
    )
}