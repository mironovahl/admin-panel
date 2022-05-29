import { ChangeEvent, useState } from "react"
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material"
import { addDoc, collection } from "firebase/firestore"
import { nanoid } from "nanoid"
import { useRouter } from "next/router"

import { useFirebaseContext } from "../firebase-context"
import { useLogger } from "../logger"
import { Group } from "../types"

interface Props {
  isOpen: boolean
  onClose: () => void
}

const useVM = (arg: Props) => {
  const { onClose } = arg
  const { db } = useFirebaseContext()
  const router = useRouter()
  const logger = useLogger()

  const [name, setName] = useState("")
  const [semester, setSemester] = useState("")

  const getOnChangeHandler =
    (field: "name" | "semester") =>
    (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      const { [field]: setter } = {
        name: setName,
        semester: setSemester,
      }

      setter(event.target.value)
    }

  const addGroupAsync = async () => {
    const id = nanoid()
    const docData: Group = { name, semester: Number(semester), id }

    await addDoc(collection(db, "groups"), docData)

    await logger("project-created", { id, name })

    onClose()
    await router.push(`/groups/${id}`)
  }

  const isButtonDisabled = semester.length === 0 || name.length === 0

  return { addGroupAsync, getOnChangeHandler, semester, name, isButtonDisabled }
}

export const AddGroup = (props: Props) => {
  const { isOpen, onClose } = props

  const vm = useVM(props)

  return (
    <Dialog open={isOpen} onBackdropClick={onClose} onClose={onClose}>
      <DialogTitle>{"Добавление группы"}</DialogTitle>

      <DialogContent>
        <TextField
          fullWidth
          required
          placeholder="Введите название группы"
          label="Группа"
          variant="standard"
          value={vm.name}
          onChange={vm.getOnChangeHandler("name")}
        />

        <TextField
          fullWidth
          required
          label="Семестр"
          placeholder="Введите семестр"
          inputMode="numeric"
          variant="standard"
          value={vm.semester}
          onChange={vm.getOnChangeHandler("semester")}
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>{"Отмена"}</Button>

        <Button
          variant="contained"
          disabled={vm.isButtonDisabled}
          onClick={vm.addGroupAsync}
        >
          {"Добавить"}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
