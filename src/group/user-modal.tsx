import { FC, Fragment, useState } from "react"
import AddIcon from "@mui/icons-material/Add"
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@mui/material"

interface Props {
  onAdd: (name: string) => Promise<void>
}

const useVM = (arg: Props) => {
  const { onAdd } = arg
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const [name, setName] = useState("")

  const onClose = () => {
    if (!loading) {
      setIsOpen(false)
    }
  }

  const onAcceptAsync = async () => {
    setLoading(true)
    await onAdd(name)

    setLoading(false)
    setIsOpen(false)
    setName("")
  }

  const isDisabled = name.length === 0 || loading

  return {
    isOpen,
    isDisabled,
    onAcceptAsync,
    onClose,
    setName,
    name,
    loading,
    onOpen: () => setIsOpen(true),
  }
}

export const UserModal: FC<Props> = (props) => {
  const vm = useVM(props)

  return (
    <Fragment>
      <Button startIcon={<AddIcon />} onClick={vm.onOpen}>
        {"Добавить"}
      </Button>

      <Dialog open={vm.isOpen} onClose={vm.onClose}>
        <DialogTitle>{"Добавить"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {
              'Чтобы выпустить сертификат безопасности, введите имя и фамилию студента и нажмите "Добавить"'
            }
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Имя студента"
            fullWidth
            variant="standard"
            value={vm.name}
            onChange={(e) => vm.setName(e.currentTarget.value)}
            disabled={vm.loading}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={vm.onClose} color="secondary" disabled={vm.loading}>
            {"Отмена"}
          </Button>

          <Button
            onClick={vm.onAcceptAsync}
            color="primary"
            disabled={vm.isDisabled}
          >
            {"Добавить"}
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  )
}
