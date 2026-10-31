// Projects as the front page of "The Daily Build": lead story, second story, and classifieds for older work.
import { ARCHIVE, STORIES } from '../../data/caseFile'
import type { NewsStory } from '../../data/caseFile'
import { Chips, FactBox, Links, Photo } from './shared'

function Masthead() {
  return (
    <header className="text-center">
      <div className="grid items-center gap-4 md:grid-cols-[1fr_auto_1fr]">
        <p className="ear hidden justify-self-start md:block">Forecast: clear skies, zero failing builds</p>
        <h2 className="font-serif text-[34px] font-black leading-none tracking-tight text-ink sm:text-[46px] md:text-[72px]">
          The Daily Build
        </h2>
        <p className="ear hidden justify-self-end md:block">Late edition · free for recruiters</p>
      </div>
      <div className="mt-3 flex flex-wrap justify-between gap-2 border-y-2 border-ink py-1 font-mono text-[12px] uppercase tracking-[0.2em] text-ink">
        <span>Vol. III · Projects edition</span>
        <span className="hidden sm:inline">Gwalior, India</span>
        <span>Price: one interview</span>
      </div>
    </header>
  )
}

function StoryExtras({ story }: { story: NewsStory }) {
  return (
    <div className="mt-6 grid items-start gap-6 md:grid-cols-[minmax(0,1fr)_280px]">
      <FactBox facts={story.facts} />
      <div className="space-y-4">
        <div>
          <p className="mb-2 font-mono text-[12px] uppercase tracking-[0.2em] text-ink-soft">Built with</p>
          <Chips items={story.stack} />
        </div>
        <Links links={story.links} />
      </div>
    </div>
  )
}

function LeadStory({ story }: { story: NewsStory }) {
  return (
    <article className="mt-7">
      <p className="kicker">{story.kicker}</p>
      <h3 className="news-headline mt-1 text-[34px] sm:text-[40px] md:text-[58px]">{story.headline}</h3>
      <p className="news-deck mt-3 max-w-3xl">{story.deck}</p>
      <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
        <Photo shot={story.images[0]} />
        <div className="news-body">
          {story.body.map((p, i) => (
            <p key={p} className={i === 0 ? 'drop-cap' : undefined}>
              {p}
            </p>
          ))}
        </div>
      </div>
      <StoryExtras story={story} />
    </article>
  )
}

function SecondStory({ story }: { story: NewsStory }) {
  const [main, ...rest] = story.images
  return (
    <article>
      <p className="kicker">{story.kicker}</p>
      <h3 className="news-headline mt-1 text-[30px] sm:text-[34px] md:text-[42px]">{story.headline}</h3>
      <p className="news-deck mt-2 max-w-3xl">{story.deck}</p>
      <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
        <div className="news-body">
          {story.body.map((p, i) => (
            <p key={p} className={i === 0 ? 'drop-cap' : undefined}>
              {p}
            </p>
          ))}
        </div>
        <div className="space-y-5">
          <Photo shot={main} />
          {rest.map((shot) => (
            <Photo key={shot.src} shot={shot} />
          ))}
        </div>
      </div>
      <StoryExtras story={story} />
    </article>
  )
}

function Classifieds() {
  return (
    <section>
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="section-label">From the archives</h3>
        <p className="font-mono text-[12px] uppercase tracking-[0.18em] text-ink-soft">Classifieds</p>
      </div>
      <div className="mt-5 grid gap-5 md:grid-cols-2">
        {ARCHIVE.map((a) => (
          <article key={a.id} className="classified">
            <p className="classified-head">{a.ad}</p>
            <div className="mt-3 grid gap-4 sm:grid-cols-[minmax(0,0.9fr)_minmax(0,1fr)]">
              <Photo shot={a.image} showCaption={false} />
              <div className="min-w-0">
                <h4 className="font-serif text-[24px] font-bold leading-tight text-ink">{a.name}</h4>
                <p className="mt-0.5 font-mono text-[12px] uppercase tracking-[0.16em] text-ink-soft">{a.when}</p>
                <p className="mt-2 font-text text-[16px] leading-snug text-ink">{a.summary}</p>
              </div>
            </div>
            <div className="mt-4">
              <Chips items={a.stack} />
            </div>
            <div className="mt-4">
              {a.links.length > 0 ? (
                <Links links={a.links} />
              ) : (
                <p className="font-mono text-[12px] uppercase tracking-[0.16em] text-ink-soft">{a.note}</p>
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
    <div className="px-5 pb-12 pt-6 sm:px-6 md:px-10">
      <Masthead />
      <LeadStory story={lead} />
      <div className="news-rule my-10" />
      <SecondStory story={second} />
      <div className="news-rule my-10" />
      <Classifieds />
    </div>
  )
}
