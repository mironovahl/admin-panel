import { ChangeEvent, useCallback, useState } from "react"
import { browserLocalPersistence } from "@firebase/auth"
import { Box, Button, TextField } from "@mui/material"
import { setPersistence, signInWithEmailAndPassword } from "firebase/auth"

import { useAuthContext } from "./auth-context"

const useVM = () => {
  const { setTempUser, auth, setStep } = useAuthContext()

  const [loginValue, setLogin] = useState("")
  const [passwordValue, setPassword] = useState("")

  const [err, setErr] = useState<null | string>(null)

  const getOnChangeHandler =
    (field: "password" | "login") =>
    (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      const { [field]: setter } = {
        password: setPassword,
        login: setLogin,
      }

      setter(event.target.value)
    }

  const onSubmit = useCallback(async () => {
    try {
      await setPersistence(auth, browserLocalPersistence)

      const { user } = await signInWithEmailAndPassword(
        auth,
        loginValue,
        passwordValue,
      )

      setTempUser(user)
      setStep((step) => step + 1)
    } catch (error) {
      if (error instanceof Error) {
        setErr(error.message)
      }
    }
  }, [auth, loginValue, passwordValue, setStep, setTempUser])

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
    <Box
      maxWidth={400}
      marginX="auto"
      display="flex"
      flexDirection="column"
      gap="20px"
    >
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

      <Button type="submit" variant="contained" onClick={vm.onSubmit}>
        {"Login"}
      </Button>
    </Box>
  )
}
