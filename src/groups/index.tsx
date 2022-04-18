import { useCallback, useEffect, useState } from "react"
import { Box, Button, styled } from "@mui/material"
import { DataGrid, GridColDef } from "@mui/x-data-grid"
import { collection, getDocs } from "firebase/firestore"
import { useRouter } from "next/router"

import { useFirebaseContext } from "../firebase-context"
import { Group } from "../types"
import { AddGroup } from "./add-group"

const Root = styled(Box)`
  width: 100%;
  height: 100%;
`

const GridRoot = styled(Box)`
  height: 600px;
  width: 100%;
`

const useVM = () => {
  const { db } = useFirebaseContext()
  const [groups, setGroups] = useState<Group[]>([])
  const [isOpen, setOpen] = useState(false)

  const router = useRouter()

  const onOpen = () => {
    setOpen(true)
  }

  const onClose = () => {
    setOpen(false)
  }

  const getGroups = useCallback(async () => {
    const querySnapshot = await getDocs(collection(db, "groups"))

    querySnapshot.forEach((doc) => {
      setGroups((prev) => [...prev, doc.data() as Group])
    })
  }, [db])

  const redirectToGroupAsync = async (id: string) => {
    await router.push(`/groups/${id}`)
  }

  useEffect(() => {
    ;(async () => await getGroups())()
  }, [getGroups])

  return { redirectToGroupAsync, onClose, onOpen, isOpen, groups }
}

const columns: GridColDef[] = [
  { field: "name", headerName: "Group", minWidth: 240 },
  { field: "semester", headerName: "Semester", minWidth: 240 },
]

export const Groups = () => {
  const vm = useVM()

  return (
    <Root>
      <Box marginBottom={1}>
        <Button onClick={vm.onOpen}>{"Add Group"}</Button>
      </Box>

      <AddGroup isOpen={vm.isOpen} onClose={vm.onClose} />

      <GridRoot>
        <DataGrid
          onRowClick={(row) => vm.redirectToGroupAsync(String(row.id))}
          rows={vm.groups}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10]}
        />
      </GridRoot>
    </Root>
  )
}
