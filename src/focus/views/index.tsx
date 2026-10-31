import type { ComponentType } from 'react'
import type { SectionId } from '../../data/caseFile'
import { AboutView } from './AboutView'
import { AchievementsView } from './AchievementsView'
import { ContactView } from './ContactView'
import { ExperienceView } from './ExperienceView'
import { ProjectsView } from './ProjectsView'
import { ResearchView } from './ResearchView'

const VIEWS: Record<SectionId, ComponentType> = {
  about: AboutView,
  projects: ProjectsView,
  experience: ExperienceView,
  achievements: AchievementsView,
  research: ResearchView,
  contact: ContactView,
}

/** The zoomed-in view of one board item. */
export function SectionView({ id }: { id: SectionId }) {
  const View = VIEWS[id]
  return <View />
}
