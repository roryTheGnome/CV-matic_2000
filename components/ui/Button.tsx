import { ComponentProps } from "react"

interface Props extends ComponentProps<"button"> {
  isLoading?: boolean
  className?: string
}

export function Button({ isLoading = false, className, ...props }: Props) {
  return (
    <button
      className={`bg-primary rounded-full p-3 w-full max-w-57 shadow-md cursor-pointer hover:brightness-110 duration-300 disabled:bg-surface-disabled uppercase ${className}`}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? "Loading..." : props.children}
    </button>
  )
}
