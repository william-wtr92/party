/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse, type NextRequest } from "next/server"

import { apiRoutes, routes } from "./routes"
import { authTokenName, cookieName } from "./web/constants/config"

export const middleware = async (request: NextRequest) => {
  const authToken = request.cookies.get(authTokenName)?.value

  if (!authToken) {
    return NextResponse.redirect(new URL(routes.test, request.nextUrl))
  }

  const url: string = request.nextUrl.origin + apiRoutes.internal.auth
  const config: RequestInit = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      [cookieName]: `${authTokenName}=${authToken}`,
    },
    credentials: "include",
  }

  try {
    const response = await fetch(url, config)

    if (!response.ok) {
      return NextResponse.redirect(new URL(routes.home, request.nextUrl))
    }

    return NextResponse.next()
  } catch (error: unknown) {
    return NextResponse.redirect(new URL(routes.home, request.nextUrl))
  }
}

export const config = {
  matcher: ["/events", "/map"],
}
