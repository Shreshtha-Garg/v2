// Achievements as the sports page: ratings as player cards, contest box scores, and clippings.
import { CLIPPINGS, CONTESTS, RATINGS } from '../../data/caseFile'

const CARD_TILT = [-0.8, 0.6, -0.4]
const CLIP_TILT = [-1, 0.8, -0.5, 0.9, -0.7]

export function AchievementsView() {
  return (
    <div className="px-5 pb-6 pt-4 tab:px-8 lg:px-10">
      <header className="flex items-end justify-between border-b-[3px] border-double border-ink pb-0.5">
        <p className="font-serif text-title font-black leading-none text-ink">The Daily Build</p>
        <p className="font-mono text-small font-bold uppercase tracking-[0.24em] text-[#9b1b1b]">Sport</p>
      </header>

      <h2 className="news-headline mt-3 text-headline">Local dev promoted to Expert</h2>
      <p className="news-deck mt-1 max-w-3xl">
        A 1640 rating on Codeforces makes it official, alongside a 2067 Knight rating on LeetCode and 4 stars on CodeChef.
        More than 1600 problems solved on LeetCode and Codeforces alone.
      </p>

      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        {RATINGS.map((r, i) => (
          <a
            key={r.site}
            href={r.href}
            target="_blank"
            rel="noreferrer"
            className="evidence-card group relative"
            style={{ rotate: `${CARD_TILT[i]}deg` }}
          >
            <span className="absolute right-2.5 top-1.5 font-mono text-small text-ink-soft group-hover:text-ink" aria-hidden="true">
              ↗
            </span>
            <p className="font-mono text-small font-bold uppercase tracking-[0.16em] text-ink-soft">{r.site}</p>
            <p className="mt-0.5 font-serif text-number font-black leading-none text-ink">{r.rating}</p>
            <p className="mt-1 text-[13px] leading-snug text-ink-soft">
              <span className="font-type text-[15px] text-[#8c1c1c]">{r.title}</span> · {r.detail}
            </p>
          </a>
        ))}
      </div>

      <div className="mt-5 grid gap-5 tab:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
        <section>
          <h3 className="section-label">Box scores · 2025–26</h3>
          <table className="box-scores mt-1 w-full">
            <thead>
              <tr>
                <th scope="col">Contest</th>
                <th scope="col" className="text-right">
                  Rank
                </th>
              </tr>
            </thead>
            <tbody>
              {CONTESTS.map((c) => (
                <tr key={c.contest}>
                  <td>{c.contest}</td>
                  <td className="text-right font-mono font-bold">#{c.rank}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section>
          <h3 className="section-label">Also in the papers</h3>
          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {CLIPPINGS.map((c, i) => (
              // One clipping runs across two columns, so five clippings don't leave a hole in the grid.
              <article
                key={c.headline}
                className={`clipping${i === 0 ? ' sm:max-lg:col-span-2' : i === 1 ? ' lg:col-span-2' : ''}`}
                style={{ rotate: `${CLIP_TILT[i % CLIP_TILT.length]}deg` }}
              >
                <p className="font-mono text-small uppercase tracking-[0.08em] text-ink-soft">{c.when}</p>
                <h4 className="mt-0.5 font-serif text-[16px] font-black leading-[1.15] text-ink">{c.headline}</h4>
                <p className="mt-1 font-text text-[13px] leading-snug text-ink-soft">{c.detail}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
