import { Profile } from "src/profile"
import { WithAuth } from "src/with-auth"

export default () => {
  return (
    <WithAuth isProtectedPage roles={["student"]}>
      <Profile />
    </WithAuth>
  )
}
