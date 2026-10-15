import { Check, Loader2, Plus, Trash2, User, UserPlus, Users, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '../../../components/ui/Button'
import { groupService } from '../../../services/groupService'
import { studentService } from '../../../services/studentService'
import StudentFormModal from '../../students/components/StudentFormModal'

export const GroupDetailCard = ({ group, groups = [], activeYearId, onClose, onEnrolmentChanged }) => {
    const { t } = useTranslation()
    const [enrolledStudents, setEnrolledStudents] = useState([])
    const [allStudents, setAllStudents] = useState([])
    const [loading, setLoading] = useState(true)
    const [enrolling, setEnrolling] = useState(false)
    const [isEnrolOpen, setIsEnrolOpen] = useState(false)
    const [isCreateStudentOpen, setIsCreateStudentOpen] = useState(false)

    const [selectedStudentId, setSelectedStudentId] = useState('')
    const [customNumber, setCustomNumber] = useState('')
    const [errorMsg, setErrorMsg] = useState(null)
    const [reloadKey, setReloadKey] = useState(0)

    // Data fetching inside effect with cancellation cleanup
    useEffect(() => {
        let isCancelled = false

        const fetchData = async () => {
            try {
                const [enrolled, candidates] = await Promise.all([
                    groupService.getGroupStudents(group.id),
                    groupService.getAllStudents()
                ])
                if (!isCancelled) {
                    setEnrolledStudents(enrolled)
                    setAllStudents(candidates)
                    const maxNum = enrolled.reduce((max, s) => Math.max(max, s.group_number || 0), 0)
                    setCustomNumber(String(maxNum + 1))
                    setErrorMsg(null)
                }
            } catch (err) {
                if (!isCancelled) {
                    setErrorMsg(err.message || 'Error loading group students')
                }
            } finally {
                if (!isCancelled) {
                    setLoading(false)
                }
            }
        }

        fetchData()

        return () => {
            isCancelled = true
        }
    }, [group.id, reloadKey])

    // Filter candidate students not yet in this group
    const availableStudents = allStudents.filter(
        (st) => !enrolledStudents.some((e) => e.id === st.id)
    )

    const handleEnrolSubmit = async (e) => {
        e.preventDefault()
        if (!selectedStudentId) return

        setEnrolling(true)
        setErrorMsg(null)
        try {
            await groupService.enrolStudent(
                group.id,
                selectedStudentId,
                activeYearId,
                customNumber ? parseInt(customNumber, 10) : null
            )
            setSelectedStudentId('')
            setIsEnrolOpen(false)
            setLoading(true)
            setReloadKey((prev) => prev + 1)
            if (onEnrolmentChanged) onEnrolmentChanged()
        } catch (err) {
            setErrorMsg(err.message || 'Failed to enrol student')
        } finally {
            setEnrolling(false)
        }
    }

    const handleCreateStudentSubmit = async (payload) => {
        setErrorMsg(null)
        try {
            await studentService.create({
                ...payload,
                group_id: payload.group_id || group.id,
                groupId: payload.groupId || group.id,
                academic_year_id: activeYearId
            })
            setIsCreateStudentOpen(false)
            setLoading(true)
            setReloadKey((prev) => prev + 1)
            if (onEnrolmentChanged) onEnrolmentChanged()
        } catch (err) {
            setErrorMsg(err.message || 'Failed to create student')
        }
    }

    const handleRemoveEnrolment = async (enrolmentId) => {
        if (!enrolmentId) return
        setErrorMsg(null)
        try {
            await groupService.removeEnrolment(enrolmentId)
            setLoading(true)
            setReloadKey((prev) => prev + 1)
            if (onEnrolmentChanged) onEnrolmentChanged()
        } catch (err) {
            setErrorMsg(err.message || 'Failed to remove student')
        }
    }

    return (
        <div className="bg-main p-4 border border-line font-mono text-xs space-y-4 w-full min-w-0 max-w-full overflow-hidden">
            {/* Control Header */}
            <div className="flex items-center justify-between pb-2 border-b border-line text-muted min-w-0">
                <div className="flex items-center gap-2 min-w-0">
                    <Users className="w-4 h-4 text-accent shrink-0" />
                    <span className="font-bold uppercase tracking-wider text-content text-[11px] truncate">
                        {t('groups.detail.title', 'Alunos da Turma')}: {group.displayName}
                    </span>
                    <span className="px-2 py-0.5 border border-accent/30 bg-accent/10 text-accent font-bold text-[10px]">
                        {enrolledStudents.length} {t('groups.detail.enrolledCount', 'alunos')}
                    </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                    {!isEnrolOpen && (
                        <>
                            <Button
                                variant="outline"
                                onClick={() => setIsCreateStudentOpen(true)}
                                className="py-1 px-2.5 text-[10px]"
                            >
                                <Plus className="w-3.5 h-3.5 text-accent" />
                                <span>{t('groups.detail.createStudentButton', 'Novo Aluno')}</span>
                            </Button>

                            <Button
                                variant="primary"
                                onClick={() => setIsEnrolOpen(true)}
                                className="py-1 px-2.5 text-[10px]"
                            >
                                <UserPlus className="w-3.5 h-3.5" />
                                <span>{t('groups.detail.enrolButton', 'Inscrever Existente')}</span>
                            </Button>
                        </>
                    )}

                    {onClose && (
                        <button
                            onClick={onClose}
                            className="p-1 text-muted hover:text-content hover:bg-content/10 transition-colors cursor-pointer"
                            title={t('common.modals.close', 'Fechar')}
                        >
                            <X className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </div>

            {/* Error Banner */}
            {errorMsg && (
                <div className="p-3 border border-red-500/30 bg-red-500/10 text-red-500 font-bold text-[11px]">
                    {errorMsg}
                </div>
            )}

            {/* Inline Enrolment Picker */}
            {isEnrolOpen && (
                <form onSubmit={handleEnrolSubmit} className="p-3 bg-content/5 border border-line space-y-3">
                    <div className="flex items-center justify-between border-b border-line pb-2">
                        <span className="font-bold text-accent uppercase text-[10px]">
                            {t('groups.detail.enrolFormTitle', 'Inscrever Aluno Existente na Turma')}
                        </span>
                        <button
                            type="button"
                            onClick={() => setIsEnrolOpen(false)}
                            className="text-muted hover:text-content text-xs cursor-pointer"
                        >
                            <X className="w-3.5 h-3.5" />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="sm:col-span-2 space-y-1">
                            <label className="block text-muted uppercase text-[10px] font-bold">
                                {t('groups.detail.selectStudent', 'Selecionar Aluno')}
                            </label>
                            <select
                                required
                                value={selectedStudentId}
                                onChange={(e) => setSelectedStudentId(e.target.value)}
                                className="w-full px-3 py-1.5 bg-main border border-line text-content focus:outline-none focus:border-accent"
                            >
                                <option value="">
                                    {t('groups.detail.chooseStudentPrompt', '-- Escolher Aluno --')}
                                </option>
                                {availableStudents.map((st) => (
                                    <option key={st.id} value={st.id}>
                                        {st.name} (Proc. #{st.process_number || '—'})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-1">
                            <label className="block text-muted uppercase text-[10px] font-bold">
                                {t('groups.detail.callNumber', 'Nº Chamada')}
                            </label>
                            <input
                                type="number"
                                value={customNumber}
                                onChange={(e) => setCustomNumber(e.target.value)}
                                className="w-full px-3 py-1.5 bg-main border border-line text-content focus:outline-none focus:border-accent font-bold text-accent"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-2 border-t border-line">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsEnrolOpen(false)}
                            disabled={enrolling}
                            className="py-1 px-3 text-[10px]"
                        >
                            {t('common.cancel', 'Cancelar')}
                        </Button>
                        <Button
                            type="submit"
                            variant="primary"
                            loading={enrolling}
                            disabled={!selectedStudentId || enrolling}
                            className="py-1 px-3 text-[10px]"
                        >
                            <Check className="w-3.5 h-3.5" />
                            <span>{t('groups.detail.confirmEnrol', 'Confirmar Inscrição')}</span>
                        </Button>
                    </div>
                </form>
            )}

            {/* Enrolled Students List */}
            {loading ? (
                <div className="p-8 border border-line bg-main flex items-center justify-center gap-2 text-muted">
                    <Loader2 className="w-4 h-4 animate-spin text-accent" />
                    <span>{t('common.loading', 'A carregar alunos...')}</span>
                </div>
            ) : enrolledStudents.length === 0 ? (
                <div className="p-8 border border-line bg-main text-center text-muted">
                    {t('groups.detail.noStudents', 'Nenhum aluno inscrito nesta turma.')}
                </div>
            ) : (
                <div className="space-y-2">
                    {enrolledStudents.map((st) => (
                        <div
                            key={st.id}
                            className="p-2.5 border border-line bg-main flex items-center justify-between gap-3 hover:border-accent/50 transition-colors"
                        >
                            <div className="flex items-center gap-3 min-w-0 flex-1">
                                {st.photo_url ? (
                                    <img
                                        src={st.photo_url}
                                        alt={st.name}
                                        className="w-8 h-8 rounded-full object-cover border border-line shrink-0"
                                    />
                                ) : (
                                    <div className="w-8 h-8 rounded-full bg-content/10 border border-line flex items-center justify-center text-muted shrink-0">
                                        <User className="w-4 h-4" />
                                    </div>
                                )}

                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-accent">
                                            #{st.group_number || '—'}
                                        </span>
                                        <h5 className="font-bold text-content truncate uppercase text-xs">
                                            {st.name}
                                        </h5>
                                    </div>
                                    <p className="text-[10px] text-muted font-mono mt-0.5">
                                        Proc. #{st.process_number || '—'}
                                    </p>
                                </div>
                            </div>

                            <button
                                onClick={() => handleRemoveEnrolment(st.enrolment_id)}
                                className="p-1.5 text-muted hover:text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer shrink-0"
                                title={t('groups.detail.removeStudent', 'Remover da turma')}
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Create Student Modal with Pre-Selected Group */}
            {isCreateStudentOpen && (
                <StudentFormModal
                    isOpen={isCreateStudentOpen}
                    initialData={{
                        groupId: group.id,
                        group_id: group.id,
                        groupNumber: customNumber ? parseInt(customNumber, 10) : undefined
                    }}
                    groups={groups}
                    onClose={() => setIsCreateStudentOpen(false)}
                    onSubmit={handleCreateStudentSubmit}
                />
            )}
        </div>
    )
}