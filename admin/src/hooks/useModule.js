import { useModuleStore } from '../store/useModuleStore'
import { useModalStore } from '../store/useModalStore'

export const useModule = () => {
  // Store de modal
  const modalType = useModalStore((state) => state.modalType)
  const formData = useModalStore((state) => state.formData)
  const closeModal = useModalStore((state) => state.closeModal)

  // Store de modules
  const loading = useModuleStore((state) => state.loading)
  const modules = useModuleStore((state) => state.modules)
  const getDataModules = useModuleStore((state) => state.getDataModules)
  const addModule = useModuleStore((state) => state.addModule)
  const editModule = useModuleStore((state) => state.editModule)
  const deleteModule = useModuleStore((state) => state.deleteModule)

  const handleSubmit = (e) => {
    e.preventDefault()

    if (modalType === 'add') {
      addModule(formData)
    } else if (modalType === 'edit') {
      editModule(formData)
    }

    closeModal()
  }

  const handleDelete = (id) => {
    deleteModule(id)
    closeModal()
  }

  const loadOptions = async () => {
    try {
      return await getDataModules()
    } catch (error) {
      console.error('Error loading modules:', error)
      return []
    }
  }

  return {
    modules,
    loading,
    getDataModules,
    handleSubmit,
    handleDelete,
    loadOptions
  }
}
