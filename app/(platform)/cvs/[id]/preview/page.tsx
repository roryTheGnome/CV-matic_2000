'use client'

import { useCv } from '@/lib/hooks/cvHooks/useCv'
import MainPage from '@/components/cv/MainPage'
import { useQuery } from '@apollo/client/react'
import { GetSkillsData, SkillMastery } from '@/types/skills'
import { GET_SKILLS } from '@/api/graphql/queries/skills'
import ProfecionalSkillsPage from '@/components/cv/ProfecionalSkillsPage'
import { Button } from '@/components/ui/Button'
import { useRef } from 'react'
import ProjectsPage from '@/components/cv/ProjectsPage'

export default function CvPreview() {
  const { isLoading, cv, error } = useCv()
  const printRef = useRef<HTMLDivElement>(null)
  const { data } = useQuery<GetSkillsData>(GET_SKILLS)
  const allSkills = data ? data.skills : []
  if (!cv) return null

  const grouped: Record<string, SkillMastery[]> = {}
  cv.skills.forEach((skill) => {
    const fullSkill = allSkills.find((s) => s.name === skill.name)
    const categoryName = fullSkill?.category_name || 'Other'
    if (!grouped[categoryName]) grouped[categoryName] = []
    grouped[categoryName].push(skill)
  })

  const handleDownload = async () => {
    const element = printRef.current
    if (!element) return

    element.classList.add('pdf-safe')

    const html2pdf = (await import('html2pdf.js')).default

    await html2pdf()
      .set({
        margin: 2.5,
        filename: 'cv.pdf',
        html2canvas: {
          scale: 2,
          backgroundColor: '#ffffff',
          logging: false,
        },
        jsPDF: {
          unit: 'mm',
          format: 'a4',
          orientation: 'portrait',
        },
      })
      .from(element)
      .save()

    element.classList.remove('pdf-safe')
  }
  return (
    <div>
      <Button onClick={handleDownload}>Download PDF</Button>
      <div ref={printRef}>

        <div className="pdf-page p-8">
          <MainPage cv={cv} grouped={grouped} />
        </div>

        <div className="pdf-page p-8">
          <ProjectsPage
            projects={cv.projects}
            userRole={cv.user.position_name}
          />
        </div>

        <div className="pdf-page p-8">
          <ProfecionalSkillsPage grouped={grouped} projects={cv.projects} />
        </div>
      </div>
    </div>
  )
}
