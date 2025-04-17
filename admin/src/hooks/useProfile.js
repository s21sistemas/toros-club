import { useState } from 'react'
import { useAuth } from './useAuth'
import { updateProfile } from '../api/checkAuth'
import { uploadFileToFirebase } from '../utils/uploadFile'
import { toast } from 'sonner'

export const useProfile = () => {
  const { user, setUser } = useAuth()

  const [userData, setUserData] = useState(user)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState(user)

  const handleEditToggle = () => {
    if (isEditing) {
      setFormData(userData)
    }
    setIsEditing(!isEditing)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setUserData(formData)

    const promise = async () => {
      try {
        // Si hay una foto nueva en formData.file, la subimos a Firebase
        if (formData.file && formData.file instanceof File) {
          const path = `admins/fotos/`
          const downloadURL = await uploadFileToFirebase(formData.file, path)
          formData.file = downloadURL
        }

        await updateProfile(formData.id, formData)
        setUser(formData)
      } catch (error) {
        console.error(error)
      } finally {
        setIsEditing(false)
      }
    }

    toast.promise(promise(), {
      loading: 'Actualizando datos...',
      success: 'Datos actualizados',
      error: 'Falló al crear el registro.'
    })
  }

  const handlePhotoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      const previewUrl = URL.createObjectURL(file)

      setUser({
        ...user,
        fotoPreview: previewUrl,
        file
      })

      setFormData({
        ...formData,
        file
      })

      user.file = previewUrl
    }
  }

  return {
    handleEditToggle,
    handleChange,
    handleSubmit,
    handlePhotoChange,
    isEditing,
    formData,
    userData
  }
}
