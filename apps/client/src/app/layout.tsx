import "./globals.css"
import "leaflet/dist/leaflet.css"

import TanStackProvider from "@client/providers/TanStackProvider"
import Navbar from "@client/web/components/layout/Navbar"
import { Toaster } from "@client/web/components/layout/toaster"
import LoginModal from "@client/web/components/LoginModal"
import { AppContextProvider } from "@client/web/contexts/useAppContext"
import { cormorantGaramond } from "@client/web/fonts/cormorantGaramond"
import { montserrat } from "@client/web/fonts/montserrat"
import { quicksand } from "@client/web/fonts/quicksand"
import classNames from "classnames"
import type { Metadata } from "next"
import type { ReactNode } from "react"

export const metadata: Metadata = {
  title: "Party",
  description: "Party",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={classNames(
          quicksand.variable,
          cormorantGaramond.variable,
          montserrat.variable,
          "bg-primary cormorantGaramond overflow-x-hidden text-white"
        )}
      >
        <AppContextProvider>
          <TanStackProvider>
            <Navbar />
            {children}
            <LoginModal />
            <Toaster />
          </TanStackProvider>
        </AppContextProvider>
      </body>
    </html>
  )
}
