import { useModalStore } from '../store/useModalStore'
import { useProveedorStore } from '../store/useProveedorStore'
import { useOrdenCompraStore } from '../store/useOrdenCompraStore'
import { useArticuloStore } from '../store/useArticuloStore'
import { useBankStore } from '../store/useBankStore'
import { ordenesSchema } from '../zod/schemas'
import { toast } from 'sonner'

export const useOrdenCompra = () => {
  // Store de users
  const getDataProveedor = useProveedorStore((state) => state.getDataProveedor)
  const getDataArticulo = useArticuloStore((state) => state.getDataArticulo)
  const getDataBanks = useBankStore((state) => state.getDataBanks)

  // Store de modal
  const modalType = useModalStore((state) => state.modalType)
  const formData = useModalStore((state) => state.formData)
  const closeModal = useModalStore((state) => state.closeModal)

  // Store de ordenes de compra
  const loading = useOrdenCompraStore((state) => state.loading)
  const ordenCompras = useOrdenCompraStore((state) => state.ordenCompras)
  const getDataOrdenCompras = useOrdenCompraStore(
    (state) => state.getDataOrdenCompras
  )
  const addOrdenCompra = useOrdenCompraStore((state) => state.addOrdenCompra)
  const editOrdenCompra = useOrdenCompraStore((state) => state.editOrdenCompra)
  const deleteOrdenCompra = useOrdenCompraStore(
    (state) => state.deleteOrdenCompra
  )

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validación ZOD
    const parsed = ordenesSchema.safeParse(formData)

    if (!parsed.success) {
      const errors = parsed.error.flatten().fieldErrors
      const firstError = Object.values(errors)[0][0]
      toast.error(firstError)
      return
    }

    if (modalType === 'add') {
      addOrdenCompra(formData)
    } else if (modalType === 'edit') {
      editOrdenCompra(formData)
    }

    closeModal()
  }

  const handleDelete = (id) => {
    deleteOrdenCompra(id)
    closeModal()
  }

  const loadOptionsProveedores = async () => {
    try {
      const data = await getDataProveedor()
      return data.map((proveedor) => ({
        value: proveedor.id,
        label: proveedor.nombre
      }))
    } catch (error) {
      console.error('Error loading data:', error)
      return []
    }
  }

  const loadOptionsArticulos = async () => {
    try {
      const data = await getDataArticulo()
      return data.map((articulo) => ({
        value: articulo.id,
        label: articulo.nombre
      }))
    } catch (error) {
      console.error('Error loading data:', error)
      return []
    }
  }

  const loadOptionsBancos = async () => {
    try {
      const data = await getDataBanks()
      return data.map((banco) => ({
        value: banco.id,
        label: banco.nombre
      }))
    } catch (error) {
      console.error('Error loading data:', error)
      return []
    }
  }

  return {
    loadOptionsProveedores,
    loadOptionsArticulos,
    loadOptionsBancos,
    ordenCompras,
    loading,
    getDataOrdenCompras,
    handleSubmit,
    handleDelete
  }
}
