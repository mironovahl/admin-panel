import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material"

import { Props, useVM } from "./add-project-vm"

export const AddProject = (props: Props) => {
  const { isOpen, onClose } = props

  const vm = useVM(props)

  return (
    <Dialog open={isOpen} onBackdropClick={onClose} onClose={onClose}>
      <DialogTitle>{"Add project"}</DialogTitle>

      <DialogContent>
        <TextField
          fullWidth
          required
          placeholder="Enter project name"
          label="Project"
          variant="standard"
          value={vm.name}
          onChange={(e) => vm.setName(e.currentTarget.value)}
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>{"Cancel"}</Button>

        <Button
          variant="contained"
          disabled={vm.isButtonDisabled}
          onClick={vm.addProjectAsync}
        >
          {"Add"}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
