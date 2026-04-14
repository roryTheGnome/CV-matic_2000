'use client'

import { useActionMenu } from '@/lib/hooks/useActionMenu'
import { ModalData, ModalType } from '@/store/modalStore'
import { Info } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { ActionMenuLayout } from './ActionMenuLayout'
import { ActionDeleteButton } from './_ui/ActionDeleteButton'
import { ActionEditButton } from './_ui/ActionEditButton'

interface Props {
  deleteType: ModalType
  editType: ModalType
  item: ModalData
  cvId?: string
}

export function ActionsMenu({ editType, deleteType, item, cvId }: Props) {
  const {
    menuRef,
    isOpen,
    setIsOpen,
    handleEdit,
    handleDelete,
    handleCvDetails,
  } = useActionMenu(deleteType, editType, item)
  const t = useTranslations('ActionMenu')

  return (
    <ActionMenuLayout menuRef={menuRef} setIsOpen={() => setIsOpen(!isOpen)}>
      {isOpen && (
        <div className="bg-background border-input-border absolute top-full right-0 z-10 w-36 overflow-hidden border shadow-xl">
          {cvId ? (
            <button
              onClick={() => handleCvDetails(cvId)}
              className="flex w-full items-center px-4 py-2.5 text-sm text-gray-300 transition-colors hover:bg-black/10 hover:text-white"
            >
              <Info size={16} className="mr-3" />
              {t('details')}
            </button>
          ) : (
            <ActionEditButton handleEdit={handleEdit} />
          )}
          <ActionDeleteButton handleDelete={handleDelete} />
        </div>
      )}
    </ActionMenuLayout>
  )
}
