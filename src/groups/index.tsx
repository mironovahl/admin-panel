import { useEffect, useState } from "react"
import { Button } from "@mui/material"
import { DataGrid, GridColDef } from "@mui/x-data-grid"
import { collection, getDocs } from "firebase/firestore"

import { useFirebaseContext } from "../firebase-context"
import { AddGroup } from "./add-group"
import { Group } from "./types"

const columns: GridColDef[] = [
  { field: "name", headerName: "Group", width: 200 },
  { field: "semester", headerName: "Semester", width: 200 },
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

  useEffect(() => {
    getGroups()
  }, [])

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <Button onClick={handleOpen}>{"Add Group"}</Button>

      <AddGroup open={open} handleClose={handleClose} />

      <div style={{ height: 600, width: "100%" }}>
        <DataGrid
          rows={groups}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[5]}
        />
      </div>
    </div>
  )
}
