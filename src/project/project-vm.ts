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
import { CollectionType, Project, User } from "../types"
import { getIsoDate } from "../utils/get-iso-date"

const getRandomIntFromInterval = (min: number, max: number) => {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min)
}

const TABLE_PADDING = 24

export const useVM = () => {
  const router = useRouter()
  const { projectId } = router.query

  const { db } = useFirebaseContext()
  const logger = useLogger()

  const [users, setUsers] = useState<Array<User>>([])
  const [projectData, setProjectData] = useState<Project | null>(null)
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

    await setDoc(doc(db, CollectionType.USERS, newUser.user.uid), {
      name,
      projectId: projectData?.id ?? "",
      status: "pending",
      hash,
      birthday,
      id: newUser.user.uid,
      createdAt,
      updatedAt: createdAt,
    })

    await addDoc(collection(db, CollectionType.USER_ROLES), {
      userId: newUser.user.uid,
      role: "user",
    })

    await logger("user-created", { id: newUser.user.uid, name })

    const randomTimeout = getRandomIntFromInterval(3, 10)

    timeoutRef.current = setTimeout(async () => {
      const status = "issued"

      await updateDoc(doc(db, CollectionType.USERS, newUser.user.uid), {
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
    const q = query(
      collection(db, CollectionType.USERS),
      where("projectId", "==", projectId),
    )

    return onSnapshot(q, (querySnapshot) => {
      querySnapshot.forEach((docData) => {
        setUsers((prevUsers) =>
          uniqBy([docData.data() as User, ...prevUsers], "id"),
        )
      })
    })
  }, [db, projectId])

  const getProjectAsync = useCallback(async () => {
    const q = query(
      collection(db, CollectionType.PROJECTS),
      where("id", "==", projectId),
    )

    const querySnapshot = await getDocs(q)

    querySnapshot.forEach((docData) => {
      setProjectData(docData.data() as Project)
    })
  }, [db, projectId])

  useEffect(() => {
    if (projectId) {
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      let unsubscribe: Unsubscribe = () => {}

      setLoading(true)
      ;(async () => {
        await getProjectAsync()
        unsubscribe = await getUsersAsync()

        setLoading(false)
      })()

      return unsubscribe
    }
  }, [getProjectAsync, getUsersAsync, projectId])

  return {
    users,
    projectData,
    loading,
    addUserAsync,
    rootRef,
    infoRef,
    tableHeight,
  }
}
