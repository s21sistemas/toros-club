import { Menu, ChevronDown, User, LogOut, ChevronUp } from 'lucide-react'
import { Link } from 'react-router'
import img_default from '../assets/imgs/usuarios/default.png'
import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'

export const Navbar = ({ toggleSidebar }) => {
  const { user, logout } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const toggleDropdown = () => setIsOpen(!isOpen)

  const handleLogout = () => {
    toggleDropdown()
    logout()
  }
  return (
    <header className='bg-white shadow-sm z-10'>
      <div className='flex items-center justify-between h-16 px-4'>
        <div className='flex items-center'>
          <button
            onClick={toggleSidebar}
            className='p-2 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100 lg:hidden'
          >
            <Menu size={20} />
          </button>
        </div>

        {/* Dropdown */}
        <div className='relative'>
          <button
            onClick={toggleDropdown}
            className='flex items-center focus:outline-none cursor-pointer'
          >
            <img
              className='h-8 w-8 rounded-full object-cover'
              src={user?.file || img_default}
              alt='Avatar'
            />
            <span className='ml-2 text-sm font-medium text-gray-900 hidden md:block'>
              {user ? user.nombre_completo : 'Usuario 1'}
            </span>
            {isOpen ? (
              <ChevronUp className='ml-1 h-4 w-4 text-gray-500' />
            ) : (
              <ChevronDown className='ml-1 h-4 w-4 text-gray-500' />
            )}
          </button>

          {isOpen && (
            <div className='absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg py-1 border z-50'>
              <Link
                onClick={toggleDropdown}
                to='/perfil'
                className='flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer'
              >
                <User className='h-4 w-4 mr-2' />
                Perfil
              </Link>
              <button
                onClick={handleLogout}
                className='flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100 cursor-pointer'
              >
                <LogOut className='h-4 w-4 mr-2' />
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
