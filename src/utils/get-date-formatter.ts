import { GridValueFormatterParams } from "@mui/x-data-grid"
import format from "date-fns/format"

export const getDateFormatter =
  (dateFormat: string) => (params: GridValueFormatterParams) => {
    return format(new Date((params?.value as string) ?? 0), dateFormat)
  }
