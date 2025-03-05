import { getPlans } from "@/db/queries";
import { NextRequest, NextResponse } from "next/server";

// Sample medical pack data for e-commerce
const samplePacks = [
  {
    id: "basic-pack",
    name: "Basic Health Checkup",
    description: "Essential health examination package including blood tests, urine analysis, and basic physical assessment.",
    price: 15000,
    ordersIncluded: 4,
    image: "/images/cover.jpg"
  },
  {
    id: "premium-pack",
    name: "Premium Health Screening",
    description: "Comprehensive health examination package including all basic tests plus cardiac evaluation, cancer markers, and vitamin levels.",
    price: 45000,
    ordersIncluded: 12,
    image: "/images/profile.jpg"
  },
  {
    id: "executive-pack",
    name: "Executive Health Assessment",
    description: "Complete executive health package including all premium tests plus specialized imaging, stress test, and detailed consultation.",
    price: 75000,
    ordersIncluded: 20,
    image: "/images/z.jpg"
  },
  {
    id: "women-pack",
    name: "Women's Health Package",
    description: "Specialized health checkup for women including gynecological assessment, breast examination, bone density test, and hormone panel.",
    price: 35000,
    ordersIncluded: 8
  },
  {
    id: "men-pack",
    name: "Men's Health Package",
    description: "Specialized health checkup for men including prostate screening, testosterone levels, and cardiovascular risk assessment.",
    price: 30000,
    ordersIncluded: 7
  },
  {
    id: "senior-pack",
    name: "Senior Wellness Package",
    description: "Comprehensive health assessment designed for seniors, including bone density scan, cognitive assessment, and medication review.",
    price: 40000,
    ordersIncluded: 10
  }
];

export const GET = async (req: NextRequest) => {
  try {
    // Try to get plans from the database
    const dbPlans = await getPlans();
    
    // If we have plans in the database, return those
    if (dbPlans && dbPlans.length > 0) {
      return NextResponse.json(dbPlans);
    }
    
    // Otherwise return our sample packs for testing
    return NextResponse.json(samplePacks);
  } catch (error) {
    console.error("Error fetching plans:", error);
    // In case of database error, return our sample packs
    return NextResponse.json(samplePacks);
  }
}