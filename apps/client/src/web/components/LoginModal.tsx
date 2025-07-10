"use client"

import { AnimatePresence, motion } from "framer-motion"
import React from "react"

import { loginTabs } from "../constants/auth"
import { useAppContext } from "../contexts/useAppContext"
import { anim } from "../utils/anim"
import LoginForm from "./forms/LoginForm"
import RegisterForm from "./forms/RegisterForm"

const LoginModal = () => {
  const {
    states: { showLoginModal, currentTab },
    actions: { setShowLoginModal },
  } = useAppContext()

  const overlay = {
    initial: { opacity: 0 },
    enter: {
      opacity: 1,
      transition: {
        duration: 0.3,
      },
    },
    exit: {
      opacity: 0,
      transition: {
        delay: 0.3,
        duration: 0.3,
      },
    },
  }

  const modal = {
    initial: { opacity: 0 },
    enter: {
      opacity: 1,
      transition: {
        delay: 0.3,
        duration: 0.3,
      },
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.3,
      },
    },
  }

  return (
    <AnimatePresence>
      {showLoginModal && (
        <>
          <motion.div
            key={showLoginModal.toString()}
            className="bg-overlay fixed left-0 top-0 z-[9998] h-screen w-screen"
            onClick={() => setShowLoginModal(false)}
            {...anim(overlay)}
          ></motion.div>

          <motion.div
            className="bg-primary text-secondary absolute-center fixed z-[9999] flex h-fit max-h-[70vh] w-[350px] flex-col items-center overflow-scroll rounded-xl p-4 py-8 md:w-[450px]"
            {...anim(modal)}
          >
            {currentTab === loginTabs.login ? <LoginForm /> : <RegisterForm />}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default LoginModal
