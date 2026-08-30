import { groupByType } from '@/lib/group'
import { sortOils, type SortState } from '@/lib/sort'
import type { Oil } from '@/shared/schema'
import { OilCard } from './OilCard'
import { SectionGroup } from './SectionGroup'
import { SortSelect } from './SortSelect'

type Props = {
  oils: Oil[]
  sort: SortState
  onSortChange: (s: SortState) => void
  onOpen: (oil: Oil) => void
  today: Date
}

export function OilCards({ oils, sort, onSortChange, onOpen, today }: Props) {
  const groups = groupByType(oils)
  return (
    <div>
      <div className="mb-4 flex justify-end">
        <SortSelect value={sort} onChange={onSortChange} />
      </div>
      {groups.map((g) => (
        <SectionGroup key={g.type} label={`${g.label} (${g.oils.length})`}>
          <div className="flex flex-col gap-2">
            {sortOils(g.oils, sort).map((oil) => (
              <OilCard key={oil.id} oil={oil} today={today} onOpen={onOpen} />
            ))}
          </div>
        </SectionGroup>
      ))}
    </div>
  )
}
