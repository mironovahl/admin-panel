import { useState } from "react"
import { addDoc, collection } from "firebase/firestore"
import { nanoid } from "nanoid"
import { useRouter } from "next/router"

import { useFirebaseContext } from "../firebase-context"
import { useLogger } from "../logger"
import { CollectionType, Project } from "../types"
import { getIsoDate } from "../utils/get-iso-date"

export interface Props {
  isOpen: boolean
  onClose: () => void
}

export const useVM = (arg: Props) => {
  const { onClose } = arg
  const { db } = useFirebaseContext()
  const router = useRouter()
  const logger = useLogger()

  const [name, setName] = useState("")

  const addProjectAsync = async () => {
    const id = nanoid()
    const docData: Project = { name, createdAt: getIsoDate(), id }

    await addDoc(collection(db, CollectionType.PROJECTS), docData)

    await logger("project-created", { id, name })

    onClose()
    await router.push(`/projects/${id}`)
  }

  const isButtonDisabled = name.length === 0

  return { addProjectAsync, setName, name, isButtonDisabled }
}
