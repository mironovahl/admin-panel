import { useEffect, useState } from "react"
import { Button } from "@mui/material"
import { DataGrid, GridColDef } from "@mui/x-data-grid"
import { collection, getDocs } from "firebase/firestore"
import { router } from "next/client"

import { useFirebaseContext } from "../firebase-context"
import { Group } from "../types"
import { AddGroup } from "./add-group"

const columns: GridColDef[] = [
  { field: "name", headerName: "Group", minWidth: 240 },
  { field: "semester", headerName: "Semester", minWidth: 240 },
]

export const Groups = () => {
  const { db } = useFirebaseContext()
  const [groups, setGroups] = useState<Group[]>([])
  const [open, setOpen] = useState(false)

  const handleOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const getGroups = async () => {
    const querySnapshot = await getDocs(collection(db, "groups"))

    querySnapshot.forEach((doc) => {
      setGroups((prev) => [...prev, doc.data() as Group])
    })
  }

  const openGroup = (id: string) => {
    router.push(`/groups/${id}`)
  }

  useEffect(() => {
    getGroups()
  }, [])

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <Button onClick={handleOpen}>{"Add Group"}</Button>

      <AddGroup open={open} handleClose={handleClose} />

      <div style={{ height: 600, width: "100%" }}>
        <DataGrid
          onRowClick={(row) => openGroup(String(row.id))}
          rows={groups}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[5]}
        />
      </div>
    </div>
  )
}
