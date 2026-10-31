// Achievements as the sports page: ratings as player cards, contest box scores, and older clippings.
import { CLIPPINGS, CONTESTS, RATINGS } from '../../data/caseFile'

const CLIP_TILT = [-1.4, 1.1, -0.7, 1.3, -1]

export function AchievementsView() {
  return (
    <div className="px-6 pb-12 pt-6 md:px-10">
      <header className="flex items-end justify-between border-b-[3px] border-double border-ink pb-1">
        <p className="font-serif text-[28px] font-black leading-none text-ink">The Daily Build</p>
        <p className="font-mono text-[13px] font-bold uppercase tracking-[0.3em] text-[#9b1b1b]">Sport</p>
      </header>

      <h2 className="news-headline mt-6 text-[34px] sm:text-[40px] md:text-[56px]">Local dev promoted to Expert</h2>
      <p className="news-deck mt-3 max-w-3xl">
        A 1640 rating on Codeforces makes it official, alongside a 2067 Knight rating on LeetCode and 4 stars on CodeChef.
        More than 1600 problems solved on LeetCode and Codeforces alone.
      </p>

      <div className="mt-8 grid gap-5 sm:grid-cols-3">
        {RATINGS.map((r, i) => (
          <a
            key={r.site}
            href={r.href}
            target="_blank"
            rel="noreferrer"
            className="evidence-card group relative"
            style={{ rotate: `${[-1, 0.8, -0.5][i]}deg` }}
          >
            <p className="font-mono text-[12px] font-bold uppercase tracking-[0.2em] text-ink-soft">{r.site}</p>
            <p className="mt-2 font-serif text-[60px] font-black leading-none text-ink">{r.rating}</p>
            <p className="mt-1 font-type text-[20px] text-[#8c1c1c]">{r.title}</p>
            <p className="mt-2 text-[14px] text-ink-soft">{r.detail}</p>
            <p className="mt-4 font-mono text-[12px] uppercase tracking-[0.16em] text-ink-soft group-hover:text-ink">
              View profile ↗
            </p>
          </a>
        ))}
      </div>

      <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <section>
          <h3 className="section-label">Box scores · 2025–26</h3>
          <table className="box-scores mt-3 w-full">
            <thead>
              <tr>
                <th scope="col">Contest</th>
                <th scope="col" className="text-right">
                  Global rank
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
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            {CLIPPINGS.map((c, i) => (
              <article key={c.headline} className="clipping" style={{ rotate: `${CLIP_TILT[i % CLIP_TILT.length]}deg` }}>
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-soft">{c.when}</p>
                <h4 className="mt-1 font-serif text-[22px] font-black leading-tight text-ink">{c.headline}</h4>
                <p className="mt-1.5 font-text text-[15px] leading-snug text-ink-soft">{c.detail}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
