import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react"
import { sha256 } from "crypto-hash"
import { initializeApp } from "firebase/app"
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth"
import {
  addDoc,
  collection,
  getDocs,
  onSnapshot,
  query,
  Unsubscribe,
  updateDoc,
  where,
} from "firebase/firestore"
import uniqBy from "lodash/uniqBy"
import { useRouter } from "next/router"
import { v4 } from "uuid"

import { config } from "../config"
import { useFirebaseContext } from "../firebase-context"
import { Group, User } from "../types"

const getRandomIntFromInterval = (min: number, max: number) => {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min)
}

const TABLE_PADDING = 24

export const useVM = () => {
  const router = useRouter()
  const { groupId } = router.query

  const { db } = useFirebaseContext()

  const [users, setUsers] = useState<User[]>([])
  const [groupData, setGroupData] = useState<Group | null>(null)
  const [loading, setLoading] = useState(true)

  const [tableHeight, setTableHeight] = useState(500)

  const rootRef = useRef<HTMLDivElement>()
  const infoRef = useRef<HTMLDivElement>()

  const timeoutRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    const timeoutId = timeoutRef.current

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }
  }, [])

  useLayoutEffect(() => {
    const root = rootRef.current
    const info = infoRef.current

    if (root && info) {
      const rootRect = root.getBoundingClientRect()
      const infoRect = info.getBoundingClientRect()

      setTableHeight(rootRect.height - infoRect.height - TABLE_PADDING)
    }
  }, [])

  const addUserAsync = async (values: {
    name: string
    email: string
    birthday: string
  }) => {
    const { name, birthday, email } = values

    // otherwise current user would be replaced by the created
    const secondApp = initializeApp(config.firebaseConfig, "second")
    const secondAuth = getAuth(secondApp)

    // use birthday in dd.mm.yyyy format
    const newUser = await createUserWithEmailAndPassword(
      secondAuth,
      email,
      birthday,
    )

    await secondAuth.signOut()

    // Add a new document in collection "cities"
    const hash = await sha256(Math.random().toString())

    const createdAt = new Date().toISOString()

    const addedUserRef = await addDoc(collection(db, "users"), {
      name,
      groupId: groupData?.id ?? "",
      status: "pending",
      hash,
      birthday,
      id: v4(),
      createdAt,
      updatedAt: createdAt,
    })

    await addDoc(collection(db, "userRoles"), {
      userId: newUser.user.uid,
      role: "student",
    })

    const randomTimeout = getRandomIntFromInterval(3, 10)

    timeoutRef.current = setTimeout(async () => {
      await updateDoc(addedUserRef, {
        status: "issued",
        updatedAt: new Date().toISOString(),
      })
    }, randomTimeout)
  }

  const getUsersAsync = useCallback(async () => {
    const q = query(collection(db, "users"), where("groupId", "==", groupId))

    return onSnapshot(q, (querySnapshot) => {
      querySnapshot.forEach((doc) => {
        setUsers((prevUsers) =>
          uniqBy([doc.data() as User, ...prevUsers], "id"),
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

  return {
    users,
    groupData,
    loading,
    addUserAsync,
    rootRef,
    infoRef,
    tableHeight,
  }
}
