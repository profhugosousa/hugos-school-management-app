
export function Card({
    children,
    onClick,
    selected = false,
    className = ''
}) {
    return (
        <div
            onClick={onClick}
            className={`
                p-4 border bg-main font-mono text-xs transition-all
                ${onClick ? 'cursor-pointer hover:border-accent' : ''}
                ${selected ? 'border-accent ring-1 ring-accent bg-content/5' : 'border-line'}
                ${className}
            `}
        >
            {children}
        </div>
    )
}

export function CardHeader({
    title,
    subtitle,
    icon: Icon,
    badge,
    actions,
    avatar
}) {
    return (
        <div className="flex items-start justify-between gap-3 pb-3 border-b border-line">
            <div className="flex items-center gap-3 min-w-0">
                {avatar ? (
                    avatar
                ) : Icon ? (
                    <div className="p-2 border border-line bg-content/5 text-accent shrink-0">
                        <Icon className="w-4 h-4" />
                    </div>
                ) : null}

                <div className="min-w-0">
                    <div className="flex items-center gap-2">
                        <h4 className="font-bold uppercase text-content truncate text-sm">
                            {title}
                        </h4>
                        {badge && (
                            <span className="px-2 py-0.5 text-[10px] font-bold border border-accent/30 bg-accent/10 text-accent shrink-0">
                                {badge}
                            </span>
                        )}
                    </div>
                    {subtitle && (
                        <p className="text-[11px] text-muted truncate mt-0.5">
                            {subtitle}
                        </p>
                    )}
                </div>
            </div>

            {actions && (
                <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                    {actions}
                </div>
            )}
        </div>
    )
}

export function CardGrid({ children, columns = 2 }) {
    const colMap = {
        1: 'grid-cols-1',
        2: 'grid-cols-1 sm:grid-cols-2',
        3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
        4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
    }

    return (
        <div className={`grid gap-3 pt-3 ${colMap[columns] || colMap[2]}`}>
            {children}
        </div>
    )
}

export function CardMetaItem({ label, value, highlight = false }) {
    return (
        <div className="min-w-0">
            <span className="text-[10px] uppercase text-muted block font-semibold">{label}</span>
            <span className={`font-bold truncate block ${highlight ? 'text-accent' : 'text-content'}`}>
                {value || '—'}
            </span>
        </div>
    )
}