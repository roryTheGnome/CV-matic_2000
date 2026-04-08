import { Check } from 'lucide-react'
import { SelectOption } from './MultiSelectField'

interface Props {
  options: SelectOption[]
  isOpen: boolean
  loading?: boolean
  selectedNames: string[]
  toggleOption: (optionName: string) => void
}

export function MultiSelectFieldMenu({
  isOpen,
  loading,
  options,
  selectedNames,
  toggleOption,
}: Props) {
  return (
    <>
      {isOpen && (
        <div className="bg-background border-input-border absolute top-[calc(100%+4px)] left-0 z-60 max-h-60 w-full overflow-y-auto rounded-sm border py-1 shadow-xl">
          {loading ? (
            <div className="text-text-secondary px-4 py-3 text-sm">
              Loading...
            </div>
          ) : options.length === 0 ? (
            <div className="text-text-secondary px-4 py-3 text-sm">
              No options found
            </div>
          ) : (
            options.map((option) => {
              const isSelected = selectedNames.includes(option.name)
              return (
                <div
                  key={option.id}
                  onClick={() => toggleOption(option.name)}
                  className={`hover:bg-text-secondary/35 flex cursor-pointer items-center justify-between px-4 py-2 text-sm transition-colors ${isSelected ? 'text-primary' : 'text-white'} `}
                >
                  {option.name}
                  {isSelected && <Check className="text-primary h-4 w-4" />}
                </div>
              )
            })
          )}
        </div>
      )}
    </>
  )
}
