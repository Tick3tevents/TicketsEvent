"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import {
  Calendar,
  Clock,
  MapPin,
  ImageIcon,
  Ticket,
  DollarSign,
  Users,
  Info,
  Plus,
  Trash2,
  Save,
  ArrowLeft,
  Sparkles,
  Percent,
  ToggleLeft,
  ToggleRight,
  HelpCircle,
  AlertCircle,
  Loader2,
  CheckCircle2,
  ChevronRight,
  Star,
  Award,
} from "lucide-react"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"

interface TicketTier {
  id: string
  name: string
  description: string
  price: string
  supply: string
  perks: string
  resaleAllowed: boolean
  royaltyPercent: number
}

interface EventFormData {
  title: string
  description: string
  category: string
  locationType: "physical" | "virtual"
  location: string
  startDate: string
  startTime: string
  endDate: string
  endTime: string
  bannerImage: string | null // This will be a local URL for preview
  logoImage: string | null   // This will be a local URL for preview
  ticketTiers: TicketTier[]
  defaultRoyaltyPercent: number
  allowResale: boolean
  useWhitelist: boolean
}

const NewEvent = () => {
  const emptyTier: TicketTier = {
    id: Date.now().toString(),
    name: "",
    description: "",
    price: "",
    supply: "",
    perks: "",
    resaleAllowed: true,
    royaltyPercent: 5,
  }

  const [formData, setFormData] = useState<EventFormData>({
    title: "",
    description: "",
    category: "",
    locationType: "physical",
    location: "",
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    bannerImage: null,
    logoImage: null,
    ticketTiers: [emptyTier],
    defaultRoyaltyPercent: 5,
    allowResale: true,
    useWhitelist: false,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [apiError, setApiError] = useState<string | null>(null); // State for API errors
  const [activeSection, setActiveSection] = useState<"basic" | "tickets" | "advanced">("basic")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [previewMode, setPreviewMode] = useState(false)
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false)
  const [animateSection, setAnimateSection] = useState(false)

  const bannerInputRef = useRef<HTMLInputElement>(null)
  const logoInputRef = useRef<HTMLInputElement>(null)
  const basicSectionRef = useRef<HTMLDivElement>(null)
  const ticketsSectionRef = useRef<HTMLDivElement>(null)
  const advancedSectionRef = useRef<HTMLDivElement>(null)

  const categories = [
    "Music", "Conference", "Workshop", "Exhibition", "Sports", "Tech",
    "Art", "Gaming", "Finance", "Business", "Entertainment", "Other",
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleToggleChange = (name: string, value: boolean) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleTierChange = (id: string, field: keyof TicketTier, value: string | boolean | number) => {
    setFormData((prev) => ({
      ...prev,
      ticketTiers: prev.ticketTiers.map((tier) => (tier.id === id ? { ...tier, [field]: value } : tier)),
    }))
  }

  const addTicketTier = () => {
    const newTier: TicketTier = {
      ...emptyTier,
      id: Date.now().toString(),
      royaltyPercent: formData.defaultRoyaltyPercent,
      resaleAllowed: formData.allowResale,
    }

    setFormData((prev) => ({
      ...prev,
      ticketTiers: [...prev.ticketTiers, newTier],
    }))
  }

  const removeTicketTier = (id: string) => {
    if (formData.ticketTiers.length <= 1) {
      return
    }

    setFormData((prev) => ({
      ...prev,
      ticketTiers: prev.ticketTiers.filter((tier) => tier.id !== id),
    }))
  }

  const handleImageUpload = (type: "banner" | "logo", e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const imageUrl = URL.createObjectURL(file)

    setFormData((prev) => ({
      ...prev,
      [type === "banner" ? "bannerImage" : "logoImage"]: imageUrl,
    }))
  }

  const triggerFileInput = (type: "banner" | "logo") => {
    if (type === "banner") {
      bannerInputRef.current?.click()
    } else {
      logoInputRef.current?.click()
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) newErrors.title = "Title is required"
    if (!formData.description.trim()) newErrors.description = "Description is required"
    if (!formData.category) newErrors.category = "Category is required"
    if (!formData.location.trim()) newErrors.location = "Location is required"
    if (!formData.startDate) newErrors.startDate = "Start date is required"
    if (!formData.startTime) newErrors.startTime = "Start time is required"

    formData.ticketTiers.forEach((tier, index) => {
      if (!tier.name.trim()) newErrors[`tier-${index}-name`] = "Name is required"
      if (!tier.price.trim() || isNaN(parseFloat(tier.price))) newErrors[`tier-${index}-price`] = "Valid price is required"
      if (!tier.supply.trim() || isNaN(parseInt(tier.supply, 10)) || parseInt(tier.supply, 10) < 1) newErrors[`tier-${index}-supply`] = "Valid supply (min 1) is required"
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setApiError(null); // Clear previous API errors

    if (!validateForm()) {
      const firstErrorKey = Object.keys(errors)[0]
      const element = document.getElementById(firstErrorKey)
      element?.scrollIntoView({ behavior: "smooth", block: "center" })
      return
    }

    setIsSubmitting(true)

    try {
      const dataToSend = new FormData();

      // IMPORTANT: Replace with a real connected wallet address
      const organizerWalletAddress = "YOUR_CONNECTED_WALLET_ADDRESS_HERE"; // <<< Replace this!
      if (!organizerWalletAddress || organizerWalletAddress === "YOUR_CONNECTED_WALLET_ADDRESS_HERE") {
        throw new Error("Wallet not connected. Please connect your wallet.");
      }
      dataToSend.append("organizerWalletAddress", organizerWalletAddress);

      dataToSend.append("title", formData.title);
      dataToSend.append("description", formData.description);
      dataToSend.append("category", formData.category);
      dataToSend.append("locationType", formData.locationType);
      dataToSend.append("location", formData.location);
      dataToSend.append("startDate", formData.startDate);
      dataToSend.append("startTime", formData.startTime);
      dataToSend.append("endDate", formData.endDate);
      dataToSend.append("endTime", formData.endTime);
      dataToSend.append("defaultRoyaltyPercent", formData.defaultRoyaltyPercent.toString());
      dataToSend.append("allowResale", formData.allowResale.toString());
      dataToSend.append("useWhitelist", formData.useWhitelist.toString());

      // Stringify ticketTiers array to send as a single string
      dataToSend.append("ticketTiers", JSON.stringify(formData.ticketTiers));

      // Append image files if selected
      if (bannerInputRef.current?.files?.[0]) {
        dataToSend.append("bannerImage", bannerInputRef.current.files[0]);
      }
      if (logoInputRef.current?.files?.[0]) {
        dataToSend.append("logoImage", logoInputRef.current.files[0]);
      }

      const response = await fetch("/api/create", {
        method: "POST",
        body: dataToSend, // FormData handles Content-Type automatically
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || "Failed to create event.");
      }

      const result = await response.json();
      console.log("Event created successfully:", result);

      setShowSuccessAnimation(true);

      setTimeout(() => {
        setShowSuccessAnimation(false);
        setIsSubmitting(false);
        // Optionally, redirect to the new event's dashboard or event page
        // router.push(`/event/${result.eventId}`);
      }, 3000);
    } catch (error: any) {
      console.error("Error creating event:", error);
      setApiError(error.message || "Failed to create event. Please try again.");
      setIsSubmitting(false);
    }
  }

  const navigateToSection = (section: "basic" | "tickets" | "advanced") => {
    setAnimateSection(false)

    setTimeout(() => {
      setActiveSection(section)
      setAnimateSection(true)
    }, 300)
  }

  useEffect(() => {
    setAnimateSection(true)
  }, [])

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Navbar />
      <main>
        <section className="pt-24 pb-12 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 relative overflow-hidden">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_50%_120%,#3b82f6,#1e3a8a)]"></div>

            <svg width="100%" height="100%" className="absolute inset-0 opacity-5">
              <pattern id="tickets-pattern" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
                <path
                  d="M15 0H45C52.5228 0 60 7.47715 60 15V45C60 52.5228 52.5228 60 45 60H15C7.47715 60 0 52.5228 0 45V15C0 7.47715 7.47715 0 15 0Z"
                  stroke="white"
                  strokeWidth="1"
                  fill="none"
                />
              </pattern>
              <rect x="0" y="0" width="100%" height="100%" fill="url(#tickets-pattern)" />
            </svg>
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="flex items-center mb-6">
              <button
                onClick={() => window.history.back()}
                className="flex items-center text-white/80 hover:text-white transition-colors group"
              >
                <ArrowLeft className="h-5 w-5 mr-2 transform group-hover:-translate-x-1 transition-transform duration-300" />
                <span>Back</span>
              </button>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="inline-block bg-white/10 backdrop-blur-sm text-white px-4 py-1 rounded-lg mb-4 animate-fadeIn">
                ORGANIZER DASHBOARD
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 animate-fadeIn">
                Create <span className="text-blue-200">Unforgettable</span> Events
              </h1>
              <p className="text-xl text-blue-100 max-w-2xl mb-8 animate-fadeIn">
                Set up your event details and create NFT tickets on Solana blockchain
              </p>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-1 flex mb-8 animate-fadeIn">
                <button
                  onClick={() => navigateToSection("basic")}
                  className={`flex-1 py-3 px-4 rounded-lg flex items-center justify-center text-sm font-medium transition-all duration-300 ${
                    activeSection === "basic" ? "bg-white text-blue-600 shadow-lg" : "text-white hover:bg-white/10"
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 ${
                      activeSection === "basic" ? "bg-blue-600 text-white" : "bg-white/20 text-white"
                    }`}
                  >
                    <span>1</span>
                  </div>
                  Basic Info
                  {activeSection !== "basic" && <ChevronRight className="h-4 w-4 ml-1 opacity-50" />}
                </button>
                <button
                  onClick={() => navigateToSection("tickets")}
                  className={`flex-1 py-3 px-4 rounded-lg flex items-center justify-center text-sm font-medium transition-all duration-300 ${
                    activeSection === "tickets" ? "bg-white text-blue-600 shadow-lg" : "text-white hover:bg-white/10"
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 ${
                      activeSection === "tickets" ? "bg-blue-600 text-white" : "bg-white/20 text-white"
                    }`}
                  >
                    <span>2</span>
                  </div>
                  Ticket Tiers
                  {activeSection !== "tickets" && <ChevronRight className="h-4 w-4 ml-1 opacity-50" />}
                </button>
                <button
                  onClick={() => navigateToSection("advanced")}
                  className={`flex-1 py-3 px-4 rounded-lg flex items-center justify-center text-sm font-medium transition-all duration-300 ${
                    activeSection === "advanced" ? "bg-white text-blue-600 shadow-lg" : "text-white hover:bg-white/10"
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 ${
                      activeSection === "advanced" ? "bg-blue-600 text-white" : "bg-white/20 text-white"
                    }`}
                  >
                    <span>3</span>
                  </div>
                  Advanced
                  {activeSection !== "advanced" && <ChevronRight className="h-4 w-4 ml-1 opacity-50" />}
                </button>
              </div>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
            <svg
              className="relative block w-full h-16 text-white"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 1200 120"
              preserveAspectRatio="none"
            >
              <path
                d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
                className="fill-current"
              ></path>
            </svg>
          </div>
        </section>

        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              {showSuccessAnimation && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-blue-900/80 backdrop-blur-sm animate-fadeIn">
                  <div className="bg-white rounded-2xl p-8 shadow-2xl max-w-md w-full mx-4">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle2 className="h-10 w-10 text-green-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-center mb-2">Event Created!</h2>
                    <p className="text-gray-600 text-center mb-6">
                      Your event has been successfully created and is now ready for ticket sales.
                    </p>
                    <div className="flex justify-center">
                      <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300 font-medium">
                        View Event Dashboard
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {apiError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg relative mb-6" role="alert">
                  <strong className="font-bold">Error! </strong>
                  <span className="block sm:inline">{apiError}</span>
                  <span className="absolute top-0 bottom-0 right-0 px-4 py-3" onClick={() => setApiError(null)}>
                    <X className="h-4 w-4 text-red-500 cursor-pointer" />
                  </span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-12">
                <div
                  ref={basicSectionRef}
                  className={`transition-all duration-500 ease-in-out transform ${
                    activeSection === "basic" ? "block opacity-100 translate-x-0" : "hidden opacity-0 -translate-x-10"
                  } ${animateSection ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"}`}
                >
                  <div className="bg-white rounded-xl shadow-md border border-blue-100 overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 border-b border-blue-100">
                      <h2 className="text-xl font-bold text-white flex items-center">
                        <Info className="h-5 w-5 mr-2 text-blue-200" />
                        Basic Information
                      </h2>
                    </div>

                    <div className="p-6 space-y-6">
                      <div className="group">
                        <label
                          htmlFor="title"
                          className="block text-sm font-medium text-gray-700 mb-1 group-focus-within:text-blue-600 transition-colors duration-200"
                        >
                          Event Title <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          id="title"
                          name="title"
                          value={formData.title}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 rounded-lg border ${
                            errors.title ? "border-red-500" : "border-gray-300 group-focus-within:border-blue-500"
                          } focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200`}
                          placeholder="e.g., Solana Summer Hackathon 2023"
                        />
                        {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
                      </div>

                      <div className="group">
                        <label
                          htmlFor="description"
                          className="block text-sm font-medium text-gray-700 mb-1 group-focus-within:text-blue-600 transition-colors duration-200"
                        >
                          Event Description <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          id="description"
                          name="description"
                          value={formData.description}
                          onChange={handleInputChange}
                          rows={4}
                          className={`w-full px-4 py-3 rounded-lg border ${
                            errors.description ? "border-red-500" : "border-gray-300 group-focus-within:border-blue-500"
                          } focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200`}
                          placeholder="Describe your event, what attendees can expect, etc."
                        />
                        {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
                      </div>

                      <div className="group">
                        <label
                          htmlFor="category"
                          className="block text-sm font-medium text-gray-700 mb-1 group-focus-within:text-blue-600 transition-colors duration-200"
                        >
                          Category <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <select
                            id="category"
                            name="category"
                            value={formData.category}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-3 rounded-lg border appearance-none ${
                              errors.category ? "border-red-500" : "border-gray-300 group-focus-within:border-blue-500"
                            } focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200`}
                          >
                            <option value="">Select a category</option>
                            {categories.map((category) => (
                              <option key={category} value={category}>
                                {category}
                              </option>
                            ))}
                          </select>
                          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <ChevronRight className="h-4 w-4 ml-1 opacity-50" />
                          </div>
                        </div>
                        {errors.category && <p className="mt-1 text-sm text-red-500">{errors.category}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">Location Type</label>
                        <div className="flex space-x-4">
                          <button
                            type="button"
                            onClick={() => handleToggleChange("locationType", "physical")}
                            className={`flex-1 py-3 px-4 rounded-lg flex items-center justify-center text-sm font-medium transition-all duration-300 ${
                              formData.locationType === "physical"
                                ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md transform -translate-y-1"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                          >
                            <MapPin className="h-4 w-4 mr-2" />
                            Physical Location
                          </button>
                          <button
                            type="button"
                            onClick={() => handleToggleChange("locationType", "virtual")}
                            className={`flex-1 py-3 px-4 rounded-lg flex items-center justify-center text-sm font-medium transition-all duration-300 ${
                              formData.locationType === "virtual"
                                ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md transform -translate-y-1"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                          >
                            <GlobeIcon className="h-4 w-4 mr-2" />
                            Virtual Event
                          </button>
                        </div>
                      </div>

                      <div className="group">
                        <label
                          htmlFor="location"
                          className="block text-sm font-medium text-gray-700 mb-1 group-focus-within:text-blue-600 transition-colors duration-200"
                        >
                          {formData.locationType === "physical" ? "Venue Address" : "Virtual Event URL"}{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            {formData.locationType === "physical" ? (
                              <MapPin className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" />
                            ) : (
                              <GlobeIcon className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" />
                            )}
                          </div>
                          <input
                            type="text"
                            id="location"
                            name="location"
                            value={formData.location}
                            onChange={handleInputChange}
                            className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                              errors.location ? "border-red-500" : "border-gray-300 group-focus-within:border-blue-500"
                            } focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200`}
                            placeholder={
                              formData.locationType === "physical"
                                ? "e.g., 123 Main St, San Francisco, CA"
                                : "e.g., https://zoom.us/j/123456789"
                            }
                          />
                        </div>
                        {errors.location && <p className="mt-1 text-sm text-red-500">{errors.location}</p>}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="group">
                          <label
                            htmlFor="startDate"
                            className="block text-sm font-medium text-gray-700 mb-1 group-focus-within:text-blue-600 transition-colors duration-200"
                          >
                            Start Date <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Calendar className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" />
                            </div>
                            <input
                              type="date"
                              id="startDate"
                              name="startDate"
                              value={formData.startDate}
                              onChange={handleInputChange}
                              className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                                errors.startDate
                                  ? "border-red-500"
                                  : "border-gray-300 group-focus-within:border-blue-500"
                              } focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200`}
                            />
                          </div>
                          {errors.startDate && <p className="mt-1 text-sm text-red-500">{errors.startDate}</p>}
                        </div>

                        <div className="group">
                          <label
                            htmlFor="startTime"
                            className="block text-sm font-medium text-gray-700 mb-1 group-focus-within:text-blue-600 transition-colors duration-200"
                          >
                            Start Time <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Clock className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" />
                            </div>
                            <input
                              type="time"
                              id="startTime"
                              name="startTime"
                              value={formData.startTime}
                              onChange={handleInputChange}
                              className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                                errors.startTime
                                  ? "border-red-500"
                                  : "border-gray-300 group-focus-within:border-blue-500"
                              } focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200`}
                            />
                          </div>
                          {errors.startTime && <p className="mt-1 text-sm text-red-500">{errors.startTime}</p>}
                        </div>

                        <div className="group">
                          <label
                            htmlFor="endDate"
                            className="block text-sm font-medium text-gray-700 mb-1 group-focus-within:text-blue-600 transition-colors duration-200"
                          >
                            End Date
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Calendar className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" />
                            </div>
                            <input
                              type="date"
                              id="endDate"
                              name="endDate"
                              value={formData.endDate}
                              onChange={handleInputChange}
                              className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                            />
                          </div>
                        </div>

                        <div className="group">
                          <label
                            htmlFor="endTime"
                            className="block text-sm font-medium text-gray-700 mb-1 group-focus-within:text-blue-600 transition-colors duration-200"
                          >
                            End Time
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Clock className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" />
                            </div>
                            <input
                              type="time"
                              id="endTime"
                              name="endTime"
                              value={formData.endTime}
                              onChange={handleInputChange}
                              className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">Banner Image</label>
                        <input
                          type="file"
                          ref={bannerInputRef}
                          onChange={(e) => handleImageUpload("banner", e)}
                          accept="image/*"
                          className="hidden"
                        />

                        {formData.bannerImage ? (
                          <div className="relative rounded-lg overflow-hidden group">
                            <img
                              src={formData.bannerImage || "/placeholder.svg"}
                              alt="Banner preview"
                              className="w-full h-48 object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <button
                                type="button"
                                onClick={() => triggerFileInput("banner")}
                                className="bg-white text-gray-800 px-4 py-2 rounded-lg text-sm font-medium mb-4 shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300"
                              >
                                Change Image
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div
                            onClick={() => triggerFileInput("banner")}
                            className="border-2 border-dashed border-blue-200 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all duration-300 group"
                          >
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                              <ImageIcon className="h-8 w-8 text-blue-600" />
                            </div>
                            <p className="text-sm text-gray-600 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                              Drag and drop your banner image here, or click to browse
                            </p>
                            <p className="text-xs text-gray-400">Recommended size: 1200 x 400px. Max file size: 5MB</p>
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">Event Logo</label>
                        <input
                          type="file"
                          ref={logoInputRef}
                          onChange={(e) => handleImageUpload("logo", e)}
                          accept="image/*"
                          className="hidden"
                        />

                        <div className="flex items-center space-x-4">
                          {formData.logoImage ? (
                            <div className="relative w-24 h-24 rounded-lg overflow-hidden group">
                              <img
                                src={formData.logoImage || "/placeholder.svg"}
                                alt="Logo preview"
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                              />
                              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <button
                                  type="button"
                                  onClick={() => triggerFileInput("logo")}
                                  className="bg-white text-gray-800 p-1 rounded-lg text-xs"
                                >
                                  Change
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div
                              onClick={() => triggerFileInput("logo")}
                              className="w-24 h-24 border-2 border-dashed border-blue-200 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all duration-300 group"
                            >
                              <ImageIcon className="h-8 w-8 text-blue-400 group-hover:text-blue-600 transition-colors duration-300" />
                              <p className="text-xs text-gray-500 text-center mt-1 group-hover:text-blue-600 transition-colors duration-300">
                                Add Logo
                              </p>
                            </div>
                          )}

                          <div className="flex-1">
                            <p className="text-sm text-gray-700 font-medium">Event Logo</p>
                            <p className="text-xs text-gray-500">
                              This will be displayed on your event page and tickets. Square format recommended.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 px-6 py-4 flex justify-between">
                      <button
                        type="button"
                        onClick={() => window.history.back()}
                        className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors duration-300 text-sm font-medium flex items-center"
                      >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => navigateToSection("tickets")}
                        className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 text-sm font-medium flex items-center group shadow-md hover:shadow-lg"
                      >
                        Next: Ticket Tiers
                        <ChevronRight className="h-4 w-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" />
                      </button>
                    </div>
                  </div>
                </div>

                <div
                  ref={ticketsSectionRef}
                  className={`transition-all duration-500 ease-in-out transform ${
                    activeSection === "tickets" ? "block opacity-100 translate-x-0" : "hidden opacity-0 translate-x-10"
                  } ${animateSection ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"}`}
                >
                  <div className="bg-white rounded-xl shadow-md border border-blue-100 overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 border-b border-blue-100">
                      <h2 className="text-xl font-bold text-white flex items-center">
                        <Ticket className="h-5 w-5 mr-2 text-blue-200" />
                        Ticket Tiers
                      </h2>
                    </div>

                    <div className="p-6 space-y-8">
                      {formData.ticketTiers.map((tier, index) => (
                        <div
                          key={tier.id}
                          className="border border-blue-100 rounded-lg p-6 relative hover:shadow-md transition-shadow duration-300 group"
                        >
                          <div className="absolute -left-3 top-1/2 transform -translate-y-1/2 w-6 h-12 bg-white border-t border-b border-l border-blue-100 rounded-l-full"></div>
                          <div className="absolute -right-3 top-1/2 transform -translate-y-1/2 w-6 h-12 bg-white border-t border-b border-r border-blue-100 rounded-r-full"></div>

                          {formData.ticketTiers.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeTicketTier(tier.id)}
                              className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors duration-300 z-10"
                              aria-label="Remove ticket tier"
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          )}

                          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-2 text-blue-600">
                              {index + 1}
                            </div>
                            Ticket Tier {index + 1}
                          </h3>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="group">
                              <label
                                htmlFor={`tier-${index}-name`}
                                className="block text-sm font-medium text-gray-700 mb-1 group-focus-within:text-blue-600 transition-colors duration-200"
                              >
                                Tier Name <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="text"
                                id={`tier-${index}-name`}
                                value={tier.name}
                                onChange={(e) => handleTierChange(tier.id, "name", e.target.value)}
                                className={`w-full px-4 py-3 rounded-lg border ${
                                  errors[`tier-${index}-name`]
                                    ? "border-red-500"
                                    : "border-gray-300 group-focus-within:border-blue-500"
                                } focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200`}
                                placeholder="e.g., General Admission, VIP, etc."
                              />
                              {errors[`tier-${index}-name`] && (
                                <p className="mt-1 text-sm text-red-500">{errors[`tier-${index}-name`]}</p>
                              )}
                            </div>

                            <div className="group">
                              <label
                                htmlFor={`tier-${index}-price`}
                                className="block text-sm font-medium text-gray-700 mb-1 group-focus-within:text-blue-600 transition-colors duration-200"
                              >
                                Price (SOL) <span className="text-red-500">*</span>
                              </label>
                              <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                  <DollarSign className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" />
                                </div>
                                <input
                                  type="text"
                                  id={`tier-${index}-price`}
                                  value={tier.price}
                                  onChange={(e) => handleTierChange(tier.id, "price", e.target.value)}
                                  className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                                    errors[`tier-${index}-price`]
                                      ? "border-red-500"
                                      : "border-gray-300 group-focus-within:border-blue-500"
                                  } focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200`}
                                  placeholder="0.00"
                                />
                              </div>
                              {errors[`tier-${index}-price`] && (
                                <p className="mt-1 text-sm text-red-500">{errors[`tier-${index}-price`]}</p>
                              )}
                            </div>

                            <div className="group">
                              <label
                                htmlFor={`tier-${index}-supply`}
                                className="block text-sm font-medium text-gray-700 mb-1 group-focus-within:text-blue-600 transition-colors duration-200"
                              >
                                Supply <span className="text-red-500">*</span>
                              </label>
                              <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                  <Users className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" />
                                </div>
                                <input
                                  type="text"
                                  id={`tier-${index}-supply`}
                                  value={tier.supply}
                                  onChange={(e) => handleTierChange(tier.id, "supply", e.target.value)}
                                  className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                                    errors[`tier-${index}-supply`]
                                      ? "border-red-500"
                                      : "border-gray-300 group-focus-within:border-blue-500"
                                  } focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200`}
                                  placeholder="Number of tickets available"
                                />
                              </div>
                              {errors[`tier-${index}-supply`] && (
                                <p className="mt-1 text-sm text-red-500">{errors[`tier-${index}-supply`]}</p>
                              )}
                            </div>

                            <div className="group">
                              <label
                                htmlFor={`tier-${index}-royalty`}
                                className="block text-sm font-medium text-gray-700 mb-1 group-focus-within:text-blue-600 transition-colors duration-200"
                              >
                                Royalty Percentage
                              </label>
                              <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                  <Percent className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" />
                                </div>
                                <input
                                  type="number"
                                  id={`tier-${index}-royalty`}
                                  min="0"
                                  max="15"
                                  value={tier.royaltyPercent}
                                  onChange={(e) => handleTierChange(tier.id, "royaltyPercent", Number(e.target.value))}
                                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                                  placeholder="5"
                                />
                              </div>
                              <p className="mt-1 text-xs text-gray-500">
                                Percentage you'll receive from secondary sales (0-15%)
                              </p>
                            </div>
                          </div>

                          <div className="mt-6 group">
                            <label
                              htmlFor={`tier-${index}-description`}
                              className="block text-sm font-medium text-gray-700 mb-1 group-focus-within:text-blue-600 transition-colors duration-200"
                            >
                              Description
                            </label>
                            <textarea
                              id={`tier-${index}-description`}
                              value={tier.description}
                              onChange={(e) => handleTierChange(tier.id, "description", e.target.value)}
                              rows={2}
                              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                              placeholder="Describe what's included with this ticket tier"
                            />
                          </div>

                          <div className="mt-6 group">
                            <label
                              htmlFor={`tier-${index}-perks`}
                              className="block text-sm font-medium text-gray-700 mb-1 group-focus-within:text-blue-600 transition-colors duration-200"
                            >
                              Perks & Benefits
                            </label>
                            <textarea
                              id={`tier-${index}-perks`}
                              value={tier.perks}
                              onChange={(e) => handleTierChange(tier.id, "perks", e.target.value)}
                              rows={2}
                              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                              placeholder="e.g., Early access, Meet & greet, Exclusive merchandise, etc."
                            />
                          </div>

                          <div className="mt-6">
                            <div className="flex items-center justify-between">
                              <label className="text-sm font-medium text-gray-700">Allow Resale</label>
                              <button
                                type="button"
                                onClick={() => handleTierChange(tier.id, "resaleAllowed", !tier.resaleAllowed)}
                                className="relative inline-flex items-center h-6 rounded-full w-11 focus:outline-none"
                                aria-pressed={tier.resaleAllowed}
                              >
                                {tier.resaleAllowed ? (
                                  <ToggleRight className="h-6 w-6 text-blue-600" />
                                ) : (
                                  <ToggleLeft className="h-6 w-6 text-gray-400" />
                                )}
                              </button>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                              If enabled, ticket holders can resell their tickets on secondary markets
                            </p>
                          </div>
                        </div>
                      ))}

                      <button
                        type="button"
                        onClick={addTicketTier}
                        className="w-full py-4 border-2 border-dashed border-blue-300 rounded-lg text-blue-600 hover:bg-blue-50 transition-all duration-300 flex items-center justify-center group"
                      >
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-2 group-hover:scale-110 transition-transform duration-300">
                          <Plus className="h-5 w-5 text-blue-600" />
                        </div>
                        <span className="font-medium">Add Another Ticket Tier</span>
                      </button>
                    </div>

                    <div className="bg-gray-50 px-6 py-4 flex justify-between">
                      <button
                        type="button"
                        onClick={() => navigateToSection("basic")}
                        className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors duration-300 text-sm font-medium flex items-center group"
                      >
                        <ArrowLeft className="h-4 w-4 mr-2 transform group-hover:-translate-x-1 transition-transform duration-300" />
                        Back to Basic Info
                      </button>
                      <button
                        type="button"
                        onClick={() => navigateToSection("advanced")}
                        className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 text-sm font-medium flex items-center group shadow-md hover:shadow-lg"
                      >
                        Next: Advanced Settings
                        <ChevronRight className="h-4 w-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" />
                      </button>
                    </div>
                  </div>
                </div>

                <div
                  ref={advancedSectionRef}
                  className={`transition-all duration-500 ease-in-out transform ${
                    activeSection === "advanced" ? "block opacity-100 translate-x-0" : "hidden opacity-0 translate-x-10"
                  } ${animateSection ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"}`}
                >
                  <div className="bg-white rounded-xl shadow-md border border-blue-100 overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 border-b border-blue-100">
                      <h2 className="text-xl font-bold text-white flex items-center">
                        <Sparkles className="h-5 w-5 mr-2 text-blue-200" />
                        Advanced Settings
                      </h2>
                    </div>

                    <div className="p-6 space-y-8">
                      <div className="group">
                        <div className="flex items-center justify-between mb-2">
                          <label
                            htmlFor="defaultRoyaltyPercent"
                            className="text-sm font-medium text-gray-700 group-focus-within:text-blue-600 transition-colors duration-200"
                          >
                            Default Royalty Percentage
                          </label>
                          <div className="flex items-center">
                            <HelpCircle className="h-4 w-4 text-gray-400 mr-1" />
                            <span className="text-xs text-gray-500">Applied to all new ticket tiers</span>
                          </div>
                        </div>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Percent className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" />
                          </div>
                          <input
                            type="number"
                            id="defaultRoyaltyPercent"
                            name="defaultRoyaltyPercent"
                            min="0"
                            max="15"
                            value={formData.defaultRoyaltyPercent}
                            onChange={(e) => handleInputChange(e)}
                            className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                          />
                        </div>
                        <p className="mt-1 text-xs text-gray-500">
                          Percentage you'll receive from secondary sales (0-15%)
                        </p>
                      </div>

                      <div className="bg-blue-50 p-6 rounded-xl">
                        <div className="flex items-center justify-between">
                          <div>
                            <label className="text-sm font-medium text-gray-700 flex items-center">
                              <Award className="h-5 w-5 mr-2 text-blue-600" />
                              Allow Ticket Resale by Default
                            </label>
                            <p className="text-xs text-gray-500 mt-1 ml-7">
                              If enabled, ticket holders can resell their tickets on secondary markets
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleToggleChange("allowResale", !formData.allowResale)}
                            className="relative inline-flex items-center h-6 rounded-full w-11 focus:outline-none"
                            aria-pressed={formData.allowResale}
                          >
                            {formData.allowResale ? (
                              <ToggleRight className="h-6 w-6 text-blue-600" />
                            ) : (
                              <ToggleLeft className="h-6 w-6 text-gray-400" />
                            )}
                          </button>
                        </div>
                      </div>

                      <div className="bg-blue-50 p-6 rounded-xl">
                        <div className="flex items-center justify-between">
                          <div>
                            <label className="text-sm font-medium text-gray-700 flex items-center">
                              <Users className="h-5 w-5 mr-2 text-blue-600" />
                              Use Whitelist for Presale
                            </label>
                            <p className="text-xs text-gray-500 mt-1 ml-7">
                              If enabled, you can create a whitelist of wallet addresses for early access
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleToggleChange("useWhitelist", !formData.useWhitelist)}
                            className="relative inline-flex items-center h-6 rounded-full w-11 focus:outline-none"
                            aria-pressed={formData.useWhitelist}
                          >
                            {formData.useWhitelist ? (
                              <ToggleRight className="h-6 w-6 text-blue-600" />
                            ) : (
                              <ToggleLeft className="h-6 w-6 text-gray-400" />
                            )}
                          </button>
                        </div>
                      </div>

                      {formData.useWhitelist && (
                        <div className="bg-white p-6 rounded-xl border border-blue-200 shadow-inner">
                          <h3 className="text-sm font-medium text-gray-800 mb-2 flex items-center">
                            <Star className="h-4 w-4 mr-2 text-blue-600" />
                            Whitelist Settings
                          </h3>
                          <p className="text-xs text-gray-600 mb-4">
                            You'll be able to add wallet addresses to your whitelist after creating the event.
                          </p>
                          <div className="flex items-center text-blue-600 bg-blue-50 p-3 rounded-lg">
                            <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
                            <span className="text-xs font-medium">
                              Whitelist functionality will be available in the event dashboard after creation
                            </span>
                          </div>
                        </div>
                      )}

                      <div className="pt-4 border-t border-gray-200">
                        <div className="flex items-center justify-between">
                          <div>
                            <label className="text-sm font-medium text-gray-700 flex items-center">
                              <EyeIcon className="h-5 w-5 mr-2 text-blue-600" />
                              Preview Mode
                            </label>
                            <p className="text-xs text-gray-500 mt-1 ml-7">
                              If enabled, your event will be created in preview mode and won't be visible to the public
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => setPreviewMode(!previewMode)}
                            className="relative inline-flex items-center h-6 rounded-full w-11 focus:outline-none"
                            aria-pressed={previewMode}
                          >
                            {previewMode ? (
                              <ToggleRight className="h-6 w-6 text-blue-600" />
                            ) : (
                              <ToggleLeft className="h-6 w-6 text-gray-400" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 px-6 py-4 flex justify-between">
                      <button
                        type="button"
                        onClick={() => navigateToSection("tickets")}
                        className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors duration-300 text-sm font-medium flex items-center group"
                      >
                        <ArrowLeft className="h-4 w-4 mr-2 transform group-hover:-translate-x-1 transition-transform duration-300" />
                        Back to Ticket Tiers
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 text-sm font-medium flex items-center shadow-md hover:shadow-lg ${
                          isSubmitting ? "opacity-70 cursor-not-allowed" : "transform hover:-translate-y-1"
                        }`}
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="animate-spin h-4 w-4 mr-2" />
                            Creating Event...
                          </>
                        ) : (
                          <>
                            <Save className="h-4 w-4 mr-2" />
                            Create Event
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

const EyeIcon = (props: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
)

const GlobeIcon = (props: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="2" x2="22" y1="12" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
)

export default NewEvent