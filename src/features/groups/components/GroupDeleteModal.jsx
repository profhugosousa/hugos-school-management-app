import { ConfirmModal } from '../../../components/common/modals/ConfirmModal'

export const GroupDeleteModal = ({ isOpen, onClose, onConfirm, group }) => {
    return (
        <ConfirmModal
            isOpen={isOpen}
            onClose={onClose}
            onConfirm={onConfirm}
            title="Delete Group"
            message={`Are you sure you want to delete group "${group?.displayName || group?.name}"? This action cannot be undone.`}
            confirmText="Delete"
            variant="danger"
        />
    )
}