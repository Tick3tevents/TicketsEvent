"use client"

import type React from "react"

import { useState } from "react"
import { Upload, Plus, X, Check, AlertCircle } from "lucide-react"

export default function NftAirdrops() {
  const [activeStep, setActiveStep] = useState(1)
  const [selectedEvent, setSelectedEvent] = useState("")
  const [selectedAudience, setSelectedAudience] = useState("")
  const [uploadedMedia, setUploadedMedia] = useState<string | null>(null)

  // Mock data for events
  const events = [
    { id: "1", name: "Solana Summer Hackathon", attendees: 450 },
    { id: "2", name: "NFT Gallery Opening", attendees: 320 },
    { id: "3", name: "Crypto Conference 2023", attendees: 280 },
  ]

  // Mock data for previous airdrops
  const previousAirdrops = [
    {
      id: "1",
      name: "Hackathon Participation Badge",
      event: "Solana Summer Hackathon",
      recipients: 450,
      date: "Aug 20, 2023",
      status: "completed",
    },
    {
      id: "2",
      name: "VIP Gallery Access Pass",
      event: "NFT Gallery Opening",
      recipients: 100,
      date: "Aug 1, 2023",
      status: "completed",
    },
    {
      id: "3",
      name: "Conference Speaker Certificate",
      event: "Crypto Conference 2023",
      recipients: 15,
      date: "In progress",
      status: "processing",
    },
  ]

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // In a real app, you would upload the file to storage
      // For this demo, we'll just create a local URL
      setUploadedMedia(URL.createObjectURL(file))
    }
  }

  // Handle next step
  const handleNextStep = () => {
    setActiveStep(activeStep + 1)
  }

  // Handle previous step
  const handlePreviousStep = () => {
    setActiveStep(activeStep - 1)
  }

  // Handle airdrop creation
  const handleCreateAirdrop = () => {
    // In a real app, you would submit the airdrop to the blockchain
    // For this demo, we'll just show a success message
    setActiveStep(4)
  }

  // Render the appropriate step content
  const renderStepContent = () => {
    switch (activeStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Upload Media</h2>
              <p className="text-gray-600">Upload the image or media file for your NFT airdrop</p>
            </div>

            {uploadedMedia ? (
              <div className="relative">
                <img
                  src={uploadedMedia || "/placeholder.svg"}
                  alt="Uploaded media"
                  className="w-full max-h-64 object-contain rounded-lg border border-gray-200"
                />
                <button
                  onClick={() => setUploadedMedia(null)}
                  className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-sm"
                >
                  <X className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">Drag and drop your file here, or click to browse</p>
                <input type="file" id="file-upload" className="hidden" accept="image/*" onChange={handleFileUpload} />
                <label
                  htmlFor="file-upload"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
                >
                  Select File
                </label>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label htmlFor="nft-name" className="block text-sm font-medium text-gray-700 mb-1">
                  NFT Name
                </label>
                <input
                  type="text"
                  id="nft-name"
                  placeholder="e.g., Event Attendance Badge"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="nft-description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  id="nft-description"
                  rows={3}
                  placeholder="Describe your NFT and its significance"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                ></textarea>
              </div>

              <div>
                <label htmlFor="nft-attributes" className="block text-sm font-medium text-gray-700 mb-1">
                  Attributes (Optional)
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  <div className="bg-gray-100 rounded-lg px-3 py-1 text-sm flex items-center">
                    <span className="mr-2">Type: Badge</span>
                    <button className="text-gray-500 hover:text-gray-700">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Attribute name"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input
                    type="text"
                    placeholder="Value"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg transition-colors">
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )
      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Select Target Event & Audience</h2>
              <p className="text-gray-600">Choose which event attendees will receive this NFT</p>
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="select-event" className="block text-sm font-medium text-gray-700 mb-1">
                  Event
                </label>
                <select
                  id="select-event"
                  value={selectedEvent}
                  onChange={(e) => setSelectedEvent(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select an event</option>
                  {events.map((event) => (
                    <option key={event.id} value={event.id}>
                      {event.name} ({event.attendees} attendees)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="select-audience" className="block text-sm font-medium text-gray-700 mb-1">
                  Target Audience
                </label>
                <select
                  id="select-audience"
                  value={selectedAudience}
                  onChange={(e) => setSelectedAudience(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select audience</option>
                  <option value="all">All Attendees</option>
                  <option value="vip">VIP Ticket Holders Only</option>
                  <option value="checked-in">Checked-in Attendees Only</option>
                  <option value="early">Early Bird Ticket Holders</option>
                </select>
              </div>

              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-start">
                  <AlertCircle className="w-5 h-5 text-blue-600 mr-3 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-blue-900">Recipient Preview</h3>
                    <p className="text-blue-700 text-sm mt-1">
                      Based on your selection, this NFT will be airdropped to approximately{" "}
                      <strong>320 wallet addresses</strong>.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Review & Confirm</h2>
              <p className="text-gray-600">Review your airdrop details before confirming</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 space-y-4">
              <div className="flex items-start">
                {uploadedMedia && (
                  <img
                    src={uploadedMedia || "/placeholder.svg"}
                    alt="NFT Preview"
                    className="w-24 h-24 object-cover rounded-lg mr-4"
                  />
                )}
                <div>
                  <h3 className="font-semibold text-gray-900">Conference Attendance Badge</h3>
                  <p className="text-gray-600 text-sm mt-1">
                    A special NFT for all attendees of the Solana Summer Hackathon.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                <div>
                  <p className="text-sm text-gray-500">Event</p>
                  <p className="font-medium text-gray-900">Solana Summer Hackathon</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Target Audience</p>
                  <p className="font-medium text-gray-900">All Attendees</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Recipients</p>
                  <p className="font-medium text-gray-900">450 wallet addresses</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Estimated Network Fee</p>
                  <p className="font-medium text-gray-900">0.05 SOL</p>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 rounded-lg p-4">
              <div className="flex items-start">
                <AlertCircle className="w-5 h-5 text-yellow-600 mr-3 mt-0.5" />
                <div>
                  <h3 className="font-medium text-yellow-900">Important Note</h3>
                  <p className="text-yellow-700 text-sm mt-1">
                    This action will create and send NFTs to all selected recipients. This process cannot be undone once
                    confirmed.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )
      case 4:
        return (
          <div className="text-center py-8">
            <div className="bg-green-100 rounded-full p-4 w-20 h-20 mx-auto mb-6 flex items-center justify-center">
              <Check className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Airdrop Initiated!</h2>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Your NFT airdrop has been successfully initiated. The NFTs will be delivered to recipients shortly.
            </p>
            <div className="bg-gray-50 rounded-lg p-4 max-w-md mx-auto mb-6">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Status:</span>
                <span className="font-medium text-gray-900">Processing</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Recipients:</span>
                <span className="font-medium text-gray-900">450 wallets</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Transaction:</span>
                <a href="#" className="text-blue-600 hover:underline">
                  View on Explorer
                </a>
              </div>
            </div>
            <button
              onClick={() => setActiveStep(1)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create Another Airdrop
            </button>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">NFT Airdrops</h1>
        <p className="text-gray-600 mt-1">Send memorabilia NFTs to event attendees</p>
      </div>

      {/* Stepper */}
      {activeStep < 4 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full ${
                  activeStep >= 1 ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"
                }`}
              >
                1
              </div>
              <div className={`w-12 h-1 ${activeStep >= 2 ? "bg-blue-600" : "bg-gray-200"}`}></div>
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full ${
                  activeStep >= 2 ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"
                }`}
              >
                2
              </div>
              <div className={`w-12 h-1 ${activeStep >= 3 ? "bg-blue-600" : "bg-gray-200"}`}></div>
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full ${
                  activeStep >= 3 ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"
                }`}
              >
                3
              </div>
            </div>
            <div className="text-sm font-medium text-gray-600">Step {activeStep} of 3</div>
          </div>

          {renderStepContent()}

          <div className="flex justify-between mt-8">
            {activeStep > 1 ? (
              <button
                onClick={handlePreviousStep}
                className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Back
              </button>
            ) : (
              <div></div>
            )}

            {activeStep < 3 ? (
              <button
                onClick={handleNextStep}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Continue
              </button>
            ) : (
              <button
                onClick={handleCreateAirdrop}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Confirm & Create Airdrop
              </button>
            )}
          </div>
        </div>
      )}

      {activeStep === 4 ? (
        renderStepContent()
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Previous Airdrops</h2>

          {previousAirdrops.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="pb-3 font-semibold text-gray-600">Name</th>
                    <th className="pb-3 font-semibold text-gray-600">Event</th>
                    <th className="pb-3 font-semibold text-gray-600">Recipients</th>
                    <th className="pb-3 font-semibold text-gray-600">Date</th>
                    <th className="pb-3 font-semibold text-gray-600">Status</th>
                    <th className="pb-3 font-semibold text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {previousAirdrops.map((airdrop) => (
                    <tr key={airdrop.id} className="border-b border-gray-100 last:border-0">
                      <td className="py-4 font-medium text-gray-900">{airdrop.name}</td>
                      <td className="py-4 text-gray-700">{airdrop.event}</td>
                      <td className="py-4 text-gray-700">{airdrop.recipients}</td>
                      <td className="py-4 text-gray-700">{airdrop.date}</td>
                      <td className="py-4">
                        <span
                          className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${
                            airdrop.status === "completed"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {airdrop.status === "completed" ? "Completed" : "Processing"}
                        </span>
                      </td>
                      <td className="py-4">
                        <button className="text-blue-600 hover:text-blue-800 transition-colors">View</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-600">No previous airdrops found.</p>
          )}
        </div>
      )}
    </div>
  )
}
