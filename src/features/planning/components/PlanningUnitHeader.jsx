import { BookOpen, Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { PageHeader } from '../../../components/common/PageHeader'
import { Button } from '../../../components/ui/Button'

export function PlanningUnitHeader({ count = 0, onAddClick }) {
    const { t } = useTranslation()

    return (
        <PageHeader
            icon={BookOpen}
            title={t('planning.header.title', 'Unidades de Planificação')}
            count={count}
            subtitle={t('planning.header.subtitle', 'Gestão de temas, recursos e atividades curriculares', { count: count ? count : 0 })}
            actions={
                <Button variant="primary" onClick={onAddClick}>
                    <Plus className="w-4 h-4" />
                    <span>{t('planning.header.addBtn', 'Nova Unidade')}</span>
                </Button>
            }
        />
    )
}