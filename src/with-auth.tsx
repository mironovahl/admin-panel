import { FC, Fragment, useEffect, useState } from "react"
import { useRouter } from "next/router"

import { useAuthContext } from "./login/auth-context"

export const WithAuth: FC<{ isProtectedPage: boolean }> = (props) => {
  const { isProtectedPage, children } = props
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

  return <Fragment>{children}</Fragment>
}
