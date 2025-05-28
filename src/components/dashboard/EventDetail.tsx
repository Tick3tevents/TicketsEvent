"use client"

import { useState, useEffect, FormEvent, ChangeEvent } from "react"
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Users,
  DollarSign,
  Ticket,
  Gift,
  Edit,
  ExternalLink,
  X,
  Download,
  Search,
  Loader2,
  AlertTriangle,
} from "lucide-react"

interface EventTierFE {
  name: string;
  price: string;
  sold: number;
  total: number;
  revenue: string;
}

interface EventAttendeeFE {
  wallet: string;
  ticketType: string;
  checkedIn: boolean;
  resold: boolean;
}

interface FetchedEventData {
  id: string;
  name: string;
  image?: string;
  date: string; // Display format like "Aug 15, 2023" or "Aug 15, 2023 - Aug 17, 2023"
  time: string; // Display format like "09:00 AM" or "09:00 AM - 05:00 PM" (or "HH:MM" from backend)
  location: string;
  description: string;
  status: string;
  ticketsSold: number;
  totalCapacity: number;
  revenue: string;
  tiers: EventTierFE[];
  attendees: EventAttendeeFE[];
  checkInRate: number;
  totalAttendees: number;
  checkedInCount: number;
  _originalStartDate?: string; // Expects "YYYY-MM-DD" if sent from backend
  _originalStartTime?: string; // Expects "HH:MM" if sent from backend
  _originalEndDate?: string;   // Expects "YYYY-MM-DD" if sent from backend
  _originalEndTime?: string;   // Expects "HH:MM" if sent from backend
}

interface UpdateEventPayload {
  title?: string;
  description?: string;
  location?: string;
  startDate?: string; // YYYY-MM-DD
  startTime?: string; // HH:MM
  endDate?: string;   // YYYY-MM-DD
  endTime?: string;   // HH:MM
  bannerImage?: string;
  logoImage?: string;
  status?: string;
}


interface EventDetailProps {
  eventId: string
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title: string;
}

