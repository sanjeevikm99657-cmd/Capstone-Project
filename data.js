/* ==========================================================================
   Sanjay Textiles - Initial Seed & Mock Data Store (Advanced System)
   ========================================================================== */

const INITIAL_DATA = {
  // Demo Users & Credentials
  users: [
    {
      id: "usr_1",
      email: "user@sanjaytextiles.com",
      password: "password123",
      name: "Sophia Carter",
      role: "donor",
      organization: "Sanjay Fashion Enthusiast",
      points: 1280,
      carbonCredits: 14.2, // SEC Carbon Credits
      badge: "Gold Eco Champion",
      avatar: "SC",
      impact: { wasteKg: 142.5, co2SavedKg: 385.0, waterSavedL: 1420 }
    },
    {
      id: "usr_2",
      email: "boutique@sanjaytextiles.com",
      password: "password123",
      name: "Marcus Vance",
      role: "boutique",
      organization: "Vance Atelier & Tailors",
      points: 3450,
      carbonCredits: 62.0,
      badge: "Platinum Innovator",
      avatar: "MV",
      impact: { wasteKg: 620.0, co2SavedKg: 1674.0, waterSavedL: 6200 }
    },
    {
      id: "admin_1",
      email: "admin@sanjaytextiles.com",
      password: "admin123",
      name: "Sanjay Administrator",
      role: "admin",
      organization: "Sanjay Textiles Central Recycling Facility",
      points: 9999,
      carbonCredits: 500.0,
      badge: "System Super Admin",
      avatar: "ST",
      impact: { wasteKg: 18450.0, co2SavedKg: 49815.0, waterSavedL: 184500 }
    }
  ],

  // Global Community Eco Leaderboard
  leaderboard: [
    { rank: 1, name: "Marcus Vance (Vance Atelier)", category: "Garment Boutique", wasteKg: 620.0, points: 3450, avatar: "MV" },
    { rank: 2, name: "Anita Sharma (Green Stitch)", category: "Boutique Donor", wasteKg: 410.5, points: 2890, avatar: "AS" },
    { rank: 3, name: "Sophia Carter", category: "Individual Citizen", wasteKg: 142.5, points: 1280, avatar: "SC" },
    { rank: 4, name: "David Chen", category: "Individual Citizen", wasteKg: 98.0, points: 880, avatar: "DC" },
    { rank: 5, name: "Help&Weave Foundation", category: "NGO Partner", wasteKg: 85.0, points: 750, avatar: "HW" }
  ],

  // Sample Waste Pickup Requests (with generated QR Batch Codes)
  pickups: [
    {
      id: "PK-1089",
      qrCode: "ST-QR-8910-X2",
      userId: "usr_1",
      userName: "Sophia Carter",
      fabricType: "Denim & Cotton Blends",
      fabricCategory: "denim",
      weightKg: 24.5,
      condition: "Minor Wear / Pre-loved Garments",
      serviceType: "Home Pickup",
      address: "742 Evergreen Terrace, Sector 4",
      dateSlot: "2026-10-06 (Morning)",
      status: "Pending Approval",
      estPoints: 245,
      co2Offset: 66.1,
      createdAt: "2026-10-03 14:30"
    },
    {
      id: "PK-1088",
      qrCode: "ST-QR-8810-Y9",
      userId: "usr_2",
      userName: "Marcus Vance (Vance Atelier)",
      fabricType: "Pure Silk & Wool Scraps",
      fabricCategory: "silk",
      weightKg: 85.0,
      condition: "Industrial Offcuts & Fabric Scraps",
      serviceType: "Bulk Logistics Freight",
      address: "102 Industrial Garment Zone, Gate 3",
      dateSlot: "2026-10-05 (Afternoon)",
      status: "Dispatched Collector",
      estPoints: 850,
      co2Offset: 229.5,
      createdAt: "2026-10-02 09:15"
    },
    {
      id: "PK-1085",
      qrCode: "ST-QR-8510-Z4",
      userId: "usr_1",
      userName: "Sophia Carter",
      fabricType: "Synthetic Polyester T-Shirts",
      fabricCategory: "polyester",
      weightKg: 18.0,
      condition: "Worn Out Textiles",
      serviceType: "Hub Drop-off",
      address: "Sanjay Textiles Drop Bin #12",
      dateSlot: "2026-09-28",
      status: "Recycled",
      estPoints: 180,
      co2Offset: 48.6,
      createdAt: "2026-09-28 11:20"
    },
    {
      id: "PK-1080",
      qrCode: "ST-QR-8010-A1",
      userId: "usr_2",
      userName: "Marcus Vance",
      fabricType: "Cotton Roll Ends",
      fabricCategory: "cotton",
      weightKg: 150.0,
      condition: "New Factory Scrap",
      serviceType: "Bulk Logistics Freight",
      address: "102 Industrial Garment Zone",
      dateSlot: "2026-09-20",
      status: "Upcycled",
      estPoints: 1500,
      co2Offset: 405.0,
      createdAt: "2026-09-20 16:45"
    }
  ],

  // Fleet Driver Logistics Live Trackers
  fleet: [
    {
      truckId: "TRUCK-01",
      driverName: "Robert Miller",
      phone: "+1 (555) 019-2831",
      assignedRoute: "Sector 4 & Central Garment District",
      status: "En Route to Pick Up (PK-1088)",
      etaMinutes: 14,
      capacityKg: 850,
      currentLoadKg: 420
    },
    {
      truckId: "TRUCK-04",
      driverName: "Vikram Patel",
      phone: "+1 (555) 018-9942",
      assignedRoute: "Downtown NGO Drop-off Network",
      status: "Unloading at Sanjay Plant",
      etaMinutes: 2,
      capacityKg: 1200,
      currentLoadKg: 1100
    }
  ],

  // Upcycled Marketplace Inventory
  marketplace: [
    {
      id: "prod_1",
      title: "Sanjay Recycled Denim Craftsman Tote",
      category: "Fashion Accessories",
      pointsPrice: 450,
      cashPrice: 28.00,
      stock: 14,
      image: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80",
      description: "Handcrafted from 100% post-consumer discarded denim jeans. Reinforced double stitching and organic cotton lining.",
      recycledWeight: "1.2 kg denim waste diverted"
    },
    {
      id: "prod_2",
      title: "Upcycled Patchwork Quilt Blanket",
      category: "Home Decor",
      pointsPrice: 800,
      cashPrice: 55.00,
      stock: 8,
      image: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=600&q=80",
      description: "Cozy artisanal quilt crafted from soft cotton fabric offcuts collected from local tailor boutiques.",
      recycledWeight: "3.5 kg cotton scraps diverted"
    },
    {
      id: "prod_3",
      title: "Sanjay Regenerated Fiber Spool",
      category: "Raw Material",
      pointsPrice: 300,
      cashPrice: 18.50,
      stock: 50,
      image: "https://images.unsplash.com/photo-1605289982774-9a6fef564df8?auto=format&fit=crop&w=600&q=80",
      description: "Mechanically carded and spun yarn from post-industrial polyester textile waste. High tensile strength.",
      recycledWeight: "5.0 kg synthetic waste diverted"
    },
    {
      id: "prod_4",
      title: "Eco Thermal Acoustic Insulation Batts",
      category: "Building Materials",
      pointsPrice: 1200,
      cashPrice: 89.00,
      stock: 25,
      image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80",
      description: "High performance eco insulation panels made from shredded mixed textile waste. Fire resistant treated.",
      recycledWeight: "12.0 kg mixed fabric diverted"
    }
  ],

  // Collection Drop-off Hubs & NGO Locations
  hubs: [
    {
      id: "hub_1",
      name: "Sanjay Textiles Central Sorting Plant & Hub",
      address: "45 Sanjay Loop Way, Industrial Park",
      hours: "Mon - Sat: 8:00 AM - 7:00 PM",
      capacity: 82,
      acceptedTypes: ["Cotton", "Denim", "Synthetics", "Silk", "Knits"],
      contact: "+1 (800) 555-SANJAY"
    },
    {
      id: "hub_2",
      name: "GreenThread Community NGO Drop Center",
      address: "112 Charity Square, Downtown",
      hours: "Mon - Sun: 9:00 AM - 6:00 PM",
      capacity: 45,
      acceptedTypes: ["Usable Wearables", "Clean Bedding", "Shoes"],
      contact: "+1 (800) 555-WEAR"
    },
    {
      id: "hub_3",
      name: "Sanjay Circular Fiber Recovery Station",
      address: "808 Fiber Depot Road, Sector 9",
      hours: "Mon - Fri: 7:00 AM - 8:00 PM",
      capacity: 94,
      acceptedTypes: ["Industrial Offcuts", "Polyester Rolls", "Synthetic Scraps"],
      contact: "+1 (800) 555-FIBER"
    }
  ]
};

// Data Store Helper Class
class DataStore {
  constructor() {
    this.init();
  }

  init() {
    if (!localStorage.getItem('sanjay_textiles_data')) {
      localStorage.setItem('sanjay_textiles_data', JSON.stringify(INITIAL_DATA));
    }
  }

  get() {
    return JSON.parse(localStorage.getItem('sanjay_textiles_data')) || INITIAL_DATA;
  }

  save(data) {
    localStorage.setItem('sanjay_textiles_data', JSON.stringify(data));
  }

  getCurrentUser() {
    const session = JSON.parse(localStorage.getItem('sanjay_textiles_session'));
    if (!session) return null;
    const store = this.get();
    return store.users.find(u => u.id === session.userId) || null;
  }

  setCurrentUserSession(user) {
    localStorage.setItem('sanjay_textiles_session', JSON.stringify({
      userId: user.id,
      role: user.role,
      loginTime: new Date().toISOString()
    }));
  }

  clearSession() {
    localStorage.removeItem('sanjay_textiles_session');
  }
}

window.db = new DataStore();
