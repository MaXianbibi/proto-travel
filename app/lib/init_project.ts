"use server";

import * as fs from 'fs';
import csv from 'csv-parser';


import { Airport, City } from '@/app/lib/interface';
import { insertManyAddresses } from './db_func';

import Amadeus from 'amadeus';



async function get_airports(): Promise<Airport[]> {
    return new Promise((resolve, reject) => {
        const results: Airport[] = [];

        fs.createReadStream('airports.csv')
            .pipe(csv({
                mapHeaders: ({ header }: { header: string }) => header.replace(/"/g, '').trim(), // Nettoyage des headers
                skipLines: 0
            }))
            .on('data', (data) => {
                const airport: Airport = {
                    id: Number(data.id) || 0,  // Convertit en nombre
                    ident: data.ident || '',
                    type: data.type || '',
                    name: data.name || '',
                    latitude_deg: Number(data.latitude_deg) || 0,
                    longitude_deg: Number(data.longitude_deg) || 0,
                    elevation_ft: data.elevation_ft ? Number(data.elevation_ft) : null,
                    continent: data.continent || '',
                    iso_country: data.iso_country || '',
                    iso_region: data.iso_region || '',
                    municipality: data.municipality || '',
                    scheduled_service: data.scheduled_service || '',
                    icao_code: data.icao_code || null,
                    iata_code: data.iata_code || null,
                    gps_code: data.gps_code || null,
                    local_code: data.local_code || null,
                    home_link: data.home_link || null,
                    wikipedia_link: data.wikipedia_link || null,
                    keywords: data.keywords || null,
                    full_name_country: null
                };

                results.push(airport);
            })
            .on('end', () => {
                resolve(results);
            })
            .on('error', (error) => {
                console.error("Erreur lors de la lecture du CSV ❌", error);
                reject(error);
            });
    });
}



async function get_countries(): Promise<City[]> {
    const results: City[] = [];

    fs.createReadStream('countries.csv')
        .pipe(csv({
            mapHeaders: ({ header }) => header.replace(/"/g, '').trim(), // Nettoie les headers
            skipLines: 0
        }))
        .on('data', (data) => {
            const city: City = {
                id: Number(data.id) || 0, // Convertit en nombre
                code: data.code || '',
                name: data.name || '',
                continent: data.continent || '',
                wikipedia_link: data.wikipedia_link || '',
                keywords: data.keywords || '',
            };

            results.push(city);
        })
        .on('end', () => {
        })
        .on('error', (error) => {
            console.error("Erreur lors de la lecture du fichier CSV :", error);
        });

    return results;

}




export default async function initProject() {
    // const countries = await get_countries();
    // const airports = await get_airports();

    // const large_airports = []
    // const countryMap = new Map(countries.map(country => [country.code, country.name]));

    // for (const airport of airports) {
    //     if (['large_airport'].includes(airport.type) && (airport.icao_code || airport.iata_code)) {
    //         airport.full_name_country = countryMap.get(airport.iso_country) || null;
    //         large_airports.push(airport);
    //     }
    // }


    // await insertManyAddresses(large_airports)

    // // for (const airport of airports) {
    // //     if (['large_airport', 'medium_airport', 'small_airport'].includes(airport.type) && (airport.icao_code || airport.iata_code)) {
    // //         airport.full_name_country = countryMap.get(airport.iso_country) || null;
    // //         large_airports.push(airport);
    // //     }
    // // }


    // console.log("Aéroports importés :", large_airports);
    console.log("🚀 Initialisation du projet");


    try {

        const res = await amadeus.shopping.flightOffersSearch.get({
            originLocationCode: 'CUN',
            destinationLocationCode: 'LAX',
            departureDate: '2025-06-01',
            returnDate: '2025-06-10',
            adults: 1,
            currencyCode: 'CAD',
        });
        const sort_by_price = res.data.sort((a: any, b: any) => a.price.total - b.price.total)
        fs.writeFileSync('flights.json', JSON.stringify(sort_by_price, null, 2))
    } catch (error) {
        console.error("❌ Erreur lors de la recherche de vols :", error);
    }


}