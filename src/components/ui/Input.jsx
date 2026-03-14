import { cn } from '../../lib/cn'

export function Input({ className, ...props }) {
  return (
    <input
      className={cn(
        'h-11 w-full rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-white placeholder:text-zinc-500 outline-none ring-0 transition focus:border-white/20 focus:bg-white/7.5 focus-visible:ring-2 focus-visible:ring-indigo-400',
        className,
      )}
      {...props}
    />
  )
}

