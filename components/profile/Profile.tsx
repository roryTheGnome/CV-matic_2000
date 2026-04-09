import { User } from '@/types/user'
import Image from 'next/image'
import defaultProfile from '../../public/default-profile.png'

type ProfileProp = {
  user: User
}

export default function Profile({ user }: ProfileProp) {
  const fullName = `${user.profile.first_name} ${user.profile.last_name}`

  return (
    <>
      <div className="mb-8 flex flex-col items-center text-center">
        <Image
          src={user.profile?.avatar ?? defaultProfile}
          className="mb-4 h-24 w-24 rounded-full object-cover"
          alt="Preview avatar"
          width={96}
          height={96}
          loading="eager"
        />

        <h1 className="text-2xl font-semibold">{fullName}</h1>

        <p className="text-text-secondary text-sm">{user.email}</p>

        <p className="text-text-secondary text-sm">
          A member since{' '}
          {new Date(Number(user.profile.created_at)).toDateString()}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="text-text-secondary text-sm">First Name</label>
          <div className="bg-surface mt-1 rounded border p-3">
            {user.profile?.first_name ? user.profile.first_name : 'NA'}
          </div>
        </div>
        <div>
          <label className="text-text-secondary text-sm">Last Name</label>
          <div className="bg-surface mt-1 rounded border p-3">
            {user.profile?.last_name ? user.profile.last_name : 'NA'}
          </div>
        </div>
        <div>
          <label className="text-text-secondary text-sm">Department</label>
          <div className="bg-surface mt-1 rounded border p-3">
            {user?.department_name ? user?.department_name : 'NA'}
          </div>
        </div>
        <div>
          <label className="text-text-secondary text-sm">Position</label>
          <div className="bg-surface mt-1 rounded border p-3">
            {user?.position_name ? user.position_name : 'NA'}
          </div>
        </div>
      </div>
    </>
  )
}
