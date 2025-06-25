"use client"

import { ArrowUp, ArrowDown, AlertCircle } from "lucide-react"
import { useState, useEffect, Suspense } from "react"
import { useWallet } from "@solana/wallet-adapter-react" 


interface Metric {
    title: string;
    value: string;
    change: string;
    isPositive: boolean;
    icon: string;
}

interface EventData {
    name: string;
    ticketsSold: number;
    totalCapacity: number;
    revenue: string;
    date: string;
    percentSold: number;
    daysLeft?: number; // Optional for upcoming events
}

interface Issue {
    event: string;
    issue: string;
    severity: 'high' | 'medium' | 'low';
}

interface DashboardInfo {
    metrics: Metric[];
    topEvents: EventData[];
    upcomingEvents: EventData[];
    issues: Issue[];
}

// Skeleton component for a metric card
const MetricCardSkeleton = () => (
    <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-100 animate-pulse">
        <div className="flex justify-between items-start">
            <div>
                <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                <div className="h-6 bg-gray-300 rounded w-32"></div>
            </div>
            <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
        </div>
        <div className="h-4 bg-gray-200 rounded w-40 mt-3"></div>
    </div>
);

// Skeleton component for an event list item
const EventListItemSkeleton = () => (
    <div className="border-b border-gray-100 pb-4 last:border-0 last:pb-0 animate-pulse">
        <div className="flex flex-wrap justify-between items-center gap-2">
            <div className="h-5 bg-gray-200 rounded w-48"></div>
            <div className="h-5 bg-gray-300 rounded w-20"></div>
        </div>
        <div className="flex flex-wrap justify-between items-center mt-2 text-xs sm:text-sm text-gray-600 gap-2">
            <div className="h-4 bg-gray-200 rounded w-20"></div>
            <div className="h-4 bg-gray-200 rounded w-32"></div>
        </div>
        <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
            <div className="h-2 rounded-full bg-gray-300 w-3/4"></div>
        </div>
    </div>
);

// Skeleton component for an issue item
const IssueItemSkeleton = () => (
    <div className="flex flex-col sm:flex-row sm:items-center p-4 rounded-lg bg-gray-50 animate-pulse">
        <div className="p-2 rounded-full mb-2 sm:mb-0 sm:mr-4 self-start bg-gray-200 h-9 w-9"></div>
        <div className="flex-1">
            <div className="h-5 bg-gray-200 rounded w-60 mb-1"></div>
            <div className="h-4 bg-gray-300 rounded w-full"></div>
        </div>
        <div className="mt-3 sm:mt-0 sm:ml-auto h-8 w-20 bg-gray-200 rounded-lg"></div>
    </div>
);


