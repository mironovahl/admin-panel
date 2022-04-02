import { useEffect } from "react"
import type { NextPage } from "next"
import { useRouter } from "next/router"

import { useAuthContext } from "src/login/auth-context"

const Home: NextPage = () => {
  const { user } = useAuthContext()
  const router = useRouter()

  useEffect(() => {
    const path = user ? "/groups" : "/login"

    router.push(path)
  }, [router, user])

  return null
}

export default Home
