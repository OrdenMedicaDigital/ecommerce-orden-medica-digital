import { db } from "../db/queries";
import { regions, cities } from "../db/schema";
import "dotenv/config";

async function main() {
  try {
    console.log("Checking regions and comunas in the database...");
    
    // Get count of regions
    const regionsResult = await db.select().from(regions);
    console.log(`Total regions: ${regionsResult.length}`);
    
    // Get count of cities/comunas
    const citiesResult = await db.select().from(cities);
    console.log(`Total comunas: ${citiesResult.length}`);
    
    // Show regions
    console.log("\nRegions:");
    regionsResult.forEach(region => {
      console.log(`${region.idRegion}: ${region.name}`);
    });
    
    // Show sample of comunas (first 10)
    console.log("\nSample of comunas (first 10):");
    citiesResult.slice(0, 10).forEach(city => {
      console.log(`${city.idCity}: ${city.name} (Region ID: ${city.idRegion})`);
    });
    
  } catch (error) {
    console.error("Error checking database:", error);
  } finally {
    process.exit(0);
  }
}

main();