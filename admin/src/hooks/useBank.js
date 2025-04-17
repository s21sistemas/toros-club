import { useBankStore } from '../store/useBankStore'
import { useModalStore } from '../store/useModalStore'

export const useBank = () => {
  // Store de modal
  const modalType = useModalStore((state) => state.modalType)
  const formData = useModalStore((state) => state.formData)
  const closeModal = useModalStore((state) => state.closeModal)

  // Store de bank
  const loading = useBankStore((state) => state.loading)
  const banks = useBankStore((state) => state.banks)
  const getDataBanks = useBankStore((state) => state.getDataBanks)
  const addBank = useBankStore((state) => state.addBank)
  const editBank = useBankStore((state) => state.editBank)
  const deleteBank = useBankStore((state) => state.deleteBank)

  const handleSubmit = (e) => {
    e.preventDefault()

    if (modalType === 'add') {
      addBank(formData)
    } else if (modalType === 'edit') {
      editBank(formData)
    }

    closeModal()
  }

  const handleDelete = (id) => {
    deleteBank(id)
    closeModal()
  }

  return {
    banks,
    loading,
    getDataBanks,
    handleSubmit,
    handleDelete
  }
}
