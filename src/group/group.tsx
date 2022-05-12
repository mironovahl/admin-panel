import { FC } from "react"
import AutorenewIcon from "@mui/icons-material/Autorenew"
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline"
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline"
import HelpOutlineIcon from "@mui/icons-material/HelpOutline"
import { Box, Button, styled, Typography } from "@mui/material"
import { DataGrid, GridColDef } from "@mui/x-data-grid"

import { User } from "../types"
import { useVM } from "./group-vm"
import { UserModal } from "./user-modal"

const Root = styled(Box)`
  display: flex;
  flex-direction: column;
`

const GridRoot = styled(Box)`
  height: 500px;
  margin-top: 8px;
`

const iconMap: Record<User["status"], FC> = {
  issued: CheckCircleOutlineIcon,
  pending: AutorenewIcon,
  blocked: ErrorOutlineIcon,
  requested: HelpOutlineIcon,
}

const colors: Record<User["status"], "error" | "info" | "success" | "warning"> =
  {
    issued: "success",
    pending: "info",
    blocked: "error",
    requested: "warning",
  }

const columns: GridColDef[] = [
  { field: "name", headerName: "Имя", minWidth: 240 },
  { field: "birthday", headerName: "Дата рождения", minWidth: 140 },
  { field: "createdAt", headerName: "Дата создания", minWidth: 140 },
  { field: "updatedAt", headerName: "Дата обновления", minWidth: 140 },
  {
    field: "status",
    headerName: "Статус сертификата",
    minWidth: 200,
    renderCell: (props) => {
      const Icon =
        iconMap[props.value as keyof typeof iconMap] ?? ErrorOutlineIcon

      return (
        <Button
          startIcon={<Icon />}
          variant="outlined"
          color={colors[props.value as keyof typeof colors] ?? "default"}
        >
          {props.value}
        </Button>
      )
    },
  },
]

export const Group = () => {
  const vm = useVM()

  return (
    <Root>
      <Box>
        <Typography>{`Группа: ${vm.groupData?.name}`}</Typography>
        <Typography>{`Семестр: ${vm.groupData?.semester}`}</Typography>
      </Box>

      <Box marginTop={1}>
        <UserModal onAdd={vm.addUserAsync} />
      </Box>

      <GridRoot>
        <DataGrid
          loading={vm.loading}
          rows={vm.users}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10]}
        />
      </GridRoot>
    </Root>
  )
}
