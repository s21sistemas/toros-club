import { X, ChevronDown, ChevronUp, Dot } from 'lucide-react'
import logo from '../assets/imgs/logo.png'
import { Link, useLocation } from 'react-router'
import { useState } from 'react'
import { routes } from '../routes/routes'
import { useAuth } from '../hooks/useAuth'

export const Sidebar = ({ toggleSidebar, sidebarOpen }) => {
  const location = useLocation()
  const [openMenus, setOpenMenus] = useState({})
  const { accesos } = useAuth()

  const toggleMenu = (label) => {
    setOpenMenus((prev) => ({ ...prev, [label]: !prev[label] }))
  }

  const isActive = (path) =>
    location.pathname === path ? 'bg-primary-dark' : 'hover:bg-primary-dark'

  const hasAccess = (path) => {
    if (path === '/') return true
    const acceso = path.replace('/', '')
    return accesos?.includes(acceso)
  }

  const handleLinkClick = () => {
    if (sidebarOpen) {
      toggleSidebar()
    }
  }

  return (
    <div
      className={`fixed inset-y-0 left-0 z-50 w-56 bg-secondary text-white transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-auto lg:h-screen sidebar ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className='flex items-center justify-between h-16 px-4 border-b border-primary-dark'>
        <Link onClick={handleLinkClick} to='/' className='flex items-center'>
          <div className='w-8 h-8 rounded-md flex items-center justify-center mr-2'>
            <img src={logo} alt='Logo de toros' />
          </div>
          <span className='text-xl font-semibold'>Panel admin</span>
        </Link>
        <button
          onClick={toggleSidebar}
          className='p-1 rounded-md hover:bg-primary-dark lg:hidden'
        >
          <X size={20} />
        </button>
      </div>

      <nav className='mt-5 px-2'>
        <div className='space-y-1'>
          {routes.map((route) => {
            if (route.path && !hasAccess(route.path)) return null
            if (route.children) {
              const visibleChildren = route.children.filter((child) =>
                hasAccess(child.path)
              )
              if (visibleChildren.length === 0) return null

              return (
                <div key={route.label}>
                  <button
                    onClick={() => toggleMenu(route.label)}
                    className='cursor-pointer flex items-center w-full px-4 py-2 text-sm font-medium rounded-md text-white hover:bg-primary-dark transition-all'
                  >
                    {route.Icon && <route.Icon className='mr-3 h-5 w-5' />}
                    {route.label}
                    {openMenus[route.label] ? (
                      <ChevronUp className='ml-auto h-4 w-4' />
                    ) : (
                      <ChevronDown className='ml-auto h-4 w-4' />
                    )}
                  </button>
                  <div
                    className={`ml-6 mt-1 space-y-1 transition-all overflow-hidden ${
                      openMenus[route.label] ? 'max-h-60' : 'max-h-0'
                    }`}
                  >
                    {visibleChildren.map((child) => (
                      <Link
                        key={child.path}
                        to={child.path}
                        onClick={handleLinkClick}
                        className={`flex items-center px-4 py-2 text-sm font-medium rounded-md text-white text-shadow transition-all ${isActive(
                          child.path
                        )}`}
                      >
                        <Dot className='h-5 w-5' />
                        {child.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )
            }

            return (
              <Link
                key={route.label}
                to={route.path}
                onClick={handleLinkClick}
                className={`flex items-center px-4 py-2 text-sm font-medium rounded-md text-white text-shadow transition-all ${isActive(
                  route.path
                )}`}
              >
                {route.Icon && <route.Icon className='mr-3 h-5 w-5' />}
                {route.label}
              </Link>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
