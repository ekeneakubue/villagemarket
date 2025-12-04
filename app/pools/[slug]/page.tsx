"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

// Type for Pool from database
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
  town: string | null;
  street: string | null;
  deadline: string;
  status: "PENDING" | "ACTIVE" | "COMPLETED" | "CANCELLED";
  creatorId: string;
  createdAt: string;
}

// Type for logged-in user
interface User {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  role: "ADMIN" | "CONTRIBUTOR";
  status: "ACTIVE" | "SUSPENDED" | "INACTIVE";
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

export default function PoolDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const slug = typeof params?.slug === "string" ? params.slug : "";
  
  const [pool, setPool] = useState<Pool | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // User authentication state
  const [user, setUser] = useState<User | null>(null);
  
  // Contribution modal state
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [selectedSlots, setSelectedSlots] = useState(1);
  
  // Check for success message
  const paymentSuccess = searchParams.get("success") === "payment_complete";
  
  // Check for logged-in user on mount
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      } catch {
        localStorage.removeItem("user");
      }
    }
  }, []);

  const handleContribute = async () => {
    if (!pool || !user) return;

    setSubmitting(true);
    setPaymentError(null);

    try {
      const contributionPerSlot = pool.contributors > 0 ? Math.ceil(pool.goal / pool.contributors) : 0;
      const totalAmount = contributionPerSlot * selectedSlots;
      
      const response = await fetch("/api/payments/initialize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          poolId: pool.id,
          userId: user.id,
          email: user.email,
          name: user.name,
          phone: user.phone || undefined,
          amount: totalAmount,
          slots: selectedSlots,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to initialize payment");
      }

      // Redirect to Paystack payment page
      window.location.href = data.data.authorization_url;
    } catch (err) {
      setPaymentError(err instanceof Error ? err.message : "Payment failed");
      setSubmitting(false);
    }
  };

  useEffect(() => {
    async function fetchPool() {
      if (!slug) {
        setError("Invalid pool");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/pools/${slug}`);
        if (response.ok) {
          const data = await response.json();
          setPool(data);
        } else if (response.status === 404) {
          setError("Pool not found");
        } else {
          setError("Failed to load pool");
        }
      } catch (err) {
        console.error("Error fetching pool:", err);
        setError("Failed to load pool");
      } finally {
        setLoading(false);
      }
    }
    fetchPool();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 via-white to-blue-50">
        <SiteHeader />
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-green-600 border-t-transparent"></div>
            <p className="mt-4 text-gray-600">Loading pool details...</p>
          </div>
        </main>
        <SiteFooter />
      </div>
    );
  }

  if (error || !pool) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 via-white to-blue-50">
        <SiteHeader />
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center py-20">
            <div className="text-6xl mb-4">😕</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{error || "Pool not found"}</h1>
            <p className="text-gray-600 mb-8">The pool you're looking for doesn't exist or has been removed.</p>
            <Link
              href="/browse"
              className="inline-block bg-green-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-green-700 transition-colors"
            >
              Browse All Pools
            </Link>
          </div>
        </main>
        <SiteFooter />
      </div>
    );
  }

  const progress = pool.goal > 0 ? Math.min((pool.currentAmount / pool.goal) * 100, 100) : 0;
  const remaining = pool.goal - pool.currentAmount;
  const daysLeft = getDaysLeft(pool.deadline);
  const contributionPerPerson = pool.contributors > 0 ? Math.ceil(pool.goal / pool.contributors) : 0;
  const categoryLabel = pool.category === "FOOD_STUFFS" ? "Food Stuffs" : "Livestock";
  const locationDisplay = pool.town 
    ? `${pool.town}, ${pool.location}` 
    : `${pool.localGovernment}, ${pool.location}`;

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-white to-blue-50">
      <SiteHeader />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Link
          href="/browse"
          className="inline-flex items-center text-sm font-semibold text-green-700 hover:text-green-900"
        >
          ← Back to pools
        </Link>

        <section className="mt-6 grid gap-10 lg:grid-cols-[1.3fr_0.9fr]">
          <div className="rounded-3xl overflow-hidden shadow-2xl border border-white">
            {pool.image ? (
              <div
                className="h-72 bg-cover bg-center"
                style={{
                  backgroundImage: `linear-gradient(120deg, rgba(0,0,0,0.45), rgba(0,0,0,0.25)), url(${pool.image})`,
                }}
              />
            ) : (
              <div className="h-72 bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center">
                <span className="text-6xl text-white font-bold">
                  {pool.title.substring(0, 2).toUpperCase()}
                </span>
              </div>
            )}
            <div className="bg-white px-8 py-8">
              <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 uppercase tracking-widest">
                <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                  pool.category === "FOOD_STUFFS" 
                    ? "border-green-200 text-green-700 bg-green-50" 
                    : "border-blue-200 text-blue-700 bg-blue-50"
                }`}>
                  {categoryLabel}
                </span>
                <span>•</span>
                <span>{locationDisplay}</span>
                <span>•</span>
                <span>{daysLeft} days left</span>
              </div>

              <h1 className="mt-4 text-4xl font-bold text-gray-900">{pool.title}</h1>
              <p className="mt-4 text-lg text-gray-600 leading-relaxed">{pool.description}</p>

              <div className="mt-8 grid gap-6 sm:grid-cols-4">
                <div>
                  <p className="text-sm text-gray-500">Goal</p>
                  <p className="text-2xl font-semibold text-gray-900">{formatCurrency(pool.goal)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Raised</p>
                  <p className="text-2xl font-semibold text-green-700">{formatCurrency(pool.currentAmount)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Contributors</p>
                  <p className="text-2xl font-semibold text-gray-900">{pool.currentContributors}/{pool.contributors}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Contribution</p>
                  <p className="text-2xl font-semibold text-green-800">{formatCurrency(contributionPerPerson)}</p>
                </div>
              </div>

              <div className="mt-6">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Progress</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <div className="h-3 w-full rounded-full bg-gray-200">
                  <div
                    className="h-3 rounded-full bg-gradient-to-r from-green-500 to-blue-500 transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  {formatCurrency(remaining > 0 ? remaining : 0)} still needed
                </p>
              </div>

              <div className="mt-8">
                {user ? (
                  <button 
                    onClick={() => {
                      setSelectedSlots(1);
                      setPaymentError(null);
                      setShowModal(true);
                    }}
                    className="w-full rounded-2xl bg-green-600 px-6 py-4 text-center text-lg font-semibold text-white shadow-lg shadow-green-600/30 hover:bg-green-700 transition"
                  >
                    Contribute {formatCurrency(contributionPerPerson)}
                  </button>
                ) : (
                  <div className="space-y-3">
                    <Link 
                      href={`/signin?redirect=/pools/${pool.slug}`}
                      className="w-full rounded-2xl bg-green-600 px-6 py-4 text-center text-lg font-semibold text-white shadow-lg shadow-green-600/30 hover:bg-green-700 transition block"
                    >
                      Sign In to Contribute
                    </Link>
                    <p className="text-center text-sm text-gray-500">
                      Don&apos;t have an account?{" "}
                      <Link href={`/signup?redirect=/pools/${pool.slug}`} className="text-green-600 font-semibold hover:text-green-700">
                        Sign up
                      </Link>
                    </p>
                  </div>
                )}
              </div>
              
              {paymentSuccess && (
                <div className="mt-4 rounded-xl bg-green-100 border border-green-200 p-4">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">🎉</div>
                    <div>
                      <p className="font-semibold text-green-800">Payment Successful!</p>
                      <p className="text-sm text-green-700">Thank you for your contribution to this pool.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <aside className="space-y-8">
            {/* Pool Info */}
            <div className="rounded-2xl border border-gray-100 bg-white/80 p-6 shadow-lg">
              <h2 className="text-xl font-semibold text-gray-900">Pool Information</h2>
              <div className="mt-4 space-y-4">
                <div className="rounded-xl bg-gray-50 p-4 border border-gray-100">
                  <p className="text-sm font-semibold text-gray-900">Location</p>
                  <p className="text-sm text-gray-600">{pool.location} • {pool.localGovernment}</p>
                  {pool.town && <p className="text-sm text-gray-600">{pool.town}{pool.street ? `, ${pool.street}` : ""}</p>}
                </div>
                <div className="rounded-xl bg-gray-50 p-4 border border-gray-100">
                  <p className="text-sm font-semibold text-gray-900">Deadline</p>
                  <p className="text-sm text-gray-600">{new Date(pool.deadline).toLocaleDateString("en-NG", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                  })}</p>
                </div>
                <div className="rounded-xl bg-gray-50 p-4 border border-gray-100">
                  <p className="text-sm font-semibold text-gray-900">Status</p>
                  <span className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-semibold ${
                    pool.status === "ACTIVE"
                      ? "bg-green-100 text-green-700"
                      : pool.status === "COMPLETED"
                      ? "bg-blue-100 text-blue-700"
                      : pool.status === "PENDING"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }`}>
                    {pool.status.toLowerCase()}
                  </span>
                </div>
              </div>
            </div>

            {/* How it works */}
            <div className="rounded-2xl border border-gray-100 bg-white/90 p-6 shadow-lg">
              <h2 className="text-xl font-semibold text-gray-900">How it works</h2>
              <div className="mt-4 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-green-700 font-semibold text-sm">1</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Contribute your share</p>
                    <p className="text-sm text-gray-600">Pay {formatCurrency(contributionPerPerson)} to join this pool</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-green-700 font-semibold text-sm">2</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Wait for pool to fill</p>
                    <p className="text-sm text-gray-600">{pool.contributors - pool.currentContributors} more contributors needed</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-green-700 font-semibold text-sm">3</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Receive your share</p>
                    <p className="text-sm text-gray-600">Items distributed to all contributors</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-green-100 bg-green-50 p-6 shadow-inner">
              <p className="text-sm text-green-700 font-semibold uppercase tracking-widest">Verified pool</p>
              <p className="mt-3 text-base text-green-900">
                This pool is managed and verified by Village Market's trust & safety team.
              </p>
              <p className="mt-4 text-sm text-gray-600">Escrow release after delivery confirmation.</p>
            </div>
          </aside>
        </section>
      </main>

      <SiteFooter />
      
      {/* Contribution Confirmation Modal */}
      {showModal && user && pool && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => !submitting && setShowModal(false)}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Close button */}
            <button
              onClick={() => !submitting && setShowModal(false)}
              className="absolute top-4 right-4 z-10 text-gray-400 hover:text-gray-600 bg-white/80 rounded-full p-1"
              disabled={submitting}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="grid md:grid-cols-2">
              {/* Left Column - Slot Selection */}
              <div className="p-8 bg-gradient-to-br from-green-50 via-white to-blue-50">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Select Slots</h2>
                  <p className="text-gray-600 mt-1 text-sm">
                    Choose how many slots you want in <span className="font-semibold">{pool.title}</span>
                  </p>
                </div>

                {paymentError && (
                  <div className="mb-4 rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">
                    {paymentError}
                  </div>
                )}

                {/* Slot Selector */}
                <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium text-gray-600">Number of Slots</span>
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                      {pool.contributors - pool.currentContributors} available
                    </span>
                  </div>
                  <div className="flex items-center justify-center gap-4">
                    <button
                      type="button"
                      onClick={() => setSelectedSlots(Math.max(1, selectedSlots - 1))}
                      disabled={selectedSlots <= 1}
                      className="w-12 h-12 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                      </svg>
                    </button>
                    <div className="w-24 h-16 flex items-center justify-center bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg">
                      <span className="text-4xl font-bold text-white">{selectedSlots}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedSlots(Math.min(pool.contributors - pool.currentContributors, selectedSlots + 1))}
                      disabled={selectedSlots >= pool.contributors - pool.currentContributors}
                      className="w-12 h-12 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  </div>
                  <p className="mt-4 text-center text-sm text-gray-500">
                    {formatCurrency(contributionPerPerson)} per slot
                  </p>
                </div>

                {/* User Info */}
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Your Details</h3>
                  <div className="bg-white rounded-lg p-4 border border-gray-100 space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500">Name</span>
                      <span className="font-medium text-gray-900">{user.name}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500">Email</span>
                      <span className="font-medium text-gray-900 truncate ml-4">{user.email}</span>
                    </div>
                    {user.phone && (
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-500">Phone</span>
                        <span className="font-medium text-gray-900">{user.phone}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column - Order Summary */}
              <div className="p-8 bg-gray-50 flex flex-col">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Order Summary</h2>
                  <p className="text-gray-600 mt-1 text-sm">Review your contribution details</p>
                </div>

                <div className="flex-1 space-y-4">
                  {/* Pool Info */}
                  <div className="bg-white rounded-xl p-4 border border-gray-100">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold text-sm">
                          {pool.title.substring(0, 2).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 truncate">{pool.title}</h4>
                        <p className="text-xs text-gray-500">{pool.category === "FOOD_STUFFS" ? "Food Stuffs" : "Livestock"}</p>
                      </div>
                    </div>
                  </div>

                  {/* Price Breakdown */}
                  <div className="bg-white rounded-xl p-4 border border-gray-100 space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Price per slot</span>
                      <span className="font-medium text-gray-900">{formatCurrency(contributionPerPerson)}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Number of slots</span>
                      <span className="font-medium text-gray-900">× {selectedSlots}</span>
                    </div>
                    <div className="border-t border-gray-100 pt-3 flex justify-between items-center">
                      <span className="font-semibold text-gray-900">Total</span>
                      <span className="text-2xl font-bold text-green-600">{formatCurrency(contributionPerPerson * selectedSlots)}</span>
                    </div>
                  </div>

                  {/* Benefits */}
                  <div className="bg-green-50 rounded-xl p-4 border border-green-100">
                    <h4 className="text-sm font-semibold text-green-800 mb-2">What you get</h4>
                    <ul className="space-y-2 text-sm text-green-700">
                      <li className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {selectedSlots} share{selectedSlots > 1 ? "s" : ""} of pool items
                      </li>
                      <li className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Escrow protection
                      </li>
                      <li className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Verified delivery
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Pay Button */}
                <div className="mt-6">
                  <button
                    onClick={handleContribute}
                    disabled={submitting}
                    className="w-full rounded-xl bg-green-600 px-6 py-4 text-center text-lg font-semibold text-white shadow-lg shadow-green-600/30 hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        Pay {formatCurrency(contributionPerPerson * selectedSlots)}
                      </>
                    )}
                  </button>
                  <p className="mt-3 text-center text-xs text-gray-500">
                    Secured by <span className="font-semibold">Paystack</span>. Your payment is safe and encrypted.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
