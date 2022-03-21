import { ChangeEvent, useState } from "react"
import { Button, TextField } from "@mui/material"

import { useAuthContext } from "./auth-context"

export const LoginPage = () => {
  const [loginValue, setLoginValue] = useState("")
  const [passwordValue, setPasswordValue] = useState("")

  const onChangeLogin = ({
    target,
  }: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setLoginValue(target.value)
  }

  const onChangePassword = ({
    target,
  }: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setPasswordValue(target.value)
  }

  const { onAuthUser } = useAuthContext()

  const onClick = () => {
    onAuthUser(loginValue, passwordValue)
  }

  return (
    <p>
      <TextField
        placeholder="Enter your email"
        type="email"
        required
        value={loginValue}
        onChange={onChangeLogin}
      />
      <TextField
        placeholder="Enter your password"
        type="password"
        required
        value={passwordValue}
        onChange={onChangePassword}
      />

      <Button type="submit" variant="contained" onClick={onClick}>
        {"Login"}
      </Button>
    </p>
  )
}
