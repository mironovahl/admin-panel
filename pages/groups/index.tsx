import { Groups } from "src/groups"

import { WithAuth } from "../../src/with-auth"

export default () => (
  <WithAuth isProtectedPage={true}>
    <Groups />
  </WithAuth>
)
