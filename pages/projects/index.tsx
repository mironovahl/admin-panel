import { Projects } from "src/projects"
import { WithAuth } from "src/with-auth"

export default () => (
  <WithAuth isProtectedPage={true} roles={["admin"]}>
    <Projects />
  </WithAuth>
)
