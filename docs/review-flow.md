# Asking for Google reviews

A short, repeatable flow for asking after a delivered booking. Templates in
English and Dutch below.

## The rule that shapes everything here

**No incentives.** Not a discount, not a free drink, not entry into a draw, not
"leave a review and we'll sort you out next time". Google's policies prohibit
offering anything in exchange for a review, and the penalty is not a warning —
it is the removal of reviews or of the business profile. It is also the one
thing a competitor can report with a screenshot.

Two more, less obvious:

- **Never filter.** Do not ask only the customers you expect to be happy, and
  never route unhappy ones to a private form instead of Google. That is review
  gating, it is against policy, and it produces a profile nobody believes.
- **Never write one for someone.** Not even from their words over WhatsApp.

You may ask everyone, once, and make it easy. That is the whole permitted
surface, and it is enough.

## When to ask

**The day after the thing happened**, not the day of, and not a week later.

- Boat charter or jet ski: the next morning.
- Car rental: the day after they drop the car back.
- Club tickets or guestlist: the following afternoon, not at 6am when they get in.

The reasoning is boring and it holds: on the day itself they are still busy
being on holiday, and a week later the feeling has faded and the message reads
as admin. Ask once. If there is no reply, let it go — a second nudge converts
almost nobody and costs you the relationship you just built.

## The direct review link

The link that opens the review box straight away, with the stars ready:

```
https://search.google.com/local/writereview?placeid=<GOOGLE_PLACE_ID>
```

**TODO:** substitute the real Place ID. It is the same value as the
`GOOGLE_PLACE_ID` environment variable used by `src/lib/google-reviews.ts`,
which is not yet set — see `docs/content-todos.md`. Find it with the Place ID
finder at <https://developers.google.com/maps/documentation/places/web-service/place-id>,
or copy it out of the Business Profile dashboard's "Ask for reviews" link.

Shorten it before sending. A raw Google URL with a 27-character ID looks like
something you should not click, and on WhatsApp it wraps across three lines.

## WhatsApp — English

> Morning [name] — hope the [boat day / jet skis / car / night at Hï] was a good
> one.
>
> If you have a spare minute, a short Google review genuinely helps us. We're a
> small local team and it's how people find us instead of the big platforms.
>
> [link]
>
> Either way, thanks for booking with us — give me a shout next time you're on
> the island.
>
> Simon

## WhatsApp — Nederlands

> Goeiemorgen [naam] — hopelijk was [de boot / de jetski's / de auto / het feest
> bij Hï] top.
>
> Als je een minuutje hebt: een korte Google-review helpt ons echt. We zijn een
> klein lokaal team, en zo vinden mensen ons in plaats van de grote platforms.
>
> [link]
>
> Hoe dan ook bedankt voor het boeken — laat het weten als je weer op het eiland
> bent.
>
> Simon

## Email — English

**Subject:** Quick favour after your Ibiza booking

> Hi [name],
>
> Thanks again for booking your [boat charter / jet ski session / car hire /
> club tickets] with us.
>
> We're a small team based on Ibiza, and reviews are genuinely how people decide
> whether to trust a local outfit over a big booking platform. If you have a
> minute, we'd really appreciate a short one:
>
> [link]
>
> Whatever you write is fine — a couple of honest sentences is worth more than
> anything polished.
>
> If something wasn't right, reply to this instead and I'll sort it.
>
> Simon
> Ibiza Mi Vida
> WhatsApp +33 6 66 52 84 12

## Email — Nederlands

**Onderwerp:** Kleine vraag na je boeking op Ibiza

> Hoi [naam],
>
> Nogmaals bedankt voor het boeken van [je boot / de jetski's / je huurauto /
> je clubtickets] bij ons.
>
> We zijn een klein team op Ibiza, en reviews bepalen echt of mensen een lokale
> partij durven te vertrouwen in plaats van een groot boekingsplatform. Heb je
> een minuutje? Dan zouden we een korte review enorm waarderen:
>
> [link]
>
> Wat je schrijft maakt niet uit — twee eerlijke zinnen zijn meer waard dan een
> mooi verhaal.
>
> Was er iets niet goed? Antwoord dan even op deze mail, dan los ik het op.
>
> Groet,
> Simon
> Ibiza Mi Vida
> WhatsApp +33 6 66 52 84 12

## Why the wording is what it is

- **It says why it matters.** "It's how people find us instead of the big
  platforms" is true and it gives the reader a reason. "Please leave a review"
  gives them none.
- **It offers nothing.** Not a nudge towards it, not a hint. See above.
- **It does not ask for five stars.** Asking for a rating is asking for a
  specific review, which is the same policy problem in a friendlier coat.
- **It gives unhappy customers a private door** — "reply to this instead" —
  without diverting them from Google. They can still review; you have just also
  offered to fix it. That is the line between good service and review gating.
- **It is signed by a person.** Simon booked it; Simon asks.

## Responding to what arrives

Reply to every review, positive or negative, within a couple of days. It is a
ranking factor in local search, and more usefully it is read by the next person
deciding whether to book.

For a bad one: answer once, in public, briefly and without arguing. Say what
happened, say what you are doing about it, offer to continue privately. Nobody
believes a profile with no criticism on it — one negative review answered well
does more for trust than another five-star does.

## Target

Five new reviews a month is the working target in `docs/authority-plan.md`. At
any reasonable booking volume that means asking is a habit rather than a
campaign. The count and rating on the site are read live from the Business
Profile, so they update by themselves — there is no number to edit anywhere in
the codebase when a review lands.
