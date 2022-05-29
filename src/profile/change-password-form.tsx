import { ChangeEventHandler, FormEvent, useState } from "react"
import * as React from "react"
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from "@firebase/auth"
import { Box, Button, styled, TextField, Typography } from "@mui/material"

import { useLogger } from "../logger"
import { useAuthContext } from "../login/auth-context"

const Root = styled("form")`
  display: flex;
  flex-direction: column;
  max-width: 250px;
`

const useVM = () => {
  const { user } = useAuthContext()

  const logger = useLogger()

  const [oldPassword, setOldPassword] = useState("")
  const [password, setPassword] = useState("")
  const [hasError, setHasError] = useState(false)
  const [loading, setLoading] = useState(false)

  const onPasswordChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setPassword(e.currentTarget.value)
  }

  const onOldPasswordChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setOldPassword(e.currentTarget.value)
  }

  const onSubmitAsync = async (event: FormEvent) => {
    event.preventDefault()

    if (!user) {
      return
    }

    try {
      setHasError(false)
      setLoading(true)

      const credentials = EmailAuthProvider.credential(
        user.email ?? "",
        oldPassword,
      )

      await reauthenticateWithCredential(user, credentials)
      await updatePassword(user, password)
      await logger("password-updated")

      setOldPassword("")
      setPassword("")
    } catch {
      setHasError(true)
    } finally {
      setLoading(false)
    }
  }

  return {
    onPasswordChange,
    password,
    oldPassword,
    onOldPasswordChange,
    onSubmitAsync,
    loading,
    hasError,
  }
}

export const ChangePasswordForm = () => {
  const vm = useVM()

  return (
    <Root onSubmit={vm.onSubmitAsync}>
      <Typography variant="h6">{"Update password"}</Typography>

      <TextField
        label="Old password"
        onChange={vm.onOldPasswordChange}
        value={vm.oldPassword}
        error={vm.hasError}
        disabled={vm.loading}
        variant="standard"
        type="password"
      />

      <TextField
        label="New Password"
        variant="standard"
        value={vm.password}
        onChange={vm.onPasswordChange}
        error={vm.hasError}
        disabled={vm.loading}
        type="password"
      />

      <Box marginTop={2} marginLeft="auto">
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={vm.loading}
        >
          {"Save"}
        </Button>
      </Box>
    </Root>
  )
}
