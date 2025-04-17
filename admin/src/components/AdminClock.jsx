import { useState, useEffect } from 'react'
import { Calendar, Sun, Moon } from 'lucide-react'
import dayjs from 'dayjs'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import 'dayjs/locale/es'

dayjs.locale('es')
dayjs.extend(localizedFormat)

export default function AdminClock() {
  const [currentTime, setCurrentTime] = useState(dayjs())
  const [mounted, setMounted] = useState(false)

  const hour = currentTime.hour()
  const isDaytime = hour >= 6 && hour < 19

  useEffect(() => {
    setMounted(true)
    const interval = setInterval(() => {
      setCurrentTime(dayjs())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  if (!mounted) return null

  return (
    <div
      className={`
      w-full mx-auto overflow-hidden rounded-2xl shadow-lg
      ${
        isDaytime
          ? 'bg-gradient-to-br from-blue-400 to-indigo-500 text-white'
          : 'bg-gradient-to-br from-indigo-900 to-purple-900 text-white'
      }
      transition-all duration-500
    `}
    >
      <div className='px-7 pt-5 pb-4'>
        <div className='flex justify-between items-center mb-4'>
          <div className='text-5xl font-bold tracking-tighter tabular-nums'>
            {currentTime.format('hh:mm')}
            <span className='text-3xl opacity-80'>
              {currentTime.format(':ss')}
            </span>
          </div>

          <div className='p-2 rounded-full bg-white/20 backdrop-blur-sm'>
            {isDaytime ? (
              <Sun className='w-6 h-6 text-yellow-300' />
            ) : (
              <Moon className='w-6 h-6 text-blue-200' />
            )}
          </div>
        </div>
      </div>

      <div
        className={`
        px-8 py-4 flex items-center gap-2
        ${isDaytime ? 'bg-white/20' : 'bg-white/10'} 
        backdrop-blur-sm
      `}
      >
        <Calendar className='w-5 h-5 opacity-80' />
        <span className='font-medium'>{currentTime.format('dddd, LL')}</span>
      </div>
    </div>
  )
}
