import { CvProject } from '@/types/cvs'
import { formatList } from '@/utils/formatList'
import { useTranslations } from 'next-intl'

type Props = {
  projects?: CvProject[]
  userRole: string
}

export default function ProjectsPage({ projects, userRole }: Props) {
  const t = useTranslations('CvPage')
  return (
    <>
      <h1 className="text-text-primary mb-10 text-4xl font-medium">
        {t('projects')}
      </h1>
      <div className="flex min-h-screen justify-center">
        <div className="w-full max-w-5xl">
          {projects?.map((project) => (
            <div
              key={project.name}
              className="relative grid grid-cols-2 gap-12"
            >
              <div className="absolute top-0 left-1/2 h-full w-0.5 -translate-x-1/2 bg-red-500" />

              <div className="space-y-8 pr-6">
                <div>
                  <p className="mb-2 font-semibold text-red-500">
                    {project.name.toUpperCase()}
                  </p>
                  <p className="text-text-primary text-sm">
                    {project.description}
                  </p>
                </div>
              </div>

              <div className="space-y-8 pl-6">
                <div>
                  <p className="text-text-primary mb-2 font-semibold">
                    {t('projectRoles')}
                  </p>
                  <p className="text-text-primary text-sm">{userRole}</p>
                </div>
                <div>
                  <p className="text-text-primary mb-2 font-semibold">
                    {t('period')}
                  </p>
                  <p className="text-text-primary text-sm">
                    {project.start_date} - {project.end_date}
                  </p>
                </div>
                <div>
                  <p className="text-text-primary mb-2 font-semibold">
                    {t('responsibilities')}
                  </p>
                  <p className="text-text-primary text-sm">
                    {formatList(project.responsibilities)}
                  </p>
                </div>
                <div>
                  <p className="text-text-primary mb-2 font-semibold">
                    {t('environments')}
                  </p>
                  <p className="text-text-primary text-sm">
                    {formatList(project.environment)}
                  </p>
                </div>
              </div>

              <div></div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
