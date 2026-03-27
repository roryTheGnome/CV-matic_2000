import { Button } from "../ui/Button"

export function CreateUserDialog() {
  return (
    <dialog>
      <h3>Create user</h3>
      <form></form>
      <div>
        <Button disabled>Cancel</Button>
        <Button disabled>Create</Button>
      </div>
    </dialog>
  )
}
