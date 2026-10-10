import { RefreshCw, TrendingUp } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { PageHeader } from '../../../components/common/PageHeader'
import { Button } from '../../../components/ui/Button'

export function EvaluationAnalyticsHeader({ count = 0, onRefresh }) {
    const { t } = useTranslation()

    return (
        <PageHeader
            icon={TrendingUp}
            title={t('evaluations.analytics.title', 'Análise de Avaliações e Tendências')}
            count={count}
            subtitle={t('evaluations.analytics.subtitle', 'Evolução qualitativa de autoavaliação vs. avaliação do docente')}
            actions={
                <Button variant="outline" onClick={onRefresh}>
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>{t('common.refresh', 'Atualizar')}</span>
                </Button>
            }
        />
    )
}