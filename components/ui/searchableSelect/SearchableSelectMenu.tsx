import { SelectOption } from './SearchableSelect'

interface Props {
  isOpen: boolean
  value: string
  filteredOptions: SelectOption[]
  handleOptionSelect: (option: SelectOption) => void
}

export function SearchableSelectMenu({
  isOpen,
  filteredOptions,
  value,
  handleOptionSelect,
}: Props) {
  return (
    <>
      {isOpen && (
        <ul className="bg-background border-input-border absolute z-10 mt-1 max-h-60 w-full overflow-y-auto rounded-md border shadow-lg">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option) => (
              <li
                key={option.value}
                onClick={() => handleOptionSelect(option)}
                className={`hover:bg-primary/10 cursor-pointer p-2.5 transition-colors ${
                  value === option.value
                    ? 'bg-primary/5 text-primary font-medium'
                    : 'text-text-primary'
                }`}
              >
                {option.label}
              </li>
            ))
          ) : (
            <li className="text-text-secondary p-2.5 text-center text-sm">
              No projects found
            </li>
          )}
        </ul>
      )}
    </>
  )
}
