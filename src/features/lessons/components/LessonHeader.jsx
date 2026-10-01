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
                    inline-flex items-center gap-1.5
                    rounded-xl
                    border border-white/25
                    bg-gradient-to-br from-white/20 to-white/5
                    px-3 py-1.5
                    font-mono text-xs font-medium
                    text-accent
                    shadow-[0_8px_30px_rgb(0,0,0,0.08)]
                    ring-1 ring-inset ring-white/10
                    backdrop-blur-xl
                    backdrop-saturate-150
                    transition-colors
                    hover:bg-white/20
                    dark:border-white/10
                    dark:from-white/10
                    dark:to-white/[0.02]
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