import { Eye, EyeOff } from "lucide-react"
import { HTMLInputTypeAttribute } from "react"

interface Props {
  currentType: HTMLInputTypeAttribute | undefined
  setCurrentType: (type: HTMLInputTypeAttribute) => void
}

export function ShowPassword({ currentType, setCurrentType }: Props) {
  const changeType = () => {
    if (currentType === "password") {
      setCurrentType("text")
    } else {
      setCurrentType("password")
    }
  }

  return (
    <button
      className="absolute right-3 top-1/2 -translate-y-1/2 hover:bg-surface-active duration-300 p-1.5 rounded-full cursor-pointer z-10"
      type="button"
      onClick={changeType}
      aria-label={
        currentType === "password" ? "Show password" : "Hide password"
      }
    >
      {currentType === "password" ? <Eye /> : <EyeOff />}
    </button>
  )
}
