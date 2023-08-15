import { ToastContainer, ToastPosition } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

interface IToastProps {
  position?: ToastPosition
  autoClose?: number | false
  hideProgressBar?: boolean
  newestOnTop?: boolean
  closeOnClick?: boolean
}

export default function Toast({
  position = 'top-right',
  autoClose = 5000,
  hideProgressBar = false,
  newestOnTop = true,
  closeOnClick = true
}: IToastProps) {
  return (
    <ToastContainer
      position={position}
      autoClose={autoClose}
      hideProgressBar={hideProgressBar}
      newestOnTop={newestOnTop}
      closeOnClick={closeOnClick}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      closeButton={false}
    />
  )
}
