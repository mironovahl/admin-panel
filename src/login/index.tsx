import { ChangeEvent, useCallback, useState } from "react"
import { Button, TextField } from "@mui/material"
import {
  ConfirmationResult,
  getAuth,
  RecaptchaVerifier,
  signInWithEmailAndPassword,
  signInWithPhoneNumber,
} from "firebase/auth"

import { useFirebaseContext } from "../firebase-context"

const useVM = () => {
  const app = useFirebaseContext()

  const [loginValue, setLogin] = useState("")
  const [passwordValue, setPassword] = useState("")
  const [pin, setPin] = useState("")
  const [pinCb, setPinCb] = useState<null | ConfirmationResult>(null)

  const [err, setErr] = useState<null | string>(null)

  const getOnChangeHandler =
    (field: "password" | "login" | "pin") =>
    (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      const { [field]: setter } = {
        password: setPassword,
        login: setLogin,
        pin: setPin,
      }

      setter(event.target.value)
    }

  const onSubmit = useCallback(async () => {
    try {
      const auth = getAuth(app)

      const { user } = await signInWithEmailAndPassword(
        auth,
        loginValue,
        passwordValue,
      )

      const appVerifier = new RecaptchaVerifier("recaptcha-container", {}, auth)

      const res = await signInWithPhoneNumber(
        auth,
        user?.phoneNumber ?? "+79225210512",
        appVerifier,
      )

      setPinCb(res)
    } catch (error) {
      if (error instanceof Error) {
        setErr(error.message)
      }
    }
  }, [app, loginValue, passwordValue])

  const onSubmitCode = useCallback(async () => {
    const result = await pinCb?.confirm(pin)

    console.log({ result })
  }, [pin, pinCb])

  return {
    onSubmit,
    getOnChangeHandler,
    passwordValue,
    loginValue,
    pin,
    onSubmitCode,
  }
}

export const LoginPage = () => {
  const vm = useVM()

  return (
    <div>
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

      <TextField
        placeholder="Enter code"
        type="code"
        required
        value={vm.pin}
        onChange={vm.getOnChangeHandler("pin")}
      />

      <Button type="submit" variant="contained" onClick={vm.onSubmit}>
        {"Login"}
      </Button>

      <Button type="submit" variant="contained" onClick={vm.onSubmitCode}>
        {"send"}
      </Button>

      <div id="recaptcha-container" />
    </div>
  )
}
