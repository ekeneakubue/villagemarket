"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

const heroSlides = [
  {
    title: "Collective buying starts here",
    subtitle: "Neighborhood markets • Farming clusters • Faith groups • Youth groups",
    description: "Source food, livestock, and essentials together with verified contribution pools. Village Market handles the logistics so you stay focused on your community.",
    ctaLabel: "Browse community pools",
    ctaHref: "/browse",
    image: "/images/caroucel/slide1.png",
  },
  {
    title: "From pledges to fulfilled deliveries",
    subtitle: "Transparent milestones • Escrow protection",
    description:
      "Track every contribution, know when items are purchased, and get real-time proof of delivery. Everyone sees the same dashboard.",
    ctaLabel: "See how it works",
    ctaHref: "#how-it-works",
    image: "/images/caroucel/slide2.png",
  },
  {
    title: "Stronger prices for rural and urban buyers",
    subtitle: "Bulk sourcing • Logistics partners • Verified suppliers",
    description:
      "Bundle demand across towns, lock in wholesale rates, and split the benefits fairly. Village Market connects you to trusted vendors.",
    ctaLabel: "Start a market pool",
    ctaHref: "/browse",
    image: "/images/caroucel/slide3.png",
  },
];

export default function Home() {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  const handlePrev = () => {
    setActiveSlide((prev) => (prev === 0 ? heroSlides.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveSlide((prev) => (prev + 1) % heroSlides.length);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-white to-blue-50">
      <SiteHeader />

      {/* Hero Section */}
      <section className="relative min-h-[70vh] overflow-hidden">
        {heroSlides.map((slide, index) => (
          <div
            key={slide.title}
            className={`absolute inset-0 transition-opacity duration-700 ease-out ${
              index === activeSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `linear-gradient(120deg, rgba(0, 0, 0, 0.65), rgba(0, 0, 0, 0.35)), url(${slide.image})`,
              }}
            />
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[70vh] min-h-[520px] flex flex-col justify-center text-white">
              <p className="text-sm uppercase tracking-[0.4em] text-white/70">{slide.subtitle}</p>
              <h1 className="mt-4 text-4xl md:text-5xl lg:text-6xl font-bold leading-tight max-w-4xl">
                {slide.title}
              </h1>
              <p className="mt-6 text-lg md:text-xl text-white/90 max-w-2xl">{slide.description}</p>
              <div className="mt-10 flex flex-col sm:flex-row gap-4">
                <Link
                  href={slide.ctaHref}
                  className="inline-flex items-center justify-center rounded-full bg-white/90 px-8 py-3 text-base font-semibold text-gray-900 shadow-lg shadow-black/20 transition hover:bg-white"
                >
                  {slide.ctaLabel}
                </Link>
                <Link
                  href="/browse"
                  className="inline-flex items-center justify-center rounded-full border border-white/60 px-8 py-3 text-base font-semibold text-white/90 hover:bg-white/10"
                >
                  View all pools
                </Link>
              </div>
            </div>
          </div>
        ))}

        {/* Side Controls */}
        <button
          type="button"
          onClick={handlePrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 h-12 w-12 rounded-full bg-white/20 backdrop-blur-sm text-white flex items-center justify-center hover:bg-white/30 transition-all"
          aria-label="Previous slide"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          type="button"
          onClick={handleNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 h-12 w-12 rounded-full bg-white/20 backdrop-blur-sm text-white flex items-center justify-center hover:bg-white/30 transition-all"
          aria-label="Next slide"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Dot Indicators */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setActiveSlide(index)}
              className={`h-2 rounded-full transition-all ${
                index === activeSlide ? "w-8 bg-white" : "w-2 bg-white/50"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 bg-white">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Simple steps to start pooling resources with your community
          </p>
        </div>


        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Join a Group</h3>
            <p className="text-gray-600">Connect with others who want to buy the same items</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Pool Money</h3>
            <p className="text-gray-600">Contribute your share to reach the purchase goal</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Share & Enjoy</h3>
            <p className="text-gray-600">Receive your portion and enjoy the benefits together</p>
          </div>
        </div>        
      </section>
     

      {/* Features Section */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 bg-gradient-to-br from-green-50 to-blue-50">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Why Choose Village Market
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Built for communities, designed for trust
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl p-6 shadow-md">
            <div className="text-green-600 text-4xl mb-4">🔒</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Secure Payments</h3>
            <p className="text-gray-600">All transactions are secure and transparent. Funds are held safely until the goal is reached.</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-md">
            <div className="text-green-600 text-4xl mb-4">👥</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Community Driven</h3>
            <p className="text-gray-600">Connect with neighbors, friends, and community members who share your needs.</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-md">
            <div className="text-purple-600 text-4xl mb-4">💰</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Save Money</h3>
            <p className="text-gray-600">Buy in bulk and get wholesale prices. Split costs and save significantly.</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-md">
            <div className="text-orange-600 text-4xl mb-4">📊</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Track Progress</h3>
            <p className="text-gray-600">See real-time progress of your pool. Know exactly how much has been collected.</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-md">
            <div className="text-green-600 text-4xl mb-4">🤝</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Fair Distribution</h3>
            <p className="text-gray-600">Automated fair sharing based on contributions. Everyone gets their fair share.</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-md">
            <div className="text-green-900 text-4xl mb-4">⚡</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Easy to Use</h3>
            <p className="text-gray-600">Simple interface that anyone can use. Start or join a pool in minutes.</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-gradient-to-r from-green-800 to-green-600 rounded-3xl p-12 text-center text-white">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Ready to Start Pooling?
          </h2>
          <p className="text-xl mb-8 text-green-50 max-w-2xl mx-auto">
            Join thousands of people who are already saving money and building stronger communities together.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">            
            <Link href="/browse" className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white/10 transition-all">
              Browse Active Pools
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
