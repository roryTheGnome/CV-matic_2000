import { User } from '@/types/user'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import defaultProfile from '../../public/default-profile.png'

type ProfileProp = {
  user: User
}

export default function Profile({ user }: ProfileProp) {
  const fullName = `${user.profile.first_name} ${user.profile.last_name}`

  const t = useTranslations('ComponentProfile')
  const f = useTranslations('Forms')

  return (
    <>
      <div className="mb-8 flex flex-col items-center text-center">
        <Image
          src={user.profile?.avatar ?? defaultProfile}
          className="mb-4 h-24 w-24 rounded-full object-cover"
          alt={t('previewAvatar')}
          width={96}
          height={96}
          loading="eager"
        />

        <h1 className="text-2xl font-semibold">{fullName}</h1>

        <p className="text-text-secondary text-sm">{user.email}</p>

        <p className="text-text-secondary text-sm">
          {t('aMember')}{' '}
          {new Date(Number(user.profile.created_at)).toDateString()}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
        <div>
          <label className="text-text-secondary text-sm">
            {f('firstName')}
          </label>
          <div className="bg-surface mt-1 rounded border p-3">
            {user.profile?.first_name ? user.profile.first_name : 'NA'}
          </div>
        </div>
        <div>
          <label className="text-text-secondary text-sm">{f('lastName')}</label>
          <div className="bg-surface mt-1 rounded border p-3">
            {user.profile?.last_name ? user.profile.last_name : 'NA'}
          </div>
        </div>
        <div>
          <label className="text-text-secondary text-sm">
            {f('department')}
          </label>
          <div className="bg-surface mt-1 rounded border p-3">
            {user?.department_name ? user?.department_name : 'NA'}
          </div>
        </div>
        <div>
          <label className="text-text-secondary text-sm">{f('position')}</label>
          <div className="bg-surface mt-1 rounded border p-3">
            {user?.position_name ? user.position_name : 'NA'}
          </div>
        </div>
      </div>
    </>
  )
}
