const mongoose = require('mongoose');
require('dotenv').config();
const Therapist = require('./models/Therapist');
const Blog = require('./models/Blog');
const User = require('./models/User');
const YogaClass = require('./models/YogaClass');
const YogaBooking = require('./models/YogaBooking');
const bcrypt = require('bcryptjs');

const therapists = [
  {
    name: "Dr. Sarah Jenkins",
    title: "Clinical Psychologist",
    email: "sarah.jenkins@aakaa.com",
    specialties: ["Anxiety", "Depression", "Work Stress"],
    rating: 4.9,
    reviews: 128,
    price: "₹850",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=500&auto=format&fit=crop&q=60",
    bio: "Dr. Sarah Jenkins is a clinical psychologist with over 10 years of experience in helping individuals navigate anxiety and depression. She specializes in cognitive behavioral therapy and mindfulness-based stress reduction.",
    availability: ["Monday", "Wednesday", "Friday"],
    views: 1240,
    bookings: 450
  },
  {
    name: "Dr. Michael Chen",
    title: "Licensed Therapist",
    email: "michael.chen@aakaa.com",
    specialties: ["Relationships", "Trauma", "Self Confidence"],
    rating: 4.8,
    reviews: 94,
    price: "₹850",
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=500&auto=format&fit=crop&q=60",
    bio: "Dr. Michael Chen focuses on relationship dynamics and trauma recovery. His approach is empathetic and evidence-based, aimed at building self-confidence and emotional resilience.",
    availability: ["Tuesday", "Thursday", "Saturday"],
    views: 980,
    bookings: 310
  },
  {
    name: "Dr. Emily Taylor",
    title: "Behavioral Therapist",
    email: "emily.taylor@aakaa.com",
    specialties: ["Emotional Burnout", "Life Transitions"],
    rating: 5.0,
    reviews: 215,
    price: "₹850",
    image: "https://images.unsplash.com/photo-1594824436998-0382f6e72c0a?w=500&auto=format&fit=crop&q=60",
    bio: "Specializing in emotional burnout and life transitions, Dr. Emily Taylor helps clients find balance and purpose through behavioral interventions and goal-oriented therapy.",
    availability: ["Monday", "Tuesday", "Friday"],
    views: 2100,
    bookings: 890
  },
  {
    name: "Dr. Anita Sharma",
    title: "Counseling Psychologist",
    email: "anita.sharma@aakaa.com",
    specialties: ["Anxiety", "Relationships", "Family Dynamics"],
    rating: 4.7,
    reviews: 86,
    price: "₹850",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&auto=format&fit=crop&q=60",
    bio: "Dr. Anita Sharma has extensive experience in counseling individuals and families. She focuses on anxiety management and improving family dynamics through open communication.",
    availability: ["Wednesday", "Thursday"],
    views: 750,
    bookings: 220
  },
  {
    name: "Mr. Rajeev Verma",
    title: "Cognitive Behavioral Therapist",
    email: "rajeev.verma@aakaa.com",
    specialties: ["Depression", "OCD", "Phobias"],
    rating: 4.9,
    reviews: 154,
    price: "₹499",
    image: "https://images.unsplash.com/photo-1537368910025-702800bf8ec0?w=500&auto=format&fit=crop&q=60",
    bio: "Rajeev Verma is a dedicated CBT practitioner specializing in depression, OCD, and phobias. He works closely with clients to challenge negative thought patterns and behaviors.",
    availability: ["Monday", "Wednesday", "Thursday"],
    views: 1100,
    bookings: 410
  },
  {
    name: "Dr. Priya Patel",
    title: "Child & Adolescent Therapist",
    email: "priya.patel@aakaa.com",
    specialties: ["Child Therapy", "ADHD", "Academic Stress"],
    rating: 5.0,
    reviews: 201,
    price: "₹499",
    image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=500&auto=format&fit=crop&q=60",
    bio: "Dr. Priya Patel specializes in child and adolescent mental health, with a focus on ADHD and academic stress. She provides a safe and supportive environment for young clients.",
    availability: ["Tuesday", "Friday"],
    views: 1800,
    bookings: 670
  }
];

const blogs = [
  {
    title: "How to Integrate Mindfulness Into a Busy Academic Schedule",
    author: "Dr. Sarah Jenkins",
    status: "Published",
    snippet: "Discover simple, actionable steps to find moments of peace between classes and study sessions.",
    content: "# Mindfulness in Academic Life\n\nBeing a student or an academic often means juggling deadlines, exams, and personal life. The pressure can be overwhelming, leading to burnout and stress. However, integrating mindfulness into your daily routine doesn't require hours of meditation. It can be as simple as finding micro-moments of peace.",
    date: "Dec 12, 2025",
    readTime: "4 min read",
    image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=2070&auto=format&fit=crop",
    slug: "mindfulness-in-academic-life",
    seoTitle: "Mindfulness in Academic Life",
    seoDescription: "Discover simple, actionable steps to find moments of peace between classes and study sessions."
  },
  {
    title: "Understanding and Managing Common Anxiety Triggers",
    author: "Dr. Michael Chen",
    status: "Published",
    snippet: "Learn how to identify what causes your anxiety to spike and tools to manage it effectively.",
    content: "# Understanding Anxiety Triggers\n\nAnxiety isn't always random. While it can feel like it comes out of nowhere, it is often tied to specific **triggers**—situations, environments, or even thoughts that signal to your brain that you are in danger.",
    date: "Dec 15, 2025",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1474418397713-7ede21d4611f?q=80&w=2070&auto=format&fit=crop",
    slug: "understanding-anxiety-triggers",
    seoTitle: "Managing Anxiety Triggers",
    seoDescription: "Learn how to identify what causes your anxiety to spike and tools to manage it effectively."
  },
  {
    title: "The Psychological Power of a Daily Routine",
    author: "Dr. Emily Taylor",
    status: "Published",
    snippet: "Why structuring your day can significantly reduce decision fatigue and improve your mental health.",
    content: "# The Psychological Power of Daily Routine\n\nIn an unpredictable world, a daily routine serves as an anchor. Psychological studies consistently show that having a structured routine can significantly lower stress levels and improve mental well-being.",
    date: "Dec 18, 2025",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?q=80&w=2068&auto=format&fit=crop",
    slug: "power-of-routine",
    seoTitle: "Power of Daily Routine",
    seoDescription: "Why structuring your day can significantly reduce decision fatigue and improve your mental health."
  }
];

