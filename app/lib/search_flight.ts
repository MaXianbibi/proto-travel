"use server"

import amadeus from "@/app/lib/amadeus"

import { Amenity, FareDetails, FlightOffer, FlightQuery, FlightSegment, Itinerary, mapFlightOffers, TravelerPricing } from "@/app/lib/interface";
import { decryptParams } from "./encrypt";
import client from "./redis";

export async function search_flight(data: string): Promise<FlightOffer[] | null> {

    const query : Record<string, string> | null = await decryptParams(data);
    if (!query) {
        console.log("invalide query");
        return [];
    }
    
    const flightQuery : FlightQuery = {
        from: query.from,
        to: query.to,
        departureDate: query.departureDate,
        returnDate: query.returnDate,
        adults: parseInt(query.adults),
        currencyCode: query.currency
    }

    if (!amadeus) {
        console.log("Amadeus n'est pas connecté");
        return null;
    }

    try {
        console.log("🔍 Recherche de vols pour", flightQuery);
        const res = await amadeus.shopping.flightOffersSearch.get({
            originLocationCode: flightQuery.from,
            destinationLocationCode: flightQuery.to,
            departureDate: flightQuery.departureDate,
            returnDate: flightQuery.returnDate,
            adults: flightQuery.adults,
            currencyCode: flightQuery.currencyCode,
        });

        const sort_by_price = res.data.sort((a: any, b: any) => a.price.total - b.price.total)
        const json_data = JSON.stringify(sort_by_price, null, 2)

        client.setEx(data, 60 * 30, json_data);


        





        return await mapFlightOffers(sort_by_price);
    } catch (error) {
        console.error("❌ Erreur lors de la recherche de vols :", error);
        return null
    }
}
