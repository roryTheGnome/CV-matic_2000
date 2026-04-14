'use client'

import { Loader } from '@/components/ui/Loader'
import { useModalStore } from '@/store/modalStore'
import { useMutation, useQuery } from '@apollo/client/react'
import { SubmitEvent, useState } from 'react'

import { PROFILE_LANGUAGE_ADD } from '@/api/graphql/mutations/profile'
import { GET_LANGUAGES } from '@/api/graphql/queries/language'
import { GET_USER } from '@/api/graphql/queries/user'
import { Select } from '@/components/ui/select/Select'
import { GetLanguagesData, Language, Proficiency } from '@/types/lang'
import { useTranslations } from 'next-intl'
import { ModalButtons } from '../../ModalButtons'

type LanguageFormProps = {
  userLanguages: { name: string }[]
  userId?: string
}

export function LanguageForm({ userLanguages, userId }: LanguageFormProps) {
  const { closeModal } = useModalStore()
  const t = useTranslations('ProfileModal')
  const { data, loading, error } = useQuery<GetLanguagesData>(GET_LANGUAGES)

  const [addLanguage, { loading: saving }] = useMutation(PROFILE_LANGUAGE_ADD, {
    refetchQueries: [
      {
        query: GET_USER,
        variables: { userId: userId },
      },
    ],
  })

  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(
    null,
  )
  const [proficiency, setProficiency] = useState<Proficiency>('A1')

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!userId || !selectedLanguage) return

    try {
      await addLanguage({
        variables: {
          language: {
            userId: userId,
            name: selectedLanguage.name,
            proficiency,
          },
        },
      })

      closeModal()
    } catch (err) {
      console.error(t('errorOccurred'), err)
    }
  }

  if (loading) return <Loader />
  if (error)
    return (
      <div>
        {t('errorOccurred')} {error.message}
      </div>
    )

  const availableLangs =
    data?.languages.filter(
      (lang) => !userLanguages.some((l) => l.name === lang.name),
    ) || []

  const isDirty = !!selectedLanguage

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Select
        id="language"
        value={selectedLanguage?.name || ''}
        title={t('language')}
        label={t('language')}
        isRequired={true}
        name="language"
        handleChange={(e) => {
          const lang = availableLangs.find((l) => l.name === e.target.value)
          setSelectedLanguage(lang || null)
        }}
      >
        {availableLangs.map((lang) => (
          <option key={lang.id} value={lang.name}>
            {lang.name}
          </option>
        ))}
      </Select>

      <Select
        id="profeciency"
        value={proficiency}
        isRequired={true}
        name="profeciency"
        label={t('profeciency')}
        handleChange={(e) => setProficiency(e.target.value as Proficiency)}
      >
        <option value="A1">A1</option>
        <option value="A2">A2</option>
        <option value="B1">B1</option>
        <option value="B2">B2</option>
        <option value="C1">C1</option>
        <option value="C2">C2</option>
        <option value="Native">Native</option>
      </Select>

      <ModalButtons saving={saving} isDirty={isDirty} />
    </form>
  )
}
