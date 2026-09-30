import { Loader2 } from 'lucide-react'

const VARIANTS = {
    default: 'bg-content text-main hover:opacity-90',
    primary: 'bg-content text-main hover:opacity-90',
    outline: 'bg-transparent text-content border border-line hover:bg-content/10',
    ghost: 'bg-transparent text-content hover:bg-content/10',
    danger: 'bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20'
}

export const Button = ({
    children,
    loading,
    variant = 'default',
    className = '',
    ...props
}) => {
    const variantStyles = VARIANTS[variant] || VARIANTS.default

    return (
        <button
            className={`py-2.5 px-4 font-semibold text-xs uppercase tracking-wider transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 active:scale-[0.99] cursor-pointer ${variantStyles} ${className}`}
            disabled={loading || props.disabled}
            {...props}
        >
            {loading ? (
                <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>{children}</span>
                </>
            ) : (
                children
            )}
        </button>
    )
}