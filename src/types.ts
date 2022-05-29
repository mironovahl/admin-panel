export type Status = "issued" | "pending" | "blocked" | "requested"

export interface User {
  id: string
  groupId: string
  hash: string
  name: string
  birthdate: string
  status: Status
  createdAt: string
  updatedAt: string
}

export interface Group {
  id: string
  name: string
  semester: number
  users?: User[]
}

export interface UserRole {
  userId: string
  role: "student" | "admin"
}

export type LogEvent =
  | "sign-in"
  | "sign-in-failure"
  | "sign-out"
  | "user-created"
  | "project-created"
  | "certificate-status-updated"
  | "password-updated"

export interface JournalItem {
  id: string
  userId: string
  createdAt: string
  email: string
  event: LogEvent
  comment: string
}
