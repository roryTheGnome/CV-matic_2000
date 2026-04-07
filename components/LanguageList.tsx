import { LanguageProficiency } from '@/types/lang'
import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useModalStore } from '@/store/modalStore'

const getTextColor = (level: LanguageProficiency['proficiency']) => {
  switch (level) {
    case 'A1':
      return 'var(--color-level-novice)'
    case 'A2':
      return 'var(--color-level-novice)'
    case 'B1':
      return 'var(--color-level-advanced)'
    case 'B2':
      return 'var(--color-level-advanced)'
    case 'C1':
      return 'var(--color-level-proficient)'
    case 'C2':
      return 'var(--color-level-proficient)'
    case 'Native':
      return 'var(--color-level-expert)'
    default:
      return 'var(--color-text-primary)'
  }
}

type Props = {
  languages: LanguageProficiency[]
  onDelete?: (names: string[]) => void
  owner: boolean
}

export const LanguageList = ({ languages, onDelete, owner }: Props) => {
  const { openModal } = useModalStore()

  const [deleteMode, setDeleteMode] = useState(false)
  const [selected, setSelected] = useState<string[]>([])

  const toggleSelect = (lang: LanguageProficiency) => {
    if(owner){if (deleteMode) {
      setSelected((prev) =>
        prev.includes(lang.name)
          ? prev.filter((n) => n !== lang.name)
          : [...prev, lang.name],
      )
    } else {
      openModal('PROFILE_LANGUAGE_EDIT', { language: lang })
    }}
  }

  const handleDelete = () => {
    if (!deleteMode) {
      setDeleteMode(true)
      return
    }

    if (selected.length === 0) return

    onDelete?.(selected)

    setSelected([])
    setDeleteMode(false)
  }

  return (
    <div>
      <div className="grid grid-cols-3 justify-items-center gap-6 px-30">
        {languages.map((lang) => (
          <div
            key={lang.name}
            onClick={() => toggleSelect(lang)}
            className="flex items-center gap-5 rounded-xl p-4 hover:bg-[#1a1a1a]"
          >
            <span
              className="rounded-md px-3 py-1 font-bold"
              style={{
                color: getTextColor(lang.proficiency),
              }}
            >
              {lang.proficiency}
            </span>

            <span className="--color-text-primary">{lang.name}</span>
          </div>
        ))}
      </div>

      {owner && (
        <div className="flex justify-end gap-4">
          {deleteMode ? (
            <>
              <Button
                isTextButton
                className="disabled:bg-surface-disabled disabled:text-text-primary/40 border-input-border text-text-secondary hover:text-text-primary hover:border-text-primary flex w-full max-w-57 cursor-pointer items-center justify-center rounded-full border bg-transparent p-3 uppercase duration-300 hover:brightness-110"
                onClick={() => {
                  setDeleteMode(false)
                  setSelected([])
                }}
              >
                CANCEL
              </Button>
              <Button
                isTextButton
                className={`flex w-full max-w-57 cursor-pointer items-center justify-center rounded-full border p-3 uppercase duration-300 ${
                  selected.length > 0
                    ? 'bg-primary text-text-primary border-primary hover:brightness-110'
                    : 'border-input-border text-text-secondary hover:text-text-primary hover:border-text-primary bg-transparent'
                } disabled:bg-surface-disabled disabled:text-text-primary/40`}
                onClick={handleDelete}
              >
                CONFIRM ({selected.length})
              </Button>
            </>
          ) : (
            <>
              <Button
                Icon={Plus}
                isTextButton
                className="text-gray-400"
                onClick={() => openModal('PROFILE_LANGUAGE_ADD')}
              >
                ADD LANGUAGE
              </Button>
              <Button
                Icon={Trash2}
                isTextButton
                className="text-red-400"
                onClick={handleDelete}
              >
                REMOVE LANGUAGES
              </Button>
            </>
          )}
        </div>
      )}
    </div>
  )
}
