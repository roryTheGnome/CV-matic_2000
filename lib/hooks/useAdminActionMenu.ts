import { useModalStore } from "@/store/modalStore"
import { useEffect, useRef, useState } from "react"

export const useAdminActionMenu = (userId: string) => {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const { openModal } = useModalStore()

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isOpen])

  const handleEdit = () => {
    openModal("CREATE_USER", { id: userId })
    setIsOpen(false)
  }

  const handleDelete = () => {
    openModal("DELETE_USER", { id: userId })
    setIsOpen(false)
  }

  return { menuRef, isOpen, setIsOpen, handleEdit, handleDelete }
}
