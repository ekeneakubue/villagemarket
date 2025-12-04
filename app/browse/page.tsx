"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
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

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function getCategoryColor(category: string) {
  switch (category) {
    case "FOOD_STUFFS":
      return "bg-green-100 text-green-700 border-green-200";
    case "LIVESTOCK":
      return "bg-blue-100 text-blue-700 border-blue-200";
    default:
      return "bg-gray-100 text-gray-700 border-gray-200";
  }
}

function getDaysLeft(deadline: string) {
  const deadlineDate = new Date(deadline);
  const now = new Date();
  const diffTime = deadlineDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
}

export default function BrowsePage() {
  const [pools, setPools] = useState<Pool[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "FOOD_STUFFS" | "LIVESTOCK">("all");

  useEffect(() => {
    async function fetchPools() {
      try {
        const response = await fetch("/api/pools");
        if (response.ok) {
          const data = await response.json();
          // Only show active pools
          const activePools = data.filter((pool: Pool) => pool.status === "ACTIVE");
          setPools(activePools);
        }
      } catch (error) {
        console.error("Error fetching pools:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchPools();
  }, []);

  const filteredPools = filter === "all" 
    ? pools 
    : pools.filter(pool => pool.category === filter);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-white to-blue-50">
      <SiteHeader />

      {/* Header Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 pb-6 sm:pb-8">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">
            Browse Active Pools
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto px-4">
            Join existing pools and contribute to reach collective goals
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 md:gap-4 mb-6 sm:mb-8 px-2">
          <button 
            onClick={() => setFilter("all")}
            className={`px-4 sm:px-6 py-2 text-sm sm:text-base rounded-full font-semibold transition-colors ${
              filter === "all" 
                ? "bg-green-600 text-white hover:bg-green-700" 
                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
            }`}
          >
            All Pools
          </button>
          <button 
            onClick={() => setFilter("FOOD_STUFFS")}
            className={`px-4 sm:px-6 py-2 text-sm sm:text-base rounded-full font-semibold transition-colors ${
              filter === "FOOD_STUFFS" 
                ? "bg-green-600 text-white hover:bg-green-700" 
                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
            }`}
          >
            Food Stuffs
          </button>
          <button 
            onClick={() => setFilter("LIVESTOCK")}
            className={`px-4 sm:px-6 py-2 text-sm sm:text-base rounded-full font-semibold transition-colors ${
              filter === "LIVESTOCK" 
                ? "bg-green-600 text-white hover:bg-green-700" 
                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
            }`}
          >
            Livestock
          </button>
        </div>
      </section>

      {/* Pools Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-green-600 border-t-transparent"></div>
            <p className="mt-4 text-gray-600">Loading pools...</p>
          </div>
        ) : filteredPools.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No Active Pools Found</h3>
            <p className="text-gray-600 mb-6">Be the first to start a pool in your community!</p>
            <Link
              href="/"
              className="inline-block bg-green-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-green-700 transition-colors"
            >
              Start a Pool
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredPools.map((pool) => {
              const progress = pool.goal > 0 ? (pool.currentAmount / pool.goal) * 100 : 0;
              const remaining = pool.goal - pool.currentAmount;
              const daysLeft = getDaysLeft(pool.deadline);
              const contributionPerPerson = pool.contributors > 0 ? Math.ceil(pool.goal / pool.contributors) : 0;
              const categoryLabel = pool.category === "FOOD_STUFFS" ? "Food Stuffs" : "Livestock";
              const locationDisplay = pool.town 
                ? `${pool.town}, ${pool.location}` 
                : `${pool.localGovernment}, ${pool.location}`;
              
              return (
                <div
                  key={pool.id}
                  className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-xl transition-all transform hover:-translate-y-1"
                >
                  {/* Pool Image */}
                  <div className="relative h-36 sm:h-40 w-full">
                    {pool.image ? (
                      <Image
                        src={pool.image}
                        alt={pool.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center">
                        <span className="text-4xl text-white font-bold">
                          {pool.title.substring(0, 2).toUpperCase()}
                        </span>
                      </div>
                    )}
                    <div className="absolute top-3 left-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold border backdrop-blur-sm bg-white/90 ${getCategoryColor(pool.category)}`}>
                        {categoryLabel}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 sm:p-5 lg:p-6">

                  {/* Pool Info */}
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 line-clamp-2">{pool.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{pool.description}</p>

                  {/* Location */}
                  <div className="flex items-center text-gray-500 text-sm mb-4">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {locationDisplay}
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-semibold text-gray-700">Progress</span>
                      <span className="text-sm font-semibold text-green-600">{Math.round(progress)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all"
                        style={{ width: `${Math.min(progress, 100)}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between items-center mt-2 text-sm text-gray-600">
                      <span>{formatCurrency(pool.currentAmount)} raised</span>
                      <span>{formatCurrency(pool.goal)} goal</span>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between mb-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      {pool.currentContributors}/{pool.contributors} contributors
                    </div>
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {daysLeft} days left
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <div className="flex-1 bg-green-50 border border-green-200 rounded-lg px-4 py-2 text-center">
                      <p className="text-xs text-green-700 font-medium">Contribution</p>
                      <p className="text-lg font-bold text-green-800">{formatCurrency(contributionPerPerson)}</p>
                    </div>
                    <Link
                      href={`/pools/${pool.slug}`}
                      className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors text-center flex items-center justify-center"
                    >
                      Join Pool
                    </Link>
                  </div>

                  {/* Remaining Amount */}
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-center text-sm text-gray-600">
                      <span className="font-semibold text-gray-900">{formatCurrency(remaining > 0 ? remaining : 0)}</span> still needed
                    </p>
                  </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <SiteFooter />
    </div>
  );
}
