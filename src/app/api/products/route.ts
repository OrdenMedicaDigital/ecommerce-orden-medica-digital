import { NextRequest, NextResponse } from "next/server";

// Sample product data
const products = [
  {
    id: "product-1",
    title: "Complete Blood Count",
    description: "Comprehensive blood analysis including red and white blood cell count, hemoglobin levels, and platelet count.",
    image: "/images/l.jpg",
    price: 25000,
    discount: 15, // percentage
    examsIncluded: ["Hemoglobin", "Hematocrit", "WBC Count", "RBC Count", "Platelet Count"]
  },
  {
    id: "product-2",
    title: "Metabolic Panel",
    description: "Evaluates kidney function, liver function, and electrolyte balance through a series of blood tests.",
    image: "/images/profile.jpg",
    price: 35000,
    discount: 10,
    examsIncluded: ["Glucose", "Calcium", "Sodium", "Potassium", "Chloride", "Carbon Dioxide", "Creatinine", "Albumin"]
  },
  {
    id: "product-3",
    title: "Lipid Profile",
    description: "Measures cholesterol levels and triglycerides to assess cardiovascular health and risk factors.",
    image: "/images/cover.jpg",
    price: 28000,
    discount: 5,
    examsIncluded: ["Total Cholesterol", "HDL", "LDL", "Triglycerides"]
  },
  {
    id: "product-4",
    title: "Thyroid Function Test",
    description: "Evaluates thyroid hormone levels to detect conditions like hypothyroidism or hyperthyroidism.",
    image: "/images/z.jpg",
    price: 32000,
    discount: 0,
    examsIncluded: ["TSH", "T3", "T4", "Free T4"]
  },
  {
    id: "product-5",
    title: "Diabetes Screening",
    description: "Assesses blood glucose levels and other markers to diagnose diabetes or prediabetes.",
    image: "/images/demo.png",
    price: 30000,
    discount: 20,
    examsIncluded: ["Fasting Blood Glucose", "HbA1c", "Glucose Tolerance Test"]
  }
];

export const GET = async (req: NextRequest) => {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    
    // If ID is provided, return the specific product
    if (id) {
      const product = products.find(p => p.id === id);
      if (!product) {
        return NextResponse.json({ error: "Product not found" }, { status: 404 });
      }
      return NextResponse.json(product);
    }
    
    // Otherwise return all products
    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}