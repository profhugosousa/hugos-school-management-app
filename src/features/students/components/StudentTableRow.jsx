import { AlertTriangle, ChevronRight, Edit2, Trash2, User } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export default function StudentTableRow({
    student,
    isSelected,
    onSelect,
    onEdit,
    onDelete
}) {
    const { t } = useTranslation()
    const extraInfo = student.extra_info || {}
    const hasSen = extraInfo.sen || extraInfo.nee
    const callNumber = student.groupNumber ?? student.number ?? null

    return (
        <tr
            onClick={() => onSelect(student)}
            className={`hover:bg-content/5 transition-colors cursor-pointer ${isSelected ? 'bg-content/10 font-bold' : ''}`}
        >
            {/* Photo Avatar */}
            <td className="p-3.5 w-10">
                {student.photo_url ? (
                    <img
                        src={student.photo_url}
                        alt={student.name}
                        className="w-7 h-7 rounded-full object-cover border border-line"
                        onError={(e) => {
                            e.currentTarget.onerror = null
                            e.currentTarget.style.display = 'none'
                        }}
                    />
                ) : (
                    <div className="w-7 h-7 rounded-full bg-content/10 border border-line flex items-center justify-center text-muted">
                        <User className="w-4 h-4" />
                    </div>
                )}
            </td>

            {/* Call Number (#) */}
            <td className="p-3.5 font-bold text-accent">
                {callNumber !== null ? `#${callNumber}` : '—'}
            </td>

            {/* Process Number */}
            <td className="p-3.5 font-mono text-muted">
                #{student.process_number || '—'}
            </td>

            {/* Student Name & SEN Indicator */}
            <td className="p-3.5 font-bold text-content">
                <div className="flex items-center gap-2">
                    <span>{student.name}</span>
                    {hasSen && (
                        <span
                            className="p-0.5 text-amber-500 bg-amber-500/10 border border-amber-500/20"
                            title="SEN / NEE Active"
                        >
                            <AlertTriangle className="w-3.5 h-3.5" />
                        </span>
                    )}
                </div>
            </td>

            {/* Group / Class */}
            <td className="p-3.5 text-muted">
                {student.display_name || student.group_name || student.groupId || '—'}
            </td>

            {/* Actions */}
            <td className="p-3.5 text-right">
                <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                    <button
                        onClick={() => onEdit(student)}
                        className="p-1.5 hover:bg-content/10 text-muted hover:text-content transition-colors cursor-pointer"
                        title={t('students.actions.edit', 'Editar Aluno')}
                    >
                        <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                        onClick={() => onDelete(student)}
                        className="p-1.5 hover:bg-red-500/10 text-muted hover:text-red-500 transition-colors cursor-pointer"
                        title={t('students.actions.delete', 'Eliminar Aluno')}
                    >
                        <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <ChevronRight className="w-4 h-4 text-muted ml-1" />
                </div>
            </td>
        </tr>
    )
}