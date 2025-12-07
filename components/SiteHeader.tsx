"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const navLinks = [
  { label: "How It Works", href: "/#how-it-works" },
  { label: "All Pools", href: "/browse" },
  { label: "Features", href: "/#features" },
  { label: "Contact Us", href: "/contact" },
];

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function SiteHeader() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [mounted, setMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch {
        localStorage.removeItem("user");
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setIsMobileMenuOpen(false);
    router.push("/");
    router.refresh();
  };

  return (
    <nav className="sticky top-0 z-50 bg-green-900 border-b py-2 text-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center">
            <span className="text-4xl font-bold bg-clip-text text-transparent">
              <img src="/images/logo.png" alt="Village Market" className="w-40 h-15" />
            </span>
          </Link>
          <div className="flex items-center gap-2">
            {/* Desktop navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-gray-200 hover:text-gray-50 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              {mounted && user ? (
                <div className="flex items-center gap-4">
                  <Link
                    href="/dashboard"
                    className="text-gray-200 hover:text-white transition-colors flex items-center gap-1.5"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                    Dashboard
                  </Link>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-green-700 flex items-center justify-center text-white text-sm font-semibold">
                      {user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)}
                    </div>
                    <span className="text-sm text-gray-200">{user.name.split(" ")[0]}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="border border-red-400 text-red-300 px-4 py-2 rounded transition-colors hover:bg-red-900/50 hover:text-red-200 text-sm"
                  >
                    Log Out
                  </button>
                </div>
              ) : (
                <Link
                  href="/signin"
                  className="border border-gray-200 text-white px-6 py-2 rounded transition-colors hover:bg-green-800"
                >
                  Sign In
                </Link>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md p-2 text-gray-100 hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white md:hidden"
              aria-label="Toggle navigation menu"
              aria-expanded={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen((open) => !open)}
            >
              {isMobileMenuOpen ? (
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-green-800 pt-2 pb-3">
            <div className="space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block px-3 py-2 text-base font-medium text-gray-100 hover:bg-green-800 rounded-md"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <div className="mt-3 border-t border-green-800 pt-3">
              {mounted && user ? (
                <div className="flex flex-col gap-3 px-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-green-700 flex items-center justify-center text-white text-sm font-semibold">
                      {user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-gray-100">
                        {user.name.split(" ")[0]}
                      </span>
                      <span className="text-xs text-green-200">{user.email}</span>
                    </div>
                  </div>
                  <Link
                    href="/dashboard"
                    className="w-full text-center bg-green-700 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-green-600"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Go to Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full border border-red-400 text-red-200 px-4 py-2 rounded-md text-sm font-semibold hover:bg-red-900/50"
                  >
                    Log Out
                  </button>
                </div>
              ) : (
                <div className="px-3">
                  <Link
                    href="/signin"
                    className="block w-full text-center border border-gray-200 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-green-800"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

