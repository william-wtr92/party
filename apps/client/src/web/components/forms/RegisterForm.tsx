import AnimatedText from "@client/web/components/animations/AnimatedText"
import Button from "@client/web/components/Button"
import Input from "@client/web/components/forms/Input"
import {
  labels,
  loginTabs,
  registerDefaultValues,
  registerOptionalValues,
  registerRequiredValues,
} from "@client/web/constants/auth"
import { useAppContext } from "@client/web/contexts/useAppContext"
import { getInputType } from "@client/web/utils/getInputType"
import { zodResolver } from "@hookform/resolvers/zod"
import { registerSchema, type RegisterSchemaType } from "@party/common"
import { AnimatePresence, motion } from "framer-motion"
import { type Path, useForm, type SubmitHandler } from "react-hook-form"

const RegisterForm = () => {
  const {
    states: { currentTab },
    actions: { setCurrentTab },
    services: {
      auth: { register },
    },
  } = useAppContext()

  const { handleSubmit, control } = useForm<RegisterSchemaType>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
    defaultValues: registerDefaultValues,
  })

  const onSubmit: SubmitHandler<RegisterSchemaType> = async (body) => {
    await register(body)
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
        className="flex h-full flex-col items-center gap-4"
        variants={formAnim}
      >
        <div className="flex flex-col items-center">
          <AnimatePresence mode="wait">
            <AnimatedText
              key={currentTab}
              Tag="h1"
              text={currentTab === loginTabs.login ? "Sign in" : "Sign up"}
              shouldAnimate={true}
              letterClass="text-[3.5rem]"
            />
          </AnimatePresence>

          <span className="text-[1.3rem] font-medium">Let's party !</span>
        </div>

        <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
          {Object.entries(registerRequiredValues).map(([key]) => {
            const typedKey = key as keyof typeof labels

            return (
              <Input<RegisterSchemaType>
                key={key}
                type={getInputType(typedKey)}
                label={labels[typedKey]}
                name={key as Path<RegisterSchemaType>}
                control={control}
              />
            )
          })}
        </div>

        <details className="quicksand mt-4">
          <summary>Extra informations</summary>

          <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
            {Object.entries(registerOptionalValues).map(([key]) => {
              const typedKey = key as keyof typeof labels

              return (
                <Input<RegisterSchemaType>
                  key={key}
                  type={getInputType(typedKey)}
                  label={labels[typedKey]}
                  name={key as Path<RegisterSchemaType>}
                  control={control}
                />
              )
            })}
          </div>
        </details>

        <Button
          type="submit"
          variant="outlined"
          customClasses="mt-4 text-center"
        >
          Register
        </Button>

        <span className="quicksand mt-2 text-center text-[0.8rem]">
          Already a partier ? Login{" "}
          <span
            className="underline"
            onClick={() => setCurrentTab(loginTabs.login)}
          >
            here
          </span>{" "}
          !
        </span>
      </motion.form>
    </AnimatePresence>
  )
}

export default RegisterForm
