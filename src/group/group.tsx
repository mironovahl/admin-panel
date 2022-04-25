import { FC } from "react"
import AutorenewIcon from "@mui/icons-material/Autorenew"
import CheckIcon from "@mui/icons-material/Check"
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline"
import { Box, Chip, styled, Typography } from "@mui/material"
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
  issued: CheckIcon,
  pending: AutorenewIcon,
  blocked: ErrorOutlineIcon,
}

const colors: Record<User["status"], "error" | "info" | "success"> = {
  issued: "success",
  pending: "info",
  blocked: "error",
}

const columns: GridColDef[] = [
  { field: "name", headerName: "Student name", minWidth: 240 },
  {
    field: "status",
    headerName: "Certificate status",
    minWidth: 140,
    renderCell: (props) => {
      const Icon =
        iconMap[props.value as keyof typeof iconMap] ?? ErrorOutlineIcon

      return (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          width="100%"
        >
          <Chip
            variant="outlined"
            icon={<Icon />}
            label={props.value}
            color={colors[props.value as keyof typeof colors] ?? "default"}
          />
        </Box>
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
          // onRowClick={(row) => vm.redirectToGroupAsync(String(row.id))}
          rows={vm.users}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10]}
        />{" "}
      </GridRoot>
    </Root>
  )
}
