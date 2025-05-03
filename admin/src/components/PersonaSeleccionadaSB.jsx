import { ChevronRight } from 'lucide-react'
import { FormSubirDocumentos } from './FormSubirDocumentos'

export const PersonaSeleccionadaSB = ({
  selectedPerson,
  setSelectedPerson
}) => {
  return (
    <div>
      <div className='bg-white p-4 shadow-sm'>
        <button
          onClick={() => setSelectedPerson(null)}
          className='flex items-center text-blue-600 hover:text-blue-800 cursor-pointer'
        >
          <ChevronRight className='h-4 w-4 transform rotate-180 mr-1' />
          <span>Volver a la lista</span>
        </button>
        <h2 className='text-xl font-semibold mt-2'>
          Documentos de {selectedPerson.nombre_completo}
        </h2>
      </div>
      <FormSubirDocumentos
        id={selectedPerson.id}
        persona={selectedPerson.persona}
      />
    </div>
  )
}
