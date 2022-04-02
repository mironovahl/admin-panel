import { ChangeEvent, useState } from "react"
import styled from "@emotion/styled"
import { Box, Button, Modal, TextField } from "@mui/material"
import { addDoc, collection } from "firebase/firestore"
import { nanoid } from "nanoid"

import { useFirebaseContext } from "../firebase-context"
import { Group } from "./types"

const StyledModal = styled(Box)`
  position: absolute;
  top: calc(50% - 300px);
  left: calc(50% - 300px);
  background-color: aliceblue;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 24px;
  width: 600px;
  height: 600px;
  border: 1px;
  border-radius: 8px;
`

interface Props {
  open: boolean
  handleClose: () => void
}

export const AddGroup = (props: Props) => {
  const { open, handleClose } = props
  const { db } = useFirebaseContext()

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

  const addGroup = async () => {
    const docData: Group = { name, semester: Number(semester), id: nanoid() }

    await addDoc(collection(db, "groups"), docData)

    handleClose()
  }

  return (
    <Modal
      hideBackdrop
      open={open}
      onClose={handleClose}
      aria-labelledby="child-modal-title"
      aria-describedby="child-modal-description"
    >
      <StyledModal>
        <TextField
          // error={showError && name.length === 0}
          required
          label="Group"
          value={name}
          onChange={getOnChangeHandler("name")}
        />

        <TextField
          // error={showError && semester.length === 0}
          required
          label="Semester"
          inputMode="numeric"
          value={semester}
          onChange={getOnChangeHandler("semester")}
        />

        <Button
          disabled={semester.length === 0 || name.length === 0}
          onClick={addGroup}
        >
          {"Add Group"}
        </Button>
      </StyledModal>
    </Modal>
  )
}
