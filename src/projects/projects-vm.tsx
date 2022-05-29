import { useCallback, useEffect, useState } from "react"
import { collection, getDocs } from "firebase/firestore"
import { useRouter } from "next/router"

import { useFirebaseContext } from "../firebase-context"
import { CollectionType, Project } from "../types"

export const useVM = () => {
  const { db } = useFirebaseContext()
  const [projects, setProjects] = useState<Project[]>([])
  const [isOpen, setOpen] = useState(false)

  const router = useRouter()

  const onOpen = () => setOpen(true)
  const onClose = () => setOpen(false)

  const getProjectsAsync = useCallback(async () => {
    const querySnapshot = await getDocs(collection(db, CollectionType.PROJECTS))

    querySnapshot.forEach((doc) => {
      setProjects((prev) => [...prev, doc.data() as Project])
    })
  }, [db])

  const redirectToProjectAsync = async (id: string) => {
    await router.push(`/projects/${id}`)
  }

  useEffect(() => {
    ;(async () => await getProjectsAsync())()
  }, [getProjectsAsync])

  return { redirectToProjectAsync, onClose, onOpen, isOpen, projects }
}
