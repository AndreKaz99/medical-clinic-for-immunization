# Medical Clinic for Immunization — Website

A static website (plain HTML, CSS and JavaScript, no build step) for **Medical Clinic for Immunization** in Glendale, CA. It covers:

- **Immunizations**: Tdap, Tetanus, Hep A, Hep B, MMR, Yellow Fever, Flu, Typhoid & more, with filter chips
- **Testing for TV Shows**: STD testing, drug testing, EKGs, physicals & more, plus the shows served (The Bachelor, American Ninja Warrior, Hell's Kitchen, The Challenge, Naked and Afraid, So You Think You Can Dance…)
- **Yelp reviews**: a star picker and a floating "Review us" button that open the clinic's Yelp page

## Publish on GitHub Pages (free, github.io URL)

1. Push this repo to GitHub (the site files are at the root: `index.html`, `css/`, `js/`, `assets/`).
2. On GitHub, go to **Settings → Pages**.
3. Under **Build and deployment**, set **Source** to *Deploy from a branch*, choose your branch (e.g. `main`) and the `/ (root)` folder, then **Save**.
4. After a minute the site is live at `https://<your-username>.github.io/medical-clinic-for-immunization/`.

## Edit your clinic details

Open `js/main.js`. The `CLINIC` object at the top holds your details:

```js
const CLINIC = {
  phone: "(323) 660-3722",
  email: "",   // e.g. "info@yourclinic.com"
  address: "660 W Broadway Suite B, Glendale, CA 91204",
  hours: { Monday: ["09:00", "17:00"], /* … */ Saturday: null, Sunday: null },
  yelpUrl: "https://www.yelp.com/biz/medical-clinic-for-immunization-glendale-2",
};
```

If you leave phone or email empty, those links are hidden. The address opens Google Maps. Hours use 24-hour Pacific time (`null` = closed) and drive the hours table plus the live "Open now / Closed" badge.

The short "Mon to Fri, 9 AM to 5 PM" text in `index.html` (footer, and the badge fallback) is plain text; update it there too if your hours change. The phone number and address are also written into `index.html` so they show even if JavaScript is off.

## After editing CSS or JS

`index.html` loads `css/styles.css?v=...` and `js/main.js?v=...`. Bump that `v=` value whenever you change those files so visitors' browsers fetch the new version instead of a cached copy.

## Preview locally

Open `index.html` in a browser, or run `python3 -m http.server` in this folder and visit http://localhost:8000.

## Accessibility

The site targets **WCAG 2.1 / 2.2 Level AA**, the standard generally used for ADA website compliance. It has been tested with [axe-core](https://github.com/dequelabs/axe-core) (0 violations), keyboard-only navigation, a 320px-wide screen, and with JavaScript turned off. Features include:

- Skip link, landmarks, logical headings, visible keyboard focus outlines
- AA color contrast for all text (deeper teal `--accent-ink` / `--accent-ink-lg` on light backgrounds)
- "Pause motion" button for all looping animation, and reduced motion for visitors who request it in their device settings
- Screen reader announcements for vaccine filters and the star rating; links that open a new tab say so
- Mobile menu traps focus while open and closes with Escape
- Content stays fully visible without JavaScript

When editing: keep teal text on light backgrounds using `var(--accent-ink)` (small text) or `var(--accent-ink-lg)` (large headings), and run an automated checker such as axe DevTools or Lighthouse after changes. Automated tools can't catch everything, so for formal ADA assurance consider a manual audit with a screen reader (VoiceOver or NVDA).
