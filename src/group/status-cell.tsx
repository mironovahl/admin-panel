import { FC, Fragment, useState } from "react"
import AutorenewIcon from "@mui/icons-material/Autorenew"
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline"
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline"
import HelpOutlineIcon from "@mui/icons-material/HelpOutline"
import {
  Button,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from "@mui/material"
import { SvgIconProps } from "@mui/material/SvgIcon/SvgIcon"
import { GridRenderCellParams } from "@mui/x-data-grid/models/params/gridCellParams"
import { doc, updateDoc } from "firebase/firestore"

import { colors } from "../colors-map"
import { useFirebaseContext } from "../firebase-context"
import { Status, User } from "../types"
import { getIsoDate } from "../utils/get-iso-date"

const iconMap: Record<Status, FC<SvgIconProps>> = {
  issued: CheckCircleOutlineIcon,
  pending: AutorenewIcon,
  blocked: ErrorOutlineIcon,
  requested: HelpOutlineIcon,
}

const menuOptions: Record<
  Status,
  Array<{ newStatus: Status; title: string }>
> = {
  issued: [
    { newStatus: "pending", title: "Reissue" },
    { newStatus: "blocked", title: "Block" },
  ],
  pending: [
    { newStatus: "pending", title: "Reissue" },
    { newStatus: "blocked", title: "Cancel" },
  ],
  blocked: [{ newStatus: "pending", title: "Reissue" }],
  requested: [
    { newStatus: "pending", title: "Approve" },
    { newStatus: "blocked", title: "Decline" },
  ],
}

const useVM = (arg: GridRenderCellParams<Status, User>) => {
  const { value, row: user } = arg

  const [anchorEl, setAnchorElement] = useState<HTMLButtonElement | null>(null)
  const [loading, setLoading] = useState(false)

  const { db } = useFirebaseContext()

  const Icon = iconMap[value] ?? ErrorOutlineIcon

  const options = menuOptions[value]

  const onClickAsync = async (newStatus: Status) => {
    setLoading(true)
    const userRef = doc(db, "users", user.id)

    await updateDoc(userRef, {
      status: newStatus,
      updatedAt: getIsoDate(),
    })

    setLoading(false)
    setAnchorElement(null)
  }

  return { anchorEl, options, setAnchorElement, Icon, loading, onClickAsync }
}

export const StatusCell = (props: GridRenderCellParams<Status, User>) => {
  const { value } = props

  const vm = useVM(props)

  return (
    <Fragment>
      <Button
        startIcon={<vm.Icon />}
        variant="outlined"
        color={colors[value] ?? "default"}
        onClick={(e) => vm.setAnchorElement(e.currentTarget)}
      >
        {value}
      </Button>

      <Menu
        anchorEl={vm.anchorEl}
        open={Boolean(vm.anchorEl)}
        onClose={() => vm.setAnchorElement(null)}
      >
        {vm.options.map((x) => {
          const MenuIcon = iconMap[x.newStatus]

          return (
            <MenuItem
              key={`${x.title}-${x.newStatus}`}
              onClick={() => vm.onClickAsync(x.newStatus)}
              disabled={vm.loading}
            >
              <ListItemIcon>
                <MenuIcon color={colors[x.newStatus]} />
              </ListItemIcon>
              <ListItemText>{x.title}</ListItemText>
            </MenuItem>
          )
        })}
      </Menu>
    </Fragment>
  )
}
