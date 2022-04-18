import { ChangeEvent, useState } from "react"
import styled from "@emotion/styled"
import { Box, Button, Modal, TextField, Typography } from "@mui/material"
import { addDoc, collection } from "firebase/firestore"
import { nanoid } from "nanoid"
import { useRouter } from "next/router"

import { useFirebaseContext } from "../firebase-context"
import { Group } from "../types"

const StyledModal = styled(Box)`
  position: absolute;
  top: calc(50% - 200px);
  left: calc(50% - 175px);
  background-color: aliceblue;
  display: flex;
  flex-direction: column;

  align-items: center;
  width: 350px;
  height: 250px;
  border: 1px;
  border-radius: 8px;
  padding: 48px;
`

const Fields = styled.div`
  width: 100%;

  margin: 24px 0;
  display: flex;
  flex-direction: column;
  gap: 24px;
`

const Buttons = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  gap: 20px;
`

interface Props {
  isOpen: boolean
  onClose: () => void
}

const useVM = (arg: Props) => {
  const { onClose } = arg
  const { db } = useFirebaseContext()
  const router = useRouter()

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
    <Modal
      open={isOpen}
      onBackdropClick={onClose}
      onClose={onClose}
      aria-labelledby="child-modal-title"
      aria-describedby="child-modal-description"
    >
      <StyledModal>
        <Typography component="h2" variant="h6">
          {"Добавление группы"}
        </Typography>

        <Fields>
          <TextField
            // error={showError && name.length === 0}

            required
            placeholder="Введите название группы"
            label="Группа"
            value={vm.name}
            onChange={vm.getOnChangeHandler("name")}
          />

          <TextField
            // error={showError && semester.length === 0}
            required
            label="Семестр"
            placeholder="Введите семестр"
            inputMode="numeric"
            value={vm.semester}
            onChange={vm.getOnChangeHandler("semester")}
          />
        </Fields>

        <Buttons>
          <Button onClick={onClose}>{"Отмена"}</Button>

          <Button
            variant="contained"
            disabled={vm.isButtonDisabled}
            onClick={vm.addGroupAsync}
          >
            {"Добавить"}
          </Button>
        </Buttons>
      </StyledModal>
    </Modal>
  )
}
