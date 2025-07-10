"use client"

import { useToast } from "@client/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@client/web/components/layout/toast"

export const Toaster = () => {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(({ id, title, description, action, ...props }) => {
        return (
          <Toast key={id} {...props}>
            <div className="quicksand z-[9999999] grid gap-1">
              {title && (
                <ToastTitle className="text-[1.1rem]">{title}</ToastTitle>
              )}
              {description && (
                <ToastDescription className="text-[0.9rem]">
                  {description}
                </ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
