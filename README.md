# Case File #2027 · Shreshtha Garg

My portfolio, built as a detective's evidence board. Projects, experience, achievements, research and contact
details are pinned to a corkboard and joined by red string. Click any piece of evidence to pick it up and read the
full file; sticky notes along the top trace each skill to where it was used.

Live: https://shreshtha-two.vercel.app

## Run it locally

Needs Node.js 20.19 or newer.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check, then build to dist/
npm run preview  # serve the production build
```

## Where things live

| Path | What it is |
| --- | --- |
| `src/data/caseFile.ts` | Every piece of text, number and link on the site. Edit content here. |
| `src/board/` | The corkboard: `layout.ts` (positions on the 1600×820 stage), `faces.tsx` (what each pinned item looks like), `Strings.tsx`, `SkillStrip.tsx`, and `StackedBoard.tsx` for phones. |
| `src/focus/` | The zoomed-in panel (`FocusPanel.tsx`) and one view per section in `views/`. |
| `src/intro/` | The lamp-on loading screen. |
| `src/hud/` | The top and bottom bars and the first-visit hint. |
| `public/` | Resume PDF, social preview image and favicon. |

## How it works

- Every section has its own URL (`/about`, `/projects`, `/experience`, `/achievements`, `/research`, `/contact`), so
  links can be shared. A tiny History API router lives in `src/lib/router.tsx`.
- Keyboard: `1`–`6` jump to a section, arrow keys flip between sections, `Esc` returns to the board.
- Below a readable board size (phones and narrow windows) the board becomes one stacked column.
- The contact form posts to Formspree.

## Deploy

Hosted on Vercel. `vercel.json` pins the Vite build (`npm run build` → `dist`), rewrites every route to
`index.html` for the single-page app, and caches hashed assets for a year.

Built with React, TypeScript, Vite, Tailwind CSS and Motion.
