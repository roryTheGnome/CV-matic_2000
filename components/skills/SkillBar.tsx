import { levelToBgColor, levelToColor } from '@/types/skills'

type Props = {
  level: number
}

export const SkillBar = ({ level }: Props) => {
  return (
    <div
      className={`h-1.5 w-20 overflow-hidden rounded ${levelToBgColor[level]}`}
    >
      <div
        className={`h-full transition-all ${levelToColor[level]}`}
        style={{ width: `${level * 20}%` }}
      />
    </div>
  )
}
