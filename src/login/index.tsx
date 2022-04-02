import { useAuthContext } from "./auth-context"
import { FirstFactorAuth } from "./first-factor-auth"
import { SecondFactorAuth } from "./second-factor-auth"

const Auth = [FirstFactorAuth, SecondFactorAuth]

const useVM = () => {
  const { step } = useAuthContext()
  const Сontent = Auth[step]

  return { Сontent }
}

export const LoginPage = () => {
  const vm = useVM()

  return (
    <div>
      <vm.Сontent />
    </div>
  )
}
