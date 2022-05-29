import { Box, styled } from "@mui/material"
import { DataGrid, GridColDef } from "@mui/x-data-grid"

import { config } from "../config"
import { getDateFormatter } from "../utils/get-date-formatter"
import { useVM } from "./journal-vm"

const GridRoot = styled(Box)`
  padding: 8px 0;
`

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", minWidth: 100 },
  { field: "email", headerName: "Email", minWidth: 240 },
  { field: "userId", headerName: "User ID", minWidth: 240 },
  {
    field: "createdAt",
    headerName: "Created At",
    minWidth: 140,
    valueFormatter: getDateFormatter(config.CERTIFICATE_DATE_FORMAT),
  },
  {
    field: "event",
    headerName: "Event type",
    minWidth: 200,
  },
  {
    field: "comment",
    headerName: "Comment",
    flex: 1,
  },
]

export const Journal = () => {
  const vm = useVM()

  return (
    <GridRoot height="100%">
      <DataGrid
        loading={vm.loading}
        rows={vm.journal}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[10]}
      />
    </GridRoot>
  )
}
