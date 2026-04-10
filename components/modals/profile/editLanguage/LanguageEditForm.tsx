'use client'

import { UPDATE_PROFILE_LANGUAGE } from '@/api/graphql/mutations/profile'
import { GET_USER } from '@/api/graphql/queries/user'
import { Select } from '@/components/ui/select/Select'
import { useModalStore } from '@/store/modalStore'
import { LanguageProficiency, Proficiency } from '@/types/lang'
import { useMutation } from '@apollo/client/react'
import { useState } from 'react'
import { ModalButtons } from '../../ModalButtons'

type Props = {
  language: LanguageProficiency
  userId?: string
}

export function LanguageEditForm({ language, userId }: Props) {
  const { closeModal } = useModalStore()

  const [proficiency, setProficiency] = useState<Proficiency>(
    language.proficiency,
  )

  const [updateLanguage, { loading }] = useMutation(UPDATE_PROFILE_LANGUAGE, {
    refetchQueries: [
      {
        query: GET_USER,
        variables: { userId: userId },
      },
    ],
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!userId) return

    try {
      await updateLanguage({
        variables: {
          language: {
            userId: userId,
            name: language.name,
            proficiency,
          },
        },
      })

      closeModal()
    } catch (err) {
      console.error('Update failed:', err)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-surface text-text-secondary rounded border p-3">
        {language.name}
      </div>

      <Select
        id="proficiency"
        name="proficiency"
        value={proficiency}
        isRequired={true}
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

      <ModalButtons saving={loading} />
    </form>
  )
}
