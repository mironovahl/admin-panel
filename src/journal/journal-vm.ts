import { useCallback, useEffect, useState } from "react"
import { collection, onSnapshot, query, Unsubscribe } from "firebase/firestore"
import uniqBy from "lodash/uniqBy"

import { useFirebaseContext } from "../firebase-context"
import { CollectionType, JournalItem } from "../types"

export const useVM = () => {
  const { db } = useFirebaseContext()
  const [journal, setJournal] = useState<JournalItem[]>([])

  const [loading, setLoading] = useState(true)

  const getJournalAsync = useCallback(async () => {
    const q = query(collection(db, CollectionType.JOURNAL))

    return onSnapshot(q, (querySnapshot) => {
      querySnapshot.forEach((docData) => {
        setJournal((prevJournal) =>
          uniqBy([docData.data() as JournalItem, ...prevJournal], "id"),
        )
      })
    })
  }, [db])

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    let unsubscribe: Unsubscribe = () => {}

    setLoading(true)
    ;(async () => {
      unsubscribe = await getJournalAsync()

      setLoading(false)
    })()

    return unsubscribe
  }, [getJournalAsync])

  return { loading, journal }
}
