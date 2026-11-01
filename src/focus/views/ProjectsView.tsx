// Projects as the front page of "The Daily Build": lead story, second story, and classifieds for older work.
import { useState } from 'react'
import { ARCHIVE, STORIES } from '../../data/caseFile'
import type { NewsStory } from '../../data/caseFile'
import { Chips, FactBox, Links, Photo } from './shared'

function Masthead() {
  return (
    <header className="text-center">
      <div className="grid items-center gap-3 lg:grid-cols-[1fr_auto_1fr]">
        <p className="ear hidden justify-self-start lg:block">Forecast: clear skies, zero failing builds</p>
        <h2 className="font-serif text-masthead font-black leading-none tracking-tight text-ink">The Daily Build</h2>
        <p className="ear hidden justify-self-end lg:block">Late edition · free for recruiters</p>
      </div>
      <div className="mt-2 flex flex-wrap justify-between gap-x-3 border-y-2 border-ink py-0.5 font-mono text-small uppercase tracking-[0.04em] text-ink tab:tracking-[0.14em]">
        <span>
          <span className="hidden tab:inline">Vol. III · </span>Projects edition
        </span>
        <span className="hidden tab:inline">Gwalior, India</span>
        <span>Price: one interview</span>
      </div>
    </header>
  )
}

function Story({ story, lead = false }: { story: NewsStory; lead?: boolean }) {
  const [main, ...more] = story.images
  // Phones start with the first paragraph; tablets and PCs always show the whole story.
  const [expanded, setExpanded] = useState(false)
  return (
    <article>
      <p className="kicker">{story.kicker}</p>
      <h3 className={`news-headline mt-0.5 ${lead ? 'text-headline' : 'text-subhead'}`}>{story.headline}</h3>
      <p className="news-deck mt-1 max-w-3xl">{story.deck}</p>
      <div className={`story-grid mt-3${lead ? '' : ' is-flipped'}`}>
        <div className="story-body news-body">
          {story.body.map((p, i) => (
            <p key={p} className={i === 0 ? 'drop-cap' : expanded ? undefined : 'hidden tab:block'}>
              {p}
            </p>
          ))}
          <button
            type="button"
            className="ink-btn mt-2 tab:hidden"
            aria-expanded={expanded}
            onClick={() => setExpanded((e) => !e)}
          >
            {expanded ? 'Show less' : 'Read full story'}
          </button>
        </div>
        <aside className="story-aside space-y-2.5">
          <Photo shot={main} more={more} aspect="16/9" />
          <Chips items={story.stack} />
          <Links links={story.links} />
        </aside>
        <div className="story-facts">
          <FactBox facts={story.facts} />
        </div>
      </div>
    </article>
  )
}

function Classifieds() {
  return (
    <section>
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="section-label">From the archives</h3>
        <p className="font-mono text-small uppercase tracking-[0.14em] text-ink-soft">Classifieds</p>
      </div>
      <div className="mt-3 grid gap-3 tab:grid-cols-2">
        {ARCHIVE.map((a) => (
          <article key={a.id} className="classified flex flex-col">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="classified-head">{a.ad}</p>
              <p className="font-mono text-small uppercase tracking-[0.1em] text-ink-soft">{a.when}</p>
            </div>
            <h4 className="mt-1.5 font-serif text-title font-bold leading-tight text-ink">{a.name}</h4>
            <Photo shot={a.image} showCaption={false} aspect="21/8" className="mt-1.5" />
            <p className="mt-2 font-text text-body leading-snug text-ink">{a.summary}</p>
            <div className="mt-auto space-y-2 pt-2.5">
              <Chips items={a.stack} />
              {a.links.length > 0 ? (
                <Links links={a.links} />
              ) : (
                <p className="font-mono text-small uppercase tracking-[0.12em] text-ink-soft">{a.note}</p>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export function ProjectsView() {
  const [lead, second] = STORIES
  return (
    <div className="px-5 pb-8 pt-4 tab:px-8 lg:px-10">
      <Masthead />
      <div className="mt-4">
        <Story story={lead} lead />
      </div>
      <div className="news-rule my-5" />
      <Story story={second} />
      <div className="news-rule my-5" />
      <Classifieds />
    </div>
  )
}
