import { permanentRedirect } from 'next/navigation'

/**
 * Weggehaald: dit was een lege huls.
 *
 * De pagina toonde een zoekbalk, één tab en "binnenkort vind je hier het
 * volledige aanbod" boven een WhatsApp-knop. Voor scooters en quads is er geen
 * aanbod, dus dat bleef ook zo. Een geindexeerde pagina die "komt eraan" zegt
 * is dunne inhoud: hij staat in de sitemap, wordt gecrawld, en levert de
 * bezoeker die erop klikt een doodlopende weg.
 *
 * Een 301 in plaats van een 404, omdat de URL in de sitemap heeft gestaan en
 * intern gelinkt was. De autopagina is het juiste doel: dat is de intentie die
 * deze URL feitelijk nog droeg, en het enige echte aanbod dat erop stond (het
 * Wiber-blok) staat daar volledig.
 */
export default function CarScooterRentalPage({ params }: { params: { locale: string } }) {
  permanentRedirect(`/${params.locale}/car-rental-ibiza`)
}
