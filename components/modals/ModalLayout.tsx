import { useModalStore } from "@/store/modalStore"
import { ReactNode } from "react"
import { ModalHeader } from "./ModalHeader"

interface Props {
  title: string
  children: ReactNode
  maxWidth?: string
}

export function ModalLayout({
  title,
  children,
  maxWidth = "max-w-4xl",
}: Props) {
  const { closeModal } = useModalStore()

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-2 sm:p-4"
      onClick={closeModal}
    >
      <div
        className={`bg-background text-text-primary w-full ${maxWidth} rounded-md shadow-2xl max-h-[90vh] flex flex-col`}
        onClick={e => e.stopPropagation()}
      >
        <div className="p-4 sm:px-6 pt-6 shrink-0">
          <ModalHeader title={title} />
        </div>

        <div className="p-4 sm:px-6 pb-6 overflow-y-auto">{children}</div>
      </div>
    </div>
  )
}
