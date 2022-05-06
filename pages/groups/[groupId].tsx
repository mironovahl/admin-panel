/* eslint-disable unicorn/filename-case */
import { Group } from "src/group"
import { WithAuth } from "src/with-auth"

export default () => {
  return (
    <WithAuth isProtectedPage roles={["admin"]}>
      <Group />
    </WithAuth>
  )
}
