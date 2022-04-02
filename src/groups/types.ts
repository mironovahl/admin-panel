export interface User {
  group: string
  hash: string
  id: string
  name: string
  status: boolean
}
export interface Group {
  id: string
  name: string
  semester: number
  users?: User[]
}
