import { Box, Button, styled } from "@mui/material"
import { DataGrid, GridColDef } from "@mui/x-data-grid"

import { config } from "../config"
import { getDateFormatter } from "../utils/get-date-formatter"
import { AddProject } from "./add-project"
import { useVM } from "./projects-vm"

const Root = styled(Box)`
  width: 100%;
  height: 100%;
`

const GridRoot = styled(Box)`
  height: 600px;
  width: 100%;
`

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", minWidth: 250 },
  { field: "name", headerName: "Project Name", flex: 1 },
  {
    field: "createdAt",
    headerName: "CreatedAt",
    minWidth: 240,
    valueFormatter: getDateFormatter(config.CERTIFICATE_DATE_FORMAT),
  },
]

export const Projects = () => {
  const vm = useVM()

  return (
    <Root>
      <Box marginBottom={1}>
        <Button onClick={vm.onOpen}>{"Add Project"}</Button>
      </Box>

      <AddProject isOpen={vm.isOpen} onClose={vm.onClose} />

      <GridRoot>
        <DataGrid
          onRowClick={(row) => vm.redirectToProjectAsync(String(row.id))}
          rows={vm.projects}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10]}
        />
      </GridRoot>
    </Root>
  )
}
