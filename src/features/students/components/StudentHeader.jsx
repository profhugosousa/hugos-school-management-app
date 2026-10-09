import { Download, Filter, Plus, Search, Upload, Users } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { PageHeader } from '../../../components/common/PageHeader'
import { Button } from '../../../components/ui/Button'
import { Input } from '../../../components/ui/Input'
import { Select } from '../../../components/ui/Select'

export default function StudentHeader({
    count,
    searchTerm,
    onSearchChange,
    selectedGroup,
    onGroupChange,
    onAddClick,
    onImportClick,
    onExportClick,
    groups = []
}) {
    const { t } = useTranslation()

    return (
        <div className="space-y-4">
            <PageHeader
                icon={Users}
                title={t('students.header.title')}
                count={count}
                subtitle={t('students.header.subtitle', 'Manage student records, contacts, and evaluations')}
                actions={
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            onClick={onExportClick}
                            title={t('students.header.export', 'Export to CSV')}
                        >
                            <Download className="w-3.5 h-3.5 text-muted" />
                            <span className="hidden sm:inline">{t('students.header.export', 'Export')}</span>
                        </Button>

                        <Button
                            variant="outline"
                            onClick={onImportClick}
                            title={t('students.header.import', 'Import from CSV')}
                        >
                            <Upload className="w-3.5 h-3.5 text-muted" />
                            <span className="hidden sm:inline">{t('students.header.import', 'Import')}</span>
                        </Button>

                        <Button
                            variant="primary"
                            onClick={onAddClick}
                        >
                            <Plus className="w-4 h-4" />
                            <span>{t('students.header.addStudent')}</span>
                        </Button>
                    </div>
                }
            />

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 bg-main border border-line">
                <div className="flex flex-1 items-center gap-3">
                    <div className="relative flex-1 max-w-md">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                        <Input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => onSearchChange(e.target.value)}
                            placeholder={t('students.header.searchPlaceholder')}
                            className="pl-9 font-mono"
                        />
                    </div>

                    <div className="relative w-48">
                        <Filter className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
                        <Select
                            value={selectedGroup}
                            onChange={(e) => onGroupChange(e.target.value)}
                            className="pl-8 font-mono appearance-none"
                        >
                            <option value="">{t('students.header.allGroups')}</option>
                            {groups.map((group) => (
                                <option key={group.id} value={group.id}>
                                    {group.displayName}
                                </option>
                            ))}
                        </Select>
                    </div>
                </div>
            </div>
        </div>
    )
}