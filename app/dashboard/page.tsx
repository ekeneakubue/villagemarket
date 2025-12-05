"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

interface Pool {
  id: string;
  slug: string;
  image: string | null;
  title: string;
  description: string;
  category: "FOOD_STUFFS" | "LIVESTOCK";
  goal: number;
  contributors: number;
  currentAmount: number;
  currentContributors: number;
  location: string;
  localGovernment: string;
  deadline: string;
  status: "PENDING" | "ACTIVE" | "COMPLETED" | "CANCELLED";
}

interface Contribution {
  id: string;
  poolId: string;
  amount: number;
  slots: number;
  status: string;
  paidAt: string;
  createdAt: string;
  pool: Pool | null;
}

interface Stats {
  totalContributed: number;
  totalSlots: number;
  totalPools: number;
  activePools: number;
  completedPools: number;
}

interface User {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  role: string;
  totalContributed: number;
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function getDaysLeft(deadline: string) {
  const deadlineDate = new Date(deadline);
  const now = new Date();
  const diffTime = deadlineDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
}

function getStatusColor(status: string) {
  switch (status) {
    case "ACTIVE":
      return "bg-green-100 text-green-700 border-green-200";
    case "COMPLETED":
      return "bg-blue-100 text-blue-700 border-blue-200";
    case "PENDING":
      return "bg-yellow-100 text-yellow-700 border-yellow-200";
    case "CANCELLED":
      return "bg-red-100 text-red-700 border-red-200";
    default:
      return "bg-gray-100 text-gray-700 border-gray-200";
  }
}

function ContributorDashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [user, setUser] = useState<User | null>(null);
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"all" | "active" | "completed">("all");
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);
  const [settingsForm, setSettingsForm] = useState({ phone: "", currentPassword: "", password: "", confirmPassword: "" });
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [settingsMessage, setSettingsMessage] = useState<string | null>(null);
  const [settingsError, setSettingsError] = useState<string | null>(null);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentPasswordStatus, setCurrentPasswordStatus] = useState<"idle" | "checking" | "valid" | "invalid">("idle");

  // Check for payment success
  useEffect(() => {
    const paymentStatus = searchParams.get("payment");
    if (paymentStatus === "success") {
      setShowPaymentSuccess(true);
      // Auto-hide after 6 seconds
      setTimeout(() => setShowPaymentSuccess(false), 6000);
      // Clean up URL
      router.replace("/dashboard", { scroll: false });
    }
  }, [searchParams, router]);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      setSettingsForm((prev) => ({ ...prev, phone: parsedUser.phone || "" }));
      fetchContributions(parsedUser.id);
    } else {
      router.push("/signin?redirect=/dashboard");
    }
  }, [router]);

  const fetchContributions = async (userId: string) => {
    try {
      const response = await fetch(`/api/contributions/user/${userId}`);
      if (response.ok) {
        const data = await response.json();
        setContributions(data.contributions);
        setStats(data.stats);
      }
    } catch (error) {
      console.error("Error fetching contributions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/");
  };

  const filteredContributions = contributions.filter((c) => {
    if (activeTab === "all") return true;
    if (activeTab === "active") return c.pool?.status === "ACTIVE";
    if (activeTab === "completed") return c.pool?.status === "COMPLETED";
    return true;
  });

  const handleUpdateSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSettingsError(null);
    setSettingsMessage(null);

    if (!settingsForm.phone.trim()) {
      setSettingsError("Phone number is required");
      return;
    }

    if (settingsForm.password) {
      if (!settingsForm.currentPassword) {
        setSettingsError("Current password is required to set a new password");
        return;
      }
      if (currentPasswordStatus !== "valid") {
        setSettingsError("Please verify your current password before setting a new one");
        return;
      }
      if (settingsForm.password.length < 8) {
        setSettingsError("Password must be at least 8 characters long");
        return;
      }
      if (settingsForm.password !== settingsForm.confirmPassword) {
        setSettingsError("Passwords do not match");
        return;
      }
    }

    setSettingsLoading(true);
    try {
      const payload: Record<string, string> = {
        phone: settingsForm.phone,
      };
      if (settingsForm.password) {
        payload.password = settingsForm.password;
        payload.currentPassword = settingsForm.currentPassword;
      }

      const response = await fetch(`/api/users/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (response.ok) {
        // persist updated user in localStorage and state
        localStorage.setItem("user", JSON.stringify(data));
        setUser(data);
        setSettingsMessage("Account updated successfully");
        setSettingsForm((prev) => ({ ...prev, password: "", confirmPassword: "", currentPassword: "" }));
        setAllowNewPasswordFields(true);
      } else {
        setSettingsError(data.error || "Failed to update account");
        if (data.error === "Current password is incorrect") {
          setAllowNewPasswordFields(false);
          setSettingsForm((prev) => ({ ...prev, password: "", confirmPassword: "" }));
        }
      }
    } catch (err) {
      console.error("Update settings error:", err);
      setSettingsError("An error occurred. Please try again.");
    } finally {
      setSettingsLoading(false);
    }
  };

  const verifyCurrentPassword = async () => {
    if (!user || !settingsForm.currentPassword) {
      setCurrentPasswordStatus("idle");
      return;
    }
    setCurrentPasswordStatus("checking");
    try {
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user.email,
          password: settingsForm.currentPassword,
          accountType: "user",
        }),
      });
      if (res.ok) {
        setCurrentPasswordStatus("valid");
      } else {
        setCurrentPasswordStatus("invalid");
      }
    } catch (err) {
      console.error("Verify current password error:", err);
      setCurrentPasswordStatus("invalid");
    }
  };

  if (!user || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-emerald-600 border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      {/* Header */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center">
              <img src="/images/logo.png" alt="Village Market" className="h-10" />
            </Link>
            <div className="flex items-center gap-6">
              <Link
                href="/browse"
                className="text-gray-600 hover:text-emerald-600 font-medium transition"
              >
                Browse Pools
              </Link>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-gray-700 font-medium hidden sm:block">{user.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="text-gray-500 hover:text-gray-700 transition"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, <span className="text-emerald-600">{user.name.split(" ")[0]}</span>! 👋
          </h1>
          <p className="text-gray-600 mt-2">Track your contributions and pool progress</p>
        </div>

        {/* Payment Success Message */}
        {showPaymentSuccess && (
          <div className="mb-8 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-6 shadow-lg animate-in slide-in-from-top-2 fade-in duration-500">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center animate-bounce">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-green-800 mb-2">🎉 Payment Successful!</h3>
                <p className="text-green-700 mb-3">
                  Thank you for your contribution! Your payment has been processed successfully and your contribution has been added to the pool.
                </p>
                <div className="flex items-center gap-2 text-sm text-green-600">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium">Your contribution is now active</span>
                </div>
              </div>
              <button
                onClick={() => setShowPaymentSuccess(false)}
                className="flex-shrink-0 text-green-600 hover:text-green-800 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-5 lg:p-6 hover:shadow-md transition">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-200 flex-shrink-0">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Total Contributed</p>
                <p className="text-lg sm:text-xl font-bold text-gray-900 truncate">{formatCurrency(stats?.totalContributed || 0)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-5 lg:p-6 hover:shadow-md transition">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200 flex-shrink-0">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Total Slots</p>
                <p className="text-lg sm:text-xl font-bold text-gray-900">{stats?.totalSlots || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-5 lg:p-6 hover:shadow-md transition">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-amber-200 flex-shrink-0">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Active Pools</p>
                <p className="text-lg sm:text-xl font-bold text-gray-900">{stats?.activePools || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-5 lg:p-6 hover:shadow-md transition">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-violet-400 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-200 flex-shrink-0">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Completed</p>
                <p className="text-lg sm:text-xl font-bold text-gray-900">{stats?.completedPools || 0}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs and Contributions */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Tabs */}
          <div className="border-b border-gray-100 px-6 pt-4">
            <div className="flex gap-6">
              <button
                onClick={() => setActiveTab("all")}
                className={`pb-4 px-2 font-medium text-sm transition border-b-2 ${
                  activeTab === "all"
                    ? "border-emerald-500 text-emerald-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                All Pools ({contributions.length})
              </button>
              <button
                onClick={() => setActiveTab("active")}
                className={`pb-4 px-2 font-medium text-sm transition border-b-2 ${
                  activeTab === "active"
                    ? "border-emerald-500 text-emerald-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Active ({contributions.filter((c) => c.pool?.status === "ACTIVE").length})
              </button>
              <button
                onClick={() => setActiveTab("completed")}
                className={`pb-4 px-2 font-medium text-sm transition border-b-2 ${
                  activeTab === "completed"
                    ? "border-emerald-500 text-emerald-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Completed ({contributions.filter((c) => c.pool?.status === "COMPLETED").length})
              </button>
            </div>
          </div>

          {/* Contributions List */}
          <div className="p-6">
            {filteredContributions.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No contributions yet</h3>
                <p className="text-gray-500 mb-6">Start by joining a pool to see your contributions here</p>
                <Link
                  href="/browse"
                  className="inline-flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-emerald-700 transition shadow-lg shadow-emerald-200"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Browse Pools
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredContributions.map((contribution) => {
                  const pool = contribution.pool;
                  if (!pool) return null;

                  const progress = pool.goal > 0 ? Math.min((pool.currentAmount / pool.goal) * 100, 100) : 0;
                  const daysLeft = getDaysLeft(pool.deadline);
                  const contributionPerSlot = pool.contributors > 0 ? Math.ceil(pool.goal / pool.contributors) : 0;

                  return (
                    <Link
                      key={contribution.id}
                      href={`/pools/${pool.slug}`}
                      className="block bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-100 p-5 hover:border-emerald-200 hover:shadow-md transition group"
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center gap-5">
                        {/* Pool Image/Icon */}
                        <div className="flex-shrink-0">
                          {pool.image ? (
                            <div
                              className="w-20 h-20 rounded-xl bg-cover bg-center"
                              style={{ backgroundImage: `url(${pool.image})` }}
                            />
                          ) : (
                            <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
                              <span className="text-white font-bold text-xl">
                                {pool.title.substring(0, 2).toUpperCase()}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Pool Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-emerald-600 transition truncate">
                              {pool.title}
                            </h3>
                            <span className={`px-2 py-0.5 text-xs font-medium rounded-full border ${getStatusColor(pool.status)}`}>
                              {pool.status.toLowerCase()}
                            </span>
                            <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-gray-100 text-gray-600">
                              {pool.category === "FOOD_STUFFS" ? "Food Stuffs" : "Livestock"}
                            </span>
                          </div>

                          {/* Progress Bar */}
                          <div className="mb-3">
                            <div className="flex justify-between text-xs text-gray-500 mb-1">
                              <span>{formatCurrency(pool.currentAmount)} raised</span>
                              <span>{Math.round(progress)}%</span>
                            </div>
                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full transition-all duration-500"
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                          </div>

                          {/* Meta Info */}
                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                              </svg>
                              {pool.currentContributors}/{pool.contributors}
                            </div>
                            <div className="flex items-center gap-1">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              {daysLeft > 0 ? `${daysLeft} days left` : "Ended"}
                            </div>
                            <div className="flex items-center gap-1">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              {pool.location}
                            </div>
                          </div>
                        </div>

                        {/* Your Contribution */}
                        <div className="flex-shrink-0 lg:text-right bg-emerald-50 rounded-xl p-4 border border-emerald-100">
                          <p className="text-xs text-emerald-600 font-medium uppercase tracking-wider mb-1">Your Contribution</p>
                          <p className="text-xl font-bold text-emerald-700">{formatCurrency(contribution.amount)}</p>
                          <p className="text-sm text-emerald-600">
                            {contribution.slots} slot{contribution.slots > 1 ? "s" : ""} × {formatCurrency(contributionPerSlot)}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(contribution.paidAt || contribution.createdAt).toLocaleDateString("en-NG", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </p>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-6 sm:mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-5 sm:p-6 text-white shadow-lg shadow-emerald-200">
            <h3 className="text-base sm:text-lg font-bold mb-2">Find More Pools</h3>
            <p className="text-emerald-100 text-sm mb-3 sm:mb-4">
              Discover new pools in your community and contribute to causes you care about.
            </p>
            <Link
              href="/browse"
              className="inline-flex items-center gap-2 bg-white text-emerald-600 px-5 py-2.5 rounded-lg font-semibold hover:bg-emerald-50 transition"
            >
              Browse All Pools
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>

          <div className="bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl p-5 sm:p-6 text-white shadow-lg shadow-violet-200">
            <h3 className="text-base sm:text-lg font-bold mb-2">Become a Creator</h3>
            <p className="text-violet-100 text-sm mb-3 sm:mb-4">
              Start your own pools and help your community access bulk goods at better prices.
            </p>
            <Link
              href="/creator/register"
              className="inline-flex items-center gap-2 bg-white text-violet-600 px-5 py-2.5 rounded-lg font-semibold hover:bg-violet-50 transition"
            >
              Start Creating
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Account Settings */}
        <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">Account Settings</h3>
            <p className="text-sm text-gray-600 mt-1">Update your phone number and password.</p>
          </div>
          <form onSubmit={handleUpdateSettings} className="p-6 space-y-5">
            {settingsError && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {settingsError}
              </div>
            )}
            {settingsMessage && (
              <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                {settingsMessage}
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={settingsForm.phone}
                  onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })}
                  required
                  placeholder="e.g., 08012345678"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all text-gray-900 placeholder:text-gray-400"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Current Password (required to change password)
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    value={settingsForm.currentPassword}
                    onChange={(e) => {
                      setSettingsError((prev) =>
                        prev === "Current password is incorrect" ? null : prev
                      );
                      setSettingsForm({ ...settingsForm, currentPassword: e.target.value });
                      setCurrentPasswordStatus("idle");
                    }}
                    placeholder="Enter current password"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all text-gray-900 placeholder:text-gray-400 pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                    aria-label={showCurrentPassword ? "Hide current password" : "Show current password"}
                  >
                    {showCurrentPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5 0-9-4-9-7 0-1.06.37-2.063 1.05-2.975M6.228 6.228A9.956 9.956 0 0112 5c5 0 9 4 9 7 0 1.291-.441 2.496-1.2 3.5M3 3l18 18M9.88 9.88a3 3 0 104.24 4.24" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
                <div className="mt-2 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={verifyCurrentPassword}
                    className="px-3 py-1.5 text-sm font-semibold text-green-700 border border-green-200 rounded-lg hover:bg-green-50 transition-colors"
                    disabled={currentPasswordStatus === "checking"}
                  >
                    {currentPasswordStatus === "checking" ? "Checking..." : "Verify current password"}
                  </button>
                  {currentPasswordStatus === "valid" && (
                    <span className="text-sm text-green-600 font-medium">Current password verified</span>
                  )}
                  {currentPasswordStatus === "invalid" && (
                    <span className="text-sm text-red-600 font-medium">Current password is incorrect</span>
                  )}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={settingsForm.password}
                    onChange={(e) => setSettingsForm({ ...settingsForm, password: e.target.value })}
                    placeholder="Leave blank to keep current"
                    disabled={currentPasswordStatus !== "valid"}
                    className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all text-gray-900 placeholder:text-gray-400 pr-12 ${
                      currentPasswordStatus !== "valid" ? "bg-gray-50 cursor-not-allowed" : ""
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword((prev) => !prev)}
                    disabled={currentPasswordStatus !== "valid"}
                    className={`absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700 ${
                      currentPasswordStatus !== "valid" ? "opacity-60 cursor-not-allowed" : ""
                    }`}
                    aria-label={showNewPassword ? "Hide new password" : "Show new password"}
                  >
                    {showNewPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5 0-9-4-9-7 0-1.06.37-2.063 1.05-2.975M6.228 6.228A9.956 9.956 0 0112 5c5 0 9 4 9 7 0 1.291-.441 2.496-1.2 3.5M3 3l18 18M9.88 9.88a3 3 0 104.24 4.24" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={settingsForm.confirmPassword}
                    onChange={(e) => setSettingsForm({ ...settingsForm, confirmPassword: e.target.value })}
                    placeholder="Re-enter new password"
                    disabled={currentPasswordStatus !== "valid"}
                    className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all text-gray-900 placeholder:text-gray-400 pr-12 ${
                      currentPasswordStatus !== "valid" ? "bg-gray-50 cursor-not-allowed" : ""
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    disabled={currentPasswordStatus !== "valid"}
                    className={`absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700 ${
                      currentPasswordStatus !== "valid" ? "opacity-60 cursor-not-allowed" : ""
                    }`}
                    aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                  >
                    {showConfirmPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5 0-9-4-9-7 0-1.06.37-2.063 1.05-2.975M6.228 6.228A9.956 9.956 0 0112 5c5 0 9 4 9 7 0 1.291-.441 2.496-1.2 3.5M3 3l18 18M9.88 9.88a3 3 0 104.24 4.24" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={settingsLoading}
                className={`px-6 py-3 rounded-lg font-semibold text-white bg-green-600 hover:bg-green-700 transition-colors ${
                  settingsLoading ? "opacity-60 cursor-not-allowed" : ""
                }`}
              >
                {settingsLoading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-gray-200 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} Village Market. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link href="/about" className="text-gray-500 hover:text-gray-700 text-sm">About</Link>
              <Link href="/privacy" className="text-gray-500 hover:text-gray-700 text-sm">Privacy</Link>
              <Link href="/terms" className="text-gray-500 hover:text-gray-700 text-sm">Terms</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function ContributorDashboard() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-emerald-600 border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    }>
      <ContributorDashboardContent />
    </Suspense>
  );
}
