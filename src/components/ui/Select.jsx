import { forwardRef } from 'react'

export const Select = forwardRef(({ label, error, children, className = '', ...props }, ref) => {
    return (
        <div className="space-y-1.5 w-full">
            {label && (
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-muted">
                    {label}
                </label>
            )}
            <select
                ref={ref}
                className={`w-full h-9 px-3.5 py-2 text-xs bg-main border border-line text-content focus:outline-none focus:border-content transition-colors disabled:opacity-50 cursor-pointer ${className}`}
                {...props}
            >
                {children}
            </select>
            {error && <p className="text-[10px] font-mono text-red-500 mt-1">{error}</p>}
        </div>
    )
})

Select.displayName = 'Select'