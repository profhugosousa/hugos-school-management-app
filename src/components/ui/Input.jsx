import { forwardRef } from 'react'

export const Input = forwardRef(({ label, error, className = '', ...props }, ref) => {
    return (
        <div className="space-y-1.5 w-full">
            {label && (
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-muted">
                    {label}
                </label>
            )}
            <input
                ref={ref}
                className={`w-full px-3.5 py-2.5 text-sm bg-transparent border border-line text-content placeholder:text-accent focus:outline-none focus:border-content transition-colors disabled:opacity-50 ${className}`}
                {...props}
            />
            {error && <p className="text-[10px] font-mono text-red-500 mt-1">{error}</p>}
        </div>
    )
})

Input.displayName = 'Input'