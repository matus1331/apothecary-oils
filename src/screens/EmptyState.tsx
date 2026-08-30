import { Button } from '@/components/ui/Button'

export function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="flex flex-col items-center gap-4 py-20 text-center">
      <BottleGlyph />
      <p className="font-serif text-lg text-muted">Zatím žádné oleje</p>
      <Button onClick={onAdd}>Přidat první olej</Button>
    </div>
  )
}

function BottleGlyph() {
  return (
    <svg width="56" height="56" viewBox="0 0 56 56" fill="none" aria-hidden>
      <rect x="21" y="4" width="14" height="7" rx="2" stroke="currentColor" className="text-line" strokeWidth="2" />
      <path
        d="M20 12h16v6l4 6v24a4 4 0 0 1-4 4H20a4 4 0 0 1-4-4V24l4-6v-6Z"
        stroke="currentColor"
        className="text-line"
        strokeWidth="2"
      />
    </svg>
  )
}
