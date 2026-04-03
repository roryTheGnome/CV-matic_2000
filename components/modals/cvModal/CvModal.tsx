import { ModalLayout } from "../ModalLayout"
import { CvForm } from "./CvForm"

export function CvModal() {
  return (
    <ModalLayout title={"Create cv"} maxWidth="max-w-5xl">
      <CvForm />
    </ModalLayout>
  )
}
