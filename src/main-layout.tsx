import { FC } from "react"
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings"
import { Box, Button, IconButton, styled } from "@mui/material"
import Link from "next/link"

import { useAuthContext } from "./login/auth-context"

const Root = styled(Box)`
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
`

const Body = styled(Box)`
  flex: 1;
  padding: 8px;
`

const HeaderRoot = styled(Box)`
  display: flex;
  margin: 0 8px;
  padding: 8px 0;
  justify-content: space-between;
  align-items: center;
`

const useVM = () => {
  const { logoutAsync, loading } = useAuthContext()

  return { loading, logoutAsync }
}

export const MainLayout: FC = (props) => {
  const { children } = props

  const vm = useVM()

  return (
    <Root>
      {!vm.loading && (
        <HeaderRoot>
          <IconButton color="primary">
            <Link href="/">
              <AdminPanelSettingsIcon />
            </Link>
          </IconButton>

          <Button onClick={() => vm.logoutAsync()} variant="outlined">
            {"Logout"}
          </Button>
        </HeaderRoot>
      )}

      <Body>{children}</Body>
    </Root>
  )
}
