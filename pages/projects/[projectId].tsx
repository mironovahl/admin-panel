/* eslint-disable unicorn/filename-case */
import { Project } from "src/project"
import { WithAuth } from "src/with-auth"

export default () => {
  return (
    <WithAuth isProtectedPage roles={["admin"]}>
      <Project />
    </WithAuth>
  )
}
