import { Star } from 'lucide-react'
import { useState } from 'react'

export function RatingStars({ value = null, onChange, disabled = false }) {
    const [hoverValue, setHoverValue] = useState(null)

    return (
        <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((starIndex) => {
                const filled = (hoverValue ?? value) >= starIndex
                return (
                    <button
                        key={starIndex}
                        type="button"
                        disabled={disabled}
                        onMouseEnter={() => !disabled && setHoverValue(starIndex)}
                        onMouseLeave={() => !disabled && setHoverValue(null)}
                        onClick={() => onChange(starIndex)}
                        className={`p-1 transition-transform cursor-pointer disabled:cursor-not-allowed ${disabled ? 'opacity-50' : 'hover:scale-110'
                            }`}
                    >
                        <Star
                            className={`w-4 h-4 transition-colors ${filled
                                ? 'fill-amber-400 text-amber-500'
                                : 'text-muted/40 hover:text-amber-400'
                                }`}
                        />
                    </button>
                )
            })}
        </div>
    )
}