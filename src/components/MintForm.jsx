import React, { useState } from "react"
import { Calendar, FileImage, Info, Pencil, X } from 'lucide-react'

export default function MintForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    date: "",
    imageFile: null,
  })

  const [errors, setErrors] = useState({})
  const [imagePreview, setImagePreview] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = "Название обязательно"
    }

    if (!formData.description.trim()) {
      newErrors.description = "Описание обязательно"
    }

    if (!formData.date) {
      newErrors.date = "Дата обязательна"
    }

    if (!formData.imageFile) {
      newErrors.imageFile = "Изображение обязательно"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target

    setFormData({
      ...formData,
      [name]: value,
    })

    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      })
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files?.[0] || null

    if (file) {
      setFormData({
        ...formData,
        imageFile: file,
      })

      // Create image preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)

      // Clear error
      if (errors.imageFile) {
        setErrors({
          ...errors,
          imageFile: "",
        })
      }
    }
  }

  const removeImage = () => {
    setFormData({
      ...formData,
      imageFile: null,
    })
    setImagePreview(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (validateForm()) {
      setIsSubmitting(true)
      try {
        await onSubmit(formData)
        // Reset form after successful submission
        setFormData({
          name: "",
          description: "",
          date: "",
          imageFile: null,
        })
        setImagePreview(null)
      } catch (error) {
        console.error("Error submitting form:", error)
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="p-6 space-y-1 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-center text-gray-900">Создать NFT</h2>
        <p className="text-center text-gray-500 text-sm">Заполните форму для создания вашего NFT</p>
      </div>
      <div className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="name" className="flex items-center gap-1 text-sm font-medium text-gray-700">
              <Pencil className="h-4 w-4" />
              Название
            </label>
            <input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Введите название NFT"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="flex items-center gap-1 text-sm font-medium text-gray-700">
              <Info className="h-4 w-4" />
              Описание
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Опишите ваш NFT"
              className={`w-full px-3 py-2 border rounded-md min-h-[100px] focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.description ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
          </div>

          <div className="space-y-2">
            <label htmlFor="date" className="flex items-center gap-1 text-sm font-medium text-gray-700">
              <Calendar className="h-4 w-4" />
              Дата
            </label>
            <input
              id="date"
              name="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.date ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.date && <p className="text-red-500 text-sm">{errors.date}</p>}
          </div>

          <div className="space-y-2">
            <label htmlFor="imageFile" className="flex items-center gap-1 text-sm font-medium text-gray-700">
              <FileImage className="h-4 w-4" />
              Изображение
            </label>

            {imagePreview ? (
              <div className="relative mt-2 rounded-lg overflow-hidden border border-gray-200">
                <img src={imagePreview || "/placeholder.svg"} alt="Preview" className="w-full h-48 object-cover" />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 bg-black bg-opacity-50 rounded-full p-1 text-white hover:bg-opacity-70 transition-all"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <div className="mt-2">
                <div
                  className={`border-2 border-dashed rounded-lg p-6 text-center ${
                    errors.imageFile ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <FileImage className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-2">
                    <label
                      htmlFor="imageFile"
                      className="cursor-pointer text-sm font-medium text-blue-600 hover:text-blue-500"
                    >
                      <span>Загрузить изображение</span>
                      <input
                        id="imageFile"
                        name="imageFile"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="sr-only"
                      />
                    </label>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">PNG, JPG, GIF до 10MB</p>
                </div>
              </div>
            )}

            {errors.imageFile && <p className="text-red-500 text-sm">{errors.imageFile}</p>}
          </div>
        </form>
      </div>
      <div className="p-6 border-t border-gray-200">
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Создание..." : "Минтить NFT"}
        </button>
      </div>
    </div>
  )
}
