"use client"

import { useAdminActionMenu } from "@/lib/hooks/useAdminActionMenu"
import { MoreVertical, Pencil, Trash2 } from "lucide-react"

interface Props {
  userId: string
}

export function AdminActionsMenu({ userId }: Props) {
  const { menuRef, isOpen, setIsOpen, handleEdit, handleDelete } =
    useAdminActionMenu(userId)

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-full transition-colors"
        aria-label="Open actions"
      >
        <MoreVertical size={20} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-1 w-36 bg-background border border-input-border rounded-lg shadow-xl z-10 overflow-hidden py-1">
          <button
            onClick={handleEdit}
            className="flex items-center w-full px-4 py-2.5 text-sm text-gray-300 hover:bg-black/10 hover:text-white transition-colors"
          >
            <Pencil size={16} className="mr-3 text-gray-400" />
            Edit
          </button>

          <button
            onClick={handleDelete}
            className="flex items-center w-full px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
          >
            <Trash2 size={16} className="mr-3" />
            Delete
          </button>
        </div>
      )}
    </div>
  )
}
