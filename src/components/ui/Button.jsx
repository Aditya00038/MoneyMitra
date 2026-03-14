import { cn } from '../../lib/cn'

export function Button({ className, variant = 'primary', size = 'md', ...props }) {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-xl font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 disabled:opacity-60 disabled:pointer-events-none'
  const variants = {
    primary: 'bg-white text-zinc-950 hover:bg-zinc-100',
    soft: 'bg-white/10 text-white hover:bg-white/15 border border-white/10',
    ghost: 'bg-transparent text-zinc-200 hover:bg-white/5 border border-white/10',
  }
  const sizes = {
    sm: 'h-9 px-3 text-sm',
    md: 'h-10 px-4 text-sm',
    lg: 'h-11 px-5 text-base',
  }
  return <button className={cn(base, variants[variant], sizes[size], className)} {...props} />
}

