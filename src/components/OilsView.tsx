import { useMediaQuery } from '@/hooks/useMediaQuery'
import type { SortKey, SortState } from '@/lib/sort'
import type { Oil } from '@/shared/schema'
import { OilCards } from './OilCards'
import { OilsTable } from './OilsTable'

type Props = {
  oils: Oil[]
  sort: SortState
  active: SortState | null
  onToggle: (k: SortKey) => void
  onSortChange: (s: SortState) => void
  onOpen: (oil: Oil) => void
  today: Date
}

export function OilsView({ oils, sort, active, onToggle, onSortChange, onOpen, today }: Props) {
  const isDesktop = useMediaQuery('(min-width: 640px)')
  return isDesktop ? (
    <OilsTable oils={oils} sort={sort} active={active} onToggle={onToggle} onOpen={onOpen} today={today} />
  ) : (
    <OilCards oils={oils} sort={sort} onSortChange={onSortChange} onOpen={onOpen} today={today} />
  )
}
