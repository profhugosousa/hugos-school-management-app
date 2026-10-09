import { useTranslation } from 'react-i18next'
import { ConfirmModal } from '../../../components/common/modals/ConfirmModal'

export default function StudentDeleteModal({
    isOpen,
    student,
    submitting = false,
    onClose,
    onConfirm
}) {
    const { t } = useTranslation()

    return (
        <ConfirmModal
            isOpen={isOpen}
            onClose={onClose}
            onConfirm={onConfirm}
            submitting={submitting}
            variant="danger"
            title={t('students.deleteModal.title')}
            description={
                student
                    ? t('students.deleteModal.confirmation', { name: student.name })
                    : undefined
            }
            confirmText={t('students.deleteModal.confirm')}
        />
    )
}