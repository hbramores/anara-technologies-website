import { cn } from '../../lib/cn.js'

/**
 * Small status pill. `tone`: dark (on dark surfaces) | light (on light surfaces).
 */
function StatusBadge({ tone = 'dark', className, children }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide',
        tone === 'dark'
          ? 'border-magenta-400/40 bg-magenta-500/10 text-magenta-200'
          : 'border-magenta-200 bg-magenta-50 text-magenta-700',
        className,
      )}
    >
      {children}
    </span>
  )
}

export default StatusBadge
