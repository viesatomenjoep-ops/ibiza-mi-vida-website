import Image from 'next/image'

/**
 * Merkteken boven de sociale secties.
 *
 * Instagram en TikTok stonden als twee losse blokken onder elkaar, elk met
 * alleen het pictogram van het platform op de volgknop. Dat pictogram hoort
 * daar te blijven — het vertelt waar je heen gaat als je klikt — maar het zegt
 * niets over wie er post. Met het logo erboven leest het blok als "dit zijn
 * wij, op dat platform" in plaats van als een losse verwijzing naar Instagram,
 * en staan de twee secties visueel bij elkaar.
 *
 * Dit is `logo-clean.png`, hetzelfde merk als in de navbar. Het gouden ronde
 * logo van de sociale profielen zit niet in de repo; komt dat er, dan is dit
 * de enige plek waar het pad hoeft te veranderen.
 *
 * Decoratief, dus `alt=""` en aria-hidden: de kop eronder benoemt de sectie al,
 * en een schermlezer hoeft het merk niet twee keer te horen.
 */
export function SocialBrandMark({ size = 88 }: { size?: number }) {
  return (
    <span
      className="grid place-items-center rounded-full border border-black/10 bg-white shadow-sm"
      style={{ width: size, height: size }}
      aria-hidden
    >
      <Image
        src="/logo-clean.png"
        alt=""
        // 0.72 en niet 0.62, en op volle dekking: dit is een dun lijnmerk,
        // geen vlak logo. Op 40px in een cirkel van 64 viel het visueel weg
        // naast de forse avatars die mensen van Instagram en TikTok gewend
        // zijn — de cirkel leek leeg.
        width={Math.round(size * 0.72)}
        height={Math.round(size * 0.72)}
      />
    </span>
  )
}
