// Mock data for the Aakaa Admin Dashboard

export const mockRevenueData = {
  totalRevenue: 125400,
  monthlyGrowth: 15.4,
  activeSessions: 42,
  statsByRange: {
    'Today': {
      revenue: 4200,
      growth: 2.1,
      sessions: 5,
      newUsers: 8,
      revenueChange: '+5.2%',
      growthChange: '+0.4%',
      sessionsChange: '+1',
      usersChange: '+2'
    },
    '7D': {
      revenue: 28400,
      growth: 8.2,
      sessions: 32,
      newUsers: 45,
      revenueChange: '+10.5%',
      growthChange: '+1.2%',
      sessionsChange: '+4',
      usersChange: '+12'
    },
    '30D': {
      revenue: 125400,
      growth: 15.4,
      sessions: 124,
      newUsers: 186,
      revenueChange: '+12.5%',
      growthChange: '+2.1%',
      sessionsChange: '+18',
      usersChange: '+32'
    },
    'All Time': {
      revenue: 842000,
      growth: 42.8,
      sessions: 1420,
      newUsers: 2840,
      revenueChange: '+15.2%',
      growthChange: '+4.5%',
      sessionsChange: '+85',
      usersChange: '+120'
    }
  },
  transactions: [
    { id: "TXN001", user: "Amit Sharma", therapist: "Dr. Ananya Singh", amount: 1500, status: "Success", date: "2026-04-15" },
    { id: "TXN002", user: "Priya Verma", therapist: "Dr. Rohan Mehra", amount: 1200, status: "Success", date: "2026-04-14" },
    { id: "TXN003", user: "Siddharth J.", therapist: "Dr. Neha Kapoor", amount: 2000, status: "Pending", date: "2026-04-14" },
    { id: "TXN004", user: "Kavita R.", therapist: "Dr. Ananya Singh", amount: 1500, status: "Success", date: "2026-04-13" },
    { id: "TXN005", user: "Rahul G.", therapist: "Dr. Rohan Mehra", amount: 1200, status: "Failed", date: "2026-04-12" },
  ]
};

export const mockTherapists = [
  { id: 1, name: "Dr. Ananya Singh", specialty: "Anxiety & Depression", views: 1240, bookings: 85, rating: 4.9 },
  { id: 2, name: "Dr. Rohan Mehra", specialty: "Relationship Counseling", views: 980, bookings: 62, rating: 4.7 },
  { id: 3, name: "Dr. Neha Kapoor", specialty: "Child Psychology", views: 850, bookings: 45, rating: 4.8 },
  { id: 4, name: "Dr. Vikram Seth", specialty: "Cognitive Behavioral Therapy", views: 720, bookings: 38, rating: 4.6 },
  { id: 5, name: "Dr. Sarah Khan", specialty: "Stress Management", views: 1100, bookings: 78, rating: 4.9 },
];

export const mockWaitlist = [
  { id: 1, name: "Arjun Singh", email: "arjun@example.com", concern: "Anxiety", date: "2026-04-16" },
  { id: 2, name: "Meera D.", email: "meera@example.com", concern: "Depression", date: "2026-04-15" },
  { id: 3, name: "Suresh K.", email: "suresh@example.com", concern: "Stress", date: "2026-04-15" },
  { id: 4, name: "Anita B.", email: "anita@example.com", concern: "Relationships", date: "2026-04-14" },
];

export const mockBlogs = [
  { id: 1, title: "Managing Work Stress", author: "Dr. Ananya Singh", status: "Published", views: 450, date: "2026-04-10" },
  { id: 2, title: "The Power of Mindfulness", author: "Dr. Rohan Mehra", status: "Published", views: 320, date: "2026-04-08" },
  { id: 3, title: "Understanding Attachment Styles", author: "Admin", status: "Draft", views: 0, date: "2026-04-14" },
];

export const mockBookings = [
  { id: "BK001", user: "Amit Sharma", therapist: "Dr. Ananya Singh", time: "2026-04-17 10:00 AM", status: "Confirmed" },
  { id: "BK002", user: "Priya Verma", therapist: "Dr. Rohan Mehra", time: "2026-04-18 02:30 PM", status: "Confirmed" },
  { id: "BK003", user: "Siddharth J.", therapist: "Dr. Neha Kapoor", time: "2026-04-17 11:30 AM", status: "Pending" },
];
