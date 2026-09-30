import { BookOpen, Plus, Upload } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { PageHeader } from '../../../components/common/PageHeader'
import { Button } from '../../../components/ui/Button'

export const LessonHeader = ({ activeYear, count, onAddLesson, onImportClick }) => {
    const { t } = useTranslation()

    // Compose subtitle with active year info if available
    const subtitle = activeYear
        ? `${t('lessons.subtitle', 'Manage and plan your class lessons')} (${activeYear.year_name || activeYear.name})`
        : t('lessons.subtitle', 'Manage and plan your class lessons')

    return (
        <PageHeader
            icon={BookOpen}
            title={t('lessons.title', 'Lessons')}
            count={count}
            subtitle={subtitle}
            actions={
                <>
                    <Button
                        variant="outline"
                        onClick={onImportClick}
                        className="flex items-center gap-2"
                    >
                        <Upload className="w-4 h-4" />
                        <span>{t('lessons.actions.import', 'Import')}</span>
                    </Button>
                    <Button
                        onClick={onAddLesson}
                        className="flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        <span>{t('lessons.actions.add', 'New Lesson')}</span>
                    </Button>
                </>
            }
        />
    )
}