import { Users } from 'lucide-react'
import { useEffect, useState } from 'react'
import { getPlayersByUID } from '../api/subirDocumentos'
import Loading from './Loading'

export const CardJugadoresSB = ({ search, setSelectedPerson }) => {
  const [players, setPlayers] = useState(null)

  useEffect(() => {
    const uid = search.split('=')[1]

    const getPlayers = async () => {
      const data = await getPlayersByUID(uid)
      setPlayers(data)
    }

    getPlayers()
  }, [search])

  return (
    <div className='bg-white rounded-xl shadow-md overflow-hidden mb-8'>
      <div className='bg-blue-600 px-6 py-4 flex items-center'>
        <Users className='h-6 w-6 text-white mr-2' />
        <h2 className='text-xl font-semibold text-white'>Jugadores</h2>
      </div>

      <div className='divide-y divide-gray-200'>
        {!players ? (
          <div className='mb-8'>
            <Loading />
          </div>
        ) : players.length === 0 ? (
          <p className='p-4'>
            No se encontraron jugadores registrados, comunicate con el club o
            agrega uno desde tu app móvil.
          </p>
        ) : (
          players?.map((player) => (
            <div
              key={player.id}
              className='p-6 hover:bg-gray-50 transition-colors flex items-center flex-col sm:flex-row'
            >
              <div className='flex-shrink-0'>
                <img
                  src={player.foto}
                  alt={player.nombre_completo}
                  className='h-14 w-14 rounded-full object-cover border-2 border-gray-200'
                />
              </div>
              <div className='ml-4 flex-grow'>
                <h3 className='text-lg font-medium text-gray-900'>
                  {player.nombre_completo}
                </h3>
                <div className='flex flex-col sm:flex-row items-center text-sm text-gray-500 mt-1 mb-2'>
                  <span>Estatus de documentos: </span>
                  <span
                    className={`max-w-max mt-1 px-2 sm:ms-2 sm:mt-0 py-1 rounded-md text-white ${
                      player.estatus === 'completo'
                        ? 'bg-green-500'
                        : 'bg-red-500'
                    }`}
                  >
                    {player.estatus}
                  </span>
                </div>
              </div>
              <div className='ml-4'>
                <button
                  disabled={player.estatus === 'completo'}
                  className='bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed text-white cursor-pointer px-4 py-2 rounded-md text-sm font-medium transition-colors'
                  onClick={() =>
                    setSelectedPerson({ ...player, persona: 'jugador' })
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
