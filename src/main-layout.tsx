import { FC, Fragment } from "react"
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings"
import { Box, Button, IconButton, Link as MuiLink, styled } from "@mui/material"
import Link from "next/link"

import { useLogger } from "./logger"
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
  const { logoutAsync, loading, userRole } = useAuthContext()
  const logger = useLogger()

  const showExtraLinks = userRole === "admin"

  const onLogoutAsync = async () => {
    await logger("sign-out")
    await logoutAsync()
  }

  return { loading, onLogoutAsync, showExtraLinks }
}

export const MainLayout: FC = (props) => {
  const { children } = props

  const vm = useVM()

  return (
    <Root>
      {!vm.loading && (
        <HeaderRoot>
          <Box display="flex" alignItems="center">
            <IconButton color="primary">
              <Link href="/">
                <AdminPanelSettingsIcon />
              </Link>
            </IconButton>

            {vm.showExtraLinks && (
              <Fragment>
                <Box marginX={1}>
                  <Link href="/projects" passHref>
                    <MuiLink>{"Projects"}</MuiLink>
                  </Link>
                </Box>

                <Link href="/journal" passHref>
                  <MuiLink>{"Journal"}</MuiLink>
                </Link>
              </Fragment>
            )}
          </Box>

          <Button onClick={vm.onLogoutAsync} variant="outlined">
            {"Logout"}
          </Button>
        </HeaderRoot>
      )}

      <Body>{children}</Body>
    </Root>
  )
}
