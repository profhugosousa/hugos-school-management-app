import { AlertTriangle, Heart, Shield, ThumbsDown } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export const StudentBadges = ({ extraInfo }) => {
    const { t } = useTranslation()

    if (!extraInfo || typeof extraInfo !== 'object') return null

    const { likes = [], dislikes = [], values = [], sen = false, senDetails = '' } = extraInfo

    return (
        <div className="space-y-3 p-4 bg-main border border-line font-mono text-xs min-w-0 max-w-full overflow-hidden">
            {/* SEN / NEE Badge */}
            {(sen || extraInfo.nee) && (
                <div className="flex items-center gap-2 p-2.5 bg-amber-500/10 border border-amber-500/30 text-amber-500 text-xs font-bold min-w-0">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span className="break-words min-w-0">
                        {t('students.badges.senRequired')} {senDetails ? `- ${senDetails}` : ''}
                    </span>
                </div>
            )}

            {/* Likes */}
            {likes.length > 0 && (
                <div className="min-w-0">
                    <div className="flex items-center text-xs font-bold text-emerald-500 mb-1">
                        <Heart className="w-3.5 h-3.5 mr-1 shrink-0" />
                        <span>{t('students.badges.likesTitle')}</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 min-w-0">
                        {likes.map((item, idx) => (
                            <span
                                key={idx}
                                className="px-2 py-0.5 text-[11px] font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 break-all"
                            >
                                {item}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Dislikes */}
            {dislikes.length > 0 && (
                <div className="min-w-0">
                    <div className="flex items-center text-xs font-bold text-rose-500 mb-1">
                        <ThumbsDown className="w-3.5 h-3.5 mr-1 shrink-0" />
                        <span>{t('students.badges.dislikesTitle')}</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 min-w-0">
                        {dislikes.map((item, idx) => (
                            <span
                                key={idx}
                                className="px-2 py-0.5 text-[11px] font-bold bg-rose-500/10 text-rose-500 border border-rose-500/30 break-all"
                            >
                                {item}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Values */}
            {values.length > 0 && (
                <div className="min-w-0">
                    <div className="flex items-center text-xs font-bold text-accent mb-1">
                        <Shield className="w-3.5 h-3.5 mr-1 shrink-0" />
                        <span>{t('students.badges.valuesTitle')}</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 min-w-0">
                        {values.map((item, idx) => (
                            <span
                                key={idx}
                                className="px-2 py-0.5 text-[11px] font-bold bg-accent/10 text-accent border border-accent/30 break-all"
                            >
                                {item}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}