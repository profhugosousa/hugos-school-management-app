import { X } from 'lucide-react'
import { useEffect } from 'react'
import { RichText } from '../../../components/common/RichTextEditor'
import { useFormatters } from '../../../hooks/useFormatters'

export const LessonStudentViewModal = ({ isOpen, onClose, lesson }) => {
    const formatters = useFormatters()
    const { formatLessonNumber, formatDate, t } = formatters

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') onClose()
        }
        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [onClose])

    if (!isOpen || !lesson) return null

    const dateVal = lesson.lesson_date || lesson.date

    return (
        <div className="fixed inset-0 bg-main text-content z-50 flex flex-col transition-colors overflow-y-auto">
            <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 text-muted hover:text-content hover:bg-content/10 rounded-lg transition-colors z-10 cursor-pointer"
                aria-label={t('close', { defaultValue: 'Close' })}
            >
                <X size={24} />
            </button>

            <div className="flex-1 flex flex-col items-center justify-center px-8 py-12 space-y-8 max-w-4xl mx-auto w-full">
                <div className="w-full max-w-3xl">
                    <h1 className="text-5xl font-bold text-content text-left">
                        {formatLessonNumber(lesson.lesson_number)}
                    </h1>
                </div>

                <div className="w-full max-w-3xl">
                    <span className="text-2xl text-muted text-left block">
                        {formatDate(dateVal)}
                    </span>
                </div>

                {lesson.summary && (
                    <div className="w-full max-w-3xl space-y-3">
                        <h2 className="text-2xl font-bold text-content text-left">
                            {t('summary', { defaultValue: 'Summary' })}
                        </h2>
                        <RichText
                            html={lesson.summary}
                            className="text-xl text-content leading-relaxed text-left"
                        />
                    </div>
                )}

                {lesson.attention_box && (
                    <div className="w-full max-w-3xl p-6 bg-yellow-500/10 border-l-4 border-yellow-500 rounded-r-lg space-y-2">
                        <h2 className="text-xl font-bold text-yellow-600 dark:text-yellow-400 text-left">
                            {t('attention', { defaultValue: 'Attention' })}
                        </h2>
                        <RichText
                            html={lesson.attention_box}
                            className="text-lg text-yellow-700 dark:text-yellow-300 text-left"
                        />
                    </div>
                )}
            </div>
        </div>
    )
}

export default LessonStudentViewModal