/* eslint-disable no-console */
import { NextResponse, type NextRequest } from "next/server"

import { apiRoutes, routes } from "./web/utils/routes"
import { authTokenName } from "./web/constants/config"

const apiUrl = process.env.NEXT_PUBLIC_API_URL

export const middleware = async (request: NextRequest) => {
  const authToken = request.cookies.get(authTokenName)?.value
  console.info("Auth Token Info:", authToken)

  if (!authToken) {
    console.info("Auth token not found, redirecting to home page")

    return NextResponse.redirect(new URL(routes.test, request.nextUrl))
  }

  console.log("URL fetched :" + apiUrl + apiRoutes.users.me)

  try {
    const authResponse = await fetch(apiUrl + apiRoutes.users.me, {
      method: "GET",
      headers: {
        Cookie: `${authTokenName}=${authToken}`,
        "Content-Type": "application/json",
      },
      credentials: "include",
    })

    console.info("Auth Response Status:", authResponse.status)

    if (!authResponse.ok) {
      console.info("Auth response not ok, redirecting to home page")

      const redirectResponse = NextResponse.redirect(
        new URL(routes.home, request.url)
      )

      if (authResponse.status === 500 && authToken) {
        redirectResponse.cookies.delete(authTokenName)
      }

      return redirectResponse
    }

    return NextResponse.next()
  } catch {
    console.log("Error fetching user data, redirecting to home page")

    return NextResponse.redirect(new URL(routes.home, request.url))
  }
}

export const config = {
  matcher: ["/events", "/map"],
}
