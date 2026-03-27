import { ComponentProps } from "react"

interface Props extends ComponentProps<"option"> {
  value: string | number | readonly string[] | undefined
  title: string
}

export function Option({ value, title }: Props) {
  return (
    <option className="bg-background text-text-primary" value={value}>
      {title}
    </option>
  )
}
