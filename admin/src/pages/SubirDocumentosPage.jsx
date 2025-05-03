import { useEffect, useState } from 'react'
import { useLocation } from 'react-router'
import { CardPorristasSB } from '../components/CardPorristasSB'
import { CardJugadoresSB } from '../components/CardJugadoresSB'
import { PersonaSeleccionadaSB } from '../components/PersonaSeleccionadaSB'
import { Toaster } from 'sonner'

const SubirDocumentosPage = () => {
  const { search } = useLocation()

  useEffect(() => {
    if (!search) window.location.href = 'https://sistema.clubtoros.com/'
    const uid = search.split('=')[1]
    if (!uid) window.location.href = 'https://sistema.clubtoros.com/'
  }, [search])

  const [selectedPerson, setSelectedPerson] = useState(null)

  if (selectedPerson) {
    return (
      <PersonaSeleccionadaSB
        selectedPerson={selectedPerson}
        setSelectedPerson={setSelectedPerson}
      />
    )
  }

  return (
    <div className='min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8'>
      <Toaster richColors position='bottom-right' />
      <div className='max-w-4xl mx-auto'>
        <div className='text-center mb-8'>
          <h1 className='text-3xl font-bold text-gray-900'>
            Subir de Documentos
          </h1>
          <p className='mt-2 text-gray-600'>
            Selecciona un jugador o porrista para subir sus documentos
          </p>
        </div>

        <CardJugadoresSB
          search={search}
          setSelectedPerson={setSelectedPerson}
        />

        <CardPorristasSB
          search={search}
          setSelectedPerson={setSelectedPerson}
        />
      </div>
    </div>
  )
}

export default SubirDocumentosPage
