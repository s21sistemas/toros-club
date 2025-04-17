import { User, Phone, Briefcase, Mail, Shield, Edit, Save } from 'lucide-react'
import foto_default from '../assets/imgs/usuarios/default.png'

export const FormProfile = ({
  handleSubmit,
  formData,
  handlePhotoChange,
  handleChange
}) => {
  return (
    <form onSubmit={handleSubmit} className='space-y-4'>
      <div className='flex flex-col items-center mb-4'>
        <div className='relative'>
          <img
            src={formData.file || foto_default}
            alt={formData.nombre_completo}
            className='w-32 h-32 rounded-full object-cover border-4 border-gray-200'
          />
          <label className='absolute bottom-0 right-0 bg-primary text-white p-1.5 rounded-full cursor-pointer'>
            <Edit size={16} />
            <input
              type='file'
              accept='image/*'
              className='hidden'
              onChange={handlePhotoChange}
            />
          </label>
        </div>
      </div>

      <div className='space-y-3'>
        <div className='flex items-center border rounded-md p-2'>
          <User className='text-gray-500 mr-2' size={18} />
          <input
            type='text'
            name='nombre_completo'
            value={formData.nombre_completo}
            onChange={handleChange}
            className='flex-1 outline-none'
            placeholder='Nombre'
          />
        </div>

        <div className='flex items-center border rounded-md p-2'>
          <Phone className='text-gray-500 mr-2' size={18} />
          <input
            type='text'
            name='celular'
            value={formData.celular}
            onChange={handleChange}
            className='flex-1 outline-none'
            placeholder='Celular'
          />
        </div>

        <div className='flex items-center border rounded-md p-2'>
          <Briefcase className='text-gray-500 mr-2' size={18} />
          <input
            type='text'
            name='ocupacion'
            value={formData.ocupacion}
            onChange={handleChange}
            className='flex-1 outline-none'
            placeholder='Ocupación'
          />
        </div>

        <div className='flex items-center border rounded-md p-2 bg-gray-200'>
          <Mail className='text-gray-500 mr-2' size={18} />
          <input
            type='email'
            defaultValue={formData.correo}
            className='flex-1 outline-none'
            placeholder='Correo electrónico'
            disabled
          />
        </div>

        <div className='flex items-center border rounded-md p-2 bg-gray-200'>
          <Shield className='text-gray-500 mr-2' size={18} />
          <input
            type='text'
            defaultValue={formData.rol}
            className='flex-1 outline-none'
            placeholder='Rol'
            disabled
          />
        </div>
      </div>

      <button
        type='submit'
        className='w-full flex items-center justify-center gap-2 bg-primary text-white py-2 rounded-md hover:bg-primary/90 cursor-pointer'
      >
        <Save size={18} />
        Guardar cambios
      </button>
    </form>
  )
}
