# Medical Clinic for Immunization — Website

A static website (plain HTML, CSS and JavaScript, no build step) for **Medical Clinic for Immunization** in Glendale, CA. It covers:

- **Immunizations**: Tdap, Tetanus, Hep A, Hep B, MMR, Yellow Fever, Flu, Typhoid & more, with filter chips
- **Testing for TV Shows**: STD testing, drug testing, EKGs, physicals & more, plus the shows served (The Bachelor, American Ninja Warrior, Hell's Kitchen, The Challenge, Naked and Afraid…)
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

The short "Mon–Fri 9 AM–5 PM" text in `index.html` (footer, and the badge fallback) is plain text; update it there too if your hours change.

## Preview locally

Open `index.html` in a browser, or run `python3 -m http.server` in this folder and visit http://localhost:8000.
