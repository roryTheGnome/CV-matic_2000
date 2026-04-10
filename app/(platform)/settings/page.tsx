import { LanguageSelect } from '@/components/ui/LanguageSelect'
import { ThemeChanger } from '@/components/ui/ThemeChanger'

export default function Settings() {
  return (
    <div className="mx-auto my-0 max-w-180 space-y-8">
      <ThemeChanger />
      <LanguageSelect />
    </div>
  )
}