export default function DashboardOverview() {
    const { publicKey, connected } = useWallet();
    const organizerWalletAddress = publicKey?.toBase58();

    const [dashboardData, setDashboardData] = useState<DashboardInfo>({
        metrics: [],
        topEvents: [],
        upcomingEvents: [],
        issues: [],
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);


    useEffect(() => {
        const fetchDashboardData = async () => {
            if (!connected || !organizerWalletAddress) {
                setLoading(false); // Stop loading if wallet not connected
                // Clear previous data if wallet disconnects
                setDashboardData({ metrics: [], topEvents: [], upcomingEvents: [], issues: [] });
                return;
            }

            try {
                setLoading(true);
                setError(null); // Clear previous errors

                const response = await fetch(`http://localhost:3001/api/dashboard/${organizerWalletAddress}`);
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.details || "Failed to fetch dashboard data.");
                }
                const data = await response.json();
                setDashboardData(data);
            } catch (err: any) {
                console.error("Error fetching dashboard data:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [organizerWalletAddress, connected]);


    if (!connected) {
        return (
            <div className="space-y-6 text-center py-10">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Dashboard Overview</h1>
                <p className="text-sm sm:text-base text-gray-600 mt-1">
                    Please connect your Solana wallet to view your dashboard.
                </p>
            </div>
        );
    }

    if (error) {
        return <div className="text-center py-10 text-red-600">Error loading dashboard: {error}</div>;
    }
    return (
        <Suspense fallback={<DashboardSkeletons />}>
            <div className="space-y-6">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Dashboard Overview</h1>
                    <p className="text-sm sm:text-base text-gray-600 mt-1">
                        Welcome back! Here's what's happening with your events.
                    </p>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                    {loading ? (
                        <>
                            <MetricCardSkeleton />
                            <MetricCardSkeleton />
                            <MetricCardSkeleton />
                            <MetricCardSkeleton />
                        </>
                    ) : (
                        dashboardData.metrics.map((metric, index) => (
                            <div key={index} className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-100">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-xs sm:text-sm font-medium text-gray-500">{metric.title}</p>
                                        <p className="text-xl sm:text-2xl font-bold mt-1 text-gray-900">{metric.value}</p>
                                    </div>
                                    <div className="text-xl sm:text-2xl">{metric.icon}</div>
                                </div>
                                <div
                                    className={`mt-2 flex items-center text-xs sm:text-sm ${metric.isPositive ? "text-green-600" : "text-red-600"}`}
                                >
                                    {metric.isPositive ? <ArrowUp className="w-4 h-4 mr-1" /> : <ArrowDown className="w-4 h-4 mr-1" />}
                                    <span>{metric.change} from last month</span>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Top Performing Events */}
                    <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-100">
                        <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">📊 Top Performing Events</h2>
                        <div className="space-y-4">
                            {loading ? (
                                <>
                                    <EventListItemSkeleton />
                                    <EventListItemSkeleton />
                                    <EventListItemSkeleton />
                                </>
                            ) : dashboardData.topEvents.length > 0 ? (
                                dashboardData.topEvents.map((event, index) => (
                                    <div key={index} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                                        <div className="flex flex-wrap justify-between items-center gap-2">
                                            <h3 className="font-medium text-gray-900">{event.name}</h3>
                                            <span className="text-blue-600 font-medium">{event.revenue}</span>
                                        </div>
                                        <div className="flex flex-wrap justify-between items-center mt-2 text-xs sm:text-sm text-gray-600 gap-2">
                                            <span>{event.date}</span>
                                            <span>
                                                {event.ticketsSold} / {event.totalCapacity} tickets sold
                                            </span>
                                        </div>
                                        <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className="bg-blue-600 h-2 rounded-full"
                                                style={{ width: `${event.percentSold}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-600">No top performing events to display yet.</p>
                            )}
                        </div>
                    </div>

                    {/* Upcoming Events */}
                    <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-100">
                        <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">📍 Upcoming Events</h2>
                        <div className="space-y-4">
                            {loading ? (
                                <>
                                    <EventListItemSkeleton />
                                    <EventListItemSkeleton />
                                </>
                            ) : dashboardData.upcomingEvents.length > 0 ? (
                                dashboardData.upcomingEvents.map((event, index) => (
                                    <div key={index} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                                        <div className="flex flex-wrap justify-between items-center gap-2">
                                            <h3 className="font-medium text-gray-900">{event.name}</h3>
                                            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                                                {event.daysLeft} days left
                                            </span>
                                        </div>
                                        <div className="flex flex-wrap justify-between items-center mt-2 text-xs sm:text-sm text-gray-600 gap-2">
                                            <span>{event.date}</span>
                                            <span>
                                                {event.ticketsSold} / {event.totalCapacity} tickets sold
                                            </span>
                                        </div>
                                        <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className="bg-blue-600 h-2 rounded-full"
                                                style={{ width: `${event.percentSold}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-600">No upcoming events to display.</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Issues/Flags */}
                <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-100">
                    <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">🛑 Issues Requiring Attention</h2>
                    {loading ? (
                        <>
                            <IssueItemSkeleton />
                            <IssueItemSkeleton />
                        </>
                    ) : dashboardData.issues.length > 0 ? (
                        <div className="space-y-4">
                            {dashboardData.issues.map((issue, index) => (
                                <div key={index} className="flex flex-col sm:flex-row sm:items-center p-4 rounded-lg bg-gray-50">
                                    <div
                                        className={`p-2 rounded-full mb-2 sm:mb-0 sm:mr-4 self-start ${
                                            issue.severity === "high"
                                                ? "bg-red-100 text-red-600"
                                                : issue.severity === "medium"
                                                    ? "bg-yellow-100 text-yellow-600"
                                                    : "bg-blue-100 text-blue-600"
                                        }`}
                                    >
                                        <AlertCircle className="w-5 h-5" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-medium text-gray-900">{issue.event}</h3>
                                        <p className="text-gray-600 text-sm mt-1">{issue.issue}</p>
                                    </div>
                                    <button className="mt-3 sm:mt-0 sm:ml-auto bg-white border border-gray-300 text-gray-700 px-3 py-1 rounded-lg text-sm hover:bg-gray-50 transition-colors">
                                        View
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-600">No issues to report at this time.</p>
                    )}
                </div>
            </div>
        </Suspense>
    )
}

// A separate component for the full dashboard skeleton view
const DashboardSkeletons = () => (
    <div className="space-y-6">
        <div>
            <div className="h-8 bg-gray-200 rounded w-64 animate-pulse mb-2"></div>
            <div className="h-5 bg-gray-300 rounded w-full animate-pulse"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <MetricCardSkeleton />
            <MetricCardSkeleton />
            <MetricCardSkeleton />
            <MetricCardSkeleton />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-100">
                <div className="h-6 bg-gray-200 rounded w-48 mb-4 animate-pulse"></div>
                <div className="space-y-4">
                    <EventListItemSkeleton />
                    <EventListItemSkeleton />
                    <EventListItemSkeleton />
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-100">
                <div className="h-6 bg-gray-200 rounded w-48 mb-4 animate-pulse"></div>
                <div className="space-y-4">
                    <EventListItemSkeleton />
                    <EventListItemSkeleton />
                </div>
            </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-100">
            <div className="h-6 bg-gray-200 rounded w-48 mb-4 animate-pulse"></div>
            <div className="space-y-4">
                <IssueItemSkeleton />
                <IssueItemSkeleton />
            </div>
        </div>
    </div>
);