"use client";
// Admin Dashboard - Fully Responsive for All Devices

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";

// Type for User from database
interface User {
  id: string;
  avatar: string | null;
  name: string;
  email: string;
  phone: string | null;
  role: "ADMIN" | "CONTRIBUTOR";
  status: "ACTIVE" | "SUSPENDED" | "INACTIVE";
  totalContributed: number;
  createdAt: string;
}

// Type for Team Member
interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  avatar: string | null;
  displayOrder: number;
  createdAt: string;
}

// Type for Creator from database
interface Creator {
  id: string;
  avatar: string | null;
  name: string;
  email: string;
  phone: string;
  organization: string | null;
  address: string | null;
  idType: "NIN" | "VOTERS_CARD" | "DRIVERS_LICENSE" | "PASSPORT";
  idNumber: string;
  status: "PENDING" | "VERIFIED" | "SUSPENDED";
  poolsCreated: number;
  totalRaised: number;
  createdAt: string;
}

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

// Mock data - in a real app, this would come from an API
const stats = {
  totalPools: 48,
  activePools: 32,
  completedPools: 16,
  totalUsers: 1247,
  totalTransactions: 3421,
  totalAmount: 125000000,
  pendingApprovals: 5,
};

const recentPools = [
  {
    id: 1,
    title: "Bulk Rice Purchase",
    category: "Food Stuffs",
    creator: "John Doe",
    goal: 500000,
    current: 325000,
    contributors: 15,
    status: "active",
    createdAt: "2024-01-15",
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=200&q=80",
  },
  {
    id: 2,
    title: "Community Cow Purchase",
    category: "Livestock",
    creator: "Jane Smith",
    goal: 800000,
    current: 800000,
    contributors: 10,
    status: "completed",
    createdAt: "2024-01-10",
    image: "https://images.unsplash.com/photo-1527153857715-3908f2bae5e8?auto=format&fit=crop&w=200&q=80",
  },
  {
    id: 3,
    title: "Cooking Oil Bulk Buy",
    category: "Food Stuffs",
    creator: "Mike Johnson",
    goal: 300000,
    current: 180000,
    contributors: 12,
    status: "active",
    createdAt: "2024-01-18",
    image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=200&q=80",
  },
  {
    id: 4,
    title: "Goat Farming Pool",
    category: "Livestock",
    creator: "Sarah Williams",
    goal: 600000,
    current: 450000,
    contributors: 8,
    status: "active",
    createdAt: "2024-01-20",
    image: "https://images.unsplash.com/photo-1524024973431-2ad916746881?auto=format&fit=crop&w=200&q=80",
  },
];

const recentUsers = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    role: "Admin",
    poolsCreated: 3,
    poolsJoined: 8,
    totalContributed: 150000,
    joinedAt: "2024-01-01",
    status: "active",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    role: "Contributor",
    poolsCreated: 5,
    poolsJoined: 12,
    totalContributed: 320000,
    joinedAt: "2023-12-15",
    status: "active",
  },
  {
    id: 3,
    name: "Mike Johnson",
    email: "mike@example.com",
    role: "Contributor",
    poolsCreated: 2,
    poolsJoined: 6,
    totalContributed: 95000,
    joinedAt: "2024-01-10",
    status: "active",
  },
  {
    id: 4,
    name: "Sarah Williams",
    email: "sarah@example.com",
    role: "Contributor",
    poolsCreated: 4,
    poolsJoined: 10,
    totalContributed: 280000,
    joinedAt: "2023-11-20",
    status: "suspended",
  },
  {
    id: 5,
    name: "David Brown",
    email: "david@example.com",
    role: "Contributor",
    poolsCreated: 0,
    poolsJoined: 15,
    totalContributed: 450000,
    joinedAt: "2023-10-05",
    status: "active",
  },
  {
    id: 6,
    name: "Admin User",
    email: "admin@villagemarket.ng",
    role: "Admin",
    poolsCreated: 0,
    poolsJoined: 0,
    totalContributed: 0,
    joinedAt: "2023-01-01",
    status: "active",
  },
];

const recentTransactions = [
  {
    id: 1,
    poolTitle: "Bulk Rice Purchase",
    user: "John Doe",
    amount: 25000,
    type: "contribution",
    status: "completed",
    date: "2024-01-22 10:30 AM",
  },
  {
    id: 2,
    poolTitle: "Community Cow Purchase",
    user: "Jane Smith",
    amount: 80000,
    type: "contribution",
    status: "completed",
    date: "2024-01-21 2:15 PM",
  },
  {
    id: 3,
    poolTitle: "Cooking Oil Bulk Buy",
    user: "Mike Johnson",
    amount: 15000,
    type: "contribution",
    status: "pending",
    date: "2024-01-22 9:00 AM",
  },
  {
    id: 4,
    poolTitle: "Goat Farming Pool",
    user: "Sarah Williams",
    amount: 75000,
    type: "contribution",
    status: "completed",
    date: "2024-01-20 4:45 PM",
  },
  {
    id: 5,
    poolTitle: "Bulk Rice Purchase",
    user: "David Brown",
    amount: 30000,
    type: "contribution",
    status: "completed",
    date: "2024-01-19 11:20 AM",
  },
];

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function getStatusBadge(status: string) {
  const styles = {
    active: "bg-green-100 text-green-700 border-green-200",
    completed: "bg-blue-100 text-blue-700 border-blue-200",
    pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
    suspended: "bg-red-100 text-red-700 border-red-200",
  };
  return styles[status as keyof typeof styles] || styles.pending;
}

