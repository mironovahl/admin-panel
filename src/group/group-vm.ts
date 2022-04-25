import { useCallback, useEffect, useState } from "react"
import { sha256 } from "crypto-hash"
import {
  addDoc,
  collection,
  getDocs,
  onSnapshot,
  query,
  Unsubscribe,
  where,
} from "firebase/firestore"
import uniqBy from "lodash/uniqBy"
import { useRouter } from "next/router"
import { v4 } from "uuid"

import { useFirebaseContext } from "../firebase-context"
import { Group, User } from "../types"

export const useVM = () => {
  const router = useRouter()
  const { groupId } = router.query

  const { db } = useFirebaseContext()

  const [users, setUsers] = useState<User[]>([])
  const [groupData, setGroupData] = useState<Group | null>(null)
  const [loading, setLoading] = useState(true)

  const addUserAsync = async (userName: string) => {
    // Add a new document in collection "cities"
    const hash = await sha256(Math.random().toString())

    await addDoc(collection(db, "users"), {
      name: userName,
      groupId: groupData?.id ?? "",
      status: "pending",
      hash,
      id: v4(),
    })
  }

  const getUsersAsync = useCallback(async () => {
    const q = query(collection(db, "users"), where("groupId", "==", groupId))

    return onSnapshot(q, (querySnapshot) => {
      querySnapshot.forEach((doc) => {
        setUsers((prevUsers) =>
          uniqBy([...prevUsers, doc.data() as User], "id"),
        )
      })
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
    if (groupId) {
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      let unsubscribe: Unsubscribe = () => {}

      setLoading(true)
      ;(async () => {
        await getGroupAsync()
        unsubscribe = await getUsersAsync()

        setLoading(false)
      })()

      return unsubscribe
    }
  }, [getGroupAsync, getUsersAsync, groupId])

  return { users, groupData, loading, addUserAsync }
}
