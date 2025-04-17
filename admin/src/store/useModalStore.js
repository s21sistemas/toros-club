import { create } from 'zustand'

export const useModalStore = create((set) => ({
  isOpen: false,
  modalType: null,
  currentItem: null,
  formData: {},
  firma: null,

  editFirma: (file) => {
    set({ firma: file })
  },

  openModal: (type, item = null, defaultData = {}) => {
    set({
      isOpen: true,
      modalType: type,
      currentItem: item,
      formData: item ? { ...item } : { ...defaultData }
    })
  },

  closeModal: () => set({ isOpen: false, modalType: null, currentItem: null }),

  resetFormData: (defaultData = {}) => set({ formData: { ...defaultData } }),

  setFormData: (key, value) =>
    set((state) => {
      const keys = key.split('.') // Manejar claves anidadas como "transferencia.monto"
      let newFormData = { ...state.formData }
      let current = newFormData

      keys.forEach((k, index) => {
        if (index === keys.length - 1) {
          current[k] = value
        } else {
          current[k] = current[k] || {} // Asegurar que el objeto anidado exista
          current = current[k]
        }
      })

      return { formData: newFormData }
    }),

  setNestedFormData: (key, value) =>
    set((state) => {
      const keys = key.split('.')
      let newFormData = { ...state.formData }
      let current = newFormData

      keys.forEach((k, index) => {
        if (index === keys.length - 1) {
          // Si el campo es de fecha y está vacío, guardarlo como null
          if (k.includes('fecha') && value === '') {
            current[k] = null
          }
          // Si el campo es estatus y no tiene valor, establecerlo en "pendiente"
          else if (k === 'estatus' && !value) {
            current[k] = 'pendiente'
          } else {
            current[k] = value
          }
        } else {
          current[k] = current[k] || (isNaN(keys[index + 1]) ? {} : [])
          current = current[k]
        }
      })

      return { formData: newFormData }
    })
}))
