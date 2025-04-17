import { toast } from 'sonner'
import { useAlmacenStore } from '../store/useAlmacenStore'
import { useArticuloStore } from '../store/useArticuloStore'
import { useModalStore } from '../store/useModalStore'
import { almacenSchema } from '../zod/schemas'

export const useAlmacen = () => {
  // Store de modal
  const modalType = useModalStore((state) => state.modalType)
  const formData = useModalStore((state) => state.formData)
  const closeModal = useModalStore((state) => state.closeModal)

  // Store de articulo
  const loading = useAlmacenStore((state) => state.loading)
  const almacen = useAlmacenStore((state) => state.almacen)
  const getDataAlmacen = useAlmacenStore((state) => state.getDataAlmacen)
  const addAlmacen = useAlmacenStore((state) => state.addAlmacen)
  const editAlmacen = useAlmacenStore((state) => state.editAlmacen)
  const deleteAlmacen = useAlmacenStore((state) => state.deleteAlmacen)

  const getDataArticulo = useArticuloStore((state) => state.getDataArticulo)

  const handleSubmit = (e) => {
    e.preventDefault()

    // Validación ZOD
    const parsed = almacenSchema.safeParse(formData)

    if (!parsed.success) {
      const errors = parsed.error.flatten().fieldErrors
      const firstError = Object.values(errors)[0][0]
      toast.error(firstError)
      return
    }

    if (modalType === 'add') {
      addAlmacen(formData)
    } else if (modalType === 'edit') {
      editAlmacen(formData)
    }

    closeModal()
  }

  const handleDelete = (id) => {
    deleteAlmacen(id)
    closeModal()
  }

  const loadOptions = async () => {
    try {
      const data = await getDataArticulo()
      return data.map((articulo) => ({
        value: articulo.id,
        label: articulo.nombre
      }))
    } catch (error) {
      console.error('Error loading articulos:', error)
      return []
    }
  }

  return {
    loadOptions,
    almacen,
    loading,
    getDataAlmacen,
    handleSubmit,
    handleDelete
  }
}
