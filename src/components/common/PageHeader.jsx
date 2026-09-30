export const PageHeader = ({
    icon: Icon,
    title,
    count,
    subtitle,
    actions
}) => {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-line">
            <div className="space-y-1">
                <div className="flex items-center gap-2">
                    {Icon && <Icon className="w-5 h-5 text-accent" />}
                    <h1 className="text-xl font-bold uppercase tracking-wider font-mono text-content">
                        {title}
                    </h1>
                    {(count !== undefined && count !== null) && (
                        <span className="px-2 py-0.5 text-xs font-mono bg-accent/10 text-accent border border-accent/20">
                            {count}
                        </span>
                    )}
                </div>
                {subtitle && (
                    <p className="text-xs text-muted font-mono">
                        {subtitle}
                    </p>
                )}
            </div>

            {actions && (
                <div className="flex items-center gap-2 flex-wrap">
                    {actions}
                </div>
            )}
        </div>
    )
}