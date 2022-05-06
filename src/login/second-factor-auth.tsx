import { ChangeEvent, Fragment, useCallback, useEffect, useState } from "react"
import { Box, Button, TextField } from "@mui/material"
import {
  ConfirmationResult,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth"
import { useRouter } from "next/router"

import { useAuthContext } from "./auth-context"

const useVM = () => {
  const { setUser, tempUser, auth, setTempUser } = useAuthContext()
  const router = useRouter()

  const [pin, setPin] = useState("")
  const [pinCb, setPinCb] = useState<null | ConfirmationResult>(null)

  const recaptchaComplete = Boolean(pinCb)

  // TODO: handle error
  const [_, setError] = useState<null | string>(null)

  const getCodeAsync = useCallback(async () => {
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
      setUser(tempUser)

      await router.push("/")
    }

    setTempUser(null)
  }, [auth, router, setTempUser, setUser, tempUser])

  useEffect(() => {
    ;(async () => await getCodeAsync())()
  }, [getCodeAsync])

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
    <Box
      maxWidth={400}
      marginX="auto"
      display="flex"
      flexDirection="column"
      gap="20px"
    >
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
          </Button>
        </Fragment>
      )}

      {!vm.recaptchaComplete && <div id="recaptcha-container" />}
    </Box>
  )
}
