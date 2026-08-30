import { useId, useMemo, useRef, useState } from 'react'
import { cn } from '@/lib/cn'
import type { Manufacturer } from '@/shared/schema'

type Props = {
  value: string
  onChange: (name: string) => void
  options: Manufacturer[]
  invalid?: boolean
  id?: string
}

const collator = new Intl.Collator('cs', { sensitivity: 'base' })

export function ManufacturerCombobox({ value, onChange, options, invalid, id }: Props) {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)
  const listId = useId()
  const inputRef = useRef<HTMLInputElement>(null)

  // Echo the typed text locally so the field reflects keystrokes even before the
  // parent round-trips `value` back down; re-sync whenever `value` changes upstream.
  const [text, setText] = useState(value)
  const prevValue = useRef(value)
  if (prevValue.current !== value) {
    prevValue.current = value
    setText(value)
  }

  const query = text.trim()
  const filtered = useMemo(
    () =>
      query
        ? options.filter((o) => o.name.toLocaleLowerCase('cs').includes(query.toLocaleLowerCase('cs')))
        : options,
    [options, query],
  )
  const exactMatch = options.some((o) => collator.compare(o.name, query) === 0)
  const showCreate = query.length > 0 && !exactMatch

  const rows: { key: string; label: string; name: string; create?: boolean }[] = [
    ...(showCreate ? [{ key: '__create', label: `➕ Vytvořit «${query}»`, name: query, create: true }] : []),
    ...filtered.map((o) => ({ key: String(o.id), label: o.name, name: o.name })),
  ]

  const commit = (name: string) => {
    setText(name)
    onChange(name)
    setOpen(false)
  }

  return (
    <div className="relative">
      <input
        ref={inputRef}
        id={id}
        role="combobox"
        aria-expanded={open}
        aria-controls={listId}
        aria-autocomplete="list"
        autoComplete="off"
        value={text}
        onChange={(e) => {
          setText(e.target.value)
          onChange(e.target.value)
          setOpen(true)
          setActive(0)
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => window.setTimeout(() => setOpen(false), 120)}
        onKeyDown={(e) => {
          if (e.key === 'ArrowDown') {
            e.preventDefault()
            setOpen(true)
            setActive((a) => Math.min(a + 1, rows.length - 1))
          } else if (e.key === 'ArrowUp') {
            e.preventDefault()
            setActive((a) => Math.max(a - 1, 0))
          } else if (e.key === 'Enter' && open && rows[active]) {
            e.preventDefault()
            commit(rows[active].name)
          } else if (e.key === 'Escape') {
            setOpen(false)
          }
        }}
        aria-activedescendant={open && rows[active] ? `${listId}-${rows[active].key}` : undefined}
        className={cn(
          'h-10 w-full rounded-lg border bg-surface px-3 text-sm text-ink outline-none placeholder:text-muted focus:ring-2 focus:ring-accent/40',
          invalid ? 'border-danger' : 'border-line',
        )}
        placeholder="Napište výrobce…"
      />
      {open && rows.length > 0 && (
        <ul
          id={listId}
          role="listbox"
          className="absolute z-20 mt-1 max-h-56 w-full overflow-auto rounded-lg border border-line bg-surface py-1 shadow-lg"
        >
          {rows.map((r, i) => (
            <li
              key={r.key}
              id={`${listId}-${r.key}`}
              role="option"
              aria-selected={i === active}
              onMouseEnter={() => setActive(i)}
              onMouseDown={(e) => {
                e.preventDefault()
                commit(r.name)
              }}
              className={cn(
                'cursor-pointer px-3 py-2 text-sm',
                i === active ? 'bg-accent-weak text-ink' : 'text-muted',
                r.create && 'text-accent',
              )}
            >
              {r.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
