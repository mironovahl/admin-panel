import { Typography } from "@mui/material"

import { useVM } from "./group-vm"

export const Group = () => {
  const vm = useVM()

  return (
    <div>
      <Typography>{"Группа"}</Typography>
    </div>
  )
}
