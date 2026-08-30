import type { ReactNode } from 'react'

export function SectionGroup({ label, children }: { label: string; children: ReactNode }) {
  return (
    <section className="mb-8">
      <h2 className="mb-2 font-serif text-sm uppercase tracking-[0.08em] text-muted">{label}</h2>
      {children}
    </section>
  )
}
