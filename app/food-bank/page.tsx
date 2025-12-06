import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export default function FoodBankPage() {
  // Mock data - will be replaced with database queries later
  const recentDonors = [
    {
      id: "1",
      name: "Sarah Johnson",
      amount: 50000,
      items: "Rice, Beans, Cooking Oil",
      date: "2024-12-05",
      avatar: "👩‍💼",
    },
    {
      id: "2",
      name: "Michael Chen",
      amount: 75000,
      items: "Yam, Garri, Palm Oil",
      date: "2024-12-04",
      avatar: "👨‍💼",
    },
    {
      id: "3",
      name: "Amina Ibrahim",
      amount: 40000,
      items: "Beans, Tomatoes, Onions",
      date: "2024-12-03",
      avatar: "👩",
    },
    {
      id: "4",
      name: "David Okonkwo",
      amount: 60000,
      items: "Rice, Chicken, Vegetables",
      date: "2024-12-02",
      avatar: "👨",
    },
    {
      id: "5",
      name: "Grace Adeyemi",
      amount: 35000,
      items: "Garri, Groundnut, Sugar",
      date: "2024-12-01",
      avatar: "👩‍🦱",
    },
    {
      id: "6",
      name: "Emmanuel Nwankwo",
      amount: 90000,
      items: "Rice, Beans, Oil, Milk",
      date: "2024-11-30",
      avatar: "👨‍🦲",
    },
  ];

  const beneficiaries = [
    {
      id: "1",
      name: "Fatima Hassan",
      university: "University of Lagos (UNILAG)",
      course: "Computer Science",
      year: "300 Level",
      itemsReceived: "Rice, Beans, Oil",
      date: "2024-12-05",
      avatar: "👩‍🎓",
    },
    {
      id: "2",
      name: "Joseph Martins",
      university: "Lagos State University (LASU)",
      course: "Mechanical Engineering",
      year: "400 Level",
      itemsReceived: "Yam, Garri, Palm Oil",
      date: "2024-12-04",
      avatar: "👨‍🎓",
    },
    {
      id: "3",
      name: "Blessing Okoro",
      university: "University of Lagos (UNILAG)",
      course: "Law",
      year: "200 Level",
      itemsReceived: "Beans, Tomatoes, Noodles",
      date: "2024-12-03",
      avatar: "👩‍🎓",
    },
    {
      id: "4",
      name: "Ibrahim Musa",
      university: "Yaba College of Technology",
      course: "Business Administration",
      year: "ND2",
      itemsReceived: "Rice, Chicken, Vegetables",
      date: "2024-12-02",
      avatar: "👨‍🎓",
    },
    {
      id: "5",
      name: "Chioma Eze",
      university: "Pan-Atlantic University",
      course: "Mass Communication",
      year: "300 Level",
      itemsReceived: "Garri, Groundnut, Bread",
      date: "2024-12-01",
      avatar: "👩‍🎓",
    },
    {
      id: "6",
      name: "Yusuf Abdullahi",
      university: "Lagos State University (LASU)",
      course: "Medicine",
      year: "500 Level",
      itemsReceived: "Rice, Beans, Oil, Milk",
      date: "2024-11-30",
      avatar: "👨‍🎓",
    },
  ];

  const distributionEvents = [
    {
      id: "1",
      title: "Christmas Food Distribution for Students",
      description: "Special food package distribution for university students during the festive season",
      location: "UNILAG Campus, Akoka",
      date: "2024-12-20",
      time: "10:00 AM - 4:00 PM",
      beneficiaries: 150,
      status: "upcoming",
      image: "🎄",
    },
    {
      id: "2",
      title: "Weekly Student Food Bank Drive",
      description: "Regular weekly distribution of essential food items to registered university students",
      location: "LASU Campus, Ojo",
      date: "2024-12-14",
      time: "9:00 AM - 2:00 PM",
      beneficiaries: 80,
      status: "upcoming",
      image: "🍲",
    },
    {
      id: "3",
      title: "Exam Period Food Support",
      description: "Distributed food supplies and study snacks to students during final exams",
      location: "Yaba College of Technology",
      date: "2024-12-01",
      time: "8:00 AM - 5:00 PM",
      beneficiaries: 200,
      status: "completed",
      image: "📚",
    },
    {
      id: "4",
      title: "New Semester Welcome Package",
      description: "Food packages for students returning to campus for a new academic session",
      location: "Pan-Atlantic University, Ibeju-Lekki",
      date: "2024-11-25",
      time: "10:00 AM - 3:00 PM",
      beneficiaries: 120,
      status: "completed",
      image: "🎒",
    },
  ];

  const stats = {
    totalDonors: 247,
    totalBeneficiaries: 523,
    foodDistributed: "12,450 kg",
    activeEvents: 5,
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-green-50 via-white to-blue-50">
      <SiteHeader />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center">
          <div className="text-7xl mb-6">🎓🍚</div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            Village Market
            <br />
            <span className="bg-linear-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Student Food Bank
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Supporting university students with essential food supplies. Helping students
            focus on their education without worrying about their next meal.
          </p>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-8">
            <div className="bg-white rounded-xl p-6 shadow-md">
              <div className="text-3xl md:text-4xl font-bold text-green-600 mb-2">
                {stats.totalDonors}
              </div>
              <div className="text-gray-600 text-sm md:text-base">Total Donors</div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-md">
              <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">
                {stats.totalBeneficiaries}
              </div>
              <div className="text-gray-600 text-sm md:text-base">Students Helped</div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-md">
              <div className="text-3xl md:text-4xl font-bold text-orange-600 mb-2">
                {stats.foodDistributed}
              </div>
              <div className="text-gray-600 text-sm md:text-base">Food Distributed</div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-md">
              <div className="text-3xl md:text-4xl font-bold text-purple-600 mb-2">
                {stats.activeEvents}
              </div>
              <div className="text-gray-600 text-sm md:text-base">Active Events</div>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Donors Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Recent Donors
          </h2>
          <p className="text-xl text-gray-600">
            Thank you to our generous donors who make a difference
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentDonors.map((donor) => (
            <div
              key={donor.id}
              className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-linear-to-br from-green-100 to-blue-100 rounded-full flex items-center justify-center text-3xl flex-shrink-0">
                  {donor.avatar}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {donor.name}
                  </h3>
                  <p className="text-2xl font-bold text-green-600 mb-2">
                    {formatCurrency(donor.amount)}
                  </p>
                  <p className="text-sm text-gray-600 mb-2">{donor.items}</p>
                  <p className="text-xs text-gray-500">{formatDate(donor.date)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-10">
          <Link
            href="/food-bank/donate"
            className="inline-block bg-green-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-green-700 transition-all transform hover:scale-105 shadow-lg"
          >
            Become a Donor
          </Link>
        </div>
      </section>

      {/* Beneficiaries Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-white rounded-3xl my-10">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Student Beneficiaries
          </h2>
          <p className="text-xl text-gray-600">
            University students we've supported through our food bank program
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {beneficiaries.map((beneficiary) => (
            <div
              key={beneficiary.id}
              className="bg-gray-50 rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-linear-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center text-3xl flex-shrink-0">
                  {beneficiary.avatar}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {beneficiary.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-1">
                    🎓 {beneficiary.year}
                  </p>
                  <p className="text-sm text-gray-600 mb-1">
                    📚 {beneficiary.course}
                  </p>
                  <p className="text-sm text-gray-600 mb-2">
                    🏫 {beneficiary.university}
                  </p>
                  <p className="text-sm text-blue-600 font-medium mb-1">
                    {beneficiary.itemsReceived}
                  </p>
                  <p className="text-xs text-gray-500">{formatDate(beneficiary.date)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Food Distribution Events */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Food Distribution Events
          </h2>
          <p className="text-xl text-gray-600">
            Join us in our upcoming events or see the impact we've made
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {distributionEvents.map((event) => (
            <div
              key={event.id}
              className={`rounded-2xl p-8 shadow-xl border-2 ${
                event.status === "upcoming"
                  ? "bg-linear-to-br from-green-50 to-blue-50 border-green-200"
                  : "bg-gray-50 border-gray-200"
              }`}
            >
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <h3 className="text-2xl font-bold text-gray-900">
                    {event.title}
                  </h3>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      event.status === "upcoming"
                        ? "bg-green-600 text-white"
                        : "bg-gray-400 text-white"
                    }`}
                  >
                    {event.status === "upcoming" ? "Upcoming" : "Completed"}
                  </span>
                </div>
                <p className="text-gray-600 mb-4">{event.description}</p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">📍</span>
                    <span className="text-gray-700 font-medium">{event.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">📅</span>
                    <span className="text-gray-700 font-medium">
                      {formatDate(event.date)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">⏰</span>
                    <span className="text-gray-700 font-medium">{event.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">👥</span>
                    <span className="text-gray-700 font-medium">
                      {event.beneficiaries} beneficiaries
                    </span>
                  </div>
                </div>
                {event.status === "upcoming" && (
                  <button className="mt-6 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors w-full">
                    Register to Attend
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-linear-to-r from-green-600 to-blue-600 rounded-3xl p-12 text-center text-white shadow-2xl">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Make a Difference Today
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Your contribution can help feed university students in need. Join our community of donors
            and help students achieve their academic dreams.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/food-bank/donate"
              className="bg-white text-green-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg"
            >
              Donate Now
            </Link>
            <Link
              href="/contact"
              className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white hover:text-green-600 transition-all"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

