import { ReactNode } from "react"
import { Box, styled } from "@mui/material"

import { LoginPage } from "src/login"
import { WithAuth } from "src/with-auth"

const Root = styled(Box)`
  height: 100vh;
  width: 100vw;
  margin: auto;
  padding: 10vh 0;
`

const Login = () => (
  <WithAuth isProtectedPage={false}>
    <LoginPage />
  </WithAuth>
)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
;(Login as any).layout = (props: { children: ReactNode }) => {
  const { children } = props

  return <Root>{children}</Root>
}

export default Login
