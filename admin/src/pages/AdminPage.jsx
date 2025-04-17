import { AdminActions } from '../components/AdminActions'
import { AdminCards } from '../components/AdminCards'
import AdminClock from '../components/AdminClock'
import { AdminGraphic } from '../components/AdminGraphic'

const AdminPage = () => {
  return (
    <>
      <AdminCards />

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-4'>
        <div className='sm:col-span-6 md:col-span-1'>
          <div className='mb-3 w-full'>
            <AdminClock />
          </div>
          <div>
            <AdminActions />
          </div>
        </div>

        <AdminGraphic />
      </div>
    </>
  )
}
export default AdminPage
