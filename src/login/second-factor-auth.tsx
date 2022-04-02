import { ChangeEvent, Fragment, useCallback, useEffect, useState } from "react"
import { Button, TextField } from "@mui/material"
import {
  ConfirmationResult,
  linkWithPhoneNumber,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth"

import { useAuthContext } from "./auth-context"

const useVM = () => {
  const { setUser, tempUser, auth } = useAuthContext()

  const [pin, setPin] = useState("")
  const [pinCb, setPinCb] = useState<null | ConfirmationResult>(null)

  const recaptchaComplete = Boolean(pinCb)
  const [error, setError] = useState<null | string>(null)

  const getCode = useCallback(async () => {
    if (tempUser?.phoneNumber) {
      const appVerifier = new RecaptchaVerifier("recaptcha-container", {}, auth)

      const res = await signInWithPhoneNumber(
        auth,
        tempUser?.phoneNumber,
        appVerifier,
      )

      setPinCb(res)
    }

    if (tempUser && !tempUser?.phoneNumber) {
      const appVerifier = new RecaptchaVerifier("recaptcha-container", {}, auth)

      const res = await linkWithPhoneNumber(
        tempUser,
        "+79952974342",
        appVerifier,
      )

      setPinCb(res)
    }
  }, [auth, tempUser])

  useEffect(() => {
    getCode()
  }, [])

  const onChange = (
    event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => {
    setPin(event.target.value)
  }

  const onSubmitCode = useCallback(async () => {
    try {
      const result = await pinCb?.confirm(pin)

      setUser(result?.user ?? null)
    } catch (error) {
      setError(String(error))
    }
  }, [pin, pinCb, setUser])

  return {
    onChange,
    pin,
    onSubmitCode,
    recaptchaComplete,
  }
}

export const SecondFactorAuth = () => {
  const vm = useVM()

  return (
    <div>
      {vm.recaptchaComplete && (
        <Fragment>
          <TextField
            placeholder="Enter code"
            type="code"
            required
            value={vm.pin}
            onChange={vm.onChange}
          />
          <Button type="submit" variant="contained" onClick={vm.onSubmitCode}>
            {"send"}
          </Button>{" "}
        </Fragment>
      )}

      {!vm.recaptchaComplete && <div id="recaptcha-container" />}
    </div>
  )
}
