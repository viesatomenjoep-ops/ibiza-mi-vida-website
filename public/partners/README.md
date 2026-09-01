# Partner logos

Drop the official logo files here, then fill in `PARTNER_LOGOS` in
`src/lib/partners.ts`. Every surface that names a partner picks them up at
once; until then each renders the partner's name as a wordmark.

Nothing in this folder may be drawn, traced or approximated by hand. A
recreated logo is a trademark problem, not a placeholder — use the official
file or none.

## Where the official files come from

Both are supplied to publishers for exactly this purpose, and using them is
covered by the affiliate agreements already in place.

| Partner | Where | Suggested filenames |
| --- | --- | --- |
| Wiber Rent a Car | Awin dashboard → Wiber ES advertiser → Creatives / Brand assets | `wiber-white.svg`, `wiber-colour.svg` |
| Click&Boat | Impact dashboard → Click&Boat → Ads / Assets, or their press & brand page | `click-and-boat-white.svg`, `click-and-boat-colour.svg` |

Take the **logo**, not a banner creative — a banner is a fixed-size advert
with its own message and will not sit correctly in our cards.

## Which variants to get

- **`dark`** — for our obsidian cards. This is the white or reversed-out
  version. It is the one that matters most; most of our partner surfaces are
  dark.
- **`light`** — for white sections. The normal full-colour version.

SVG if they offer it, otherwise PNG at 2× the display size with a transparent
background. Record the file's real intrinsic width and height in
`PARTNER_LOGOS`: Next's `<Image>` uses them to reserve space, and a wrong
ratio squashes somebody's brand.

## Only got the standard logo, on white?

That is enough. Fill in `light` and leave `dark` at `null`.

Every surface that shows a partner sits on obsidian, and a partner's default
asset is usually dark lettering on white — put that straight on a dark card and
the logo disappears, which is worse than the wordmark it replaces. So when only
a `light` file exists and the surface is dark, `<PartnerLogo>` wraps it in a
white rounded chip: the brand keeps its own colours and stays legible, which is
how partner logos are shown on dark sites generally.

A `dark` file (the reversed-out, usually white variant) is still better where a
partner supplies one — it sits free on the card with no chip around it. If you
have both, fill in both; the component picks per surface.
