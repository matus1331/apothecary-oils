import { cn } from '@/lib/cn'

/** Monochrome logo mark: an oil droplet with a two-leaf sprig. Fills with `currentColor`. */
export function BottleMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="140 20 232 448"
      className={cn('h-7 w-auto', className)}
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M256 150c0 0 100 116 100 192a100 100 0 1 1-200 0c0-76 100-192 100-192z" />
      <rect x="250" y="104" width="12" height="54" rx="6" />
      <path d="M256 132c34-16 60-42 74-78-38 8-66 30-82 62 4 6 8 12 8 16z" />
      <path d="M256 132c-34-16-60-42-74-78 38 8 66 30 82 62-4 6-8 12-8 16z" />
    </svg>
  )
}
