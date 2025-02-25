"use client";

import { useSearchParams } from "next/navigation";
import { check_for_cache } from "@/app/lib/cache_lib";
import { Suspense, useEffect, useState } from "react";
import { search_flight } from "../lib/search_flight";


import { FlightOffer, mapFlightOffers } from "../lib/interface";
import { Skeleton } from "antd";

export default function FlightSearch() {
    const searchParams = useSearchParams();
    const [flightData, setFlightData] = useState<FlightOffer[] | null>(null);
    
    useEffect(() => {
        async function performSearch() {
            const data: string | null = searchParams.get('data');
            if (!data) return;

            // Vérifie si les données sont déjà en cache
            const cachedValue = await check_for_cache(data);
            if (cachedValue) {
                console.log("[MUST REMOVE]🚀 Données en cache");
                const flightOffer : FlightOffer[] = await mapFlightOffers(JSON.parse(cachedValue));
                setFlightData(flightOffer);
                return;
            }

            // Si pas en cache, appeler Amadeus
            console.log("⏳ Requête envoyée à Amadeus...");
            const res = await search_flight(data);
            if (res && res.length > 0) {
                setFlightData(res);
            }
        }

        performSearch();
    }, [searchParams]);


    

    return (
        <div>
            <Skeleton loading={!flightData} active>
                <div>
                    {flightData?.map((flight: FlightOffer) => {
                        return (
                            <div key={flight.id}>
                                <h1>{flight.price.total} {flight.price.currency}</h1>
                                <h3>{flight.itineraries[0].segments[0].departure.iataCode} - {flight.itineraries[0].segments[0].arrival.iataCode}</h3>
                            </div>
                        )
                    })}
                </div>
            </Skeleton>
        </div>
    );
}
