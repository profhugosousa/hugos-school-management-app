import { CheckCircle, Edit2, Trash2, XCircle } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export const AcademicYearRow = ({ year, onEdit, onDelete, onToggleActive }) => {
    const { t } = useTranslation()

    return (
        <tr className="hover:bg-content/5 transition-colors">
            <td className="p-3.5 font-bold text-content">{year.label}</td>
            <td className="p-3.5 text-muted">{year.startDate || '—'}</td>
            <td className="p-3.5 text-muted">{year.endDate || '—'}</td>
            <td className="p-3.5">
                <button
                    onClick={() => onToggleActive(year)}
                    className={`inline-flex items-center gap-1.5 px-2 py-0.5 border text-[10px] uppercase font-mono cursor-pointer transition-colors ${year.isActive
                        ? 'border-emerald-500/50 text-emerald-500 bg-emerald-500/10'
                        : 'border-line text-muted hover:border-content/50'
                        }`}
                >
                    {year.isActive ? (
                        <>
                            <CheckCircle className="w-3 h-3" /> {t('academicYears.status.active')}
                        </>
                    ) : (
                        <>
                            <XCircle className="w-3 h-3" /> {t('academicYears.status.inactive')}
                        </>
                    )}
                </button>
            </td>
            <td className="p-3.5 text-right">
                <div className="flex items-center justify-end gap-2">
                    <button
                        onClick={() => onEdit(year)}
                        title={t('academicYears.modal.editTitle')}
                        className="p-1.5 border border-line hover:bg-content hover:text-main text-muted transition-colors cursor-pointer"
                    >
                        <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                        onClick={() => onDelete(year.id)}
                        title={t('academicYears.deleteModal.title')}
                        className="p-1.5 border border-line hover:border-red-500 hover:bg-red-500 hover:text-white text-muted transition-colors cursor-pointer"
                    >
                        <Trash2 className="w-3.5 h-3.5" />
                    </button>
                </div>
            </td>
        </tr>
    )
}