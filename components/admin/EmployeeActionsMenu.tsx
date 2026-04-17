'use client'

import { useActionMenu } from '@/lib/hooks/useActionMenu'
import { ModalData, ModalType } from '@/store/modalStore'
import { UserRoundSearch } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { ActionMenuLayout } from './ActionMenuLayout'
import { ActionDeleteButton } from './_ui/ActionDeleteButton'
import { ActionEditButton } from './_ui/ActionEditButton'

interface Props {
  deleteType: ModalType
  editType: ModalType
  item: ModalData
}

export function EmployeeActionsMenu({ editType, deleteType, item }: Props) {
  const { menuRef, isOpen, setIsOpen, handleEdit, handleDelete } =
    useActionMenu(deleteType, editType, item)
  const t = useTranslations('ActionMenu')

  return (
    <ActionMenuLayout menuRef={menuRef} setIsOpen={() => setIsOpen(!isOpen)}>
      {isOpen && (
        <div className="bg-surface border-input-border absolute top-full right-0 z-10 w-36 overflow-hidden border shadow-xl">
          <Link
            href={`/users/${item.id}`}
            className="text-text-secondary hover:bg-surface-active hover:text-text-primary flex w-full items-center px-4 py-2.5 text-sm transition-colors"
          >
            <UserRoundSearch size={16} className="text-text-secondary mr-3" />
            {t('profile')}
          </Link>

          <ActionEditButton handleEdit={handleEdit} />

          <ActionDeleteButton handleDelete={handleDelete} />
        </div>
      )}
    </ActionMenuLayout>
  )
}
