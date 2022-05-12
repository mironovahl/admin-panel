import { Box, styled, Typography } from "@mui/material"
import {
  DataGrid,
  GridColDef,
  GridValueFormatterParams,
} from "@mui/x-data-grid"
import format from "date-fns/format"

import { config } from "../config"
import { useVM } from "./group-vm"
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

const getDateFormatter =
  (dateFormat: string) => (params: GridValueFormatterParams) => {
    return format(new Date((params?.value as string) ?? 0), dateFormat)
  }

const columns: GridColDef[] = [
  { field: "name", headerName: "Имя", minWidth: 240 },
  {
    field: "birthday",
    headerName: "Дата рождения",
    minWidth: 140,
    valueFormatter: getDateFormatter("dd.MM.yyyy"),
  },
  {
    field: "createdAt",
    headerName: "Дата создания",
    minWidth: 140,
    valueFormatter: getDateFormatter(config.CERTIFICATE_DATE_FORMAT),
  },
  {
    field: "updatedAt",
    headerName: "Дата обновления",
    minWidth: 140,
    valueFormatter: getDateFormatter(config.CERTIFICATE_DATE_FORMAT),
  },
  {
    field: "status",
    headerName: "Статус сертификата",
    minWidth: 200,
    renderCell: StatusCell,
  },
]

export const Group = () => {
  const vm = useVM()

  return (
    <Root ref={vm.rootRef}>
      <Box ref={vm.infoRef}>
        <Box>
          <Typography>{`Группа: ${vm.groupData?.name}`}</Typography>
          <Typography>{`Семестр: ${vm.groupData?.semester}`}</Typography>
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
