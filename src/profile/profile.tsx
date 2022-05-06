import { Box, styled } from "@mui/material"

import { ChangePasswordForm } from "./change-password-form"

const Root = styled(Box)`
  height: 100%;
  width: 100%;
`

export const Profile = () => {
  return (
    <Root>
      <ChangePasswordForm />
    </Root>
  )
}
