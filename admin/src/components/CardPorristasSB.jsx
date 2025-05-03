import { Flag } from 'lucide-react'
import { useEffect, useState } from 'react'
import { getCheerleaderByUID } from '../api/subirDocumentos'
import Loading from './Loading'

export const CardPorristasSB = ({ search, setSelectedPerson }) => {
  const [cheerleaders, setCheerleaders] = useState(null)

  useEffect(() => {
    const uid = search.split('=')[1]
    const getCheer = async () => {
      const data = await getCheerleaderByUID(uid)
      setCheerleaders(data)
    }

    getCheer()
  }, [search])

  return (
    <div className='bg-white rounded-xl shadow-md overflow-hidden'>
      <div className='bg-pink-600 px-6 py-4 flex items-center'>
        <Flag className='h-6 w-6 text-white mr-2' />
        <h2 className='text-xl font-semibold text-white'>Porristas</h2>
      </div>

      <div className='divide-y divide-gray-200'>
        {!cheerleaders ? (
          <div className='mb-8'>
            <Loading />
          </div>
        ) : cheerleaders.length === 0 ? (
          <p className='p-4'>
            No se encontraron porristas registradas, comunicate con el club o
            agrega uno desde tu app móvil.
          </p>
        ) : (
          cheerleaders.map((cheerleader) => (
            <div
              key={cheerleader.id}
              className='p-6 hover:bg-gray-50 transition-colors flex items-center flex-col sm:flex-row'
            >
              <div className='flex-shrink-0'>
                <img
                  src={cheerleader.foto}
                  alt={cheerleader.nombre_completo}
                  className='h-14 w-14 rounded-full object-cover border-2 border-gray-200'
                />
              </div>
              <div className='ml-4 flex-grow'>
                <h3 className='text-lg font-medium text-gray-900'>
                  {cheerleader.nombre_completo}
                </h3>
                <div className='flex flex-col sm:flex-row items-center text-sm text-gray-500 mt-1 mb-2'>
                  <span>Estatus de documentos: </span>
                  <span
                    className={`max-w-max mt-1 px-2 sm:ms-2 sm:mt-0 py-1 rounded-md text-white ${
                      cheerleader.estatus === 'completo'
                        ? 'bg-green-500'
                        : 'bg-red-500'
                    }`}
                  >
                    {cheerleader.estatus}
                  </span>
                </div>
              </div>
              <div className='ml-4'>
                <button
                  disabled={cheerleader.estatus === 'completo'}
                  className='bg-pink-600 hover:bg-pink-700 disabled:bg-pink-300 disabled:cursor-not-allowed cursor-pointer text-white px-4 py-2 rounded-md text-sm font-medium transition-colors'
                  onClick={() =>
                    setSelectedPerson({ ...cheerleader, persona: 'porrista' })
                  }
                >
                  Subir documentos
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
