import { CREATE_USER_MUTATION } from "@/api/graphql/mutations/user"
import { useModalStore } from "@/store/modalStore"
import { CreateUserData, CreateUserVariables } from "@/types/createUser"
import { ModalFormState } from "@/types/user"
import { useMutation } from "@apollo/client/react"
import { useId, useState } from "react"
import toast from "react-hot-toast"

export function useCreateUser() {
  const formId = useId()
  const { closeModal } = useModalStore()

  const [formData, setFormData] = useState<ModalFormState>({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    departmentId: "",
    positionId: "",
    role: "Employee",
  })

  const [createUser, { loading }] = useMutation<
    CreateUserData,
    CreateUserVariables
  >(CREATE_USER_MUTATION, {
    onCompleted: data => {
      console.log("Успех! Создан юзер с ID:", data.createUser.id)
      toast.success("User created successfully!")
      closeModal()
    },
    onError: err => {
      toast.error(err.message) // Теперь тост появится ровно 1 раз
    },
  })

  const isFormValid = Object.values(formData).every(v => v.trim() !== "")

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()
    createUser({
      variables: {
        user: {
          auth: { email: formData.email, password: formData.password },
          profile: {
            first_name: formData.firstName,
            last_name: formData.lastName,
          },
          departmentId: formData.departmentId,
          positionId: formData.positionId,
          cvsIds: [],
          role: formData.role,
        },
      },
    })
  }

  return {
    formData,
    formId,
    loading,
    isFormValid,
    closeModal,
    handleChange,
    handleRegister,
  }
}
