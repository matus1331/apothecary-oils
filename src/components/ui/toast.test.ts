import { describe, expect, it } from 'vitest'
import { toast } from './toast'

describe('toast store', () => {
  it('notifies subscribers on success and error with incrementing ids', () => {
    const seen: unknown[] = []
    const unsub = toast.subscribe((list) => seen.push(list.map((t) => `${t.kind}:${t.message}`)))
    toast.success('Uloženo')
    toast.error('Chyba')
    expect(seen.at(-1)).toEqual(['success:Uloženo', 'error:Chyba'])
    unsub()
  })
  it('dismiss removes by id', () => {
    let current: { id: number }[] = []
    const unsub = toast.subscribe((l) => (current = l))
    toast.success('A')
    const id = current[0].id
    toast.dismiss(id)
    expect(current.find((t) => t.id === id)).toBeUndefined()
    unsub()
  })
})
