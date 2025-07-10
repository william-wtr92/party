import Image from "next/image"
import { useRouter } from "next/navigation"
import React from "react"

import Button from "../../Button"
import { routes } from "@client/routes"

const Hero = () => {
  const router = useRouter()

  return (
    <header className="header-box-shadow relative h-[60vh] w-full md:h-[100vh]">
      <div className="relative z-10 flex h-full w-[80%] flex-col justify-center gap-4 px-4 py-2 md:py-4 md:pl-12">
        <div className="text-secondary">
          <h1 className="text-[2.2rem] leading-8 tracking-tighter md:text-[5rem] md:leading-[4.5rem]">
            Organize an Event
          </h1>
          <h1 className="mb-4 text-[2.2rem] leading-8 tracking-tighter md:mb-8 md:pl-2 md:text-[5rem] md:leading-[4.5rem]">
            Join one
          </h1>
          <p
            className={
              "quicksand m-0 text-[0.8rem] leading-4 md:text-[1rem] md:leading-6"
            }
          >
            Ever wondered where to spend a good time outside after work but
            nothing planned ? Come here to <strong>JOIN</strong> an event or
            <strong> ORGANIZE</strong> one. <br />
            It has never been that simple !
          </p>
        </div>

        <div className="flex flex-col items-start gap-2 md:flex-row md:gap-4">
          <Button
            onClick={() => router.push(routes.events.organize)}
            variant={"contained"}
            customClasses="md:text-[1.3rem] md:px-4 md:py-2 font-semibold"
          >
            Organize an Event
          </Button>
          <Button
            variant={"outlined"}
            customClasses="md:text-[1.3rem] md:px-4 md:py-2 font-semibold"
          >
            JOIN NOW
          </Button>
        </div>

        {/* Gradient layers */}
        <div className="bg-primary absolute left-0 top-0 z-[-1] h-full w-[40%]"></div>
        <div className="bg-header-gradient absolute left-[40%] top-0 z-[-1] h-full w-[100%]"></div>
      </div>

      {/* Background image */}
      <Image
        src="/party-image-2.jpg"
        alt="Header party"
        layout="fill"
        className="absolute left-0 top-0 z-[-1] object-bottom"
      />
    </header>
  )
}

export default Hero
