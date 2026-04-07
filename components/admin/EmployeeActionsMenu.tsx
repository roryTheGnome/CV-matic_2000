'use client'

import { useActionMenu } from '@/lib/hooks/useActionMenu'
import { ModalData, ModalType } from '@/store/modalStore'
import { UserRoundSearch, MoreVertical, Pencil, Trash2 } from 'lucide-react'
import Link from 'next/link'

interface Props {
  deleteType: ModalType
  editType: ModalType
  item: ModalData
}

export function EmployeeActionsMenu({ editType, deleteType, item }: Props) {
  const { menuRef, isOpen, setIsOpen, handleEdit, handleDelete } =
    useActionMenu(deleteType, editType, item)

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-700/50 hover:text-white"
        aria-label="Open actions"
      >
        <MoreVertical size={20} />
      </button>

      {isOpen && (
        <div className="bg-background border-input-border absolute top-full right-0 z-10 w-36 overflow-hidden border shadow-xl">
          <Link
            href={`/users/${item.id}`}
            className="flex w-full items-center px-4 py-2.5 text-sm text-gray-300 transition-colors hover:bg-black/10 hover:text-white"
          >
            <UserRoundSearch size={16} className="mr-3 text-gray-400" />
            Profile
          </Link>

          <button
            onClick={handleEdit}
            className="flex w-full items-center px-4 py-2.5 text-sm text-gray-300 transition-colors hover:bg-black/10 hover:text-white"
          >
            <Pencil size={16} className="mr-3 text-gray-400" />
            Edit
          </button>

          <button
            onClick={handleDelete}
            className="flex w-full items-center px-4 py-2.5 text-sm text-red-400 transition-colors hover:bg-red-500/10 hover:text-red-300"
          >
            <Trash2 size={16} className="mr-3" />
            Delete
          </button>
        </div>
      )}
    </div>
  )
}
