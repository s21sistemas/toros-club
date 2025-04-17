import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'

export const LoginForm = () => {
  const { login } = useAuth()
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const data = Object.fromEntries(formData)

    localStorage.setItem('email', data.email)
    localStorage.setItem('mensaje', data.password)

    await login(data.email, data.password)
  }

  return (
    <form onSubmit={handleSubmit} className='space-y-4'>
      <div className='space-y-2'>
        <label
          htmlFor='email'
          className='block text-sm font-medium text-gray-700'
        >
          Email
        </label>
        <div className='mt-1'>
          <input
            id='email'
            name='email'
            type='email'
            placeholder='your@email.com'
            required
            className='shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border disabled:bg-gray-100'
          />
        </div>
      </div>

      <div className='space-y-2'>
        <label
          htmlFor='password'
          className='block text-sm font-medium text-gray-700'
        >
          Password
        </label>
        <div className='relative'>
          <input
            id='password'
            name='password'
            type={showPassword ? 'text' : 'password'}
            placeholder='••••••••'
            className='shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border disabled:bg-gray-100'
            required
          />
          <button
            type='button'
            className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700'
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      <button
        type='submit'
        className='w-full py-2 bg-primary text-white font-semibold rounded-md cursor-pointer hover:bg-primary-dark transition-all'
      >
        Iniciar sesión
      </button>
    </form>
  )
}
