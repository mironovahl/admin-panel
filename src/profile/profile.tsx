import { Fragment, useEffect, useState } from "react"
import HelpOutlineIcon from "@mui/icons-material/HelpOutline"
import { Box, Button, styled, Typography, useTheme } from "@mui/material"
import format from "date-fns/format"
import { doc, onSnapshot, updateDoc } from "firebase/firestore"

import { colors } from "../colors-map"
import { config } from "../config"
import { useFirebaseContext } from "../firebase-context"
import { useLogger } from "../logger"
import { useAuthContext } from "../login/auth-context"
import { CollectionType, Status, User } from "../types"
import { getIsoDate } from "../utils/get-iso-date"
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
  issued: "Issued",
  requested: "Requested",
  blocked: "Blocked",
  pending: "Pending",
}

const useVM = () => {
  const [loading, setLoading] = useState(false)
  const [userRecord, setUser] = useState<User | null>(null)
  const logger = useLogger()

  const { user } = useAuthContext()
  const { db } = useFirebaseContext()

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    let unsubscribe = () => {}

    if (user) {
      const ref = doc(db, CollectionType.USERS, user.uid)

      unsubscribe = onSnapshot(ref, (docData) => {
        setUser(docData.data() as User)
      })
    }

    return unsubscribe
  }, [user, db])

  const requestCertificateAsync = async () => {
    if (user) {
      setLoading(true)

      const ref = doc(db, CollectionType.USERS, user.uid)
      const status = "pending"

      await updateDoc(ref, {
        status,
        updatedAt: getIsoDate(),
      })

      await logger("certificate-status-updated", { id: ref.id, status })

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
            <Typography variant="h6">{"Certificate"}</Typography>

            <Typography>{`Name: ${vm.userRecord.name}`}</Typography>

            <Box display="flex">
              <Box marginRight={1}>
                <Typography>{"Status:"}</Typography>
              </Box>

              <Typography
                color={theme.palette[colors[vm.userRecord.status]].main}
              >
                {title[vm.userRecord.status]}
              </Typography>
            </Box>

            <Typography>
              {`Updated: ${format(
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
          {"Re-issue certificate"}
        </Button>
      </DataRoot>
    </Root>
  )
}
