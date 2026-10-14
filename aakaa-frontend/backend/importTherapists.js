const mongoose = require('mongoose');
require('dotenv').config({ path: __dirname + '/.env' });
const Therapist = require('./models/Therapist');

const therapistsData = [
  {
    name: "Siyona Rajeevan VC",
    title: "Consultant Psychologist & Educator",
    email: "",
    specialties: ["Mental Health", "Emotional Well-being", "Student Guidance", "School Counselling", "Personal Growth", "Women's Development"],
    rating: 5.0,
    reviews: 0,
    price: "₹850",
    image: "",
    bio: "Consultant Psychologist & Educator with a Master's in Clinical & Counselling Psychology. Experienced in clinical consultation, community development, mental-health promotion, education, and school counselling with a dedicated client-centred approach.",
    availability: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    bookings: 0,
    views: 0,
    status: "approved"
  },
  {
    name: "Surya P. S.",
    title: "Consultant Psychologist",
    email: "",
    specialties: ["Anxiety", "Emotional & Behavioural Concerns", "Adjustment Difficulties", "CBT & REBT", "Psychological Assessment"],
    rating: 5.0,
    reviews: 0,
    price: "₹850",
    image: "",
    bio: "Consultant Psychologist holding an MSc in Clinical and Counselling Psychology. Specializes in anxiety, emotional/behavioural concerns, and adjustment difficulties using Cognitive Behavioural Therapy (CBT), REBT, and EMDR-informed relaxation techniques.",
    availability: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    bookings: 0,
    views: 0,
    status: "approved"
  },
  {
    name: "Sony Ulahannan",
    title: "Consultant Psychologist",
    email: "",
    specialties: ["Anxiety", "Depression", "ADHD", "Autism Support", "Play Therapy", "Child & Adolescent Therapy"],
    rating: 5.0,
    reviews: 0,
    price: "₹850",
    image: "",
    bio: "Consultant Psychologist with an MSc in Clinical & Counselling Psychology, Advanced Diploma in School Counselling, and Certification in Play Therapy. Dedicated to helping children and adolescents navigate emotional, behavioural, academic, and neurodevelopmental challenges.",
    availability: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Sunday"],
    bookings: 0,
    views: 0,
    status: "approved"
  },
  {
    name: "Amrutha K. V.",
    title: "Consultant Psychologist",
    email: "",
    specialties: ["Psychotherapy", "Behavioural Analysis", "Resilience", "CBT", "DBT", "MBCT"],
    rating: 5.0,
    reviews: 0,
    price: "₹850",
    image: "",
    bio: "Consultant Psychologist with over 3 years of clinical practice holding a Master's & Bachelor's in Clinical Psychology. Specializes in personalized psychotherapy, behavioural analysis, CBT, Dialectical Behaviour Therapy (DBT), and mindfulness-based emotional resilience.",
    availability: ["Thursday", "Friday", "Saturday"],
    bookings: 0,
    views: 0,
    status: "approved"
  },
  {
    name: "Kashika Ramamurthy",
    title: "Counsellor & Psychotherapist",
    email: "",
    specialties: ["Anxiety", "Depression", "Relationship Concerns", "Neurodivergent Support", "Trauma-Informed Care", "Self Exploration"],
    rating: 5.0,
    reviews: 0,
    price: "₹850",
    image: "",
    bio: "Counsellor & Psychotherapist holding an MSc in Clinical and Counselling Psychology. Providing queer-affirmative, neurodivergent-affirming, and trauma-informed care through REBT, Emotion-Focused Therapy, and creative arts-based psychological modalities.",
    availability: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    bookings: 0,
    views: 0,
    status: "approved"
  },
  {
    name: "Supriya G. A.",
    title: "Clinical & Counselling Psychologist",
    email: "",
    specialties: ["Anxiety", "Self-Esteem", "Interpersonal Concerns", "Student Well-being", "SEL & Life Skills"],
    rating: 5.0,
    reviews: 0,
    price: "₹850",
    image: "",
    bio: "Clinical and Counselling Psychologist holding an MSc in Clinical & Counselling Psychology. Experienced in student well-being, individual counselling, and social-emotional learning (SEL) initiatives focused on accessible, empathetic, and meaningful mental health support.",
    availability: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    bookings: 0,
    views: 0,
    status: "approved"
  }
];

async function seed() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected!');

    // First delete any previous entries to avoid duplicates
    await Therapist.deleteMany({});
    console.log('Existing therapists cleared.');

    const created = await Therapist.insertMany(therapistsData);
    console.log(`✅ Successfully added ${created.length} therapists to the database:`);
    created.forEach((t, i) => {
      console.log(`  ${i + 1}. ${t.name} (${t.title}) - ${t.price}`);
    });

    process.exit(0);
  } catch (err) {
    console.error('❌ Error seeding therapists:', err);
    process.exit(1);
  }
}

seed();
