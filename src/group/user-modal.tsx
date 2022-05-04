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
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"
import format from "date-fns/format"

interface Props {
  onAdd: (values: {
    name: string
    birthday: string
    email: string
  }) => Promise<void>
}

const useVM = (arg: Props) => {
  const { onAdd } = arg
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [birthday, setBirthday] = useState<Date | null>(null)

  const onClose = () => {
    if (!loading) {
      setIsOpen(false)
    }
  }

  const onAcceptAsync = async () => {
    try {
      setLoading(true)
      const formattedDate = format(birthday ?? new Date(), "dd.MM.yyyy")

      await onAdd({ name, birthday: formattedDate, email })

      setIsOpen(false)
      setName("")
      setEmail("")
      setBirthday(null)
    } finally {
      setLoading(false)
    }
  }

  const isDisabled = name.length === 0 || loading

  return {
    isOpen,
    isDisabled,
    name,
    loading,
    email,
    birthday,
    onAcceptAsync,
    onClose,
    setName,
    setEmail,
    setBirthday,
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
            {`Чтобы выпустить сертификат безопасности,
               введите имя и фамилию студента и нажмите "Добавить"`}
          </DialogContentText>

          <TextField
            margin="dense"
            id="name"
            label="Имя студента"
            fullWidth
            variant="standard"
            value={vm.name}
            onChange={(e) => vm.setName(e.currentTarget.value)}
            disabled={vm.loading}
            placeholder=""
          />

          <TextField
            margin="dense"
            id="email"
            label="Email"
            fullWidth
            variant="standard"
            value={vm.email}
            onChange={(e) => vm.setEmail(e.currentTarget.value)}
            disabled={vm.loading}
            type="email"
          />

          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker<Date>
              label="Дата рождения"
              value={vm.birthday}
              onChange={(newValue) => vm.setBirthday(newValue)}
              inputFormat="dd.MM.yyyy"
              mask="__.__.____"
              renderInput={(params) => (
                <TextField
                  {...params}
                  margin="dense"
                  fullWidth
                  id="birthday"
                  variant="standard"
                />
              )}
            />
          </LocalizationProvider>
        </DialogContent>

        <DialogActions>
          <Button onClick={vm.onClose} color="secondary" disabled={vm.loading}>
            {"Отмена"}
          </Button>

          <Button
            onClick={vm.onAcceptAsync}
            color="primary"
            variant="contained"
            disabled={vm.isDisabled}
          >
            {"Добавить"}
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  )
}