// Local Government Areas by State
const lgaByState: Record<string, string[]> = {
  "Abia": ["Aba North", "Aba South", "Arochukwu", "Bende", "Ikwuano", "Isiala Ngwa North", "Isiala Ngwa South", "Isuikwuato", "Obi Ngwa", "Ohafia", "Osisioma", "Ugwunagbo", "Ukwa East", "Ukwa West", "Umuahia North", "Umuahia South", "Umu Nneochi"],
  "Adamawa": ["Demsa", "Fufure", "Ganye", "Gayuk", "Gombi", "Grie", "Hong", "Jada", "Larmurde", "Madagali", "Maiha", "Mayo Belwa", "Michika", "Mubi North", "Mubi South", "Numan", "Shelleng", "Song", "Toungo", "Yola North", "Yola South"],
  "Akwa Ibom": ["Abak", "Eastern Obolo", "Eket", "Esit Eket", "Essien Udim", "Etim Ekpo", "Etinan", "Ibeno", "Ibesikpo Asutan", "Ibiono-Ibom", "Ika", "Ikono", "Ikot Abasi", "Ikot Ekpene", "Ini", "Itu", "Mbo", "Mkpat-Enin", "Nsit-Atai", "Nsit-Ibom", "Nsit-Ubium", "Obot Akara", "Okobo", "Onna", "Oron", "Oruk Anam", "Udung-Uko", "Ukanafun", "Uruan", "Urue-Offong/Oruko", "Uyo"],
  "Anambra": ["Aguata", "Anambra East", "Anambra West", "Anaocha", "Awka North", "Awka South", "Ayamelum", "Dunukofia", "Ekwusigo", "Idemili North", "Idemili South", "Ihiala", "Njikoka", "Nnewi North", "Nnewi South", "Ogbaru", "Onitsha North", "Onitsha South", "Orumba North", "Orumba South", "Oyi"],
  "Bauchi": ["Alkaleri", "Bauchi", "Bogoro", "Damban", "Darazo", "Dass", "Gamawa", "Ganjuwa", "Giade", "Itas/Gadau", "Jama'are", "Katagum", "Kirfi", "Misau", "Ningi", "Shira", "Tafawa Balewa", "Toro", "Warji", "Zaki"],
  "Bayelsa": ["Brass", "Ekeremor", "Kolokuma/Opokuma", "Nembe", "Ogbia", "Sagbama", "Southern Ijaw", "Yenagoa"],
  "Benue": ["Ado", "Agatu", "Apa", "Buruku", "Gboko", "Guma", "Gwer East", "Gwer West", "Katsina-Ala", "Konshisha", "Kwande", "Logo", "Makurdi", "Obi", "Ogbadibo", "Ohimini", "Oju", "Okpokwu", "Otukpo", "Tarka", "Ukum", "Ushongo", "Vandeikya"],
  "Borno": ["Abadam", "Askira/Uba", "Bama", "Bayo", "Biu", "Chibok", "Damboa", "Dikwa", "Gubio", "Guzamala", "Gwoza", "Hawul", "Jere", "Kaga", "Kala/Balge", "Konduga", "Kukawa", "Kwaya Kusar", "Mafa", "Magumeri", "Maiduguri", "Marte", "Mobbar", "Monguno", "Ngala", "Nganzai", "Shani"],
  "Cross River": ["Abi", "Akpabuyo", "Akwa", "Bakassi", "Bekwarra", "Biase", "Boki", "Calabar Municipal", "Calabar South", "Etung", "Ikom", "Obanliku", "Obubra", "Obudu", "Odukpani", "Ogoja", "Yakuur", "Yala"],
  "Delta": ["Aniocha North", "Aniocha South", "Bomadi", "Burutu", "Ethiope East", "Ethiope West", "Ika North East", "Ika South", "Isoko North", "Isoko South", "Ndokwa East", "Ndokwa West", "Okpe", "Oshimili North", "Oshimili South", "Patani", "Sapele", "Udu", "Ughelli North", "Ughelli South", "Ukwuani", "Uvwie", "Warri North", "Warri South", "Warri South West"],
  "Ebonyi": ["Abakaliki", "Afikpo North", "Afikpo South", "Ebonyi", "Ezza North", "Ezza South", "Ikwo", "Ishielu", "Ivo", "Izzi", "Ohaozara", "Ohaukwu", "Onicha"],
  "Edo": ["Akoko-Edo", "Egor", "Esan Central", "Esan North-East", "Esan South-East", "Esan West", "Etsako Central", "Etsako East", "Etsako West", "Igueben", "Ikpoba Okha", "Orhionmwon", "Oredo", "Ovia North-East", "Ovia South-West", "Owan East", "Owan West", "Uhunmwonde"],
  "Ekiti": ["Ado Ekiti", "Efon", "Ekiti East", "Ekiti South-West", "Ekiti West", "Emure", "Gbonyin", "Ido Osi", "Ijero", "Ikere", "Ikole", "Ilejemeje", "Irepodun/Ifelodun", "Ise/Orun", "Moba", "Oye"],
  "Enugu": ["Aninri", "Awgu", "Enugu East", "Enugu North", "Enugu South", "Ezeagu", "Igbo Etiti", "Igbo Eze North", "Igbo Eze South", "Isi Uzo", "Nkanu East", "Nkanu West", "Nsukka", "Oji River", "Udenu", "Udi", "Uzo Uwani"],
  "FCT": ["Abaji", "Bwari", "Gwagwalada", "Kuje", "Municipal Area Council", "Kwali"],
  "Gombe": ["Akko", "Balanga", "Billiri", "Dukku", "Funakaye", "Gombe", "Kaltungo", "Kwami", "Nafada", "Shongom", "Yamaltu/Deba"],
  "Imo": ["Aboh Mbaise", "Ahiazu Mbaise", "Ehime Mbano", "Ezinihitte", "Ideato North", "Ideato South", "Ihitte/Uboma", "Ikeduru", "Isiala Mbano", "Isu", "Mbaitoli", "Ngor Okpala", "Njaba", "Nkwerre", "Nwangele", "Obowo", "Oguta", "Ohaji/Egbema", "Okigwe", "Orlu", "Orsu", "Oru East", "Oru West", "Owerri Municipal", "Owerri North", "Owerri West", "Unuimo"],
  "Jigawa": ["Auyo", "Babura", "Biriniwa", "Birnin Kudu", "Buji", "Dutse", "Gagarawa", "Garki", "Gumel", "Guri", "Gwaram", "Gwiwa", "Hadejia", "Jahun", "Kafin Hausa", "Kazaure", "Kiri Kasama", "Kiyawa", "Kaugama", "Maigatari", "Malam Madori", "Miga", "Ringim", "Roni", "Sule Tankarkar", "Taura", "Yankwashi"],
  "Kaduna": ["Birnin Gwari", "Chikun", "Giwa", "Igabi", "Ikara", "Jaba", "Jema'a", "Kachia", "Kaduna North", "Kaduna South", "Kagarko", "Kajuru", "Kaura", "Kauru", "Kubau", "Kudan", "Lere", "Makarfi", "Sabon Gari", "Sanga", "Soba", "Zangon Kataf", "Zaria"],
  "Kano": ["Ajingi", "Albasu", "Bagwai", "Bebeji", "Bichi", "Bunkure", "Dala", "Dambatta", "Dawakin Kudu", "Dawakin Tofa", "Doguwa", "Fagge", "Gabasawa", "Garko", "Garun Mallam", "Gaya", "Gezawa", "Gwale", "Gwarzo", "Kabo", "Kano Municipal", "Karaye", "Kibiya", "Kiru", "Kumbotso", "Kunchi", "Kura", "Madobi", "Makoda", "Minjibir", "Nasarawa", "Rano", "Rimin Gado", "Rogo", "Shanono", "Sumaila", "Takai", "Tarauni", "Tofa", "Tsanyawa", "Tudun Wada", "Ungogo", "Warawa", "Wudil"],
  "Katsina": ["Bakori", "Batagarawa", "Batsari", "Baure", "Bindawa", "Charanchi", "Dandume", "Danja", "Dan Musa", "Daura", "Dutsi", "Dutsin Ma", "Faskari", "Funtua", "Ingawa", "Jibia", "Kafur", "Kaita", "Kankara", "Kankia", "Katsina", "Kurfi", "Kusada", "Mai'Adua", "Malumfashi", "Mani", "Mashi", "Matazu", "Musawa", "Rimi", "Sabuwa", "Safana", "Sandamu", "Zango"],
  "Kebbi": ["Aleiro", "Arewa Dandi", "Argungu", "Augie", "Bagudo", "Bunza", "Dandi", "Fakai", "Gwandu", "Jega", "Kalgo", "Koko/Besse", "Maiyama", "Ngaski", "Sakaba", "Shanga", "Suru", "Wasagu/Danko", "Yauri", "Zuru"],
  "Kogi": ["Adavi", "Ajaokuta", "Ankpa", "Bassa", "Dekina", "Ibaji", "Idah", "Igalamela Odolu", "Ijumu", "Kabba/Bunu", "Kogi", "Lokoja", "Mopa Muro", "Ofu", "Ogori/Magongo", "Okehi", "Okene", "Olamaboro", "Omala", "Yagba East", "Yagba West"],
  "Kwara": ["Asa", "Baruten", "Edu", "Ekiti", "Ifelodun", "Ilorin East", "Ilorin South", "Ilorin West", "Irepodun", "Isin", "Kaiama", "Moro", "Offa", "Oke Ero", "Oyun", "Pategi"],
  "Lagos": ["Agege", "Ajeromi-Ifelodun", "Alimosho", "Amuwo-Odofin", "Apapa", "Badagry", "Epe", "Eti Osa", "Ibeju-Lekki", "Ifako-Ijaiye", "Ikeja", "Ikorodu", "Kosofe", "Lagos Island", "Lagos Mainland", "Mushin", "Ojo", "Oshodi-Isolo", "Shomolu", "Surulere"],
  "Nasarawa": ["Akwanga", "Awe", "Doma", "Karu", "Keana", "Keffi", "Kokona", "Lafia", "Nasarawa", "Nasarawa Egon", "Obi", "Toto", "Wamba"],
  "Niger": ["Agaie", "Agwara", "Bida", "Borgu", "Bosso", "Chanchaga", "Edati", "Gbako", "Gurara", "Katcha", "Kontagora", "Lapai", "Lavun", "Magama", "Mariga", "Mashegu", "Mokwa", "Moya", "Paikoro", "Rafi", "Rijau", "Shiroro", "Suleja", "Tafa", "Wushishi"],
  "Ogun": ["Abeokuta North", "Abeokuta South", "Ado-Odo/Ota", "Egbado North", "Egbado South", "Ewekoro", "Ifo", "Ijebu East", "Ijebu North", "Ijebu North East", "Ijebu Ode", "Ikenne", "Imeko Afon", "Ipokia", "Obafemi Owode", "Odeda", "Odogbolu", "Ogun Waterside", "Remo North", "Shagamu", "Yewa North", "Yewa South"],
  "Ondo": ["Akoko North-East", "Akoko North-West", "Akoko South-West", "Akoko South-East", "Akure North", "Akure South", "Ese Odo", "Idanre", "Ifedore", "Ilaje", "Ile Oluji/Okeigbo", "Irele", "Odigbo", "Okitipupa", "Ondo East", "Ondo West", "Ose", "Owo"],
  "Osun": ["Atakunmosa East", "Atakunmosa West", "Aiyedaade", "Aiyedire", "Boluwaduro", "Boripe", "Ede North", "Ede South", "Ife Central", "Ife East", "Ife North", "Ife South", "Egbedore", "Ejigbo", "Ifedayo", "Ifelodun", "Ila", "Ilesa East", "Ilesa West", "Irepodun", "Irewole", "Isokan", "Iwo", "Obokun", "Odo Otin", "Ola Oluwa", "Olorunda", "Oriade", "Orolu", "Osogbo"],
  "Oyo": ["Afijio", "Akinyele", "Atiba", "Atisbo", "Egbeda", "Ibadan North", "Ibadan North-East", "Ibadan North-West", "Ibadan South-East", "Ibadan South-West", "Ibarapa Central", "Ibarapa East", "Ibarapa North", "Ido", "Irepo", "Iseyin", "Itesiwaju", "Iwajowa", "Kajola", "Lagelu", "Ogbomoso North", "Ogbomoso South", "Ogo Oluwa", "Olorunsogo", "Oluyole", "Ona Ara", "Orelope", "Ori Ire", "Oyo", "Oyo East", "Saki East", "Saki West", "Surulere"],
  "Plateau": ["Bokkos", "Barkin Ladi", "Bassa", "Jos East", "Jos North", "Jos South", "Kanam", "Kanke", "Langtang North", "Langtang South", "Mangu", "Mikang", "Pankshin", "Qua'an Pan", "Riyom", "Shendam", "Wase"],
  "Rivers": ["Abua/Odual", "Ahoada East", "Ahoada West", "Akuku-Toru", "Andoni", "Asari-Toru", "Bonny", "Degema", "Eleme", "Emuoha", "Etche", "Gokana", "Ikwerre", "Khana", "Obio/Akpor", "Ogba/Egbema/Ndoni", "Ogu/Bolo", "Okrika", "Omuma", "Opobo/Nkoro", "Oyigbo", "Port Harcourt", "Tai"],
  "Sokoto": ["Binji", "Bodinga", "Dange Shuni", "Gada", "Goronyo", "Gudu", "Gwadabawa", "Illela", "Isa", "Kebbe", "Kware", "Rabah", "Sabon Birni", "Shagari", "Silame", "Sokoto North", "Sokoto South", "Tambuwal", "Tangaza", "Tureta", "Wamako", "Wurno", "Yabo"],
  "Taraba": ["Ardo Kola", "Bali", "Donga", "Gashaka", "Gassol", "Ibi", "Jalingo", "Karim Lamido", "Kumi", "Lau", "Sardauna", "Takum", "Ussa", "Wukari", "Yorro", "Zing"],
  "Yobe": ["Bade", "Bursari", "Damaturu", "Fika", "Fune", "Geidam", "Gujba", "Gulani", "Jakusko", "Karasuwa", "Machina", "Nangere", "Nguru", "Potiskum", "Tarmuwa", "Yunusari", "Yusufari"],
  "Zamfara": ["Anka", "Bakura", "Birnin Magaji/Kiyaw", "Bukkuyum", "Bungudu", "Gummi", "Kaura Namoda", "Maradun", "Maru", "Shinkafi", "Talata Mafara", "Chafe", "Zurmi"]
};

type TabType = "overview" | "pools" | "users" | "creators" | "teams" | "transactions";

function AdminDashboardContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // Get initial tab from URL or default to "overview"
  const tabFromUrl = searchParams.get("tab") as TabType | null;
  const validTabs: TabType[] = ["overview", "pools", "users", "creators", "teams", "transactions"];
  const initialTab = tabFromUrl && validTabs.includes(tabFromUrl) ? tabFromUrl : "overview";
  
  const [activeTab, setActiveTab] = useState<TabType>(initialTab);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCreatorModalOpen, setIsCreatorModalOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedPool, setSelectedPool] = useState<Pool | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedCreator, setSelectedCreator] = useState<Creator | null>(null);
  const [selectedTeamMember, setSelectedTeamMember] = useState<TeamMember | null>(null);
  const [isUserViewModalOpen, setIsUserViewModalOpen] = useState(false);
  const [isUserEditModalOpen, setIsUserEditModalOpen] = useState(false);
  const [isUserDeleteModalOpen, setIsUserDeleteModalOpen] = useState(false);
  const [isCreatorViewModalOpen, setIsCreatorViewModalOpen] = useState(false);
  const [isCreatorDeleteModalOpen, setIsCreatorDeleteModalOpen] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [pools, setPools] = useState<Pool[]>([]);
  const [poolsLoading, setPoolsLoading] = useState(true);
  const [creators, setCreators] = useState<Creator[]>([]);
  const [creatorsLoading, setCreatorsLoading] = useState(true);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [teamLoading, setTeamLoading] = useState(true);
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [isTeamEditModalOpen, setIsTeamEditModalOpen] = useState(false);
  const [isTeamDeleteModalOpen, setIsTeamDeleteModalOpen] = useState(false);

  // Update URL when tab changes
  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    router.push(`/admin?tab=${tab}`, { scroll: false });
    setIsSidebarOpen(false); // Close sidebar on mobile after selection
  };

  // Fetch users from API
  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await fetch("/api/users");
        if (response.ok) {
          const data = await response.json();
          setUsers(data);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setUsersLoading(false);
      }
    }
    fetchUsers();
  }, []);

  // Fetch pools from API
  useEffect(() => {
    async function fetchPools() {
      try {
        const response = await fetch("/api/pools");
        if (response.ok) {
          const data = await response.json();
          setPools(data);
        }
      } catch (error) {
        console.error("Error fetching pools:", error);
      } finally {
        setPoolsLoading(false);
      }
    }
    fetchPools();
  }, []);

  // Fetch creators from API
  useEffect(() => {
    async function fetchCreators() {
      try {
        const response = await fetch("/api/creators");
        if (response.ok) {
          const data = await response.json();
          setCreators(data);
        }
      } catch (error) {
        console.error("Error fetching creators:", error);
      } finally {
        setCreatorsLoading(false);
      }
    }
    fetchCreators();
  }, []);

  // Fetch team members from API
  useEffect(() => {
    async function fetchTeamMembers() {
      try {
        const response = await fetch("/api/team-members");
        if (response.ok) {
          const data = await response.json();
          setTeamMembers(data);
        }
      } catch (error) {
        console.error("Error fetching team members:", error);
      } finally {
        setTeamLoading(false);
      }
    }
    fetchTeamMembers();
  }, []);

  const [formData, setFormData] = useState({
    image: "",
    title: "",
    description: "",
    category: "Food Stuffs",
    goal: "",
    contributors: "",
    location: "",
    localGovernment: "",
    town: "",
    street: "",
    deadline: "",
  });
  const [creatorFormData, setCreatorFormData] = useState({
    avatar: "",
    name: "",
    email: "",
    phone: "",
    organization: "",
    address: "",
    idType: "NIN",
    idNumber: "",
    password: "",
  });

  const [teamFormData, setTeamFormData] = useState({
    name: "",
    role: "",
    bio: "",
    avatar: "",
    displayOrder: "",
  });

  const [editTeamFormData, setEditTeamFormData] = useState({
    id: "",
    name: "",
    role: "",
    bio: "",
    avatar: "",
    displayOrder: "",
  });
  const [showCreatorSuccess, setShowCreatorSuccess] = useState(false);
  const [newCreatorName, setNewCreatorName] = useState("");
  const [toast, setToast] = useState<{
    show: boolean;
    type: "success" | "error";
    title: string;
    message: string;
  }>({ show: false, type: "success", title: "", message: "" });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  // Check authentication and authorization
  useEffect(() => {
    const userData = localStorage.getItem("user");
    
    if (!userData) {
      router.push("/signin?redirect=/admin");
      return;
    }

    try {
      const user = JSON.parse(userData);
      
      if (user.role !== "ADMIN") {
        router.push("/dashboard"); // Redirect non-admin users to their dashboard
        return;
      }

      setCurrentUser(user);
      setIsAuthorized(true);
    } catch (error) {
      console.error("Error parsing user data:", error);
      localStorage.removeItem("user");
      router.push("/signin?redirect=/admin");
    } finally {
      setAuthLoading(false);
    }
  }, [router]);

  const showToast = (type: "success" | "error", title: string, message: string) => {
    setToast({ show: true, type, title, message });
    setTimeout(() => setToast((prev) => ({ ...prev, show: false })), 4000);
  };

  const [userFormData, setUserFormData] = useState({
    avatar: "",
    name: "",
    email: "",
    phone: "",
    role: "Contributor",
    password: "",
  });

  const [editUserFormData, setEditUserFormData] = useState({
    id: "",
    avatar: "",
    name: "",
    email: "",
    phone: "",
    role: "Contributor",
    status: "ACTIVE",
    password: "",
  });

  // User action handlers
  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setIsUserViewModalOpen(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setEditUserFormData({
      id: user.id,
      avatar: user.avatar || "",
      name: user.name,
      email: user.email,
      phone: user.phone || "",
      role: user.role === "ADMIN" ? "Admin" : "Contributor",
      status: user.status,
      password: "",
    });
    setIsUserEditModalOpen(true);
  };

  const handleDeleteUser = (user: User) => {
    setSelectedUser(user);
    setIsUserDeleteModalOpen(true);
  };

  const handleUpdateUser = async () => {
    try {
      const updateData: Record<string, string | null> = {
        avatar: editUserFormData.avatar || null,
        name: editUserFormData.name,
        email: editUserFormData.email,
        phone: editUserFormData.phone || null,
        role: editUserFormData.role === "Admin" ? "ADMIN" : "CONTRIBUTOR",
        status: editUserFormData.status,
      };
      
      // Only include password if it was provided
      if (editUserFormData.password) {
        updateData.password = editUserFormData.password;
      }
      
      const response = await fetch(`/api/users/${editUserFormData.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setUsers((prev) =>
          prev.map((u) => (u.id === updatedUser.id ? updatedUser : u))
        );
        setIsUserEditModalOpen(false);
        showToast("success", "User Updated!", `${editUserFormData.name} has been updated.`);
      } else {
        const error = await response.json();
        showToast("error", "Error", error.error || "Failed to update user");
      }
    } catch (error) {
      console.error("Error updating user:", error);
      showToast("error", "Error", "Failed to update user");
    }
  };

  const handleConfirmDeleteUser = async () => {
    if (!selectedUser) return;
    try {
      const response = await fetch(`/api/users/${selectedUser.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setUsers((prev) => prev.filter((u) => u.id !== selectedUser.id));
        setIsUserDeleteModalOpen(false);
        showToast("success", "User Deleted!", `${selectedUser.name} has been removed.`);
      } else {
        const error = await response.json();
        showToast("error", "Error", error.error || "Failed to delete user");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      showToast("error", "Error", "Failed to delete user");
    }
  };

  // Team action handlers
  const handleEditTeamMember = (member: TeamMember) => {
    setSelectedTeamMember(member);
    setEditTeamFormData({
      id: member.id,
      name: member.name,
      role: member.role,
      bio: member.bio,
      avatar: member.avatar || "",
      displayOrder: member.displayOrder != null ? String(member.displayOrder) : "",
    });
    setIsTeamEditModalOpen(true);
  };

  const handleDeleteTeamMember = (member: TeamMember) => {
    setSelectedTeamMember(member);
    setIsTeamDeleteModalOpen(true);
  };

  const handleCreateTeamMember = async () => {
    try {
      const response = await fetch("/api/team-members", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: teamFormData.name,
          role: teamFormData.role,
          bio: teamFormData.bio,
          avatar: teamFormData.avatar || null,
          displayOrder: teamFormData.displayOrder ? Number(teamFormData.displayOrder) : 0,
        }),
      });

      if (response.ok) {
        const newMember = await response.json();
        setTeamMembers((prev) => [newMember, ...prev]);
        setIsTeamModalOpen(false);
        setTeamFormData({
          name: "",
          role: "",
          bio: "",
          avatar: "",
          displayOrder: "",
        });
        showToast("success", "Team Member Added", `${newMember.name} has been added to the team.`);
      } else {
        const error = await response.json();
        showToast("error", "Error", error.error || "Failed to add team member");
      }
    } catch (error) {
      console.error("Error creating team member:", error);
      showToast("error", "Error", "Failed to add team member");
    }
  };

  const handleUpdateTeamMember = async () => {
    try {
      const response = await fetch(`/api/team-members/${editTeamFormData.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editTeamFormData.name,
          role: editTeamFormData.role,
          bio: editTeamFormData.bio,
          avatar: editTeamFormData.avatar || null,
          displayOrder: editTeamFormData.displayOrder ? Number(editTeamFormData.displayOrder) : 0,
        }),
      });

      if (response.ok) {
        const updatedMember = await response.json();
        setTeamMembers((prev) =>
          prev.map((m) => (m.id === updatedMember.id ? updatedMember : m))
        );
        setIsTeamEditModalOpen(false);
        showToast("success", "Team Member Updated", `${updatedMember.name} has been updated.`);
      } else {
        const error = await response.json();
        showToast("error", "Error", error.error || "Failed to update team member");
      }
    } catch (error) {
      console.error("Error updating team member:", error);
      showToast("error", "Error", "Failed to update team member");
    }
  };

  const handleConfirmDeleteTeamMember = async () => {
    if (!selectedTeamMember) return;
    try {
      const response = await fetch(`/api/team-members/${selectedTeamMember.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setTeamMembers((prev) => prev.filter((m) => m.id !== selectedTeamMember.id));
        setIsTeamDeleteModalOpen(false);
        showToast("success", "Team Member Deleted", `${selectedTeamMember.name} has been removed.`);
      } else {
        const error = await response.json();
        showToast("error", "Error", error.error || "Failed to delete team member");
      }
    } catch (error) {
      console.error("Error deleting team member:", error);
      showToast("error", "Error", "Failed to delete team member");
    }
  };

  // Creator action handlers
  const handleViewCreator = (creator: Creator) => {
    setSelectedCreator(creator);
    setIsCreatorViewModalOpen(true);
  };

  const handleVerifyCreator = async (creator: Creator) => {
    try {
      const response = await fetch(`/api/creators/${creator.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "VERIFIED" }),
      });

      if (response.ok) {
        const updatedCreator = await response.json();
        setCreators((prev) =>
          prev.map((c) => (c.id === updatedCreator.id ? updatedCreator : c))
        );
        showToast("success", "Creator Verified!", `${creator.name} has been verified.`);
      } else {
        const error = await response.json();
        showToast("error", "Error", error.error || "Failed to verify creator");
      }
    } catch (error) {
      console.error("Error verifying creator:", error);
      showToast("error", "Error", "Failed to verify creator");
    }
  };

  const handleSuspendCreator = async (creator: Creator) => {
    try {
      const response = await fetch(`/api/creators/${creator.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "SUSPENDED" }),
      });

      if (response.ok) {
        const updatedCreator = await response.json();
        setCreators((prev) =>
          prev.map((c) => (c.id === updatedCreator.id ? updatedCreator : c))
        );
        showToast("success", "Creator Suspended!", `${creator.name} has been suspended.`);
      } else {
        const error = await response.json();
        showToast("error", "Error", error.error || "Failed to suspend creator");
      }
    } catch (error) {
      console.error("Error suspending creator:", error);
      showToast("error", "Error", "Failed to suspend creator");
    }
  };

  const handleDeleteCreator = (creator: Creator) => {
    setSelectedCreator(creator);
    setIsCreatorDeleteModalOpen(true);
  };

  const handleConfirmDeleteCreator = async () => {
    if (!selectedCreator) return;
    try {
      const response = await fetch(`/api/creators/${selectedCreator.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setCreators((prev) => prev.filter((c) => c.id !== selectedCreator.id));
        setIsCreatorDeleteModalOpen(false);
        showToast("success", "Creator Deleted!", `${selectedCreator.name} has been removed.`);
      } else {
        const error = await response.json();
        showToast("error", "Error", error.error || "Failed to delete creator");
      }
    } catch (error) {
      console.error("Error deleting creator:", error);
      showToast("error", "Error", "Failed to delete creator");
    }
  };

  // Show loading state while checking authorization
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-green-600 border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Verifying access...</p>
        </div>
      </div>
    );
  }

  // Don't render anything if not authorized (redirecting)
  if (!isAuthorized || !currentUser) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Toast Notification */}
      {toast.show && (
        <div className="fixed top-4 right-4 z-[100] animate-in slide-in-from-top-2 fade-in duration-300">
          <div className={`flex items-start gap-4 p-4 rounded-xl shadow-2xl border backdrop-blur-sm max-w-sm ${
            toast.type === "success"
              ? "bg-green-50/95 border-green-200"
              : "bg-red-50/95 border-red-200"
          }`}>
            <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
              toast.type === "success"
                ? "bg-green-100"
                : "bg-red-100"
            }`}>
              {toast.type === "success" ? (
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-semibold ${
                toast.type === "success" ? "text-green-800" : "text-red-800"
              }`}>
                {toast.title}
              </p>
              <p className={`mt-1 text-sm ${
                toast.type === "success" ? "text-green-600" : "text-red-600"
              }`}>
                {toast.message}
              </p>
            </div>
            <button
              onClick={() => setToast((prev) => ({ ...prev, show: false }))}
              className={`flex-shrink-0 p-1 rounded-lg transition-colors ${
                toast.type === "success"
                  ? "text-green-400 hover:text-green-600 hover:bg-green-100"
                  : "text-red-400 hover:text-red-600 hover:bg-red-100"
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Creator Added Success Notification */}
      {showCreatorSuccess && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-300">
            {/* Confetti-like header */}
            <div className="bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 p-8 text-center relative overflow-hidden">
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-2 left-4 w-3 h-3 bg-yellow-300 rounded-full animate-bounce" style={{ animationDelay: "0s" }} />
                <div className="absolute top-6 right-8 w-2 h-2 bg-pink-300 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                <div className="absolute bottom-4 left-12 w-2 h-2 bg-blue-300 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }} />
                <div className="absolute top-4 right-16 w-3 h-3 bg-purple-300 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                <div className="absolute bottom-6 right-4 w-2 h-2 bg-orange-300 rounded-full animate-bounce" style={{ animationDelay: "0.3s" }} />
              </div>
              <div className="relative">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-white">Creator Added!</h2>
              </div>
            </div>
            
            <div className="p-8 text-center">
              <div className="mb-6">
                <p className="text-gray-600 mb-2">Welcome to Village Market</p>
                <p className="text-2xl font-bold text-gray-900">{newCreatorName}</p>
              </div>
              
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-4 mb-6 border border-green-100">
                <div className="flex items-center justify-center gap-3 text-green-700">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-medium">Status: Pending Verification</span>
                </div>
                <p className="text-sm text-green-600 mt-2">
                  The creator account will be reviewed and verified shortly.
                </p>
              </div>
              
              <button
                onClick={() => setShowCreatorSuccess(false)}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg shadow-green-500/25"
              >
                Continue to Dashboard
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top Navigation */}
      <nav className="bg-green-900 border-b py-2 text-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              {/* Mobile menu button */}
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-green-800 transition-colors"
                aria-label="Toggle menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <Link href="/" className="flex items-center">
                <img src="/images/logo.png" alt="Village Market" className="w-32 sm:w-40 h-auto" />
              </Link>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="flex items-center gap-2">
                {currentUser.avatar ? (
                  <img src={currentUser.avatar} alt={currentUser.name} className="w-8 h-8 rounded-full object-cover" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-green-700 flex items-center justify-center text-white text-sm font-semibold">
                    {currentUser.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)}
                  </div>
                )}
                <div className="text-xs sm:text-sm text-gray-50 hidden sm:block">
                  {currentUser.name}
                </div>
              </div>
              <button 
                onClick={() => {
                  localStorage.removeItem("user");
                  router.push("/");
                }}
                className="px-3 py-2 text-xs sm:text-sm text-gray-50 hover:bg-green-800 rounded-lg transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex relative">
        {/* Mobile overlay */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside className={`
          fixed lg:sticky top-0 left-0 
          w-64 bg-white border-r border-gray-200 
          min-h-screen lg:min-h-[calc(100vh-4rem)]
          z-50 lg:z-0
          transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <nav className="p-4 space-y-2 pt-20 lg:pt-4">
            <button
              onClick={() => handleTabChange("overview")}
              className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                activeTab === "overview"
                  ? "bg-green-50 text-green-700 font-semibold"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Overview
              </div>
            </button>
            <button
              onClick={() => handleTabChange("pools")}
              className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                activeTab === "pools"
                  ? "bg-green-50 text-green-700 font-semibold"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                Pools
                {stats.pendingApprovals > 0 && (
                  <span className="ml-2 px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
                    {stats.pendingApprovals}
                  </span>
                )}
              </div>
            </button>
            <button
              onClick={() => handleTabChange("users")}
              className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                activeTab === "users"
                  ? "bg-green-50 text-green-700 font-semibold"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                Manage Users
              </div>
            </button>
            <button
              onClick={() => handleTabChange("creators")}
              className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                activeTab === "creators"
                  ? "bg-green-50 text-green-700 font-semibold"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Manage Creators
              </div>
            </button>
            <button
              onClick={() => handleTabChange("teams")}
              className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                activeTab === "teams"
                  ? "bg-green-50 text-green-700 font-semibold"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Manage Team
              </div>
            </button>
            <button
              onClick={() => setActiveTab("transactions")}
              className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                activeTab === "transactions"
                  ? "bg-green-50 text-green-700 font-semibold"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
                Transactions
              </div>
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 w-full lg:w-auto">
          {activeTab === "overview" && (
            <div className="space-y-8">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Dashboard Overview</h1>
                <p className="text-sm sm:text-base text-gray-600">Monitor and manage your platform activities</p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Total Pools</p>
                      <p className="text-3xl font-bold text-gray-900">{stats.totalPools}</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center text-sm">
                    <span className="text-green-600 font-semibold">{stats.activePools} active</span>
                    <span className="text-gray-400 mx-2">•</span>
                    <span className="text-gray-600">{stats.completedPools} completed</span>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Total Users</p>
                      <p className="text-3xl font-bold text-gray-900">{stats.totalUsers.toLocaleString()}</p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </div>
                  </div>
                  <div className="mt-4 text-sm text-gray-600">
                    Active members
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Total Volume</p>
                      <p className="text-3xl font-bold text-gray-900">{formatCurrency(stats.totalAmount)}</p>
                    </div>
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <div className="mt-4 text-sm text-gray-600">
                    {stats.totalTransactions.toLocaleString()} transactions
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Pending Approvals</p>
                      <p className="text-3xl font-bold text-gray-900">{stats.pendingApprovals}</p>
                    </div>
                    <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <div className="mt-4">
                    <button className="text-sm text-yellow-600 hover:text-yellow-700 font-semibold">
                      Review now →
                    </button>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                  <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900">Recent Pools</h2>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      {recentPools.slice(0, 5).map((pool) => (
                        <div key={pool.id} className="flex items-center justify-between pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900">{pool.title}</p>
                            <p className="text-sm text-gray-600">{pool.creator} • {pool.category}</p>
                          </div>
                          <div className="text-right">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(pool.status)}`}>
                              {pool.status}
                            </span>
                            <p className="text-sm text-gray-600 mt-1">{formatCurrency(pool.current)} / {formatCurrency(pool.goal)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={() => handleTabChange("pools")}
                      className="mt-4 w-full text-center text-green-600 hover:text-green-700 font-semibold text-sm"
                    >
                      View all pools →
                    </button>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                  <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900">Recent Transactions</h2>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      {recentTransactions.slice(0, 5).map((transaction) => (
                        <div key={transaction.id} className="flex items-center justify-between pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900">{transaction.poolTitle}</p>
                            <p className="text-sm text-gray-600">{transaction.user} • {transaction.date}</p>
                          </div>
                          <div className="text-right">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(transaction.status)}`}>
                              {transaction.status}
                            </span>
                            <p className="text-sm font-semibold text-gray-900 mt-1">{formatCurrency(transaction.amount)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={() => setActiveTab("transactions")}
                      className="mt-4 w-full text-center text-green-600 hover:text-green-700 font-semibold text-sm"
                    >
                      View all transactions →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "pools" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Pool Management</h1>
                  <p className="text-sm sm:text-base text-gray-600">Manage all pools on the platform</p>
                </div>
                <button 
                  onClick={() => setIsCreateModalOpen(true)}
                  className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors whitespace-nowrap self-start sm:self-auto"
                >
                  + Create Pool
                </button>
              </div>

              {/* Filters */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <div className="flex flex-wrap gap-4">
                  <select className="px-4 py-2 border border-gray-300 rounded-lg text-sm">
                    <option>All Status</option>
                    <option>Active</option>
                    <option>Completed</option>
                    <option>Pending</option>
                  </select>
                  <select className="px-4 py-2 border border-gray-300 rounded-lg text-sm">
                    <option>All Categories</option>
                    <option>Food Stuffs</option>
                    <option>Livestock</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Search pools..."
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm flex-1 min-w-[200px]"
                  />
                </div>
              </div>

              {/* Pools Table */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Pool</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Category</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Progress</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {poolsLoading ? (
                        <tr>
                          <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                            Loading pools...
                          </td>
                        </tr>
                      ) : pools.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                            No pools found. Create your first pool to get started.
                          </td>
                        </tr>
                      ) : (
                        pools.map((pool) => {
                          const progress = pool.goal > 0 ? (pool.currentAmount / pool.goal) * 100 : 0;
                          const categoryLabel = pool.category === "FOOD_STUFFS" ? "Food Stuffs" : "Livestock";
                          return (
                            <tr key={pool.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                  {pool.image ? (
                                    <img
                                      src={pool.image}
                                      alt={pool.title}
                                      className="w-12 h-12 rounded-lg object-cover"
                                    />
                                  ) : (
                                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-white font-semibold text-sm">
                                      {pool.title.substring(0, 2).toUpperCase()}
                                    </div>
                                  )}
                                  <div>
                                    <p className="font-semibold text-gray-900">{pool.title}</p>
                                    <p className="text-sm text-gray-600">{formatCurrency(pool.goal)} goal</p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                  pool.category === "FOOD_STUFFS"
                                    ? "bg-green-100 text-green-700"
                                    : "bg-blue-100 text-blue-700"
                                }`}>
                                  {categoryLabel}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <div className="w-32">
                                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                                    <span>{Math.round(progress)}%</span>
                                    <span>{pool.currentContributors}/{pool.contributors}</span>
                                  </div>
                                  <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                      className="bg-green-600 h-2 rounded-full"
                                      style={{ width: `${Math.min(progress, 100)}%` }}
                                    ></div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                                  pool.status === "ACTIVE"
                                    ? "bg-green-100 text-green-700 border-green-200"
                                    : pool.status === "COMPLETED"
                                    ? "bg-blue-100 text-blue-700 border-blue-200"
                                    : pool.status === "PENDING"
                                    ? "bg-yellow-100 text-yellow-700 border-yellow-200"
                                    : "bg-red-100 text-red-700 border-red-200"
                                }`}>
                                  {pool.status.toLowerCase()}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center space-x-1">
                                  <button 
                                    onClick={() => {
                                      setSelectedPool(pool);
                                      setIsViewModalOpen(true);
                                    }}
                                    className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors" 
                                    title="View"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                  </button>
                                  <button 
                                    onClick={() => {
                                      setSelectedPool(pool);
                                      // Pre-fill form data with pool information
                                      setFormData({
                                        image: pool.image || "",
                                        title: pool.title || "",
                                        description: pool.description || "",
                                        category: pool.category === "FOOD_STUFFS" ? "Food Stuffs" : "Livestock",
                                        goal: pool.goal?.toString() || "",
                                        contributors: pool.contributors?.toString() || "",
                                        location: pool.location || "",
                                        localGovernment: pool.localGovernment || "",
                                        town: pool.town || "",
                                        street: pool.street || "",
                                        deadline: pool.deadline?.split('T')[0] || "",
                                      });
                                      setIsEditModalOpen(true);
                                    }}
                                    className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors" 
                                    title="Edit"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                  </button>
                                  <button 
                                    onClick={() => {
                                      setSelectedPool(pool);
                                      setIsDeleteModalOpen(true);
                                    }}
                                    className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors" 
                                    title="Delete"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === "users" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Manage Users</h1>
                  <p className="text-sm sm:text-base text-gray-600">Manage platform users, roles, and their activities</p>
                </div>
                <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
                  <select className="px-4 py-2 border border-gray-300 rounded-lg text-sm">
                    <option value="">All Roles</option>
                    <option value="Admin">Admin</option>
                    <option value="Contributor">Contributor</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Search users..."
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm w-64"
                  />
                  <button
                    onClick={() => setIsUserModalOpen(true)}
                    className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                  >
                    + Add User
                  </button>
                </div>
              </div>

              {/* Users Table */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">User</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Role</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Joined</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {usersLoading ? (
                        <tr>
                          <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                            Loading users...
                          </td>
                        </tr>
                      ) : users.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                            No users found. Add your first user to get started.
                          </td>
                        </tr>
                      ) : (
                        users.map((user) => (
                          <tr key={user.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                {user.avatar ? (
                                  <img
                                    src={user.avatar}
                                    alt={user.name}
                                    className="w-10 h-10 rounded-full object-cover"
                                  />
                                ) : (
                                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-white font-semibold text-sm">
                                    {user.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
                                  </div>
                                )}
                                <div>
                                  <p className="font-semibold text-gray-900">{user.name}</p>
                                  <p className="text-sm text-gray-600">{user.email}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                                user.role === "ADMIN"
                                  ? "bg-purple-100 text-purple-700 border-purple-200"
                                  : "bg-gray-100 text-gray-700 border-gray-200"
                              }`}>
                                {user.role === "ADMIN" ? "Admin" : "Contributor"}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">
                              {new Date(user.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4">
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                                user.status === "ACTIVE"
                                  ? "bg-green-100 text-green-700 border-green-200"
                                  : user.status === "SUSPENDED"
                                  ? "bg-red-100 text-red-700 border-red-200"
                                  : "bg-gray-100 text-gray-700 border-gray-200"
                              }`}>
                                {user.status.toLowerCase()}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center space-x-1">
                                <button 
                                  onClick={() => handleViewUser(user)}
                                  className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors" 
                                  title="View"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                  </svg>
                                </button>
                                <button 
                                  onClick={() => handleEditUser(user)}
                                  className="p-2 text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50 rounded-lg transition-colors" 
                                  title="Edit"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                  </svg>
                                </button>
                                <button 
                                  onClick={() => handleDeleteUser(user)}
                                  className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors" 
                                  title="Delete"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === "creators" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Manage Creators</h1>
                  <p className="text-sm sm:text-base text-gray-600">Review and manage pool creators on the platform</p>
                </div>
                <button
                  onClick={() => setIsCreatorModalOpen(true)}
                  className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors whitespace-nowrap self-start sm:self-auto"
                >
                  + Add Creator
                </button>
              </div>

              {/* Creators Table */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Creator</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Pools Created</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Total Raised</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Joined</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {creatorsLoading ? (
                        <tr>
                          <td colSpan={6} className="px-6 py-12 text-center">
                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent"></div>
                            <p className="mt-2 text-gray-600">Loading creators...</p>
                          </td>
                        </tr>
                      ) : creators.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="px-6 py-12 text-center">
                            <div className="text-4xl mb-2">👥</div>
                            <p className="text-gray-600">No creators found</p>
                          </td>
                        </tr>
                      ) : (
                        creators.map((creator) => (
                        <tr key={creator.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold text-sm overflow-hidden">
                                {creator.avatar ? (
                                  <img src={creator.avatar} alt={creator.name} className="w-full h-full object-cover" />
                                ) : (
                                  creator.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()
                                )}
                              </div>
                              <div>
                                <p className="font-semibold text-gray-900">{creator.name}</p>
                                <p className="text-sm text-gray-600">{creator.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">{creator.poolsCreated}</td>
                          <td className="px-6 py-4 text-sm font-semibold text-gray-900">{formatCurrency(creator.totalRaised)}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {new Date(creator.createdAt).toLocaleDateString("en-NG", {
                              year: "numeric",
                              month: "short",
                              day: "numeric"
                            })}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                              creator.status === "VERIFIED"
                                ? "bg-green-100 text-green-700 border-green-200"
                                : creator.status === "SUSPENDED"
                                ? "bg-red-100 text-red-700 border-red-200"
                                : "bg-yellow-100 text-yellow-700 border-yellow-200"
                            }`}>
                              {creator.status.toLowerCase()}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-1">
                              <button 
                                onClick={() => handleViewCreator(creator)}
                                className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors" 
                                title="View"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                              </button>
                              <button 
                                onClick={() => alert('Edit creator feature coming soon')}
                                className="p-2 text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-colors" 
                                title="Edit"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                              </button>
                              {creator.status === "PENDING" ? (
                                <button 
                                  onClick={() => handleVerifyCreator(creator)}
                                  className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors" 
                                  title="Verify"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                  </svg>
                                </button>
                              ) : creator.status === "VERIFIED" ? (
                                <button 
                                  onClick={() => handleSuspendCreator(creator)}
                                  className="p-2 text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50 rounded-lg transition-colors" 
                                  title="Suspend"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                                  </svg>
                                </button>
                              ) : (
                                <button 
                                  onClick={() => handleVerifyCreator(creator)}
                                  className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors" 
                                  title="Re-verify"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                  </svg>
                                </button>
                              )}
                              <button 
                                onClick={() => handleDeleteCreator(creator)}
                                className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors" 
                                title="Delete"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === "teams" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Manage Team</h1>
                  <p className="text-sm sm:text-base text-gray-600">Manage the VillageMarket team members shown on the About page</p>
                </div>
                <button
                  onClick={() => setIsTeamModalOpen(true)}
                  className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors whitespace-nowrap self-start sm:self-auto"
                >
                  + Add Team Member
                </button>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Member</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Role</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Joined</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {teamLoading ? (
                        <tr>
                          <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                            Loading team members...
                          </td>
                        </tr>
                      ) : teamMembers.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                            No team members found. Add your first team member to get started.
                          </td>
                        </tr>
                      ) : (
                        teamMembers.map((member) => (
                          <tr key={member.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-100 to-blue-100 flex items-center justify-center text-xl overflow-hidden">
                                  {member.avatar && (member.avatar.startsWith("http") || member.avatar.startsWith("data:")) ? (
                                    <img
                                      src={member.avatar}
                                      alt={member.name}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <span>{member.avatar || "👤"}</span>
                                  )}
                                </div>
                                <div>
                                  <p className="font-semibold text-gray-900">{member.name}</p>
                                  <p className="text-sm text-gray-600 line-clamp-2">{member.bio}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-700">
                              {member.role}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">
                              {new Date(member.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center space-x-1">
                                <button
                                  onClick={() => handleEditTeamMember(member)}
                                  className="p-2 text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50 rounded-lg transition-colors"
                                  title="Edit"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                  </svg>
                                </button>
                                <button
                                  onClick={() => handleDeleteTeamMember(member)}
                                  className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                                  title="Delete"
                                >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === "transactions" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Transaction History</h1>
                  <p className="text-sm sm:text-base text-gray-600">Monitor all platform transactions</p>
                </div>
                <div className="flex gap-2 sm:gap-4 flex-wrap">
                  <select className="px-4 py-2 border border-gray-300 rounded-lg text-sm">
                    <option>All Status</option>
                    <option>Completed</option>
                    <option>Pending</option>
                    <option>Failed</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Search transactions..."
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm w-64"
                  />
                </div>
              </div>

              {/* Transactions Table */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Transaction ID</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Pool</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">User</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Amount</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Type</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {recentTransactions.map((transaction) => (
                        <tr key={transaction.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm text-gray-600">#{transaction.id.toString().padStart(6, '0')}</td>
                          <td className="px-6 py-4 text-sm font-semibold text-gray-900">{transaction.poolTitle}</td>
                          <td className="px-6 py-4 text-sm text-gray-900">{transaction.user}</td>
                          <td className="px-6 py-4 text-sm font-semibold text-gray-900">{formatCurrency(transaction.amount)}</td>
                          <td className="px-6 py-4">
                            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                              {transaction.type}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(transaction.status)}`}>
                              {transaction.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">{transaction.date}</td>
                          <td className="px-6 py-4">
                            <button className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors" title="View Details">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Create Pool Modal */}
      {isCreateModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsCreateModalOpen(false);
              setFormData({
                image: "",
                title: "",
                description: "",
                category: "Food Stuffs",
                goal: "",
                contributors: "",
                location: "",
                localGovernment: "",
                town: "",
                street: "",
                deadline: "",
              });
            }
          }}
        >
          <div 
            className="bg-white rounded-2xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Create New Pool</h2>
                <button
                  onClick={() => {
                    setIsCreateModalOpen(false);
                    setFormData({
                      image: "",
                      title: "",
                      description: "",
                      category: "Food Stuffs",
                      goal: "",
                      contributors: "",
                      location: "",
                      localGovernment: "",
                      town: "",
                      street: "",
                      deadline: "",
                    });
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                try {
                  const response = await fetch("/api/pools", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      image: formData.image || null,
                      title: formData.title,
                      description: formData.description,
                      category: formData.category === "Food Stuffs" ? "FOOD_STUFFS" : "LIVESTOCK",
                      goal: formData.goal,
                      contributors: formData.contributors,
                      location: formData.location,
                      localGovernment: formData.localGovernment,
                      town: formData.town || null,
                      street: formData.street || null,
                      deadline: formData.deadline,
                    }),
                  });

                  if (response.ok) {
                    const newPool = await response.json();
                    setPools((prev) => [newPool, ...prev]);
                    setIsCreateModalOpen(false);
                    setFormData({
                      image: "",
                      title: "",
                      description: "",
                      category: "Food Stuffs",
                      goal: "",
                      contributors: "",
                      location: "",
                      localGovernment: "",
                      town: "",
                      street: "",
                      deadline: "",
                    });
                    showToast("success", "Pool Created!", `${formData.title} has been created successfully.`);
                  } else {
                    const error = await response.json();
                    showToast("error", "Error", error.error || "Failed to create pool");
                  }
                } catch (error) {
                  console.error("Error creating pool:", error);
                  showToast("error", "Error", "Failed to create pool. Please try again.");
                }
              }}
              className="p-6 space-y-6"
            >
              {/* Pool Image Upload */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Pool Image
                </label>
                <div className="relative">
                  <div className="w-full h-40 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 flex flex-col items-center justify-center overflow-hidden hover:border-green-400 transition-colors">
                    {formData.image ? (
                      <img
                        src={formData.image}
                        alt="Pool preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <>
                        <svg className="w-10 h-10 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="text-sm text-gray-500">Click to upload pool image</p>
                        <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 5MB</p>
                      </>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setFormData({ ...formData, image: reader.result as string });
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </div>
                  {formData.image && (
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, image: "" })}
                      className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Pool Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title || ""}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Bulk Rice Purchase"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  required
                  value={formData.description || ""}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe what this pool is for and why people should join..."
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    required
                    value={formData.category || "Food Stuffs"}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                  >
                    <option value="Food Stuffs">Food Stuffs</option>
                    <option value="Livestock">Livestock</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Goal Amount (NGN) *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.goal || ""}
                    onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                    placeholder="500000"
                    min="1"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Number of Contributors *
                </label>
                <input
                  type="number"
                  required
                  value={formData.contributors || ""}
                  onChange={(e) => setFormData({ ...formData, contributors: e.target.value })}
                  placeholder="e.g., 20"
                  min="1"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                />
                <p className="mt-1 text-xs text-gray-500">
                  The pool will require this many contributors. Each contributor will pay: {formData.goal && formData.contributors ? `₦${Math.ceil(Number(formData.goal) / Number(formData.contributors)).toLocaleString()}` : "—"}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Location (State) *
                  </label>
                  <select
                    required
                    value={formData.location || ""}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value, localGovernment: "" })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                  >
                    <option value="">Select a state</option>
                    <option value="Abia">Abia</option>
                    <option value="Adamawa">Adamawa</option>
                    <option value="Akwa Ibom">Akwa Ibom</option>
                    <option value="Anambra">Anambra</option>
                    <option value="Bauchi">Bauchi</option>
                    <option value="Bayelsa">Bayelsa</option>
                    <option value="Benue">Benue</option>
                    <option value="Borno">Borno</option>
                    <option value="Cross River">Cross River</option>
                    <option value="Delta">Delta</option>
                    <option value="Ebonyi">Ebonyi</option>
                    <option value="Edo">Edo</option>
                    <option value="Ekiti">Ekiti</option>
                    <option value="Enugu">Enugu</option>
                    <option value="FCT">Federal Capital Territory (FCT)</option>
                    <option value="Gombe">Gombe</option>
                    <option value="Imo">Imo</option>
                    <option value="Jigawa">Jigawa</option>
                    <option value="Kaduna">Kaduna</option>
                    <option value="Kano">Kano</option>
                    <option value="Katsina">Katsina</option>
                    <option value="Kebbi">Kebbi</option>
                    <option value="Kogi">Kogi</option>
                    <option value="Kwara">Kwara</option>
                    <option value="Lagos">Lagos</option>
                    <option value="Nasarawa">Nasarawa</option>
                    <option value="Niger">Niger</option>
                    <option value="Ogun">Ogun</option>
                    <option value="Ondo">Ondo</option>
                    <option value="Osun">Osun</option>
                    <option value="Oyo">Oyo</option>
                    <option value="Plateau">Plateau</option>
                    <option value="Rivers">Rivers</option>
                    <option value="Sokoto">Sokoto</option>
                    <option value="Taraba">Taraba</option>
                    <option value="Yobe">Yobe</option>
                    <option value="Zamfara">Zamfara</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Deadline *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.deadline || ""}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>

              {/* Local Government, Town, and Street */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Local Government Area *
                  </label>
                  <select
                    required
                    value={formData.localGovernment || ""}
                    onChange={(e) => setFormData({ ...formData, localGovernment: e.target.value })}
                    disabled={!formData.location}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    <option value="">
                      {formData.location ? "Select LGA" : "Select state first"}
                    </option>
                    {formData.location && lgaByState[formData.location]?.map((lga) => (
                      <option key={lga} value={lga}>
                        {lga}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Town/City *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.town || ""}
                    onChange={(e) => setFormData({ ...formData, town: e.target.value })}
                    placeholder="e.g., Ikeja, Victoria Island"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Street Address
                  </label>
                  <input
                    type="text"
                    value={formData.street || ""}
                    onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                    placeholder="e.g., 123 Main Street"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreateModalOpen(false);
                    setFormData({
                      image: "",
                      title: "",
                      description: "",
                      category: "Food Stuffs",
                      goal: "",
                      contributors: "",
                      location: "",
                      localGovernment: "",
                      town: "",
                      street: "",
                      deadline: "",
                    });
                  }}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
                >
                  Create Pool
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Pool Modal */}
      {isViewModalOpen && selectedPool && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsViewModalOpen(false);
              setSelectedPool(null);
            }
          }}
        >
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Pool Details</h2>
                <button
                  onClick={() => {
                    setIsViewModalOpen(false);
                    setSelectedPool(null);
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="px-8 py-6 space-y-6">
              {selectedPool.image && (
                <div className="w-full h-64 rounded-xl overflow-hidden">
                  <img
                    src={selectedPool.image}
                    alt={selectedPool.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-500 mb-1">Title</label>
                  <p className="text-gray-900 font-medium">{selectedPool.title}</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-500 mb-1">Category</label>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                    selectedPool.category === "FOOD_STUFFS"
                      ? "bg-green-100 text-green-700"
                      : "bg-blue-100 text-blue-700"
                  }`}>
                    {selectedPool.category === "FOOD_STUFFS" ? "Food Stuffs" : "Livestock"}
                  </span>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-500 mb-1">Goal Amount</label>
                  <p className="text-gray-900 font-medium">{formatCurrency(selectedPool.goal)}</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-500 mb-1">Current Amount</label>
                  <p className="text-gray-900 font-medium">{formatCurrency(selectedPool.currentAmount)}</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-500 mb-1">Max Contributors</label>
                  <p className="text-gray-900 font-medium">{selectedPool.contributors}</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-500 mb-1">Current Contributors</label>
                  <p className="text-gray-900 font-medium">{selectedPool.currentContributors}</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-500 mb-1">Status</label>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${
                    selectedPool.status === "ACTIVE"
                      ? "bg-green-100 text-green-700 border-green-200"
                      : selectedPool.status === "COMPLETED"
                      ? "bg-blue-100 text-blue-700 border-blue-200"
                      : selectedPool.status === "PENDING"
                      ? "bg-yellow-100 text-yellow-700 border-yellow-200"
                      : "bg-red-100 text-red-700 border-red-200"
                  }`}>
                    {selectedPool.status.toLowerCase()}
                  </span>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-500 mb-1">Deadline</label>
                  <p className="text-gray-900 font-medium">{new Date(selectedPool.deadline).toLocaleDateString()}</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-500 mb-1">Location</label>
                  <p className="text-gray-900 font-medium">{selectedPool.location}</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-500 mb-1">Local Government</label>
                  <p className="text-gray-900 font-medium">{selectedPool.localGovernment}</p>
                </div>

                {selectedPool.town && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-500 mb-1">Town</label>
                    <p className="text-gray-900 font-medium">{selectedPool.town}</p>
                  </div>
                )}

                {selectedPool.street && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-500 mb-1">Street</label>
                    <p className="text-gray-900 font-medium">{selectedPool.street}</p>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-500 mb-1">Description</label>
                <p className="text-gray-900">{selectedPool.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-6 pt-4 border-t border-gray-200">
                <div>
                  <label className="block text-sm font-semibold text-gray-500 mb-1">Created At</label>
                  <p className="text-gray-900 font-medium">{new Date(selectedPool.createdAt).toLocaleString()}</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-500 mb-1">Pool ID</label>
                  <p className="text-gray-900 font-mono text-sm">{selectedPool.id}</p>
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    setIsViewModalOpen(false);
                    setSelectedPool(null);
                  }}
                  className="px-6 py-3 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Team Member Create Modal */}
      {isTeamModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsTeamModalOpen(false);
              setTeamFormData({
                name: "",
                role: "",
                bio: "",
                avatar: "",
                displayOrder: "",
              });
            }
          }}
        >
          <div
            className="bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Add Team Member</h2>
              <button
                onClick={() => {
                  setIsTeamModalOpen(false);
                  setTeamFormData({
                    name: "",
                    role: "",
                    bio: "",
                    avatar: "",
                    displayOrder: "",
                  });
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Avatar
                </label>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-100 to-blue-100 flex items-center justify-center overflow-hidden">
                    {teamFormData.avatar ? (
                      <img
                        src={teamFormData.avatar}
                        alt={teamFormData.name || "Team member"}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-2xl">👤</span>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="block">
                      <span className="sr-only">Upload avatar</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="block w-full text-sm text-gray-600
                                   file:mr-3 file:py-2 file:px-3
                                   file:rounded-md file:border-0
                                   file:text-sm file:font-semibold
                                   file:bg-green-50 file:text-green-700
                                   hover:file:bg-green-100"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setTeamFormData({ ...teamFormData, avatar: reader.result as string });
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                    {teamFormData.avatar && (
                      <button
                        type="button"
                        onClick={() => setTeamFormData({ ...teamFormData, avatar: "" })}
                        className="text-xs text-red-600 hover:text-red-700"
                      >
                        Remove avatar
                      </button>
                    )}
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={teamFormData.name}
                  onChange={(e) => setTeamFormData({ ...teamFormData, name: e.target.value })}
                  placeholder="e.g., John Doe"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Display Order
                </label>
                <input
                  type="number"
                  min={0}
                  value={teamFormData.displayOrder}
                  onChange={(e) => setTeamFormData({ ...teamFormData, displayOrder: e.target.value })}
                  placeholder="e.g., 1"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Lower numbers appear first on the team page.
                </p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Role <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={teamFormData.role}
                  onChange={(e) => setTeamFormData({ ...teamFormData, role: e.target.value })}
                  placeholder="e.g., Founder & CEO"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Bio <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={teamFormData.bio}
                  onChange={(e) => setTeamFormData({ ...teamFormData, bio: e.target.value })}
                  placeholder="Short description about this team member..."
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all resize-none"
                />
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => {
                  setIsTeamModalOpen(false);
                  setTeamFormData({
                    name: "",
                    role: "",
                    bio: "",
                    avatar: "",
                    displayOrder: "",
                  });
                }}
                className="px-5 py-2 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateTeamMember}
                className="px-6 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Team Member Edit Modal */}
      {isTeamEditModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsTeamEditModalOpen(false);
            }
          }}
        >
          <div
            className="bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Edit Team Member</h2>
              <button
                onClick={() => setIsTeamEditModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Avatar
                </label>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-100 to-blue-100 flex items-center justify-center overflow-hidden">
                    {editTeamFormData.avatar ? (
                      <img
                        src={editTeamFormData.avatar}
                        alt={editTeamFormData.name || "Team member"}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-2xl">👤</span>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="block">
                      <span className="sr-only">Upload avatar</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="block w-full text-sm text-gray-600
                                   file:mr-3 file:py-2 file:px-3
                                   file:rounded-md file:border-0
                                   file:text-sm file:font-semibold
                                   file:bg-green-50 file:text-green-700
                                   hover:file:bg-green-100"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setEditTeamFormData({ ...editTeamFormData, avatar: reader.result as string });
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                    {editTeamFormData.avatar && (
                      <button
                        type="button"
                        onClick={() => setEditTeamFormData({ ...editTeamFormData, avatar: "" })}
                        className="text-xs text-red-600 hover:text-red-700"
                      >
                        Remove avatar
                      </button>
                    )}
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={editTeamFormData.name}
                  onChange={(e) => setEditTeamFormData({ ...editTeamFormData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Display Order
                </label>
                <input
                  type="number"
                  min={0}
                  value={editTeamFormData.displayOrder}
                  onChange={(e) => setEditTeamFormData({ ...editTeamFormData, displayOrder: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Lower numbers appear first on the team page.
                </p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Role <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={editTeamFormData.role}
                  onChange={(e) => setEditTeamFormData({ ...editTeamFormData, role: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Bio <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={editTeamFormData.bio}
                  onChange={(e) => setEditTeamFormData({ ...editTeamFormData, bio: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all resize-none"
                />
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setIsTeamEditModalOpen(false)}
                className="px-5 py-2 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateTeamMember}
                className="px-6 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Team Member Delete Modal */}
      {isTeamDeleteModalOpen && selectedTeamMember && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsTeamDeleteModalOpen(false);
            }
          }}
        >
          <div
            className="bg-white rounded-2xl shadow-xl max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Delete Team Member</h2>
            </div>
            <div className="p-6 space-y-3">
              <p className="text-gray-700">
                Are you sure you want to delete{" "}
                <span className="font-semibold">{selectedTeamMember.name}</span> from the team?
              </p>
              <p className="text-sm text-gray-500">
                This action cannot be undone and will remove this member from the public team page.
              </p>
            </div>
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setIsTeamDeleteModalOpen(false)}
                className="px-5 py-2 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDeleteTeamMember}
                className="px-6 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Pool Modal */}
      {isEditModalOpen && selectedPool && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsEditModalOpen(false);
              setSelectedPool(null);
            }
          }}
        >
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Edit Pool</h2>
                <button
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setSelectedPool(null);
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <form 
              onSubmit={async (e) => {
                e.preventDefault();
                try {
                  const response = await fetch(`/api/pools/admin/${selectedPool.id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      image: formData.image,
                      title: formData.title,
                      description: formData.description,
                      category: formData.category === "Food Stuffs" ? "FOOD_STUFFS" : "LIVESTOCK",
                      goal: parseFloat(formData.goal),
                      contributors: parseInt(formData.contributors),
                      location: formData.location,
                      localGovernment: formData.localGovernment,
                      town: formData.town,
                      street: formData.street,
                      deadline: new Date(formData.deadline).toISOString(),
                    }),
                  });

                  if (response.ok) {
                    const updatedPool = await response.json();
                    setPools((prev) => 
                      prev.map((p) => (p.id === updatedPool.id ? updatedPool : p))
                    );
                    setIsEditModalOpen(false);
                    setSelectedPool(null);
                    showToast("success", "Pool Updated!", "The pool has been successfully updated.");
                  } else {
                    showToast("error", "Update Failed", "Failed to update the pool. Please try again.");
                  }
                } catch (error) {
                  console.error("Error updating pool:", error);
                  showToast("error", "Update Failed", "An error occurred while updating the pool.");
                }
              }}
              className="px-8 py-6 space-y-6"
            >
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Pool Image URL
                </label>
                <input
                  type="url"
                  value={formData.image || ""}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Pool Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title || ""}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  placeholder="e.g., Bulk Rice Purchase Pool"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.description || ""}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  rows={4}
                  placeholder="Describe the pool purpose and benefits..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.category || "Food Stuffs"}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                  >
                    <option value="Food Stuffs">Food Stuffs</option>
                    <option value="Livestock">Livestock</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Goal Amount (₦) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.goal || ""}
                    onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                    required
                    placeholder="500000"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Max Contributors <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.contributors || ""}
                    onChange={(e) => setFormData({ ...formData, contributors: e.target.value })}
                    required
                    placeholder="10"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Deadline <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.deadline || ""}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Location <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.location || ""}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    required
                    placeholder="e.g., Lagos"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Local Government <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.localGovernment || ""}
                    onChange={(e) => setFormData({ ...formData, localGovernment: e.target.value })}
                    required
                    placeholder="e.g., Ikeja"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Town
                  </label>
                  <input
                    type="text"
                    value={formData.town || ""}
                    onChange={(e) => setFormData({ ...formData, town: e.target.value })}
                    placeholder="e.g., Victoria Island"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Street Address
                  </label>
                  <input
                    type="text"
                    value={formData.street || ""}
                    onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                    placeholder="e.g., 123 Main Street"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setSelectedPool(null);
                  }}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
                >
                  Update Pool
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Pool Modal */}
      {isDeleteModalOpen && selectedPool && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsDeleteModalOpen(false);
              setSelectedPool(null);
            }
          }}
        >
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="px-8 py-6">
              <div className="flex items-center justify-center w-16 h-16 mx-auto bg-red-100 rounded-full mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">Delete Pool</h2>
              <p className="text-gray-600 text-center mb-6">
                Are you sure you want to delete "<strong>{selectedPool.title}</strong>"? This action cannot be undone.
              </p>

              <div className="flex space-x-4">
                <button
                  onClick={() => {
                    setIsDeleteModalOpen(false);
                    setSelectedPool(null);
                  }}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    try {
                      const response = await fetch(`/api/pools/admin/${selectedPool.id}`, {
                        method: "DELETE",
                      });

                      if (response.ok) {
                        setPools((prev) => prev.filter((p) => p.id !== selectedPool.id));
                        setIsDeleteModalOpen(false);
                        setSelectedPool(null);
                        showToast("success", "Pool Deleted!", "The pool has been successfully deleted.");
                      } else {
                        showToast("error", "Delete Failed", "Failed to delete the pool. Please try again.");
                      }
                    } catch (error) {
                      console.error("Error deleting pool:", error);
                      showToast("error", "Delete Failed", "An error occurred while deleting the pool.");
                    }
                  }}
                  className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Creator Modal */}
      {isCreatorModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsCreatorModalOpen(false);
              setCreatorFormData({
                avatar: "",
                name: "",
                email: "",
                phone: "",
                organization: "",
                address: "",
                idType: "NIN",
                idNumber: "",
                password: "",
              });
            }
          }}
        >
          <div
            className="bg-white rounded-2xl shadow-xl max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Add New Creator</h2>
                <button
                  onClick={() => {
                    setIsCreatorModalOpen(false);
                    setCreatorFormData({
                      avatar: "",
                      name: "",
                      email: "",
                      phone: "",
                      organization: "",
                      address: "",
                      idType: "NIN",
                      idNumber: "",
                      password: "",
                    });
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                try {
                  const response = await fetch("/api/creators", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(creatorFormData),
                  });
                  
                  if (response.ok) {
                    const newCreator = await response.json();
                    setCreators((prev) => [newCreator, ...prev]);
                    setNewCreatorName(creatorFormData.name);
                    setIsCreatorModalOpen(false);
                    setCreatorFormData({
                      avatar: "",
                      name: "",
                      email: "",
                      phone: "",
                      organization: "",
                      address: "",
                      idType: "NIN",
                      idNumber: "",
                      password: "",
                    });
                    setShowCreatorSuccess(true);
                    setTimeout(() => setShowCreatorSuccess(false), 5000);
                  } else {
                    const error = await response.json();
                    showToast("error", "Error", error.error || "Failed to add creator");
                  }
                } catch (error) {
                  console.error("Error creating creator:", error);
                  showToast("error", "Error", "Failed to add creator. Please try again.");
                }
              }}
              className="p-6 space-y-5"
            >
              {/* Creator Avatar Upload */}
              <div className="flex flex-col items-center">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Profile Photo
                </label>
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-2xl font-semibold overflow-hidden">
                    {creatorFormData.avatar ? (
                      <img
                        src={creatorFormData.avatar}
                        alt="Avatar preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    )}
                  </div>
                  <label
                    htmlFor="creator-avatar-upload"
                    className="absolute bottom-0 right-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-700 transition-colors shadow-lg"
                  >
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <input
                      id="creator-avatar-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setCreatorFormData({ ...creatorFormData, avatar: reader.result as string });
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                </div>
                <p className="mt-2 text-xs text-gray-500">Click the camera icon to upload</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={creatorFormData.name || ""}
                  onChange={(e) => setCreatorFormData({ ...creatorFormData, name: e.target.value })}
                  placeholder="e.g., Adebayo Johnson"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={creatorFormData.email || ""}
                  onChange={(e) => setCreatorFormData({ ...creatorFormData, email: e.target.value })}
                  placeholder="e.g., adebayo@example.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  value={creatorFormData.phone || ""}
                  onChange={(e) => setCreatorFormData({ ...creatorFormData, phone: e.target.value })}
                  placeholder="e.g., 08012345678"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Organization / Business Name
                </label>
                <input
                  type="text"
                  value={creatorFormData.organization || ""}
                  onChange={(e) => setCreatorFormData({ ...creatorFormData, organization: e.target.value })}
                  placeholder="e.g., Lagos Women Cooperative"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Address
                </label>
                <textarea
                  value={creatorFormData.address || ""}
                  onChange={(e) => setCreatorFormData({ ...creatorFormData, address: e.target.value })}
                  placeholder="e.g., 15 Market Road, Ikeja, Lagos"
                  rows={2}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    ID Type *
                  </label>
                  <select
                    required
                    value={creatorFormData.idType || "NIN"}
                    onChange={(e) => setCreatorFormData({ ...creatorFormData, idType: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                  >
                    <option value="NIN">NIN</option>
                    <option value="Voters Card">Voters Card</option>
                    <option value="Drivers License">Drivers License</option>
                    <option value="Passport">International Passport</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    ID Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={creatorFormData.idNumber || ""}
                    onChange={(e) => setCreatorFormData({ ...creatorFormData, idNumber: e.target.value })}
                    placeholder="Enter ID number"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Password *
                </label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={creatorFormData.password || ""}
                  onChange={(e) => setCreatorFormData({ ...creatorFormData, password: e.target.value })}
                  placeholder="Min. 8 characters"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                />
                <p className="mt-1 text-xs text-gray-500">Creator will use this to sign in</p>
              </div>

              <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreatorModalOpen(false);
                    setCreatorFormData({
                      avatar: "",
                      name: "",
                      email: "",
                      phone: "",
                      organization: "",
                      address: "",
                      idType: "NIN",
                      idNumber: "",
                      password: "",
                    });
                  }}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
                >
                  Add Creator
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {isUserModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsUserModalOpen(false);
              setUserFormData({
                avatar: "",
                name: "",
                email: "",
                phone: "",
                role: "Contributor",
                password: "",
              });
            }
          }}
        >
          <div
            className="bg-white rounded-2xl shadow-xl max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Add New User</h2>
                <button
                  onClick={() => {
                    setIsUserModalOpen(false);
                    setUserFormData({
                      avatar: "",
                      name: "",
                      email: "",
                      phone: "",
                      role: "Contributor",
                      password: "",
                    });
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                try {
                  const response = await fetch("/api/users", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      avatar: userFormData.avatar || null,
                      name: userFormData.name,
                      email: userFormData.email,
                      phone: userFormData.phone || null,
                      role: userFormData.role === "Admin" ? "ADMIN" : "CONTRIBUTOR",
                      password: userFormData.password,
                    }),
                  });

                  if (response.ok) {
                    const newUser = await response.json();
                    setUsers((prev) => [newUser, ...prev]);
                    setIsUserModalOpen(false);
                    setUserFormData({
                      avatar: "",
                      name: "",
                      email: "",
                      phone: "",
                      role: "Contributor",
                      password: "",
                    });
                    showToast("success", "User Created!", `${userFormData.name} has been added successfully.`);
                  } else {
                    const error = await response.json();
                    showToast("error", "Error", error.error || "Failed to create user");
                  }
                } catch (error) {
                  console.error("Error creating user:", error);
                  showToast("error", "Error", "Failed to create user. Please try again.");
                }
              }}
              className="p-6 space-y-5"
            >
              {/* Avatar Upload */}
              <div className="flex flex-col items-center">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Profile Photo
                </label>
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-white text-2xl font-semibold overflow-hidden">
                    {userFormData.avatar ? (
                      <img
                        src={userFormData.avatar}
                        alt="Avatar preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    )}
                  </div>
                  <label
                    htmlFor="avatar-upload"
                    className="absolute bottom-0 right-0 w-8 h-8 bg-green-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-green-700 transition-colors shadow-lg"
                  >
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <input
                      id="avatar-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setUserFormData({ ...userFormData, avatar: reader.result as string });
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                </div>
                <p className="mt-2 text-xs text-gray-500">Click the camera icon to upload</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={userFormData.name || ""}
                  onChange={(e) => setUserFormData({ ...userFormData, name: e.target.value })}
                  placeholder="e.g., John Doe"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={userFormData.email || ""}
                  onChange={(e) => setUserFormData({ ...userFormData, email: e.target.value })}
                  placeholder="e.g., john@example.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={userFormData.phone || ""}
                  onChange={(e) => setUserFormData({ ...userFormData, phone: e.target.value })}
                  placeholder="e.g., 08012345678"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Role *
                </label>
                <select
                  required
                  value={userFormData.role || "Contributor"}
                  onChange={(e) => setUserFormData({ ...userFormData, role: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                >
                  <option value="Contributor">Contributor</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Password *
                </label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={userFormData.password || ""}
                  onChange={(e) => setUserFormData({ ...userFormData, password: e.target.value })}
                  placeholder="Min. 8 characters"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                />
                <p className="mt-1 text-xs text-gray-500">Must be at least 8 characters</p>
              </div>

              <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setIsUserModalOpen(false);
                    setUserFormData({
                      avatar: "",
                      name: "",
                      email: "",
                      phone: "",
                      role: "Contributor",
                      password: "",
                    });
                  }}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
                >
                  Add User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* User View Modal */}
      {isUserViewModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">User Details</h2>
              <button
                onClick={() => setIsUserViewModalOpen(false)}
                className="text-white/80 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              <div className="flex flex-col items-center mb-6">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-2xl font-semibold overflow-hidden">
                  {selectedUser.avatar ? (
                    <img src={selectedUser.avatar} alt={selectedUser.name} className="w-full h-full object-cover" />
                  ) : (
                    selectedUser.name.split(" ").map((n) => n[0]).join("").toUpperCase()
                  )}
                </div>
                <h3 className="mt-3 text-xl font-bold text-gray-900">{selectedUser.name}</h3>
                <span className={`mt-1 px-3 py-1 rounded-full text-xs font-semibold ${
                  selectedUser.status === "ACTIVE"
                    ? "bg-green-100 text-green-700"
                    : selectedUser.status === "SUSPENDED"
                    ? "bg-red-100 text-red-700"
                    : "bg-gray-100 text-gray-700"
                }`}>
                  {selectedUser.status}
                </span>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">Email</span>
                  <span className="font-medium text-gray-900">{selectedUser.email}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">Phone</span>
                  <span className="font-medium text-gray-900">{selectedUser.phone || "Not provided"}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">Role</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    selectedUser.role === "ADMIN"
                      ? "bg-purple-100 text-purple-700"
                      : "bg-blue-100 text-blue-700"
                  }`}>
                    {selectedUser.role}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">Total Contributed</span>
                  <span className="font-medium text-green-600">
                    ₦{selectedUser.totalContributed.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-500">Joined</span>
                  <span className="font-medium text-gray-900">
                    {new Date(selectedUser.createdAt).toLocaleDateString("en-NG", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </div>
              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => {
                    setIsUserViewModalOpen(false);
                    handleEditUser(selectedUser);
                  }}
                  className="flex-1 px-4 py-2 bg-yellow-500 text-white rounded-lg font-semibold hover:bg-yellow-600 transition-colors"
                >
                  Edit User
                </button>
                <button
                  onClick={() => setIsUserViewModalOpen(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* User Edit Modal */}
      {isUserEditModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 px-6 py-4 flex items-center justify-between sticky top-0">
              <h2 className="text-xl font-bold text-white">Edit User</h2>
              <button
                onClick={() => setIsUserEditModalOpen(false)}
                className="text-white/80 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name *</label>
                <input
                  type="text"
                  value={editUserFormData.name || ""}
                  onChange={(e) => setEditUserFormData({ ...editUserFormData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email *</label>
                <input
                  type="email"
                  value={editUserFormData.email || ""}
                  onChange={(e) => setEditUserFormData({ ...editUserFormData, email: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Phone</label>
                <input
                  type="tel"
                  value={editUserFormData.phone || ""}
                  onChange={(e) => setEditUserFormData({ ...editUserFormData, phone: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Role *</label>
                <select
                  value={editUserFormData.role || "Contributor"}
                  onChange={(e) => setEditUserFormData({ ...editUserFormData, role: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none transition-all"
                >
                  <option value="Contributor">Contributor</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Status *</label>
                <select
                  value={editUserFormData.status || "ACTIVE"}
                  onChange={(e) => setEditUserFormData({ ...editUserFormData, status: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none transition-all"
                >
                  <option value="ACTIVE">Active</option>
                  <option value="SUSPENDED">Suspended</option>
                  <option value="INACTIVE">Inactive</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  New Password <span className="text-gray-400 font-normal">(leave blank to keep current)</span>
                </label>
                <input
                  type="password"
                  value={editUserFormData.password || ""}
                  onChange={(e) => setEditUserFormData({ ...editUserFormData, password: e.target.value })}
                  placeholder="Enter new password"
                  minLength={8}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none transition-all"
                />
                <p className="mt-1 text-xs text-gray-500">Min. 8 characters if changing password</p>
              </div>
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => setIsUserEditModalOpen(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateUser}
                  className="flex-1 px-4 py-3 bg-yellow-500 text-white rounded-lg font-semibold hover:bg-yellow-600 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* User Delete Confirmation Modal */}
      {isUserDeleteModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Delete User</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete <span className="font-semibold">{selectedUser.name}</span>? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setIsUserDeleteModalOpen(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDeleteUser}
                  className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Creator View Modal */}
      {isCreatorViewModalOpen && selectedCreator && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Creator Details</h2>
              <button
                onClick={() => setIsCreatorViewModalOpen(false)}
                className="text-white/80 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Left Column - Profile Info */}
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-3xl font-semibold mx-auto overflow-hidden shadow-lg">
                      {selectedCreator.avatar ? (
                        <img src={selectedCreator.avatar} alt={selectedCreator.name} className="w-full h-full object-cover" />
                      ) : (
                        selectedCreator.name.split(" ").map((n) => n[0]).join("").toUpperCase()
                      )}
                    </div>
                    <h3 className="mt-4 text-2xl font-bold text-gray-900">{selectedCreator.name}</h3>
                    <span className={`mt-2 inline-block px-4 py-1.5 rounded-full text-sm font-semibold ${
                      selectedCreator.status === "VERIFIED"
                        ? "bg-green-100 text-green-700"
                        : selectedCreator.status === "SUSPENDED"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}>
                      {selectedCreator.status}
                    </span>
                  </div>

                  {/* Contact Information */}
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">Contact Information</h4>
                    <div className="space-y-3">
                      <div>
                        <span className="text-xs text-gray-500 block mb-1">Email</span>
                        <span className="font-medium text-gray-900 text-sm">{selectedCreator.email}</span>
                      </div>
                      <div>
                        <span className="text-xs text-gray-500 block mb-1">Phone</span>
                        <span className="font-medium text-gray-900 text-sm">{selectedCreator.phone}</span>
                      </div>
                      {selectedCreator.organization && (
                        <div>
                          <span className="text-xs text-gray-500 block mb-1">Organization</span>
                          <span className="font-medium text-gray-900 text-sm">{selectedCreator.organization}</span>
                        </div>
                      )}
                      {selectedCreator.address && (
                        <div>
                          <span className="text-xs text-gray-500 block mb-1">Address</span>
                          <span className="font-medium text-gray-900 text-sm">{selectedCreator.address}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Column - Verification & Stats */}
                <div className="space-y-6">
                  {/* Verification Details */}
                  <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-100">
                    <h4 className="text-sm font-semibold text-indigo-700 uppercase tracking-wider mb-4">Verification Details</h4>
                    <div className="space-y-3">
                      <div>
                        <span className="text-xs text-gray-600 block mb-1">ID Type</span>
                        <span className="font-medium text-gray-900 text-sm">{selectedCreator.idType.replace("_", " ")}</span>
                      </div>
                      <div>
                        <span className="text-xs text-gray-600 block mb-1">ID Number</span>
                        <span className="font-medium text-gray-900 text-sm font-mono">{selectedCreator.idNumber}</span>
                      </div>
                    </div>
                  </div>

                  {/* Statistics */}
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100">
                    <h4 className="text-sm font-semibold text-green-700 uppercase tracking-wider mb-4">Statistics</h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Pools Created</span>
                        <span className="text-2xl font-bold text-gray-900">{selectedCreator.poolsCreated}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Total Raised</span>
                        <span className="text-2xl font-bold text-green-600">
                          ₦{selectedCreator.totalRaised.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Account Information */}
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">Account Information</h4>
                    <div>
                      <span className="text-xs text-gray-500 block mb-1">Joined</span>
                      <span className="font-medium text-gray-900 text-sm">
                        {new Date(selectedCreator.createdAt).toLocaleDateString("en-NG", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Creator Delete Modal */}
      {isCreatorDeleteModalOpen && selectedCreator && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Creator</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete <span className="font-semibold">{selectedCreator.name}</span>? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setIsCreatorDeleteModalOpen(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDeleteCreator}
                  className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-green-600 border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    }>
      <AdminDashboardContent />
    </Suspense>
  );
}
