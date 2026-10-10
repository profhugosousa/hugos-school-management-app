import { Sparkles, Trophy } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export function EvaluationDescriptorsFooter() {
    const { t } = useTranslation()
    const levels = [1, 2, 3, 4, 5]

    return (
        <div className="border-t border-line bg-content/5 p-4 space-y-3 font-mono text-xs">
            <div className="flex items-center gap-2 text-xs font-bold text-content uppercase tracking-wider">
                <Trophy className="w-4 h-4 text-amber-500" />
                <span>{t('lessons.evaluations.rubricTitle', 'Guia de Conquista e Autoavaliação')}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
                {levels.map((level) => (
                    <div
                        key={level}
                        className={`p-3 border bg-main flex flex-col justify-between transition-all ${level === 5
                            ? 'border-amber-400/80 bg-amber-500/5 shadow-sm'
                            : 'border-line'
                            }`}
                    >
                        <div className="space-y-1">
                            <div className="flex items-center justify-between">
                                <span className="flex text-amber-400 text-xs">
                                    {'★'.repeat(level)}
                                </span>
                                {level === 5 && (
                                    <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                                )}
                            </div>
                            <h5 className="font-bold text-content text-[11px] leading-tight pt-1">
                                {t(`lessons.evaluations.levels.${level}.title`)}
                            </h5>
                            <p className="text-[10px] text-muted leading-relaxed pt-1">
                                {t(`lessons.evaluations.levels.${level}.desc`)}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}