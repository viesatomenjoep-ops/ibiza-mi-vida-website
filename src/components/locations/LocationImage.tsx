import Image from 'next/image'

/**
 * Beeld van een plaats, of een nette stand-in als dat er niet is.
 *
 * Dertien van de eenentwintig plaatsen hebben geen foto. Die tegels toonden een
 * leeg muntgroen vlak: geen ontwerp, maar een gat waar een <Image> had moeten
 * staan. Op een raster van eenentwintig tegels lezen dertien lege vlakken als
 * een stukke pagina.
 *
 * De stand-in is bewust typografisch en geen stockfoto. Een gekochte foto van
 * "een Spaanse baai" bij Benirràs zetten belooft de bezoeker iets wat er niet
 * staat, en dat is precies wat deze site niet doet. Zodra er een echte foto is,
 * verdwijnt de stand-in vanzelf: hij hangt alleen aan een lege `src`.
 */
export function LocationImage({
  src,
  name,
  sizes,
  priority = false,
  className = '',
}: {
  src: string
  name: string
  sizes: string
  priority?: boolean
  className?: string
}) {
  if (src) {
    return (
      <Image
        src={src}
        alt={name}
        fill
        sizes={sizes}
        priority={priority}
        className={`object-cover ${className}`}
      />
    )
  }

  return (
    <span
      aria-hidden
      className="absolute inset-0 flex items-center justify-center bg-[radial-gradient(120%_140%_at_20%_0%,rgba(212,175,55,0.22),transparent_62%)] bg-obsidian"
    >
      <span className="px-4 text-center font-serif text-[15px] font-black uppercase leading-tight tracking-[0.18em] text-white/70">
        {name}
      </span>
    </span>
  )
}
