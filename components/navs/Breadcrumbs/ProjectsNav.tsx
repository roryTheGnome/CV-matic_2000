import { ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { useProjectNav } from '@/lib/hooks/nav/useProjectNav'

export default function ProjectsNav() {
  const { project, projectDisplayName } = useProjectNav()

  return (
    <>
      {project && (
        <>
          <ChevronRight size={20} />
          <Link
            href={`/projects/${project.id}`}
            className="text-primary sm:text-xl"
          >
            {projectDisplayName}
          </Link>
        </>
      )}
    </>
  )
}
