import { useAlertaStore } from '../store/useAlertaStore'
import { useModalStore } from '../store/useModalStore'
import { useUserStore } from '../store/useUserStore'

export const useAlerta = () => {
  // Store de modal
  const formData = useModalStore((state) => state.formData)
  const closeModal = useModalStore((state) => state.closeModal)

  // Store de articulo
  const loading = useAlertaStore((state) => state.loading)
  const alertas = useAlertaStore((state) => state.alertas)
  const getDataAlerta = useAlertaStore((state) => state.getDataAlerta)
  const addAlerta = useAlertaStore((state) => state.addAlerta)
  const deleteAlerta = useAlertaStore((state) => state.deleteAlerta)
  const getDataUsers = useUserStore((state) => state.getDataUsers)

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      await addAlerta(formData)
    } catch (error) {
      console.log(error, 'hola')
    }
  }

  const loadOptionsAlerta = async () => {
    try {
      const data = await getDataUsers()
      return data.map((user) => ({
        value: user.id,
        label: `${user.nombre_completo} (${user.correo})`,
        tutor: user.nombre_completo,
        correo: user.correo,
        uid: user.uid
      }))
    } catch (error) {
      console.error('Error loading data:', error)
      return []
    }
  }

  const handleDelete = (id) => {
    deleteAlerta(id)
    closeModal()
  }

  return {
    alertas,
    loading,
    getDataAlerta,
    handleSubmit,
    loadOptionsAlerta,
    handleDelete
  }
}
