const pr = new Intl.PluralRules('cs')

export function plural(n: number, forms: [string, string, string]): string {
  const cat = pr.select(n)
  if (cat === 'one') return forms[0]
  if (cat === 'few') return forms[1]
  return forms[2]
}
