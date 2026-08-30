'use client'
import { ctLink } from '@/lib/ct-link'
import { getAiSource } from '@/lib/attribution'
;
import { useState } from 'react';
import { ExternalLink, Ticket } from 'lucide-react';

interface EventTicketSelectorProps {
  id: string;
  title: string;
  date: string;
  priceStr: string;
  image?: string;
  affLink?: string;
  locale?: string;
}

const CONFIRM: Record<string, { title: string; body: string; yes: string; no: string }> = {
  en: { title: 'Ready to check out?', body: "You'll be taken to our official ticket partner ClubTickets to securely complete your booking.", yes: 'Yes, check out', no: 'Cancel' },
  nl: { title: 'Klaar om af te rekenen?', body: 'Je wordt doorgestuurd naar onze officiële ticketpartner ClubTickets om je boeking veilig af te ronden.', yes: 'Ja, afrekenen', no: 'Annuleren' },
  de: { title: 'Bereit zur Kasse?', body: 'Sie werden zu unserem offiziellen Ticketpartner ClubTickets weitergeleitet, um Ihre Buchung sicher abzuschließen.', yes: 'Ja, zur Kasse', no: 'Abbrechen' },
  es: { title: '¿Listo para finalizar la compra?', body: 'Te redirigiremos a nuestro socio oficial de entradas ClubTickets para completar tu reserva de forma segura.', yes: 'Sí, finalizar', no: 'Cancelar' },
  fr: { title: 'Prêt à commander ?', body: 'Vous serez redirigé vers notre partenaire billetterie officiel ClubTickets pour finaliser votre réservation en toute sécurité.', yes: 'Oui, commander', no: 'Annuler' },
};

export function EventTicketSelector({ affLink, locale = 'nl' }: EventTicketSelectorProps) {
  const [open, setOpen] = useState(false);
  const C = CONFIRM[locale] || CONFIRM.en;

  const go = () => {
    if (affLink) window.open(ctLink(affLink, locale, 'event', undefined, getAiSource()), '_blank');
    setOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="bg-ibiza-green text-white px-6 py-3 rounded-xl font-black text-sm uppercase tracking-wider transition-all hover:brightness-95 hover:scale-105 whitespace-nowrap shadow-md flex items-center justify-center gap-2"
      >
        Tickets
        <ExternalLink size={16} />
      </button>

      {open && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="relative z-10 w-full max-w-md rounded-3xl border border-black/10 bg-white p-7 shadow-2xl md:p-8 text-left">
            <span className="mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-ibiza-green text-white"><Ticket size={24} /></span>
            <h3 className="font-serif text-2xl font-black text-black md:text-3xl">{C.title}</h3>
            <p className="mt-3 text-base font-medium leading-relaxed text-black/70">{C.body}</p>
            <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row">
              <button
                onClick={() => setOpen(false)}
                className="flex-1 rounded-2xl border border-black/15 bg-white px-6 py-3.5 font-serif text-base font-black uppercase text-black transition-colors hover:bg-black/5"
              >
                {C.no}
              </button>
              <button
                onClick={go}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-2xl bg-ibiza-green px-6 py-3.5 font-serif text-base font-black uppercase text-white shadow-md transition-all hover:brightness-95"
              >
                {C.yes} <ExternalLink size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
