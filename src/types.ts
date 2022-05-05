export interface User {
  id: string
  groupId: string
  hash: string
  name: string
  birthdate: string
  status: "issued" | "pending" | "blocked"
  role: "student" | "admin"
}
export interface Group {
  id: string
  name: string
  semester: number
  users?: User[]
}
