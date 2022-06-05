import { Box, styled, Typography } from "@mui/material"
import { DataGrid, GridColDef } from "@mui/x-data-grid"

import { config } from "../config"
import { getDateFormatter } from "../utils/get-date-formatter"
import { useVM } from "./project-vm"
import { StatusCell } from "./status-cell"
import { UserModal } from "./user-modal"

const Root = styled(Box)`
  display: flex;
  flex-direction: column;
  height: 100%;
`

const GridRoot = styled(Box)`
  margin-top: 8px;
`

const columns: GridColDef[] = [
  { field: "name", headerName: "Name", minWidth: 240 },
  {
    field: "birthday",
    headerName: "Birthday",
    minWidth: 140,
  },
  {
    field: "createdAt",
    headerName: "Created At",
    minWidth: 140,
    valueFormatter: getDateFormatter(config.CERTIFICATE_DATE_FORMAT),
  },
  {
    field: "updatedAt",
    headerName: "Updated At",
    minWidth: 140,
    valueFormatter: getDateFormatter(config.CERTIFICATE_DATE_FORMAT),
  },
  {
    field: "status",
    headerName: "Certificate Status",
    minWidth: 200,
    renderCell: StatusCell,
  },
]

export const Project = () => {
  const vm = useVM()

  return (
    <Root ref={vm.rootRef}>
      <Box ref={vm.infoRef}>
        <Box>
          <Typography>{`Project: ${vm.projectData?.name}`}</Typography>
        </Box>

        <Box marginTop={1}>
          <UserModal onAdd={vm.addUserAsync} />
        </Box>
      </Box>

      <GridRoot height={vm.tableHeight}>
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
