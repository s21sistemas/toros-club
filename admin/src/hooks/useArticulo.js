import { toast } from 'sonner'
import { useArticuloStore } from '../store/useArticuloStore'
import { useModalStore } from '../store/useModalStore'
import { articulosSchema } from '../zod/schemas'

export const useArticulo = () => {
  // Store de modal
  const modalType = useModalStore((state) => state.modalType)
  const formData = useModalStore((state) => state.formData)
  const closeModal = useModalStore((state) => state.closeModal)

  // Store de articulo
  const loading = useArticuloStore((state) => state.loading)
  const articulos = useArticuloStore((state) => state.articulos)
  const getDataArticulo = useArticuloStore((state) => state.getDataArticulo)
  const addArticulo = useArticuloStore((state) => state.addArticulo)
  const editArticulo = useArticuloStore((state) => state.editArticulo)
  const deleteArticulo = useArticuloStore((state) => state.deleteArticulo)

  const handleSubmit = (e) => {
    e.preventDefault()

    // Validación ZOD
    const parsed = articulosSchema.safeParse(formData)

    if (!parsed.success) {
      const errors = parsed.error.flatten().fieldErrors
      const firstError = Object.values(errors)[0][0]
      toast.error(firstError)
      return
    }

    if (modalType === 'add') {
      addArticulo(formData)
    } else if (modalType === 'edit') {
      editArticulo(formData)
    }

    closeModal()
  }

  const handleDelete = (id) => {
    deleteArticulo(id)
    closeModal()
  }

  return {
    articulos,
    loading,
    getDataArticulo,
    handleSubmit,
    handleDelete
  }
}
