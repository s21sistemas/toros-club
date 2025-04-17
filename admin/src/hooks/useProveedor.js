import { toast } from 'sonner'
import { useModalStore } from '../store/useModalStore'
import { useProveedorStore } from '../store/useProveedorStore'
import { proveedorSchema } from '../zod/schemas'

export const useProveedor = () => {
  // Store de modal
  const modalType = useModalStore((state) => state.modalType)
  const formData = useModalStore((state) => state.formData)
  const closeModal = useModalStore((state) => state.closeModal)

  // Store de bank
  const loading = useProveedorStore((state) => state.loading)
  const proveedores = useProveedorStore((state) => state.proveedores)
  const getDataProveedor = useProveedorStore((state) => state.getDataProveedor)
  const addProveedor = useProveedorStore((state) => state.addProveedor)
  const editProveedor = useProveedorStore((state) => state.editProveedor)
  const deleteProveedor = useProveedorStore((state) => state.deleteProveedor)

  const handleSubmit = (e) => {
    e.preventDefault()

    // Validación ZOD
    const parsed = proveedorSchema.safeParse(formData)

    if (!parsed.success) {
      const errors = parsed.error.flatten().fieldErrors
      const firstError = Object.values(errors)[0][0]
      toast.error(firstError)
      return
    }

    if (modalType === 'add') {
      addProveedor(formData)
    } else if (modalType === 'edit') {
      editProveedor(formData)
    }

    closeModal()
  }

  const handleDelete = (id) => {
    deleteProveedor(id)
    closeModal()
  }

  return {
    proveedores,
    loading,
    getDataProveedor,
    handleSubmit,
    handleDelete
  }
}
