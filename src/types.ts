export type Status = "issued" | "pending" | "blocked" | "requested"

export interface User {
  id: string
  projectId: string
  hash: string
  name: string
  birthdate: string
  status: Status
  createdAt: string
  updatedAt: string
}

export interface Project {
  id: string
  name: string
  createdAt: string
  users?: User[]
}

export interface UserRole {
  userId: string
  role: "user" | "admin"
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

export enum CollectionType {
  JOURNAL = "journal",
  PROJECTS = "projects",
  USERS = "users",
  USER_ROLES = "userRoles",
}
