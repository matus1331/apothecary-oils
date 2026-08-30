import { motion } from 'framer-motion'
import { TriangleAlert } from 'lucide-react'
import { summarizeExpiry } from '@/lib/expiry-summary'
import { plural } from '@/shared/plural'
import type { Oil } from '@/shared/schema'
import { Button } from './ui/Button'

const OLEJ: [string, string, string] = ['olej', 'oleje', 'olejů']

export function ExpiryBanner({
  oils,
  today = new Date(),
  onShow,
}: {
  oils: Oil[]
  today?: Date
  onShow: () => void
}) {
  const { expiring, expired } = summarizeExpiry(oils, today)
  if (expiring + expired === 0) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      role="status"
      className="mb-6 flex flex-wrap items-center gap-x-3 gap-y-1 rounded-xl border border-warn/40 bg-warn-bg px-4 py-3 text-sm text-warn"
    >
      <TriangleAlert size={16} className="shrink-0" />
      {expiring > 0 && (
        <span>
          {expiring} {plural(expiring, OLEJ)} expiruje do 90 dní
        </span>
      )}
      {expired > 0 && (
        <span>
          {expired} {plural(expired, OLEJ)} je po expiraci
        </span>
      )}
      <Button variant="ghost" size="sm" className="ml-auto text-warn" onClick={onShow}>
        Zobrazit
      </Button>
    </motion.div>
  )
}