const Modal = ({ isOpen, onClose, children, title }: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>
        <div className="p-6 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};


export default function EventDetail({ eventId }: EventDetailProps) {
  const [activeTab, setActiveTab] = useState("summary")
  const [eventData, setEventData] = useState<FetchedEventData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editFormData, setEditFormData] = useState<UpdateEventPayload>({})

  const safeFormatDisplayDateToISO = (dateStr: string | undefined) : string | undefined => {
      if (!dateStr || typeof dateStr !== 'string' || dateStr.trim() === "") return undefined;
      try {
          const d = new Date(dateStr.trim());
          if (isNaN(d.getTime())) {
            console.warn(`safeFormatDisplayDateToISO: Invalid date string provided: "${dateStr}"`);
            return undefined;
          }
          return d.toISOString().split('T')[0];
      } catch (e) {
          console.error(`safeFormatDisplayDateToISO: Error parsing date string "${dateStr}":`, e);
          return undefined;
      }
  };

  const safeFormatDisplayTimeToHHMM = (timeStrInput: string | undefined): string | undefined => {
      if (!timeStrInput || typeof timeStrInput !== 'string' || timeStrInput.trim() === "") {
          return undefined;
      }
      const timeStr = timeStrInput.trim();

      if (/^([01]\d|2[0-3]):([0-5]\d)$/.test(timeStr)) {
          return timeStr; // Already in HH:MM format
      }
      
      // Attempt to parse if not in HH:MM, e.g. "9:00 AM"
      try {
          let hoursMatch = timeStr.match(/(\d+):(\d+)\s*(AM|PM)?/i);
          if (hoursMatch) {
              let hours = parseInt(hoursMatch[1], 10);
              const minutes = parseInt(hoursMatch[2], 10);
              const ampm = hoursMatch[3];

              if (isNaN(hours) || isNaN(minutes)) return undefined;

              if (ampm) {
                  if (ampm.toUpperCase() === "PM" && hours < 12) hours += 12;
                  if (ampm.toUpperCase() === "AM" && hours === 12) hours = 0; // Midnight
              }
              // Ensure hours are within 0-23 range after AM/PM conversion.
              if (hours < 0 || hours > 23) return undefined;


              return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
          }
          // Fallback for simple time string that might be parseable by Date constructor
          const tempDate = new Date(`1970/01/01 ${timeStr}`);
          if (isNaN(tempDate.getTime())) {
              console.warn(`safeFormatDisplayTimeToHHMM: Could not parse time string "${timeStrInput}" into a valid date object.`);
              return undefined;
          }
          const h = tempDate.getHours().toString().padStart(2, '0');
          const m = tempDate.getMinutes().toString().padStart(2, '0');
          return `${h}:${m}`;

      } catch (e) {
          console.error(`safeFormatDisplayTimeToHHMM: Error parsing time string "${timeStrInput}":`, e);
          return undefined;
      }
  };


  useEffect(() => {
    if (!eventId) {
      setError("Event ID is missing.")
      setIsLoading(false)
      return
    }

    const fetchEvent = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const response = await fetch(`http://localhost:3001/api/events/${eventId}`)
        if (!response.ok) {
          const errData = await response.json()
          throw new Error(errData.error || `Failed to fetch event: ${response.statusText}`)
        }
        const data: FetchedEventData = await response.json();

        const dateParts = typeof data.date === 'string' ? data.date.split(' - ') : ["", ""];
        const timeParts = typeof data.time === 'string' ? data.time.split(' - ') : ["", ""];

        const originalEventDataForForm = {
          title: data.name,
          description: data.description,
          location: data.location,
          startDate: data._originalStartDate || safeFormatDisplayDateToISO(dateParts[0]),
          startTime: data._originalStartTime || safeFormatDisplayTimeToHHMM(timeParts[0]),
          endDate: data._originalEndDate || safeFormatDisplayDateToISO(dateParts[1]),
          endTime: data._originalEndTime || safeFormatDisplayTimeToHHMM(timeParts[1]),
          bannerImage: data.image?.startsWith('/') ? undefined : data.image,
          status: data.status,
        };
        setEventData(data);
        setEditFormData(originalEventDataForForm);

      } catch (err: any) {
        setError(err.message || "An unknown error occurred.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchEvent()
  }, [eventId])

  const handleEditModalOpen = () => {
    if (eventData) {
      const dateParts = typeof eventData.date === 'string' ? eventData.date.split(' - ') : ["", ""];
      const timeParts = typeof eventData.time === 'string' ? eventData.time.split(' - ') : ["", ""];
      
      setEditFormData({
        title: eventData.name,
        description: eventData.description,
        location: eventData.location,
        startDate: safeFormatDisplayDateToISO(dateParts[0]),
        startTime: safeFormatDisplayTimeToHHMM(timeParts[0]),
        endDate: safeFormatDisplayDateToISO(dateParts[1]),
        endTime: safeFormatDisplayTimeToHHMM(timeParts[1]),
        bannerImage: eventData.image?.startsWith('http') ? eventData.image : '',
        status: eventData.status,
      });
    }
    setIsEditModalOpen(true);
  };

  const handleEditModalClose = () => setIsEditModalOpen(false);

  const handleEditFormChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!eventId) return;
    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:3001/api/events/${eventId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editFormData),
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || `Failed to update event: ${response.statusText}`);
      }
      //const updatedEventRaw = await response.json(); // This would be IEvent
      handleEditModalClose();
      
      // Re-fetch to get the data in the FetchedEventData format
      const fetchEventAfterUpdate = async () => {
        const res = await fetch(`http://localhost:3001/api/events/${eventId}`);
         if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || `Failed to re-fetch event: ${res.statusText}`);
        }
        const data = await res.json();
        setEventData(data);
      };
      await fetchEventAfterUpdate();

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };


  if (isLoading && !eventData) {
    return <div className="flex justify-center items-center h-screen"><Loader2 className="w-12 h-12 animate-spin" /></div>;
  }

  if (error) {
    return <div className="flex flex-col justify-center items-center h-screen text-red-600">
      <AlertTriangle size={48} className="mb-4"/>
      <p className="text-xl">Error loading event details:</p>
      <p>{error}</p>
      <button
        onClick={() => window.history.back()}
        className="mt-4 flex items-center text-blue-600 hover:text-blue-800"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Go Back
      </button>
    </div>;
  }

  if (!eventData) {
    return <div className="text-center py-10">Event not found or ID is invalid.</div>;
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case "summary":
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="relative h-48 sm:h-64">
                <img src={eventData.image || "/placeholder.svg"} alt={eventData.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-4 sm:p-6 text-white">
                  <h1 className="text-xl sm:text-3xl font-bold">{eventData.name}</h1>
                  <div className="flex flex-wrap gap-3 sm:gap-4 mt-2">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1 sm:mr-2 flex-shrink-0" />
                      <span className="text-sm sm:text-base">{eventData.date}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1 sm:mr-2 flex-shrink-0" />
                      <span className="text-sm sm:text-base">{eventData.time}</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1 sm:mr-2 flex-shrink-0" />
                      <span className="text-sm sm:text-base">{eventData.location}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-4 sm:p-6">
                <p className="text-sm sm:text-base text-gray-700">{eventData.description}</p>

                <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="flex items-center text-blue-600 mb-2">
                      <Ticket className="w-5 h-5 mr-2 flex-shrink-0" />
                      <h3 className="font-semibold">Tickets Sold</h3>
                    </div>
                    <p className="text-xl sm:text-2xl font-bold text-gray-900">
                      {eventData.ticketsSold} / {eventData.totalCapacity}
                    </p>
                    {eventData.totalCapacity > 0 && (
                       <div className="mt-2 w-full bg-blue-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${(eventData.ticketsSold / eventData.totalCapacity) * 100}%` }}
                        ></div>
                      </div>
                    )}
                  </div>

                  <div className="bg-green-50 rounded-lg p-4">
                    <div className="flex items-center text-green-600 mb-2">
                      <DollarSign className="w-5 h-5 mr-2 flex-shrink-0" />
                      <h3 className="font-semibold">Total Revenue</h3>
                    </div>
                    <p className="text-xl sm:text-2xl font-bold text-gray-900">{eventData.revenue}</p>
                    <p className="text-xs sm:text-sm text-gray-600 mt-2">Primary sales</p>
                  </div>

                  <div className="bg-purple-50 rounded-lg p-4">
                    <div className="flex items-center text-purple-600 mb-2">
                      <Users className="w-5 h-5 mr-2 flex-shrink-0" />
                      <h3 className="font-semibold">Check-in Rate</h3>
                    </div>
                    <p className="text-xl sm:text-2xl font-bold text-gray-900">
                      {eventData.checkInRate}%
                    </p>
                    <p className="text-xs sm:text-sm text-gray-600 mt-2">
                       {eventData.checkedInCount} of {eventData.totalAttendees} attendees
                    </p>
                  </div>
                </div>
                <div className="mt-6 flex flex-col md:flex-row items-center justify-between p-4 bg-gray-50 rounded-lg gap-4">
                  <div>
                    <h3 className="font-semibold text-gray-900">Event Check-in QR Code</h3>
                    <p className="text-xs sm:text-sm text-gray-600 mt-1">
                      Use this QR code at the event entrance to verify tickets
                    </p>
                  </div>
                  <div className="bg-white p-2 rounded-lg shadow-sm">
                    <div className="w-24 h-24 bg-gray-200 flex items-center justify-center">
                      <span className="text-xs text-gray-500">QR Code</span>
                    </div>
                  </div>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors w-full md:w-auto">
                    Download
                  </button>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Ticket Tiers</h2>
              <div className="overflow-x-auto -mx-4 sm:mx-0">
                <div className="inline-block min-w-full align-middle p-4 sm:p-0">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tier Name</th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sold</th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                      {eventData.tiers.map((tier, index) => (
                        <tr key={tier.name + index}> {/* More stable key if names can repeat */}
                          <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{tier.name}</td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">{tier.price}</td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">{tier.sold} / {tier.total}</td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">{tier.revenue}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-3 sm:gap-4">
              <button className="flex items-center bg-blue-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm">
                <Gift className="w-4 h-4 mr-1 sm:mr-2" /> Airdrop NFTs
              </button>
              <button
                onClick={handleEditModalOpen}
                className="flex items-center bg-white border border-gray-300 text-gray-700 px-3 sm:px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors text-sm"
              >
                <Edit className="w-4 h-4 mr-1 sm:mr-2" /> Edit Event
              </button>
              <button className="flex items-center bg-white border border-gray-300 text-gray-700 px-3 sm:px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                <ExternalLink className="w-4 h-4 mr-1 sm:mr-2" /> View on Explorer
              </button>
              <button className="flex items-center bg-red-50 text-red-600 px-3 sm:px-4 py-2 rounded-lg hover:bg-red-100 transition-colors text-sm">
                <X className="w-4 h-4 mr-1 sm:mr-2" /> End Ticket Sales
              </button>
            </div>
          </div>
        )
      case "stats":
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Sales Statistics</h2>
              <div className="flex flex-wrap gap-2 mb-6">
                <button className="bg-blue-50 text-blue-600 px-3 py-1 rounded-lg text-sm font-medium">24h</button>
                <button className="text-gray-600 hover:bg-gray-100 px-3 py-1 rounded-lg text-sm font-medium">7d</button>
                <button className="text-gray-600 hover:bg-gray-100 px-3 py-1 rounded-lg text-sm font-medium">30d</button>
                <button className="text-gray-600 hover:bg-gray-100 px-3 py-1 rounded-lg text-sm font-medium">All time</button>
              </div>
              <div className="bg-gray-100 rounded-lg h-48 sm:h-64 flex items-center justify-center mb-6">
                <p className="text-gray-500">Sales chart would appear here</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                {eventData.tiers.map((tier, index) => (
                  <div key={tier.name + index} className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900">{tier.name}</h3>
                    <div className="mt-2 flex justify-between">
                      <div>
                        <p className="text-xs text-gray-600">Sold</p><p className="font-bold text-gray-900">{tier.sold} / {tier.total}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Revenue</p><p className="font-bold text-gray-900">{tier.revenue}</p>
                      </div>
                    </div>
                    {tier.total > 0 && (
                       <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${(tier.sold / tier.total) * 100}%` }}></div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )
      case "attendees":
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Attendees ({eventData.totalAttendees})</h2>
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                  <div className="relative w-full sm:w-64">
                    <input type="text" placeholder="Search by wallet" className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"/>
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  </div>
                  <select className="border border-gray-300 rounded-lg px-3 py-2 bg-white">
                    <option>All Ticket Types</option>
                    {eventData.tiers.map(tier => <option key={tier.name} value={tier.name}>{tier.name}</option>)}
                  </select>
                  <button className="flex items-center bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50">
                    <Download className="w-4 h-4 mr-2" />Export
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto -mx-4 sm:mx-0">
                <div className="inline-block min-w-full align-middle p-4 sm:p-0">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Wallet Address</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ticket Type</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Checked In</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Resold</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                      {eventData.attendees.map((attendee, index) => (
                        <tr key={attendee.wallet + index}> {/* More stable key */}
                          <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{attendee.wallet}</td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">{attendee.ticketType}</td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            {attendee.checkedIn
                              ? <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">✓ Yes</span>
                              : <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded-full">No</span>}
                          </td>
                           <td className="px-4 py-4 whitespace-nowrap">
                            {attendee.resold
                              ? <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full">Yes</span>
                              : <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded-full">No</span>}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-blue-600 hover:text-blue-800"><button>View</button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
               <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                <p className="text-sm text-gray-600">Showing {Math.min(5, eventData.attendees.length)} of {eventData.attendees.length} attendees</p>
                {eventData.attendees.length > 5 && (
                  <div className="flex space-x-2">
                    <button className="bg-white border border-gray-300 text-gray-700 px-3 py-1 rounded-lg hover:bg-gray-50">Previous</button>
                    <button className="bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700">Next</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )
      default:
        return <div>Tab content not found</div>
    }
  }

  return (
    <div className="space-y-6">
      <button
        onClick={() => window.history.back()}
        className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2 flex-shrink-0" />
        Back to My Events
      </button>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="border-b border-gray-200">
          <div className="flex overflow-x-auto">
            {["summary", "stats", "attendees"].map((tabName) => (
              <button
                key={tabName}
                onClick={() => setActiveTab(tabName)}
                className={`px-4 sm:px-6 py-3 sm:py-4 text-sm font-medium whitespace-nowrap capitalize ${
                  activeTab === tabName
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {tabName.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>
        <div className="p-4 sm:p-6">{renderTabContent()}</div>
      </div>

      <Modal isOpen={isEditModalOpen} onClose={handleEditModalClose} title="Edit Event Details">
       {isLoading && eventData && isEditModalOpen && <div className="absolute inset-0 bg-white bg-opacity-75 flex justify-center items-center"><Loader2 className="w-8 h-8 animate-spin" /></div>}
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">Event Name</label>
            <input type="text" name="title" id="title" value={editFormData.title || ''} onChange={handleEditFormChange} required
                   className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"/>
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
            <textarea name="description" id="description" value={editFormData.description || ''} onChange={handleEditFormChange} rows={3}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"></textarea>
          </div>
           <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
            <input type="text" name="location" id="location" value={editFormData.location || ''} onChange={handleEditFormChange}
                   className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"/>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">Start Date</label>
              <input type="date" name="startDate" id="startDate" value={editFormData.startDate || ''} onChange={handleEditFormChange}
                     className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"/>
            </div>
            <div>
              <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">Start Time</label>
              <input type="time" name="startTime" id="startTime" value={editFormData.startTime || ''} onChange={handleEditFormChange}
                     className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"/>
            </div>
          </div>
           <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">End Date (Optional)</label>
              <input type="date" name="endDate" id="endDate" value={editFormData.endDate || ''} onChange={handleEditFormChange}
                     className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"/>
            </div>
            <div>
              <label htmlFor="endTime" className="block text-sm font-medium text-gray-700">End Time (Optional)</label>
              <input type="time" name="endTime" id="endTime" value={editFormData.endTime || ''} onChange={handleEditFormChange}
                     className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"/>
            </div>
          </div>
          <div>
            <label htmlFor="bannerImage" className="block text-sm font-medium text-gray-700">Banner Image URL</label>
            <input type="url" name="bannerImage" id="bannerImage" value={editFormData.bannerImage || ''} onChange={handleEditFormChange} placeholder="https://example.com/image.png"
                   className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"/>
          </div>
           <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
            <select name="status" id="status" value={editFormData.status || 'draft'} onChange={handleEditFormChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="ended">Ended</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div className="pt-4 flex justify-end space-x-3">
            <button type="button" onClick={handleEditModalClose}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50">
              Cancel
            </button>
            <button type="submit" disabled={isLoading && isEditModalOpen}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 disabled:bg-gray-400">
              {(isLoading && isEditModalOpen) ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}