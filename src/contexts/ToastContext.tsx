import { createContext, useContext, useState, ReactNode } from 'react'
import Toast from '../components/Toast/Toast'

type ToastType = 'success' | 'error' | 'info'

interface ToastContextType {
  showToast: (message: string, type?: ToastType, duration?: number) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null)

  const showToast = (message: string, type: ToastType = 'info', duration = 3000) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), duration)
  }

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && <Toast content={toast.message} type={toast.type} />}
    </ToastContext.Provider>
  )
}

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error("you aren't using useToast within a ToastProvider")
  return context
}
