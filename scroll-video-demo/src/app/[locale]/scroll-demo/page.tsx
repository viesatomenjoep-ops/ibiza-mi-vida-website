import { ScrollVideo } from '@/components/ScrollVideo'

export const metadata = {
  title: 'Scroll Demo | Ibiza Mi Vida',
  robots: { index: false, follow: false },
}

export default function ScrollDemoPage() {
  return (
    <main className="bg-black">
      {/* Intro boven de video */}
      <section className="flex h-screen flex-col items-center justify-center px-6 text-center">
        <p className="mb-4 text-xs uppercase tracking-[0.3em] text-white/50">
          Demo
        </p>
        <h1 className="max-w-3xl text-5xl font-bold leading-tight text-white md:text-7xl">
          Van vliegtuig
          <br />
          naar infinity pool
        </h1>
        <p className="mt-6 max-w-md text-white/60">
          Scroll naar beneden en de reis speelt zich af. Scroll terug omhoog en
          hij spoelt terug.
        </p>
        <div className="mt-12 h-10 w-[1px] animate-pulse bg-white/40" />
      </section>

      {/* De scroll-gestuurde video */}
      <ScrollVideo />

      {/* Ruimte eronder, zodat je ziet dat hij netjes loslaat */}
      <section className="flex h-screen flex-col items-center justify-center px-6 text-center">
        <h2 className="text-3xl font-bold text-white md:text-5xl">
          Welkom op Ibiza
        </h2>
        <p className="mt-4 max-w-md text-white/60">
          Hier gaat de normale pagina verder.
        </p>
      </section>
    </main>
  )
}
