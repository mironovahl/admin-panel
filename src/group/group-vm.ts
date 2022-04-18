import { useCallback, useEffect, useState } from "react"
import { collection, getDocs, query, where } from "firebase/firestore"
import { useRouter } from "next/router"

import { useFirebaseContext } from "../firebase-context"
import { Group, User } from "../types"

export const useVM = () => {
  const router = useRouter()
  const { groupId } = router.query

  const { db } = useFirebaseContext()

  const [users, setUsers] = useState<User[]>([])
  const [groupData, setGroupData] = useState<Group | null>(null)

  const getUsersAsync = useCallback(async () => {
    const q = query(collection(db, "users"), where("groupId", "==", groupId))

    const querySnapshot = await getDocs(q)

    querySnapshot.forEach((doc) => {
      setUsers((prevUsers) => [...prevUsers, doc.data() as User])
    })
  }, [db, groupId])

  const getGroupAsync = useCallback(async () => {
    const q = query(collection(db, "groups"), where("id", "==", groupId))

    const querySnapshot = await getDocs(q)

    querySnapshot.forEach((doc) => {
      setGroupData(doc.data() as Group)
    })
  }, [db, groupId])

  useEffect(() => {
    const getDataAsync = async () => {
      const promises = [getGroupAsync(), getUsersAsync()]

      await Promise.all(promises)
    }

    if (groupId) {
      ;(async () => await getDataAsync())()
    }
  }, [getGroupAsync, getUsersAsync, groupId])

  return { users, groupData }
}
