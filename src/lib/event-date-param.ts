/**
 * De ?date= op een eventpagina.
 *
 * Een club die elke week dezelfde naam draait heeft tientallen datums onder
 * één URL. Zonder deze parameter opende de detailpagina altijd op de
 * eerstvolgende: klikte je in de agenda op maandag de 14e, dan kreeg je de
 * line-up, de prijs en de ticketlink van de 7e. Dat is verwarrend, en bij een
 * andere hoofdact ronduit fout.
 *
 * De parameter is een voorkeur, geen route: hij hoort niet in de canonical
 * (die blijft de kale URL, en generateMetadata leest searchParams niet) en een
 * onzinnige of onbekende waarde valt gewoon terug op de eerstvolgende datum.
 * Zo kan een geplakte link nooit een lege pagina geven.
 */
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/

export function dateParam(searchParams?: { date?: string | string[] }): string | undefined {
  const raw = searchParams?.date
  const waarde = Array.isArray(raw) ? raw[0] : raw
  return waarde && ISO_DATE.test(waarde) ? waarde : undefined
}

/**
 * Zet de gekozen dag achter een eventlink. Gebruik dit overal waar de lijst
 * per avond is (agenda, deze week, vanavond) — dan opent de detailpagina op
 * dezelfde avond als waar geklikt werd.
 *
 * Niet gebruiken op een lijst die het event als geheel toont (een clubpagina
 * met "alle datums"): daar ís geen gekozen dag, en dan hoort de pagina gewoon
 * op de eerstvolgende te openen.
 */
export function withDate(href: string, date?: string | null): string {
  const dag = String(date || '').slice(0, 10)
  return ISO_DATE.test(dag) ? `${href}${href.includes('?') ? '&' : '?'}date=${dag}` : href
}
