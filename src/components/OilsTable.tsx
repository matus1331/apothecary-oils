import { groupByType } from '@/lib/group'
import { sortOils, type SortKey, type SortState } from '@/lib/sort'
import type { Oil } from '@/shared/schema'
import { OilRow } from './OilRow'
import { SectionGroup } from './SectionGroup'
import { SortHeader } from './SortHeader'

type Props = {
  oils: Oil[]
  sort: SortState
  active: SortState | null
  onToggle: (k: SortKey) => void
  onOpen: (oil: Oil) => void
  today: Date
}

export function OilsTable({ oils, sort, active, onToggle, onOpen, today }: Props) {
  const groups = groupByType(oils)
  return (
    <div>
      {groups.map((g) => (
        <SectionGroup key={g.type} label={`${g.label} (${g.oils.length})`}>
          <div className="overflow-x-auto rounded-xl border border-line bg-surface">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <SortHeader label="Název" column="name" active={active} onToggle={onToggle} />
                  <SortHeader label="Latinský název" column="latinName" active={active} onToggle={onToggle} />
                  <SortHeader label="Výrobce" column="manufacturerName" active={active} onToggle={onToggle} />
                  <SortHeader label="Datum expirace" column="expiryDate" active={active} onToggle={onToggle} />
                  <SortHeader label="Dochází" column="lowStock" active={active} onToggle={onToggle} />
                </tr>
              </thead>
              <tbody>
                {sortOils(g.oils, sort).map((oil) => (
                  <OilRow key={oil.id} oil={oil} today={today} onOpen={onOpen} />
                ))}
              </tbody>
            </table>
          </div>
        </SectionGroup>
      ))}
    </div>
  )
}
