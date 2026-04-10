import { Eye, EyeOff } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { HTMLInputTypeAttribute } from 'react'

interface Props {
  currentType: HTMLInputTypeAttribute | undefined
  setCurrentType: (type: HTMLInputTypeAttribute) => void
}

export function ShowPassword({ currentType, setCurrentType }: Props) {
  const changeType = () => {
    if (currentType === 'password') {
      setCurrentType('text')
    } else {
      setCurrentType('password')
    }
  }
  const t = useTranslations('PasswordInput')

  return (
    <button
      className="hover:bg-surface-active absolute top-1/2 right-3 z-10 -translate-y-1/2 cursor-pointer rounded-full p-1.5 duration-300"
      type="button"
      onClick={changeType}
      aria-label={currentType === 'password' ? t('show') : t('hide')}
    >
      {currentType === 'password' ? <Eye /> : <EyeOff />}
    </button>
  )
}
