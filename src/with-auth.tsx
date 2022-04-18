import { FC, Fragment, useEffect } from "react"
import { useRouter } from "next/router"

import { useAuthContext } from "./login/auth-context"

const useAuth = (isProtectedPage: boolean) => {
  const { user, loading } = useAuthContext()

  const router = useRouter()

  useEffect(() => {
    if (loading) {
      return
    }

    if (isProtectedPage && !user) {
      router.push("/login")

      return
    }

    if (!isProtectedPage && user) {
      router.push("/")

      return
    }
  }, [isProtectedPage, loading, router, user])
}

export const WithAuth: FC<{ isProtectedPage: boolean }> = (props) => {
  const { isProtectedPage, children } = props

  useAuth(isProtectedPage)

  return <Fragment>{children}</Fragment>
}
