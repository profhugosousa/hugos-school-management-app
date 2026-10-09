import { AlertTriangle, CheckCircle, FileText, Image as ImageIcon, Layers, Upload, X } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '../../../components/ui/Button'
import useEscapeKey from '../../../hooks/useEscapeKey'
import { studentService } from '../../../services/studentService'
import { parseStudentsCSV } from '../utils/studentCsvUtils'

export default function StudentBulkImportModal({ isOpen, activeYearId, selectedGroupId, onClose, onImportCompleted }) {
    const { t } = useTranslation()
    const [parsedData, setParsedData] = useState([])
    const [fileName, setFileName] = useState('')
    const [duplicates, setDuplicates] = useState([])
    const [step, setStep] = useState('upload') // 'upload' | 'conflict'
    const [conflictStrategy, setConflictStrategy] = useState('skip') // 'skip' | 'update'
    const [submitting, setSubmitting] = useState(false)
    const [errorMsg, setErrorMsg] = useState(null)

    useEscapeKey(onClose, isOpen)

    if (!isOpen) return null

    const handleFileUpload = (e) => {
        const file = e.target.files?.[0]
        if (!file) return

        setErrorMsg(null)
        setFileName(file.name)
        const reader = new FileReader()
        reader.onload = (event) => {
            const content = event.target?.result
            if (typeof content === 'string') {
                const results = parseStudentsCSV(content)
                setParsedData(results)
                setDuplicates([])
                setStep('upload')
            }
        }
        reader.readAsText(file)
    }

    const handlePreCheck = async () => {
        if (parsedData.length === 0) return
        setSubmitting(true)
        setErrorMsg(null)

        try {
            const processNumbers = parsedData
                .map((d) => String(d.process_number || '').trim())
                .filter(Boolean)

            const existing = await studentService.checkDuplicates(processNumbers)

            if (existing.length > 0) {
                setDuplicates(existing)
                setStep('conflict')
            } else {
                await executeImport('skip')
            }
        } catch (err) {
            setErrorMsg(err.message || 'Error checking duplicates')
        } finally {
            setSubmitting(false)
        }
    }

    const executeImport = async (strategy) => {
        setSubmitting(true)
        setErrorMsg(null)

        try {
            const stats = await studentService.bulkImport(parsedData, {
                conflictStrategy: strategy,
                defaultAcademicYearId: activeYearId,
                defaultGroupId: selectedGroupId
            })
            if (onImportCompleted) {
                await onImportCompleted(stats)
            }
            onClose()
        } catch (err) {
            setErrorMsg(err.message || 'Error executing bulk import')
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
            <div className="bg-main border border-line shadow-xl w-full max-w-4xl font-mono text-xs text-content overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-line bg-content/5">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-content flex items-center gap-2">
                        <Upload className="w-4 h-4 text-accent" />
                        <span>{t('students.bulkImport.title', 'Importar Alunos em Massa (CSV)')}</span>
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-1 text-muted hover:text-content hover:bg-content/10 transition-colors cursor-pointer"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
                    {/* Error Banner */}
                    {errorMsg && (
                        <div className="p-3 border border-red-500/30 bg-red-500/10 text-red-500 font-bold flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 shrink-0" />
                            <span>{errorMsg}</span>
                        </div>
                    )}

                    {step === 'upload' && (
                        <>
                            {/* File Upload Box */}
                            <div className="border border-dashed border-line p-6 text-center hover:border-accent transition-colors bg-content/5">
                                <input
                                    type="file"
                                    accept=".csv"
                                    onChange={handleFileUpload}
                                    id="csv-file-input"
                                    className="hidden"
                                />
                                <label htmlFor="csv-file-input" className="cursor-pointer space-y-2 block">
                                    <FileText className="w-8 h-8 text-muted mx-auto" />
                                    <p className="text-content font-bold uppercase">
                                        {fileName ? fileName : t('students.bulkImport.selectFile', 'Clique para selecionar ficheiro CSV')}
                                    </p>
                                    <p className="text-muted text-[10px] max-w-xl mx-auto">
                                        {t('students.bulkImport.acceptedColumns', 'Colunas aceites')}: <span className="text-accent">process_number, number, name, birthdate, gender, photo_url, academic_year_id, group_id, level_id, sen, sen_details, guardian_name, guardian_relationship, guardian_phone, guardian_email</span>
                                    </p>
                                </label>
                            </div>

                            {/* Preview Table */}
                            {parsedData.length > 0 && (
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-muted">
                                        <span className="uppercase text-[10px] font-bold tracking-wider">
                                            {t('students.bulkImport.preview', 'Pré-visualização do Ficheiro')} ({parsedData.length} registos)
                                        </span>
                                    </div>

                                    <div className="border border-line max-h-60 overflow-auto bg-main">
                                        <table className="w-full text-left border-collapse">
                                            <thead>
                                                <tr className="border-b border-line bg-content/5 uppercase text-muted text-[10px]">
                                                    <th className="p-2">{t('students.bulkImport.photo', 'Foto')}</th>
                                                    <th className="p-2">{t('students.bulkImport.number', 'Nº')}</th>
                                                    <th className="p-2">{t('students.bulkImport.processNumber', 'Proc #')}</th>
                                                    <th className="p-2">{t('students.bulkImport.name', 'Nome')}</th>
                                                    <th className="p-2">{t('students.bulkImport.groupYear', 'Turma / Ano Letivo')}</th>
                                                    <th className="p-2">{t('students.bulkImport.guardian', 'Encarregado')}</th>
                                                    <th className="p-2">{t('students.bulkImport.guardianContact', 'Contacto EE')}</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-line text-[11px]">
                                                {parsedData.map((item, idx) => (
                                                    <tr key={idx} className="hover:bg-content/5">
                                                        <td className="p-2">
                                                            {item.photo_url ? (
                                                                <img
                                                                    src={item.photo_url}
                                                                    alt={item.name}
                                                                    className="w-6 h-6 rounded-full object-cover border border-line"
                                                                    onError={(e) => {
                                                                        e.currentTarget.onerror = null
                                                                        e.currentTarget.style.display = 'none'
                                                                    }}
                                                                />
                                                            ) : (
                                                                <ImageIcon className="w-4 h-4 text-muted" />
                                                            )}
                                                        </td>
                                                        <td className="p-2 font-bold text-accent">
                                                            {item.number !== null ? `#${item.number}` : '—'}
                                                        </td>
                                                        <td className="p-2 font-bold text-muted">#{item.process_number || '—'}</td>
                                                        <td className="p-2 text-content font-bold">{item.name}</td>
                                                        <td className="p-2 text-muted">
                                                            <div className="flex items-center gap-1 font-mono text-[10px]">
                                                                <Layers className="w-3 h-3 text-muted" />
                                                                <span>
                                                                    G: {item.group_id ? `${item.group_id}` : 'Contexto'}
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td className="p-2 text-muted">
                                                            {item.guardian_info?.name || '—'}{' '}
                                                            {item.guardian_info?.relationship && `(${item.guardian_info.relationship})`}
                                                        </td>
                                                        <td className="p-2 text-muted">
                                                            {item.guardian_info?.phone || item.guardian_info?.email || '—'}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </>
                    )}

                    {step === 'conflict' && (
                        <div className="space-y-4">
                            <div className="p-4 border border-amber-500/30 bg-amber-500/10 flex items-start gap-3">
                                <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                                <div className="space-y-1">
                                    <h4 className="font-bold uppercase text-amber-500">
                                        {t('students.bulkImport.duplicateAlert', 'Foram detetados registos duplicados')} ({duplicates.length})
                                    </h4>
                                    <p className="text-muted leading-relaxed">
                                        {t('students.bulkImport.duplicateDesc', 'Alguns números de processo do ficheiro CSV já existem na base de dados. Escolha como pretende proceder:')}
                                    </p>
                                </div>
                            </div>

                            <div className="border border-line max-h-40 overflow-auto bg-main">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-line bg-content/5 uppercase text-muted text-[10px]">
                                            <th className="p-2">{t('students.bulkImport.existingProcessNumber', 'Proc # Existente')}</th>
                                            <th className="p-2">{t('students.bulkImport.existingName', 'Nome Atual na BD')}</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-line text-[11px]">
                                        {duplicates.map((dup) => (
                                            <tr key={dup.id} className="hover:bg-content/5">
                                                <td className="p-2 font-bold text-amber-500">#{dup.process_number}</td>
                                                <td className="p-2 text-content">{dup.name}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="space-y-2 pt-2">
                                <label className="block text-muted uppercase font-bold text-[10px]">
                                    {t('students.bulkImport.actionPrompt', 'Ação para registos duplicados:')}
                                </label>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setConflictStrategy('skip')}
                                        className={`p-3 border text-left cursor-pointer transition-all ${conflictStrategy === 'skip'
                                            ? 'border-accent bg-accent/10 font-bold'
                                            : 'border-line hover:border-accent/50'
                                            }`}
                                    >
                                        <p className="text-content uppercase">{t('students.bulkImport.skipTitle', 'Ignorar Duplicados')}</p>
                                        <p className="text-[10px] text-muted">{t('students.bulkImport.skipDesc', 'Importa apenas os alunos novos e mantém os existentes intocados.')}</p>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setConflictStrategy('update')}
                                        className={`p-3 border text-left cursor-pointer transition-all ${conflictStrategy === 'update'
                                            ? 'border-accent bg-accent/10 font-bold'
                                            : 'border-line hover:border-accent/50'
                                            }`}
                                    >
                                        <p className="text-content uppercase">{t('students.bulkImport.updateTitle', 'Atualizar Existentes')}</p>
                                        <p className="text-[10px] text-muted">{t('students.bulkImport.updateDesc', 'Atualiza os dados dos alunos existentes com a informação do CSV.')}</p>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Actions */}
                <div className="flex justify-end gap-3 p-4 border-t border-line bg-content/5">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        disabled={submitting}
                    >
                        {t('common.modals.cancel', 'Cancelar')}
                    </Button>

                    {step === 'upload' ? (
                        <Button
                            variant="primary"
                            onClick={handlePreCheck}
                            disabled={parsedData.length === 0 || submitting}
                            loading={submitting}
                        >
                            <CheckCircle className="w-3.5 h-3.5" />
                            <span>{t('students.bulkImport.confirm', 'Importar Registos')}</span>
                        </Button>
                    ) : (
                        <Button
                            variant="primary"
                            onClick={() => executeImport(conflictStrategy)}
                            disabled={submitting}
                            loading={submitting}
                        >
                            <CheckCircle className="w-3.5 h-3.5" />
                            <span>{t('students.bulkImport.execute', 'Confirmar e Processar')}</span>
                        </Button>
                    )}
                </div>
            </div>
        </div>
    )
}