const yogaClasses = [
  {
    title: "Gentle Vinyasa for Stress Relief",
    instructorName: "Elena Rostova",
    instructorTitle: "Yoga & Breathwork Coach",
    date: "Every Saturday",
    time: "08:30 AM",
    duration: "60 mins",
    price: 499,
    capacity: 20,
    bookedSpots: 0,
    description: "Flow through calming sequences designed to release tension from the body, quiet the mind, and restore emotional balance. Perfect for all skill levels.",
    level: "All Levels",
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=2000&auto=format&fit=crop"
  },
  {
    title: "Pranayama & Sound Meditation",
    instructorName: "Swami Dhyan",
    instructorTitle: "Meditation & Sound Therapist",
    date: "Every Wednesday",
    time: "06:30 PM",
    duration: "45 mins",
    price: 399,
    capacity: 15,
    bookedSpots: 0,
    description: "Focus on control of breathing (Pranayama) followed by a soothing sound bath journey using Tibetan singing bowls to soothe the nervous system.",
    level: "Beginner",
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=2000&auto=format&fit=crop"
  },
  {
    title: "Yin Yoga for Deep Restoration",
    instructorName: "Elena Rostova",
    instructorTitle: "Yoga & Breathwork Coach",
    date: "Every Friday",
    time: "07:00 PM",
    duration: "75 mins",
    price: 599,
    capacity: 12,
    bookedSpots: 0,
    description: "Hold passive poses for longer periods to target deep connective tissues, improve flexibility, and release stored trauma or physical blockages.",
    level: "Intermediate",
    image: "https://images.unsplash.com/photo-1599447421416-3414500d18a5?q=80&w=2000&auto=format&fit=crop"
  },
  {
    title: "Kundalini Yoga for Mental Focus",
    instructorName: "Yogi Amrit",
    instructorTitle: "Kundalini & Meditation Teacher",
    date: "Every Thursday",
    time: "07:00 AM",
    duration: "60 mins",
    price: 499,
    capacity: 15,
    bookedSpots: 0,
    description: "Combine active breathwork, mudras, vocal chanting, and dynamic movements to balance the glandular system, strengthen the nervous system, and build absolute mental clarity.",
    level: "All Levels",
    image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?q=80&w=2000&auto=format&fit=crop"
  },
  {
    title: "Restorative Yoga for Trauma Recovery",
    instructorName: "Dr. Sarah Jenkins",
    instructorTitle: "Clinical Psychologist & Somatic Guide",
    date: "Every Tuesday",
    time: "06:00 PM",
    duration: "75 mins",
    price: 599,
    capacity: 10,
    bookedSpots: 0,
    description: "A gentle somatic therapy class designed to support emotional release. Features long, fully-supported postures using props to release physical blockages and settle anxiety.",
    level: "Beginner",
    image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=2000&auto=format&fit=crop"
  },
  {
    title: "Hatha Flow for Anxiety Release",
    instructorName: "Swami Dhyan",
    instructorTitle: "Meditation & Sound Therapist",
    date: "Every Monday",
    time: "05:30 PM",
    duration: "60 mins",
    price: 450,
    capacity: 18,
    bookedSpots: 0,
    description: "Classical yoga postures combined with steady, conscious breathing patterns. Focuses on physical grounding, stability, and slowing down the active, racing mind.",
    level: "Beginner",
    image: "https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?q=80&w=2000&auto=format&fit=crop"
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB for seeding...');

    // Clear existing collections
    await Therapist.deleteMany({});
    await Blog.deleteMany({});
    await User.deleteMany({});
    await YogaClass.deleteMany({});
    await YogaBooking.deleteMany({});
    console.log('🗑️  Cleared existing collections');

    // Create Admin User
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);
    
    await User.create({
      email: 'admin@aakaa.com',
      password: hashedPassword,
      role: 'admin'
    });
    console.log('👤 Admin User created');

    // Insert new data
    await Therapist.insertMany(therapists);
    await Blog.insertMany(blogs);
    await YogaClass.insertMany(yogaClasses);
    
    console.log('🌱 Database Seeded successfully!');

    process.exit();
  } catch (err) {
    console.error('❌ Error seeding database:', err);
    process.exit(1);
  }
};

seedDB();
