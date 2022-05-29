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
  doc,
  getDocs,
  onSnapshot,
  query,
  setDoc,
  Unsubscribe,
  updateDoc,
  where,
} from "firebase/firestore"
import uniqBy from "lodash/uniqBy"
import { useRouter } from "next/router"

import { config } from "../config"
import { useFirebaseContext } from "../firebase-context"
import { useLogger } from "../logger"
import { Group, User } from "../types"
import { getIsoDate } from "../utils/get-iso-date"

const getRandomIntFromInterval = (min: number, max: number) => {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min)
}

const TABLE_PADDING = 24

export const useVM = () => {
  const router = useRouter()
  const { groupId } = router.query

  const { db } = useFirebaseContext()
  const logger = useLogger()

  const [users, setUsers] = useState<Array<User>>([])
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

    const createdAt = getIsoDate()

    await setDoc(doc(db, "users", newUser.user.uid), {
      name,
      groupId: groupData?.id ?? "",
      status: "pending",
      hash,
      birthday,
      id: newUser.user.uid,
      createdAt,
      updatedAt: createdAt,
    })

    await addDoc(collection(db, "userRoles"), {
      userId: newUser.user.uid,
      role: "student",
    })

    await logger("user-created", { id: newUser.user.uid, name })

    const randomTimeout = getRandomIntFromInterval(3, 10)

    timeoutRef.current = setTimeout(async () => {
      const status = "issued"

      await updateDoc(doc(db, "users", newUser.user.uid), {
        status,
        updatedAt: getIsoDate(),
      })

      await logger("certificate-status-updated", {
        id: newUser.user.uid,
        status,
      })
    }, randomTimeout)
  }

  const getUsersAsync = useCallback(async () => {
    const q = query(collection(db, "users"), where("groupId", "==", groupId))

    return onSnapshot(q, (querySnapshot) => {
      querySnapshot.forEach((docData) => {
        setUsers((prevUsers) =>
          uniqBy([docData.data() as User, ...prevUsers], "id"),
        )
      })
    })
  }, [db, groupId])

  const getGroupAsync = useCallback(async () => {
    const q = query(collection(db, "groups"), where("id", "==", groupId))

    const querySnapshot = await getDocs(q)

    querySnapshot.forEach((docData) => {
      setGroupData(docData.data() as Group)
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
