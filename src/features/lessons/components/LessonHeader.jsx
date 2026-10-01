import { BookOpen, Plus, Upload } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { PageHeader } from '../../../components/common/PageHeader'
import { Button } from '../../../components/ui/Button'

export const LessonHeader = ({ activeYear, count, onAddClick, onImportClick }) => {
    const { t } = useTranslation()

    const subtitle = activeYear ? (
        <>
            {t('lessons.subtitle', 'Manage and plan your class lessons')}{' '}
            <span
                className="
                    inline-flex items-center
                    rounded-lg
                    border border-line/70
                    bg-content/[0.06]
                    px-2.5 py-1
                    font-mono text-xs
                    text-content
                    shadow-inner
                    backdrop-blur-sm
                    dark:bg-content/[0.08]
                "
            >
                {activeYear.label || activeYear.name}
            </span>
        </>
    ) : (
        t('lessons.subtitle', 'Manage and plan your class lessons')
    );

    return (
        <PageHeader
            icon={BookOpen}
            title={t('lessons.title', 'Lessons')}
            count={count}
            subtitle={subtitle}
            actions={
                <div className="flex items-center gap-2 shrink-0">
                    <Button
                        variant="outline"
                        onClick={onImportClick}
                        className="flex items-center gap-2"
                    >
                        <Upload className="w-4 h-4" />
                        <span>{t('lessons.actions.import', 'Import')}</span>
                    </Button>
                    <Button
                        variant="default"
                        onClick={onAddClick}
                        className="flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        <span>{t('lessons.actions.add', 'New Lesson')}</span>
                    </Button>
                </div>
            }
        />
    )
}