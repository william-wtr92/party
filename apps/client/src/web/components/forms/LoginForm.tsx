import AnimatedText from "@client/web/components/animations/AnimatedText"
import Button from "@client/web/components/Button"
import Input from "@client/web/components/forms/Input"
import {
  labels,
  loginDefaultValues,
  loginTabs,
} from "@client/web/constants/auth"
import { useAppContext } from "@client/web/contexts/useAppContext"
import { getInputType } from "@client/web/utils/getInputType"
import { zodResolver } from "@hookform/resolvers/zod"
import { loginSchema, type LoginSchemaType } from "@party/common"
import { useQueryClient } from "@tanstack/react-query"
import { AnimatePresence, motion } from "framer-motion"
import { type Path, useForm, type SubmitHandler } from "react-hook-form"

const LoginForm = () => {
  const {
    states: { currentTab },
    actions: { setCurrentTab, setShowLoginModal },
    services: {
      auth: { login },
    },
  } = useAppContext()

  const qc = useQueryClient()

  const { handleSubmit, control } = useForm<LoginSchemaType>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
    defaultValues: loginDefaultValues,
  })

  const onSubmit: SubmitHandler<LoginSchemaType> = async (body) => {
    const data = await login(body)

    if (data) {
      setShowLoginModal(false)
      qc.invalidateQueries({ queryKey: ["user"] })
    }
  }

  const formAnim = {
    initial: {
      y: "-120%",
    },
    enter: {
      y: 0,
    },
    exit: {
      y: "120%",
    },
  }

  return (
    <AnimatePresence mode="wait">
      <motion.form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col items-center gap-4"
        variants={formAnim}
      >
        <div className="flex flex-col items-center">
          <AnimatePresence mode="wait">
            <AnimatedText
              key={currentTab}
              Tag="span"
              text={currentTab === loginTabs.login ? "Sign in" : "Sign up"}
              shouldAnimate={true}
              letterClass="text-[3.5rem]"
            />
          </AnimatePresence>

          <span className="text-[1.3rem] font-medium">Let's party !</span>
        </div>

        <div className="flex flex-col gap-4">
          {Object.entries(loginDefaultValues).map(([key]) => {
            const typedKey = key as keyof typeof labels

            return (
              <Input<LoginSchemaType>
                key={key}
                type={getInputType(typedKey)}
                label={labels[typedKey]}
                name={key as Path<LoginSchemaType>}
                control={control}
              />
            )
          })}
        </div>

        <Button
          type="submit"
          variant={"outlined"}
          customClasses="mt-4 text-center w-fit mx-auto"
        >
          Login
        </Button>

        <span className="quicksand mt-2 text-center text-[0.8rem]">
          Still not a partier ? Register{" "}
          <span
            className="underline"
            onClick={() => setCurrentTab(loginTabs.register)}
          >
            here
          </span>{" "}
          !
        </span>
      </motion.form>
    </AnimatePresence>
  )
}

export default LoginForm
