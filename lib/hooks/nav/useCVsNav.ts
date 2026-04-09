import { usePathname } from 'next/navigation'
import { useCv } from '@/lib/hooks/cvHooks/useCv'

export function useCVsNav() {
  const pathname = usePathname()
  const { cv, isLoading, error } = useCv()
  const cvLoading=isLoading;
  const cvError=error

  const pieces = pathname.split('/').filter(Boolean)
  const currentCvPiece = pieces[2]

  const formatCvLabel = (value: string) =>
    value.charAt(0).toUpperCase() + value.slice(1)

  const cvName = cv
    ? `${cv.name}`
    : 'Unnamed CV'

  return {
    cv,
    cvLoading,
    cvError,
    cvName,
    currentCvPiece,
    formatCvLabel,
  }
}
