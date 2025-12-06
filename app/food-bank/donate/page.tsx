"use client";

import { useState } from "react";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export default function DonatePage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    donationType: "monetary",
    amount: "",
    foodItems: "",
    frequency: "one-time",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsSubmitting(false);
    setSubmitSuccess(true);

    // Reset form after 3 seconds
    setTimeout(() => {
      setFormData({
        name: "",
        email: "",
        phone: "",
        donationType: "monetary",
        amount: "",
        foodItems: "",
        frequency: "one-time",
        message: "",
      });
      setSubmitSuccess(false);
    }, 3000);
  };

  const suggestedAmounts = [5000, 10000, 25000, 50000, 100000];
  const commonFoodItems = [
    "Rice",
    "Beans",
    "Garri",
    "Yam",
    "Cooking Oil",
    "Tomatoes",
    "Onions",
    "Noodles",
    "Bread",
  ];

  return (
    <div className="min-h-screen bg-linear-to-b from-green-50 via-white to-blue-50">
      <SiteHeader />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12">
        <div className="text-center">
          <div className="text-6xl mb-4">❤️🎓</div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 leading-tight">
            Make a Donation
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Your generosity helps university students focus on their education. 
            Every contribution makes a difference.
          </p>
        </div>
      </section>

      {/* Main Form Section */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
          {submitSuccess ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-6">🎉</div>
              <h2 className="text-3xl font-bold text-green-600 mb-4">
                Thank You for Your Donation!
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Your contribution will help support university students in need.
                We'll be in touch with you shortly.
              </p>
              <Link
                href="/food-bank"
                className="inline-block bg-green-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-green-700 transition-colors"
              >
                Back to Food Bank
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Your Information
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="johndoe@example.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="+234 801 234 5678"
                    />
                  </div>
                </div>
              </div>

              {/* Donation Type */}
              <div className="border-t border-gray-200 pt-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Donation Type
                </h2>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, donationType: "monetary" })}
                    className={`p-6 rounded-xl border-2 transition-all ${
                      formData.donationType === "monetary"
                        ? "border-green-600 bg-green-50 shadow-md"
                        : "border-gray-200 hover:border-green-300"
                    }`}
                  >
                    <div className="text-4xl mb-2">💵</div>
                    <div className="font-semibold text-gray-900">Monetary</div>
                    <div className="text-sm text-gray-600">Cash donation</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, donationType: "food" })}
                    className={`p-6 rounded-xl border-2 transition-all ${
                      formData.donationType === "food"
                        ? "border-green-600 bg-green-50 shadow-md"
                        : "border-gray-200 hover:border-green-300"
                    }`}
                  >
                    <div className="text-4xl mb-2">🍚</div>
                    <div className="font-semibold text-gray-900">Food Items</div>
                    <div className="text-sm text-gray-600">Physical donation</div>
                  </button>
                </div>

                {/* Monetary Donation */}
                {formData.donationType === "monetary" && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Select Amount
                      </label>
                      <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mb-4">
                        {suggestedAmounts.map((amount) => (
                          <button
                            key={amount}
                            type="button"
                            onClick={() =>
                              setFormData({ ...formData, amount: amount.toString() })
                            }
                            className={`py-3 px-2 rounded-lg border-2 font-semibold transition-all text-sm ${
                              formData.amount === amount.toString()
                                ? "border-green-600 bg-green-50 text-green-700"
                                : "border-gray-200 hover:border-green-300"
                            }`}
                          >
                            ₦{(amount / 1000).toFixed(0)}k
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label htmlFor="amount" className="block text-sm font-semibold text-gray-700 mb-2">
                        Or Enter Custom Amount (₦) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        id="amount"
                        name="amount"
                        value={formData.amount}
                        onChange={handleChange}
                        required
                        min="1000"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Enter amount"
                      />
                    </div>
                  </div>
                )}

                {/* Food Items Donation */}
                {formData.donationType === "food" && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Common Food Items
                      </label>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {commonFoodItems.map((item) => (
                          <button
                            key={item}
                            type="button"
                            onClick={() => {
                              const currentItems = formData.foodItems
                                ? formData.foodItems.split(", ")
                                : [];
                              if (currentItems.includes(item)) {
                                setFormData({
                                  ...formData,
                                  foodItems: currentItems
                                    .filter((i) => i !== item)
                                    .join(", "),
                                });
                              } else {
                                setFormData({
                                  ...formData,
                                  foodItems: [...currentItems, item].join(", "),
                                });
                              }
                            }}
                            className={`py-2 px-4 rounded-full border-2 font-medium transition-all text-sm ${
                              formData.foodItems.includes(item)
                                ? "border-green-600 bg-green-50 text-green-700"
                                : "border-gray-200 hover:border-green-300"
                            }`}
                          >
                            {item}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label htmlFor="foodItems" className="block text-sm font-semibold text-gray-700 mb-2">
                        Food Items to Donate <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        id="foodItems"
                        name="foodItems"
                        value={formData.foodItems}
                        onChange={handleChange}
                        required
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="e.g., 5 bags of rice, 10kg of beans, 20 liters of cooking oil"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Donation Frequency */}
              <div className="border-t border-gray-200 pt-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Donation Frequency
                </h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, frequency: "one-time" })}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      formData.frequency === "one-time"
                        ? "border-green-600 bg-green-50"
                        : "border-gray-200 hover:border-green-300"
                    }`}
                  >
                    <div className="font-semibold text-gray-900">One-Time</div>
                    <div className="text-sm text-gray-600">Single donation</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, frequency: "monthly" })}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      formData.frequency === "monthly"
                        ? "border-green-600 bg-green-50"
                        : "border-gray-200 hover:border-green-300"
                    }`}
                  >
                    <div className="font-semibold text-gray-900">Monthly</div>
                    <div className="text-sm text-gray-600">Recurring donation</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, frequency: "quarterly" })}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      formData.frequency === "quarterly"
                        ? "border-green-600 bg-green-50"
                        : "border-gray-200 hover:border-green-300"
                    }`}
                  >
                    <div className="font-semibold text-gray-900">Quarterly</div>
                    <div className="text-sm text-gray-600">Every 3 months</div>
                  </button>
                </div>
              </div>

              {/* Message */}
              <div className="border-t border-gray-200 pt-6">
                <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                  Message (Optional)
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Share why you want to support university students..."
                />
              </div>

              {/* Submit Button */}
              <div className="border-t border-gray-200 pt-6">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-4 rounded-full text-lg font-bold transition-all shadow-lg ${
                    isSubmitting
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700 text-white transform hover:scale-105"
                  }`}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg
                        className="animate-spin h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    "Submit Donation"
                  )}
                </button>

                <p className="text-sm text-gray-500 text-center mt-4">
                  By submitting this form, you agree to be contacted regarding your donation.
                </p>
              </div>
            </form>
          )}
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="bg-white rounded-xl p-6 shadow-md text-center">
            <div className="text-4xl mb-3">🔒</div>
            <h3 className="font-bold text-gray-900 mb-2">Secure</h3>
            <p className="text-sm text-gray-600">
              Your information is protected and secure
            </p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-md text-center">
            <div className="text-4xl mb-3">✅</div>
            <h3 className="font-bold text-gray-900 mb-2">Transparent</h3>
            <p className="text-sm text-gray-600">
              Track where your donation goes
            </p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-md text-center">
            <div className="text-4xl mb-3">📧</div>
            <h3 className="font-bold text-gray-900 mb-2">Updates</h3>
            <p className="text-sm text-gray-600">
              Receive impact reports via email
            </p>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

