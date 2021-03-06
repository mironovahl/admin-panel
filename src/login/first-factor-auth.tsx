import { ChangeEvent, FormEvent, useCallback, useState } from "react"
import { browserLocalPersistence } from "@firebase/auth"
import { Button, styled, TextField } from "@mui/material"
import { setPersistence, signInWithEmailAndPassword } from "firebase/auth"

import { useLogger } from "../logger"
import { useAuthContext } from "./auth-context"

const Root = styled("form")`
  max-width: 400px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
`

const useVM = () => {
  const { setTempUser, auth, setStep } = useAuthContext()
  const logger = useLogger()

  const [loginValue, setLogin] = useState("")
  const [passwordValue, setPassword] = useState("")

  // TODO: handle error
  const [_, setErr] = useState<null | string>(null)

  const getOnChangeHandler =
    (field: "password" | "login") =>
    (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      const { [field]: setter } = {
        password: setPassword,
        login: setLogin,
      }

      setter(event.target.value)
    }

  const onSubmit = useCallback(
    async (event: FormEvent) => {
      event.preventDefault()

      try {
        await setPersistence(auth, browserLocalPersistence)

        const { user } = await signInWithEmailAndPassword(
          auth,
          loginValue,
          passwordValue,
        )

        await logger("sign-in")

        setTempUser(user)
        setStep((step) => step + 1)
      } catch (error) {
        if (error instanceof Error) {
          setErr(error.message)
          await logger("sign-in-failure")
        }
      }
    },
    [auth, logger, loginValue, passwordValue, setStep, setTempUser],
  )

  return {
    onSubmit,
    getOnChangeHandler,
    passwordValue,
    loginValue,
  }
}

export const FirstFactorAuth = () => {
  const vm = useVM()

  return (
    <Root onSubmit={vm.onSubmit}>
      <TextField
        placeholder="Enter your email"
        type="email"
        required
        value={vm.loginValue}
        onChange={vm.getOnChangeHandler("login")}
      />
      <TextField
        placeholder="Enter your password"
        type="password"
        required
        value={vm.passwordValue}
        onChange={vm.getOnChangeHandler("password")}
      />

      <Button type="submit" variant="contained">
        {"Login"}
      </Button>
    </Root>
  )
}
