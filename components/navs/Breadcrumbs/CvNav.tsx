import { ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { useCVsNav } from '@/lib/hooks/nav/useCVsNav'

export default function CvNav() {
  const { cv, cvName, currentCvPiece, formatCvLabel } = useCVsNav()

  return (
    <>
      {cv && (
        <>
          <ChevronRight size={20} />
          <Link href={`/cvs/${cv.id}`} className="text-primary sm:text-xl">
            {cvName}
          </Link>
          {currentCvPiece && (
            <>
              <ChevronRight size={16} />
              <Link
                href={`/cvs/${cv.id}/${formatCvLabel(currentCvPiece).toLowerCase()}`}
                className="hover:text-text-primary sm:text-xl"
              >
                {formatCvLabel(currentCvPiece)}
              </Link>
            </>
          )}
        </>
      )}
    </>
  )
}
