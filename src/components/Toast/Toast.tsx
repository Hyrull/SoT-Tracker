import { useEffect, useState } from 'react'
import './Toast.scss'

export interface ToastProps {
  content: string,
  duration?: number // has to be in ms, default is 3s / 3000ms
  type?: 'success' | 'error' | 'info'
  onClose?: () => void
}

function Toast({ content, duration = 3000, type = 'success', onClose }: ToastProps) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {setVisible(false), onClose?.()}, duration)
    return () => clearTimeout(timer)
  }, [duration, onClose])

  if (!visible) return null

  return (
    <div className={`toast-container ${type}`}
      style={{ ['--toast-duration' as string]: `${duration}ms` }}
      role="status"
      aria-live="polite"
      >
      <div className="toast-message">{content}</div>
    </div>
  )
}

export default Toast