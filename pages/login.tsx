import { LoginPage } from "src/login"
import { WithAuth } from "src/with-auth"

export default () => (
  <WithAuth isProtectedPage={false}>
    <LoginPage />
  </WithAuth>
)
