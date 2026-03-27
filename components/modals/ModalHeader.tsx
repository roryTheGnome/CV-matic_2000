import { useModalStore } from "@/store/modalStore"
import { X } from "lucide-react"

interface Props {
  title: string
}

export function ModalHeader({ title }: Props) {
  const { closeModal } = useModalStore()

  return (
    <div className="flex justify-between items-center">
      <h2 className="text-2xl font-bold">{title}</h2>
      <button
        onClick={() => closeModal()}
        className="p-1 text-gray-400 hover:text-text-primary transition-colors"
        aria-label="Close"
      >
        <X size={24} />
      </button>
    </div>
  )
}
