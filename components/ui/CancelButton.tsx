interface Props {
  closeModal: () => void
}

export function CancelButton({ closeModal }: Props) {
  return (
    <button
      type="button"
      onClick={() => closeModal()}
      className="flex items-center justify-center cursor-pointer duration-300 disabled:bg-surface-disabled disabled:text-text-primary/40 uppercase p-3  bg-transparent rounded-full w-full max-w-57 hover:brightness-110 border border-input-border text-text-secondary hover:text-text-primary hover:border-text-primary"
    >
      CANCEL
    </button>
  )
}
