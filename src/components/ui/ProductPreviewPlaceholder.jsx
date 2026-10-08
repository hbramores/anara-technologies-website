import { cn } from '../../lib/cn.js'

/**
 * Honest placeholder for a product interface preview. Used until an approved
 * screenshot/mockup exists — no interface is fabricated.
 */
function ProductPreviewPlaceholder({
  tone = 'dark',
  name,
  label = 'An approved product interface preview will appear here.',
  className,
}) {
  const isDark = tone === 'dark'

  return (
    <div
      className={cn(
        'aspect-[16/10] w-full overflow-hidden rounded-2xl border shadow-2xl',
        isDark ? 'border-white/10 bg-white/5' : 'border-line bg-neutral-50',
        className,
      )}
    >
      <div
        aria-hidden="true"
        className={cn(
          'flex items-center gap-1.5 border-b px-4 py-3',
          isDark ? 'border-white/10' : 'border-line',
        )}
      >
        <span
          className={cn(
            'h-2.5 w-2.5 rounded-full',
            isDark ? 'bg-white/20' : 'bg-neutral-300',
          )}
        />
        <span
          className={cn(
            'h-2.5 w-2.5 rounded-full',
            isDark ? 'bg-white/20' : 'bg-neutral-300',
          )}
        />
        <span
          className={cn(
            'h-2.5 w-2.5 rounded-full',
            isDark ? 'bg-white/20' : 'bg-neutral-300',
          )}
        />
      </div>

      <div className="flex h-[calc(100%-2.75rem)] flex-col items-center justify-center gap-3 px-6 text-center">
        <span
          aria-hidden="true"
          className="h-12 w-12 rounded-2xl bg-anara-gradient"
        />
        {name && (
          <p
            className={cn(
              'text-sm font-semibold',
              isDark ? 'text-white' : 'text-ink',
            )}
          >
            {name}
          </p>
        )}
        <p
          className={cn(
            'max-w-xs text-sm',
            isDark ? 'text-neutral-400' : 'text-ink-muted',
          )}
        >
          {label}
        </p>
      </div>
    </div>
  )
}

export default ProductPreviewPlaceholder
