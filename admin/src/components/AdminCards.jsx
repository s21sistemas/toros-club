import { User, Users, BoomBox, Landmark } from 'lucide-react'
import { useCount } from '../hooks/useCount'

export const AdminCards = () => {
  const { usersCount, playersCount, cheerleadersCount, banksCount } = useCount()

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6'>
      <div className='bg-white rounded-lg shadow p-4'>
        <div className='flex items-center'>
          <div className='p-3 rounded-full bg-blue-100 text-blue-500'>
            <User className='h-6 w-6' />
          </div>
          <div className='ml-4'>
            <p className='text-sm font-medium text-gray-500'>Usuarios</p>
            <p className='text-2xl font-semibold text-gray-900'>{usersCount}</p>
          </div>
        </div>
      </div>
      <div className='bg-white rounded-lg shadow p-4'>
        <div className='flex items-center'>
          <div className='p-3 rounded-full bg-green-100 text-green-500'>
            <Users className='h-6 w-6' />
          </div>
          <div className='ml-4'>
            <p className='text-sm font-medium text-gray-500'>Jugadores</p>
            <p className='text-2xl font-semibold text-gray-900'>
              {playersCount}
            </p>
          </div>
        </div>
      </div>
      <div className='bg-white rounded-lg shadow p-4'>
        <div className='flex items-center'>
          <div className='p-3 rounded-full bg-yellow-100 text-yellow-500'>
            <BoomBox className='h-6 w-6' />
          </div>
          <div className='ml-4'>
            <p className='text-sm font-medium text-gray-500'>Porristas</p>
            <p className='text-2xl font-semibold text-gray-900'>
              {cheerleadersCount}
            </p>
          </div>
        </div>
      </div>
      <div className='bg-white rounded-lg shadow p-4'>
        <div className='flex items-center'>
          <div className='p-3 rounded-full bg-purple-100 text-purple-500'>
            <Landmark className='h-6 w-6' />
          </div>
          <div className='ml-4'>
            <p className='text-sm font-medium text-gray-500'>Bancos</p>
            <p className='text-2xl font-semibold text-gray-900'>{banksCount}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
