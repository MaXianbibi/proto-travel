"use client";

import { useSearchParams } from "next/navigation";
import { check_for_cache } from "@/app/lib/cache_lib";
import { Suspense, useEffect, useState } from "react";
import { search_flight } from "../lib/search_flight";


import { FlightOffer, FlightQuery, mapFlightOffers } from "../lib/interface";
import { Skeleton } from "antd";

import { DateTime } from "luxon";

import { useRouter } from 'next/navigation';

import { get_name_from_iata_airline } from "@/app/lib/db_func"
import Image from 'next/image';


export default function FlightSearch() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [flightData, setFlightData] = useState<FlightOffer[] | null>(null);
    const [flightQuery, setFlightQuery] = useState<FlightQuery | null>(null);
    const [chooseFlight, setChooseFlight] = useState<FlightOffer | null>(null);




    useEffect(() => {
        async function performSearch() {
            const data: string | null = searchParams.get('data');
            if (!data) return;
            const res = await search_flight(data);

            if (!res) {
                return;
            }
            const [flightOffer, query] = res;
            if (flightOffer && flightOffer.length > 0) {
                setFlightData(flightOffer);
            }
            if (query) {
                setFlightQuery(query);
            }
        }
        performSearch();
    }, [searchParams]);




    return (
        <div className="w-100svw h-full flex gap-5 p-5 py-10">
            <div className="w-[50svw] h-full flex flex-col px-10 gap-4">
                <h1 className="text-3xl font-bold">Vols Disponibles</h1>
                <div className="flex gap-2">
                    <p>Il y a {flightData?.length ?? 0} vols disponibles</p>
                </div>

                <div>
                    {flightQuery && (
                        <div className="flex gap-2">
                            <div className="border border-blue-200 px-2 rounded-xl">
                                <p>{flightQuery.from} - {flightQuery.to}</p>
                            </div>
                            <div className="border border-blue-200 px-2 rounded-xl">
                                <p>{DateTime.fromISO(flightQuery.departureDate).toFormat("d LLLL yyyy")} - {DateTime.fromISO(flightQuery.returnDate).toFormat("d LLLL yyyy")}</p>
                            </div>
                            <div className="border border-blue-200 px-2 rounded-xl">
                                <p>{flightQuery.adults} Adultes</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Affichage des Skeletons lorsque flightData n'est pas chargé */}
                {flightData == null
                    ? [...Array(4)].map((_, index) => (
                        <Skeleton key={index} active className="border border-gray-300 p-4 w-full h-30 rounded-lg flex items-center gap-4">
                            <div className="w-24 h-16 bg-gray-200 rounded-md" />
                            <div className="flex-1 space-y-2">
                                <div className="w-3/4 h-4 bg-gray-200 rounded" />
                                <div className="w-1/2 h-4 bg-gray-200 rounded" />
                            </div>
                            <div className="w-16 h-6 bg-gray-200 rounded" />
                        </Skeleton>
                    ))
                    : 
                    flightData?.map((flight: FlightOffer) => (
                        <div key={flight.id}
                            onClick={() => setChooseFlight(flight)}
                            className="border border-blue-200 flex gap-5 p-2 w-full rounded-l hover:scale-105 transition duration-50 ease-in-out cursor-pointer hover:shadow-lg shadow-md">
                            <div className="flex flex-col items-center justify-center">
                                <Image src={`https://pics.avs.io/200/100/${flight.itineraries?.[0]?.segments?.[0]?.carrierCode}.png`} alt="" width={100} height={100} quality={100} />
                            </div>

                            <div className="flex flex-col w-full">
                                <div className="flex gap-1 font-bold items-center justify-between">
                                    <div className="flex gap-1">
                                        <p>{DateTime.fromISO(flight.itineraries?.[0]?.segments?.[0]?.departure?.at ?? "").toFormat("HH:mm")} {">"}</p>
                                        <p>{DateTime.fromISO(flight.itineraries?.[0]?.segments?.[flight.itineraries[0]?.segments?.length - 1]?.arrival?.at ?? "").toFormat("HH:mm")}</p>
                                    </div>
                                    <div>
                                        <p>{flight.price.currency} {flight.price.total}</p>
                                    </div>
                                </div>

                                <h3 className="text-gray-500 text-sm">
                                    {flight.itineraries?.[0]?.segments?.[0]?.departure?.iataCode ?? "N/A"} -
                                    {flight.itineraries?.[0]?.segments?.[0]?.arrival?.iataCode ?? "N/A"}
                                </h3>
                                <div>{flight.itineraries?.[0]?.segments?.[0]?.departure?.iataName ?? "N/A"}</div>
                            </div>
                        </div>
                    ))}
            </div>

            <div className="w-[40svw] h-full fixed right-20 p-5">
                <h2 className="text-3xl font-bold">Choisissez un vol pour continuer</h2>'
                <div className="w-full h-96 bg-gray-200 rounded-lg flex justify-center items-center shadow-lg ">
                    {
                        chooseFlight ?
                            <div className="flex flex-col justify-end items-end">
                                <div className="w-full h-full p-5 ">
                                    {
                                        chooseFlight.itineraries?.map((itinerary, index) => (
                                            <div key={index} className="flex gap-5">
                                                <div>
                                                    <p>{DateTime.fromISO(itinerary.segments[0].departure.at).toFormat("HH:mm")} {">"} {DateTime.fromISO(itinerary.segments[itinerary.segments.length - 1].arrival.at).toFormat("HH:mm")}</p>
                                                    <p>{itinerary.segments[0].departure.iataCode} - {itinerary.segments[itinerary.segments.length - 1].arrival.iataCode}</p>
                                                </div>
                                                <div>
                                                    <p>{itinerary.segments[0].departure.iataName} - {itinerary.segments[itinerary.segments.length - 1].arrival.iataName}</p>
                                                    <p>{itinerary.segments[0].carrierCode} {itinerary.segments[0].number}</p>
                                                </div>
                                            </div>
                                        ))
                                    }
                                    <div className="flex gap-5">
                                        <div>
                                            <p>{chooseFlight.price.currency} {chooseFlight.price.total}</p>
                                        </div>
                                        <div>
                                            <p>{chooseFlight.price.currency} {chooseFlight.price.base}</p>
                                        </div>
                                    </div>
                                </div>
                                <button className="bg-slate-800 text-white px-4 py-1 w-fit  rounded-lg" 
                                onClick={() => {

                                    router.push("/generate");
                                }}  

                                >
                                    NEXT STEP</button>
                            </div> :
                            <p className="text-2xl">Please select a flight</p>
                    }
                </div>
            </div>
        </div>
    );

}
