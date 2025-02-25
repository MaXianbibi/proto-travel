"use server"

import prisma from "@/app/lib/prisma";
import { Airport } from "@/app/lib/interface";



export async function insertManyAddresses(airports: Airport[]) {
    try {
        const result = await prisma.airport.createMany({
            data: airports,
            skipDuplicates: true,
        });

        console.log(`✅ ${result.count} adresses insérées avec succès !`);
    } catch (error) {
        console.error("❌ Erreur lors de l'insertion :", error);
    }
}

export async function search_airport(name: string): Promise<Airport[]>{
    console.log("🔍 Recherche de l'aéroport :", name);
    if (name.length < 2) {
        return [];
    }

    try {
        const results = await prisma.airport.findMany({
          where: {
            OR: [
              { name: { contains: name, mode: "insensitive" } },
              { full_name_country: { contains: name, mode: "insensitive" } },
              { iata_code: { contains: name, mode: "insensitive" } },
              { keywords: { contains: name, mode: "insensitive" } },
              { municipality: { contains: name, mode: "insensitive" } },
            ],
          },
          orderBy: { name: "asc" },
          take: 10, // Limite
        });


        const airports : Airport[] = results.map((airport) => {
            return {
                id: airport.id,
                ident: airport.ident,
                type: airport.type,
                name: airport.name,
                latitude_deg: airport.latitude_deg,
                longitude_deg: airport.longitude_deg,
                elevation_ft: airport.elevation_ft,
                continent: airport.continent,
                iso_country: airport.iso_country,
                iso_region: airport.iso_region,
                municipality: airport.municipality,
                scheduled_service: airport.scheduled_service,
                icao_code: airport.icao_code,
                iata_code: airport.iata_code,
                gps_code: airport.gps_code,
                local_code: airport.local_code,
                home_link: airport.home_link,
                wikipedia_link: airport.wikipedia_link,
                keywords: airport.keywords,
                full_name_country: airport.full_name_country,
            };
        })
       
        return airports

    } catch (error) {
        console.error("❌ Erreur lors de la recherche :", error);

        return [];

    }

}