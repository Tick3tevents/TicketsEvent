"use client"

import { useState } from "react"
import { Save, User, Globe, Twitter, Instagram, Copy, Check } from "lucide-react"

export default function Settings() {
  const [activeTab, setActiveTab] = useState("profile")
  const [copied, setCopied] = useState(false)

  // Mock user data
  const userData = {
    name: "Alex Johnson",
    email: "alex@example.com",
    walletAddress: "7xKXzLpY9fGh...",
    website: "https://alexjohnson.com",
    twitter: "@alexjohnson",
    instagram: "@alex.johnson",
    bio: "Event organizer and blockchain enthusiast. Creating memorable experiences in the web3 space.",
  }

  // Mock notification settings
  const notificationSettings = {
    emailNotifications: true,
    salesAlerts: true,
    newAttendees: true,
    marketplaceActivity: false,
    promotionalEmails: false,
  }

  // Mock API keys
  const apiKeys = [
    {
      id: "1",
      name: "Production API Key",
      key: "tk3_prod_9a7b3c5d2e1f...",
      created: "Aug 10, 2023",
      lastUsed: "2 hours ago",
    },
  ]

  // Handle copy to clipboard
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Render the appropriate tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case "profile":
        return (
          <div className="space-y-6">
            <div className="flex items-start gap-6">
              <div className="bg-gray-200 rounded-full w-24 h-24 flex items-center justify-center">
                <User className="w-12 h-12 text-gray-500" />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-gray-900">Profile Picture</h2>
                <p className="text-gray-600 text-sm mt-1 mb-3">
                  This will be displayed on your organizer profile and event pages
                </p>
                <div className="flex gap-3">
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    Upload Image
                  </button>
                  <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                    Remove
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Display Name
                </label>
                <input
                  type="text"
                  id="name"
                  defaultValue={userData.name}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  defaultValue={userData.email}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="wallet" className="block text-sm font-medium text-gray-700 mb-1">
                  Connected Wallet
                </label>
                <div className="flex">
                  <input
                    type="text"
                    id="wallet"
                    value={userData.walletAddress}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-l-lg bg-gray-50 focus:outline-none"
                  />
                  <button
                    onClick={() => handleCopy(userData.walletAddress)}
                    className="bg-gray-100 border border-l-0 border-gray-300 px-3 rounded-r-lg hover:bg-gray-200 transition-colors"
                  >
                    {copied ? <Check className="w-5 h-5 text-green-600" /> : <Copy className="w-5 h-5 text-gray-600" />}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1">
                  Website (Optional)
                </label>
                <div className="flex">
                  <div className="bg-gray-100 border border-r-0 border-gray-300 px-3 py-2 rounded-l-lg">
                    <Globe className="w-5 h-5 text-gray-500" />
                  </div>
                  <input
                    type="url"
                    id="website"
                    defaultValue={userData.website}
                    className="w-full px-3 py-2 border border-gray-300 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="twitter" className="block text-sm font-medium text-gray-700 mb-1">
                  Twitter (Optional)
                </label>
                <div className="flex">
                  <div className="bg-gray-100 border border-r-0 border-gray-300 px-3 py-2 rounded-l-lg">
                    <Twitter className="w-5 h-5 text-gray-500" />
                  </div>
                  <input
                    type="text"
                    id="twitter"
                    defaultValue={userData.twitter}
                    className="w-full px-3 py-2 border border-gray-300 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="instagram" className="block text-sm font-medium text-gray-700 mb-1">
                  Instagram (Optional)
                </label>
                <div className="flex">
                  <div className="bg-gray-100 border border-r-0 border-gray-300 px-3 py-2 rounded-l-lg">
                    <Instagram className="w-5 h-5 text-gray-500" />
                  </div>
                  <input
                    type="text"
                    id="instagram"
                    defaultValue={userData.instagram}
                    className="w-full px-3 py-2 border border-gray-300 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                  Bio (Optional)
                </label>
                <textarea
                  id="bio"
                  rows={4}
                  defaultValue={userData.bio}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                ></textarea>
                <p className="text-sm text-gray-500 mt-1">
                  Brief description for your organizer profile. Maximum 200 characters.
                </p>
              </div>
            </div>

            <div className="flex justify-end">
              <button className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </button>
            </div>
          </div>
        )
      case "notifications":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Email Notifications</h2>
              <p className="text-gray-600 text-sm mt-1">Configure which emails you'd like to receive</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div>
                  <h3 className="font-medium text-gray-900">Email Notifications</h3>
                  <p className="text-sm text-gray-600 mt-1">Receive email notifications for important updates</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    defaultChecked={notificationSettings.emailNotifications}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div>
                  <h3 className="font-medium text-gray-900">Sales Alerts</h3>
                  <p className="text-sm text-gray-600 mt-1">Get notified when you make a sale</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked={notificationSettings.salesAlerts} />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div>
                  <h3 className="font-medium text-gray-900">New Attendees</h3>
                  <p className="text-sm text-gray-600 mt-1">Get notified when someone purchases a ticket</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked={notificationSettings.newAttendees} />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div>
                  <h3 className="font-medium text-gray-900">Marketplace Activity</h3>
                  <p className="text-sm text-gray-600 mt-1">Get notified about secondary market sales and royalties</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    defaultChecked={notificationSettings.marketplaceActivity}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div>
                  <h3 className="font-medium text-gray-900">Promotional Emails</h3>
                  <p className="text-sm text-gray-600 mt-1">Receive updates about new features and promotions</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    defaultChecked={notificationSettings.promotionalEmails}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>

            <div className="flex justify-end">
              <button className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                <Save className="w-4 h-4 mr-2" />
                Save Preferences
              </button>
            </div>
          </div>
        )
      case "api":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">API Keys</h2>
              <p className="text-gray-600 text-sm mt-1">Manage API keys for external integrations</p>
            </div>

            <div className="bg-yellow-50 rounded-lg p-4">
              <div className="flex items-start">
                <div className="text-yellow-600 mr-3 mt-0.5">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-yellow-800">API Key Security</h3>
                  <p className="text-yellow-700 text-sm mt-1">
                    Keep your API keys secure. Do not share them in public repositories or client-side code.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium text-gray-900">Your API Keys</h3>
                  <button className="bg-blue-600 text-white px-3 py-1 text-sm rounded-lg hover:bg-blue-700 transition-colors">
                    Create New Key
                  </button>
                </div>
              </div>

              {apiKeys.length > 0 ? (
                <div className="divide-y divide-gray-200">
                  {apiKeys.map((apiKey) => (
                    <div key={apiKey.id} className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-gray-900">{apiKey.name}</h4>
                          <p className="text-sm text-gray-600 mt-1">
                            Created: {apiKey.created} • Last used: {apiKey.lastUsed}
                          </p>
                        </div>
                        <button className="text-red-600 hover:text-red-800 text-sm font-medium transition-colors">
                          Revoke
                        </button>
                      </div>
                      <div className="mt-3 flex">
                        <input
                          type="text"
                          value={apiKey.key}
                          readOnly
                          className="w-full px-3 py-2 border border-gray-300 rounded-l-lg bg-gray-50 focus:outline-none"
                        />
                        <button
                          onClick={() => handleCopy(apiKey.key)}
                          className="bg-gray-100 border border-l-0 border-gray-300 px-3 rounded-r-lg hover:bg-gray-200 transition-colors"
                        >
                          {copied ? (
                            <Check className="w-5 h-5 text-green-600" />
                          ) : (
                            <Copy className="w-5 h-5 text-gray-600" />
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center">
                  <p className="text-gray-600">No API keys found.</p>
                  <button className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    Create Your First API Key
                  </button>
                </div>
              )}
            </div>

            <div>
              <h3 className="font-medium text-gray-900 mb-2">API Documentation</h3>
              <p className="text-gray-600 text-sm mb-3">
                Learn how to integrate with our API to build custom applications and workflows.
              </p>
              <a href="#" className="text-blue-600 hover:text-blue-800 font-medium transition-colors">
                View API Documentation →
              </a>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">Manage your account settings and preferences</p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="border-b border-gray-200">
          <div className="flex overflow-x-auto">
            <button
              onClick={() => setActiveTab("profile")}
              className={`px-6 py-4 text-sm font-medium whitespace-nowrap ${
                activeTab === "profile"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Profile
            </button>
            <button
              onClick={() => setActiveTab("notifications")}
              className={`px-6 py-4 text-sm font-medium whitespace-nowrap ${
                activeTab === "notifications"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Notifications
            </button>
            <button
              onClick={() => setActiveTab("api")}
              className={`px-6 py-4 text-sm font-medium whitespace-nowrap ${
                activeTab === "api" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              API Keys
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6">{renderTabContent()}</div>
      </div>
    </div>
  )
}
