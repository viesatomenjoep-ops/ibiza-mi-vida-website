import Image from 'next/image'
import type { PartnerVehicle } from '@/lib/partner-api'

/**
 * De vloot van een partner, met beeld.
 *
 * ── Waarom dit geen ItemGrid is ───────────────────────────────────────────
 * De eerste versie toonde naam en specificaties als tekstblokje. Dat leest als
 * een inventarislijst, en een gast kiest geen auto uit een lijst — hij kijkt.
 * Vier goede foto's doen meer dan elke beschrijving, en de partner heeft ze
 * juist daarom geüpload.
 *
 * ── Waarom een auto zonder foto's er tóch bij staat ───────────────────────
 * Niet verbergen: hij is echt beschikbaar en de partner heeft hem bewust
 * gepubliceerd. Wel zonder lege beeldplek — een grijs vlak leest als een
 * kapotte pagina, terwijl een kaart met alleen tekst gewoon sober is.
 */
export function VehicleCards({
  heading,
  intro,
  vehicles,
}: {
  heading: string
  intro?: string
  vehicles: PartnerVehicle[]
}) {
  if (vehicles.length === 0) return null

  return (
    <section className="border-t border-black/5 bg-white py-14 text-neutral-900">
      <div className="mx-auto max-w-5xl px-4">
        <h2 className="font-serif text-2xl font-black tracking-tight md:text-3xl">{heading}</h2>
        {intro && <p className="mt-4 max-w-3xl text-[15px] leading-relaxed text-neutral-600">{intro}</p>}

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {vehicles.map((v) => {
            // De eerste foto is de cover: de partner bepaalt die volgorde zelf
            // in zijn portal, dus hier niet nog eens sorteren.
            const cover = v.media.find((m) => m.kind === 'photo') ?? v.media[0]

            return (
              <article
                key={v.id}
                className="overflow-hidden rounded-2xl border border-black/10 bg-neutral-50"
              >
                {cover && (
                  <div className="relative aspect-[16/10] bg-neutral-200">
                    <Image
                      src={cover.kind === 'video' ? (cover.poster ?? cover.url) : cover.url}
                      alt={`${v.display_name} — ${cover.angle ?? 'exterior'}`}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover"
                    />
                  </div>
                )}

                <div className="p-6">
                  <h3 className="font-serif text-base font-black leading-snug tracking-tight text-neutral-900">
                    {v.display_name}
                  </h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-neutral-600">
                    {v.seats} seats · {v.luggage} large cases
                  </p>

                  {v.features.length > 0 && (
                    <ul className="mt-3 flex flex-wrap gap-1.5">
                      {v.features.map((f) => (
                        <li
                          key={f}
                          className="rounded-full bg-white px-2 py-0.5 text-[12px] capitalize text-neutral-500 ring-1 ring-black/5"
                        >
                          {f.replace(/_/g, ' ')}
                        </li>
                      ))}
                    </ul>
                  )}

                  <p className="mt-4 text-[13px] text-neutral-500">
                    Operated by {v.partner.name}
                  </p>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
