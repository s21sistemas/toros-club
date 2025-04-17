import { LoginForm } from '../components/LoginForm'
import logo from '../assets/imgs/logo.png'
import { Toaster } from 'sonner'

export default function LoginPage() {
  return (
    <>
      <Toaster richColors position='bottom-right' />

      <div className='flex min-h-screen items-center justify-center bg-primary-dark p-4'>
        <div className='mx-auto w-full max-w-md rounded-lg bg-white p-6 shadow-md'>
          <div className='mb-6 flex justify-center'>
            <div className='h-24 w-24 overflow-hidden rounded-full bg-primary/10'>
              <img
                src={logo}
                alt='Logo del club toros'
                className='h-full w-full object-cover'
              />
            </div>
          </div>

          <h2 className='mb-6 text-center text-2xl font-bold text-gray-900'>
            Iniciar sesión
          </h2>

          <LoginForm />
        </div>
      </div>
    </>
  )
}
