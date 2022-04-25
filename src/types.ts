export interface User {
  id: string
  groupId: string
  hash: string
  name: string
  status: "issued" | "pending" | "blocked"
}
export interface Group {
  id: string
  name: string
  semester: number
  users?: User[]
}
