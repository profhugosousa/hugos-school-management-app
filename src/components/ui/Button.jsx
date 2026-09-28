import { Loader2 } from 'lucide-react'

export const Button = ({ children, loading, className = '', ...props }) => {
    return (
        <button
            className={`w-full py-3 px-4 bg-content text-main font-semibold text-xs uppercase tracking-wider hover:opacity-90 active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${className}`}
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