import { Journal } from "src/journal"
import { WithAuth } from "src/with-auth"

export default () => {
  return (
    <WithAuth isProtectedPage roles={["admin"]}>
      <Journal />
    </WithAuth>
  )
}
