import { Fragment, useEffect, useState } from "react"
import HelpOutlineIcon from "@mui/icons-material/HelpOutline"
import { Box, Button, styled, Typography, useTheme } from "@mui/material"
import format from "date-fns/format"
import { doc, onSnapshot, updateDoc } from "firebase/firestore"

import { colors } from "../colors-map"
import { config } from "../config"
import { useFirebaseContext } from "../firebase-context"
import { useAuthContext } from "../login/auth-context"
import { Status, User } from "../types"
import { ChangePasswordForm } from "./change-password-form"

const Root = styled(Box)`
  height: 100%;
  width: 100%;

  display: flex;
  align-items: flex-start;
  padding: 20px;
  gap: 40px;
`

const DataRoot = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 20px;
`

const title: Record<Status, string> = {
  issued: "Выпущен",
  requested: "Запрошен",
  blocked: "Заблокирован",
  pending: "Обрабатывается",
}

const useVM = () => {
  const [loading, setLoading] = useState(false)
  const [userRecord, setUser] = useState<User | null>(null)

  const { user } = useAuthContext()
  const { db } = useFirebaseContext()

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    let unsubscribe = () => {}

    if (user) {
      const ref = doc(db, "users", user.uid)

      unsubscribe = onSnapshot(ref, (docData) => {
        setUser(docData.data() as User)
      })
    }

    return unsubscribe
  }, [user, db])

  const requestCertificateAsync = async () => {
    if (user) {
      setLoading(true)

      const ref = doc(db, "users", user.uid)

      await updateDoc(ref, {
        status: "pending",
        updatedAt: new Date().toISOString(),
      })

      setLoading(false)
    }
  }

  return { loading, userRecord, requestCertificateAsync }
}

export const Profile = () => {
  const vm = useVM()

  const theme = useTheme()

  return (
    <Root>
      <ChangePasswordForm />

      <DataRoot>
        {vm.userRecord && (
          <Fragment>
            <Typography variant="h6">{"Сертификат"}</Typography>

            <Typography>{`Имя: ${vm.userRecord.name}`}</Typography>

            <Box display="flex">
              <Box marginRight={1}>
                <Typography>{"Статус:"}</Typography>
              </Box>

              <Typography
                color={theme.palette[colors[vm.userRecord.status]].main}
              >
                {title[vm.userRecord.status]}
              </Typography>
            </Box>

            <Typography>
              {`Обновлен: ${format(
                new Date(vm.userRecord.updatedAt),
                config.CERTIFICATE_DATE_FORMAT,
              )}`}
            </Typography>
          </Fragment>
        )}

        <Button
          startIcon={<HelpOutlineIcon />}
          variant="outlined"
          color="warning"
          disabled={vm.loading}
          onClick={vm.requestCertificateAsync}
        >
          {"Перевыпустить Сертификат"}
        </Button>
      </DataRoot>
    </Root>
  )
}
