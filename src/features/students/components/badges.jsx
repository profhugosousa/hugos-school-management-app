import { AlertTriangle, Heart, Shield, ThumbsDown } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export const StudentBadges = ({ extraInfo }) => {
    const { t } = useTranslation()

    if (!extraInfo || typeof extraInfo !== 'object') return null

    const { likes = [], dislikes = [], values = [], sen = false, senDetails = '' } = extraInfo

    return (
        <div className="space-y-3">
            {/* SEN / NEE Badge */}
            {(sen || extraInfo.nee) && (
                <div className="flex items-center space-x-2 px-3 py-2 bg-amber-50 border border-amber-200 text-amber-800 rounded-lg text-xs font-semibold">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>
                        {t('students.badges.senRequired')} {senDetails ? `- ${senDetails}` : ''}
                    </span>
                </div>
            )}

            {/* Likes */}
            {likes.length > 0 && (
                <div>
                    <div className="flex items-center text-xs font-semibold text-emerald-700 mb-1">
                        <Heart className="w-3.5 h-3.5 mr-1" />
                        <span>{t('students.badges.likesTitle')}</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                        {likes.map((item, idx) => (
                            <span
                                key={idx}
                                className="px-2.5 py-0.5 text-xs font-medium bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200"
                            >
                                {item}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Dislikes */}
            {dislikes.length > 0 && (
                <div>
                    <div className="flex items-center text-xs font-semibold text-rose-700 mb-1">
                        <ThumbsDown className="w-3.5 h-3.5 mr-1" />
                        <span>{t('students.badges.dislikesTitle')}</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                        {dislikes.map((item, idx) => (
                            <span
                                key={idx}
                                className="px-2.5 py-0.5 text-xs font-medium bg-rose-50 text-rose-700 rounded-full border border-rose-200"
                            >
                                {item}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Values */}
            {values.length > 0 && (
                <div>
                    <div className="flex items-center text-xs font-semibold text-indigo-700 mb-1">
                        <Shield className="w-3.5 h-3.5 mr-1" />
                        <span>{t('students.badges.valuesTitle')}</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                        {values.map((item, idx) => (
                            <span
                                key={idx}
                                className="px-2.5 py-0.5 text-xs font-medium bg-indigo-50 text-indigo-700 rounded-full border border-indigo-200"
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