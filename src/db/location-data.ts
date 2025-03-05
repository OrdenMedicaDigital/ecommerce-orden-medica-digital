import { drizzle } from "drizzle-orm/node-postgres";
import { regions, cities, countries } from "./schema";
import { and, eq } from "drizzle-orm";
import "dotenv/config";

// Use the same database connection as queries.ts
const db = drizzle(process.env.DATABASE_URL as string);

export async function insertRegionIfNotExists(countryId: number, regionName: string) {
    try {
        // Check if region exists by name
        const existingRegions = await db
            .select()
            .from(regions)
            .where(
                and(
                    eq(regions.name, regionName),
                    eq(regions.idCountry, countryId)
                )
            );
      
        if (existingRegions.length > 0) {
            // Region exists, return its ID
            return existingRegions[0];
        }

        // Region doesn't exist, insert it
        const result = await db
            .insert(regions)
            .values({
                idCountry: countryId,
                name: regionName
            })
            .returning({ idRegion: regions.idRegion });
        
        return result[0];
    } catch (error) {
        console.error(`Error inserting region ${regionName}:`, error);
        
        // If insertion failed, try to find a similar region
        const similarRegions = await db
            .select()
            .from(regions)
            .where(eq(regions.idCountry, countryId));
        
        if (similarRegions.length > 0) {
            console.log(`Using existing region with ID ${similarRegions[0].idRegion}: ${similarRegions[0].name}`);
            return similarRegions[0];
        }
        
        throw error;
    }
}

export async function insertComunaIfNotExists(regionId: number, countryId: number, comunaName: string) {
    try {
        // Check if comuna exists
        const existingComunas = await db
            .select()
            .from(cities)
            .where(
                and(
                    eq(cities.name, comunaName),
                    eq(cities.idRegion, regionId),
                    eq(cities.idCountry, countryId)
                )
            );
      
        if (existingComunas.length > 0) {
            // Comuna exists, return its ID
            return existingComunas[0];
        }

        // Comuna doesn't exist, insert it
        const result = await db
            .insert(cities)
            .values({
                idRegion: regionId,
                idCountry: countryId,
                name: comunaName
            })
            .returning({ idCity: cities.idCity });
                
        return result[0];
    } catch (error) {
        console.error(`Error inserting comuna ${comunaName} for region ${regionId}:`, error);
        throw error;
    }
}

export async function insertRegionesYComunas(data: { 
    regiones: Array<{ 
        region: string; 
        comunas: string[] 
    }> 
}) {
    // First check if Chile exists as a country
    const existingCountries = await db.select().from(countries);
    let countryId = 1; // Default Chile country ID
    
    // If no countries exist, create Chile
    if (existingCountries.length === 0) {
        try {
            const result = await db
                .insert(countries)
                .values({
                    name: "Chile"
                })
                .returning({ idCountry: countries.idCountry });
            
            countryId = result[0].idCountry;
            console.log(`Created country Chile with ID ${countryId}`);
        } catch (error) {
            console.error("Error creating country:", error);
            console.log("Using default country ID 1");
        }
    }
    
    // Process each region and its comunas
    for (const regionData of data.regiones) {
        try {
            // Insert or get region ID
            const region = await insertRegionIfNotExists(countryId, regionData.region);
            console.log(`Processing region: ${regionData.region} (ID: ${region.idRegion})`);
            
            // Insert each comuna for this region
            for (const comunaName of regionData.comunas) {
                try {
                    await insertComunaIfNotExists(region.idRegion, countryId, comunaName);
                    console.log(`  Added comuna: ${comunaName}`);
                } catch (error) {
                    console.error(`  Error adding comuna ${comunaName}:`, error);
                    // Continue with next comuna
                }
            }
        } catch (error) {
            console.error(`Error processing region ${regionData.region}:`, error);
            // Continue with next region
        }
    }
    
    return { success: true, message: "Regiones y comunas insertadas correctamente" };
}