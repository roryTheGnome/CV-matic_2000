import { LucideIcon } from "lucide-react"
import { ComponentProps } from "react"

interface Props extends ComponentProps<"button"> {
  isLoading?: boolean
  className?: string
  isTextButton?: boolean
  Icon?: LucideIcon
}

export function Button({
  isLoading = false,
  className,
  isTextButton = false,
  Icon,
  ...props
}: Props) {
  return (
    <button
      className={`flex items-center justify-center cursor-pointer duration-300 disabled:bg-surface-disabled disabled:text-text-primary/40 uppercase ${isTextButton ? "hover:brightness-140 font-semibold" : "p-3  bg-primary rounded-full shadow-md w-full max-w-57 hover:brightness-110"} ${className}`}
      disabled={isLoading}
      {...props}
    >
      {Icon != undefined && <Icon />}
      {isLoading ? "Loading..." : props.children}
    </button>
  )
}
