interface Props {
  title: string
  subtitle: string
}

export function AuthHeading({ title, subtitle }: Props) {
  return (
    <div className="mb-10">
      <h1 className="font-normal">{title}</h1>
      <span>{subtitle}</span>
    </div>
  )
}
