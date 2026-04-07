"use client"

import { useActionMenu } from "@/lib/hooks/useActionMenu"
import { ModalData, ModalType } from "@/store/modalStore"
import { Info, MoreVertical, Pencil, Trash2 } from "lucide-react"
import Link from 'next/link'

interface Props {
  deleteType: ModalType
  editType: ModalType
  item: ModalData
  isAdmin:boolean
}

export function ProjectsActionsMenu({ editType, deleteType, item, isAdmin }: Props) {
  const {
    menuRef,
    isOpen,
    setIsOpen,
    handleEdit,
    handleDelete,
  } = useActionMenu(deleteType, editType, item)

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
        <div className="absolute right-0 top-full w-36 bg-background border border-input-border shadow-xl z-10 overflow-hidden">

            <Link
              href={`/projects/${item.id}`}
              className="flex items-center w-full px-4 py-2.5 text-sm text-gray-300 hover:bg-black/10 hover:text-white transition-colors"
            >
              <Info  size={16} className="mr-3 text-gray-400" />
              Details
            </Link>
          {isAdmin &&(
            <>
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
            </>
          )}

        </div>
      )}
    </div>
  )
}
