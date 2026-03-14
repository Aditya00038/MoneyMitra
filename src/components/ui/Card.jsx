import { cn } from '../../lib/cn'

export function Card({ className, children }) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-white/10 bg-white/[0.03] p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.02)] backdrop-blur',
        className,
      )}
    >
      {children}
    </div>
  )
}

export function CardHeader({ className, children }) {
  return <div className={cn('mb-4 flex items-start justify-between gap-3', className)}>{children}</div>
}

export function CardTitle({ className, children }) {
  return <div className={cn('text-sm font-semibold text-white', className)}>{children}</div>
}

export function CardDescription({ className, children }) {
  return <div className={cn('text-xs text-zinc-400', className)}>{children}</div>
}

