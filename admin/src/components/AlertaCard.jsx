import { AlertCircle } from 'lucide-react'

export const AlertaCard = ({ text }) => {
  return (
    <div className='bg-[#3674B5] font-semibold p-3 rounded-md text-white sm:col-span-6 md:col-span-2 flex gap-1 items-center'>
      <AlertCircle />
      <h3>{text}</h3>
    </div>
  )
}
