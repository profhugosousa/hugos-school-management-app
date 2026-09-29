import { Input } from './Input'

export const DateFilterInput = ({
    isRangeMode,
    singleLabel,
    rangeLabel,
    singleDate,
    dateStart,
    dateEnd,
    onChangeSingle,
    onChangeStart,
    onChangeEnd
}) => {
    if (!isRangeMode) {
        return (
            <Input
                type="date"
                label={singleLabel}
                value={singleDate || ''}
                onChange={onChangeSingle}
            />
        )
    }

    return (
        <div className="space-y-1.5 w-full">
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-muted">
                {rangeLabel}
            </label>
            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-1.5">
                <input
                    type="date"
                    value={dateStart || ''}
                    onChange={onChangeStart}
                    className="w-full h-9 px-2 py-2 text-xs bg-main border border-line text-content focus:outline-none focus:border-content transition-colors"
                />
                <span className="text-muted text-xs text-center">-</span>
                <input
                    type="date"
                    value={dateEnd || ''}
                    onChange={onChangeEnd}
                    className="w-full h-9 px-2 py-2 text-xs bg-main border border-line text-content focus:outline-none focus:border-content transition-colors"
                />
            </div>
        </div>
    )
}