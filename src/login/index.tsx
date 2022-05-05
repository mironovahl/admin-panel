import { useAuthContext } from "./auth-context"
import { FirstFactorAuth } from "./first-factor-auth"
import { SecondFactorAuth } from "./second-factor-auth"

const Auth = [FirstFactorAuth, SecondFactorAuth]

const useVM = () => {
  const { step } = useAuthContext()
  const Content = Auth[step]

  return { Content }
}

export const LoginPage = () => {
  const vm = useVM()

  return (
    <div>
      <vm.Content />
    </div>
  )
}
