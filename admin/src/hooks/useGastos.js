import { useModalStore } from '../store/useModalStore'
import { useProveedorStore } from '../store/useProveedorStore'
import { useArticuloStore } from '../store/useArticuloStore'
import { useBankStore } from '../store/useBankStore'
import { useGastosStore } from '../store/useGastosStore'
import { gastosSchema } from '../zod/schemas'
import { toast } from 'sonner'

export const useGastos = () => {
  // Stores extras
  const getDataProveedor = useProveedorStore((state) => state.getDataProveedor)
  const getDataArticulo = useArticuloStore((state) => state.getDataArticulo)
  const getDataBanks = useBankStore((state) => state.getDataBanks)

  // Store de modal
  const modalType = useModalStore((state) => state.modalType)
  const formData = useModalStore((state) => state.formData)
  const closeModal = useModalStore((state) => state.closeModal)

  // Store de ordenes de compra
  const loading = useGastosStore((state) => state.loading)
  const gastos = useGastosStore((state) => state.gastos)
  const getDataGastos = useGastosStore((state) => state.getDataGastos)
  const addGastos = useGastosStore((state) => state.addGastos)
  const editGastos = useGastosStore((state) => state.editGastos)
  const deleteGastos = useGastosStore((state) => state.deleteGastos)

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validación ZOD
    const parsed = gastosSchema.safeParse(formData)

    if (!parsed.success) {
      const errors = parsed.error.flatten().fieldErrors
      const firstError = Object.values(errors)[0][0]
      toast.error(firstError)
      return
    }

    if (modalType === 'add') {
      addGastos(formData)
    } else if (modalType === 'edit') {
      editGastos(formData)
    }

    closeModal()
  }

  const handleDelete = (id) => {
    deleteGastos(id)
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
    gastos,
    loading,
    getDataGastos,
    handleSubmit,
    handleDelete
  }
}
