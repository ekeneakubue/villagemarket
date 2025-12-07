import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import prisma from "@/lib/prisma";

type TeamMemberCard = {
  id?: string;
  name: string;
  role: string;
  bio: string;
  avatar?: string | null;
};

// Force dynamic rendering so we always read fresh data from the database
export const revalidate = 0;

export default async function TeamPage() {
  // Fetch team members from the database
  let dbTeamMembers: TeamMemberCard[] = [];
  try {
    dbTeamMembers = await prisma.teamMember.findMany({
      orderBy: [
        { displayOrder: "asc" },
        { createdAt: "asc" },
      ],
    });
  } catch (error) {
    console.error("Failed to load team members from the database", error);
  }

  // Fallback static team if database is empty
  const fallbackTeam = [
    {
      name: "John Doe",
      role: "Founder & CEO",
      bio: "Passionate about building communities and empowering people through shared resources.",
      avatar: "👨‍💼",
    },
    {
      name: "Jane Smith",
      role: "CTO",
      bio: "Tech enthusiast focused on creating seamless user experiences and scalable solutions.",
      avatar: "👩‍💻",
    },
    {
      name: "Mike Johnson",
      role: "Head of Product",
      bio: "Dedicated to understanding user needs and delivering products that make a real difference.",
      avatar: "👨‍🎨",
    },
    {
      name: "Sarah Williams",
      role: "Head of Community",
      bio: "Building strong relationships and fostering trust within our growing community.",
      avatar: "👩‍🤝‍👩",
    },
    {
      name: "David Brown",
      role: "Lead Developer",
      bio: "Crafting robust and secure systems to power the future of collaborative consumption.",
      avatar: "👨‍🔧",
    },
    {
      name: "Emily Davis",
      role: "Head of Operations",
      bio: "Ensuring smooth operations and excellent service delivery across all touchpoints.",
      avatar: "👩‍💼",
    },
  ];

  const teamMembers = dbTeamMembers.length > 0 ? dbTeamMembers : fallbackTeam;

  return (
    <div className="min-h-screen bg-linear-to-b from-green-50 via-white to-blue-50">
      <SiteHeader />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            Village Market           
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
            We're a passionate group of individuals dedicated to building stronger communities 
            through collaborative resource sharing.
          </p>
        </div>
      </section>      

      {/* Mission Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 bg-white rounded-3xl mb-20">
        <div className="text-center max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Our Mission
          </h2>
          <p className="text-xl text-gray-600 leading-relaxed mb-8">
            At Village Market, we believe that by pooling resources together, communities can achieve more. 
            Our mission is to make collaborative consumption accessible, secure, and beneficial for everyone. 
            We're committed to building a platform that empowers people to share costs, share benefits, 
            and build stronger, more connected communities.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="bg-green-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-green-700 transition-all transform hover:scale-105 shadow-lg"
            >
              Join Our Community
            </Link>
            <Link
              href="/browse"
              className="bg-white text-green-600 px-8 py-4 rounded-full text-lg font-semibold border-2 border-green-600 hover:bg-green-50 transition-all"
            >
              Explore Pools
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

