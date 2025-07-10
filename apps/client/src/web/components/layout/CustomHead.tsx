import Head from "next/head"
import React from "react"

type Props = {
  title: string
}

const CustomHead = (props: Props) => {
  const { title } = props

  return (
    <Head>
      <meta
        name="description"
        content="Party.com, the best party organizer website."
      />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" href="/favicon.ico" />
      <title>{title}</title>
    </Head>
  )
}

export default CustomHead
