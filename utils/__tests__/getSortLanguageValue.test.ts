import { LanguageItem } from '@/types/languages'
import { GlobalSortKey } from '@/types/table'
import { getSortLanguageValue } from '../getSortLanguageValue'

describe('getSortLanguageValue', () => {
  const mockLanguage = {
    name: 'Spanish',
    native_name: 'Español',
    iso2: 'es',
  } as LanguageItem

  it('should return the language name when sortKey is "language_name"', () => {
    expect(
      getSortLanguageValue(mockLanguage, 'language_name' as GlobalSortKey),
    ).toBe('Spanish')
  })

  it('should return the language native name when sortKey is "language_native_name"', () => {
    expect(
      getSortLanguageValue(
        mockLanguage,
        'language_native_name' as GlobalSortKey,
      ),
    ).toBe('Español')
  })

  it('should return the language iso2 code when sortKey is "language_iso2"', () => {
    expect(
      getSortLanguageValue(mockLanguage, 'language_iso2' as GlobalSortKey),
    ).toBe('es')
  })

  it('should return an empty string when an invalid sortKey is provided', () => {
    expect(
      getSortLanguageValue(
        mockLanguage,
        'invalid_key' as unknown as GlobalSortKey,
      ),
    ).toBe('')
  })
})
