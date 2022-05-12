import { Status } from "./types"

export const colors: Record<Status, "error" | "info" | "success" | "warning"> =
  {
    issued: "success",
    pending: "info",
    blocked: "error",
    requested: "warning",
  }
