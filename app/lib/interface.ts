"use server"

// Interface pour les données

// "id","code","name","continent","wikipedia_link","keywords"
// 302672,"AD","Andorra","EU","https://en.wikipedia.org/wiki/Andorra","Andorran airports"

export interface City {
    id: number;
    code: string;
    name: string;
    continent: string;
    wikipedia_link: string;
    keywords: string;
}

//  "id","ident","type","name","latitude_deg","longitude_deg","elevation_ft","continent","iso_country","iso_region","municipality","scheduled_service","icao_code","iata_code","gps_code","local_code","home_link","wikipedia_link","keywords"
//  1928,"CYUL","large_airport","Montreal / Pierre Elliott Trudeau International Airport",45.467837,-73.742294,118,"NA","CA","CA-QC","Montréal","yes","CYUL","YUL","CYUL","YUL","http://www.admtl.com/passager/Home.aspx","https://en.wikipedia.org/wiki/Montr%C3%A9al-Pierre_Elliott_Trudeau_International_Airport","YMQ, Dorval Airport"

export interface Airport {
    id: number;
    ident: string;
    type: string;
    name: string;
    latitude_deg: number;
    longitude_deg: number;
    elevation_ft: number | null;
    continent: string;
    iso_country: string;
    iso_region: string;
    municipality: string;
    scheduled_service: string;
    icao_code: string | null;
    iata_code: string | null;
    gps_code: string | null;
    local_code: string | null;
    home_link: string | null;
    wikipedia_link: string | null;
    keywords: string | null;

    full_name_country: string | null;
}


// FLIGHT QUERY


export interface FlightQuery {
    from: string;
    to: string;
    departureDate: string;
    returnDate: string;
    adults: number;
    currencyCode: string;
}

// FLIGHT INTERFACE

export interface FlightOffer {
    id: string;
    source: string;
    oneWay: boolean;
    lastTicketingDate: string;
    numberOfBookableSeats: number;
    price: FlightPrice;
    itineraries: Itinerary[];
    validatingAirlineCodes: string[];
    travelerPricings: TravelerPricing[];
  }
  
  export interface FlightPrice {
    currency: string;
    total: string;
    base: string;
    grandTotal: string;
  }
  
  export interface Itinerary {
    duration: string;
    segments: FlightSegment[];
  }
  
  export interface FlightSegment {
    id: string;
    departure: AirportInfo;
    arrival: AirportInfo;
    carrierCode: string;
    number: string;
    aircraft: Aircraft;
    duration: string;
    numberOfStops: number;
  }
  
  export interface AirportInfo {
    iataCode: string;
    terminal?: string;
    at: string; // Date ISO 8601
  }
  
  export interface Aircraft {
    code: string;
  }
  
  export interface TravelerPricing {
    travelerId: string;
    travelerType: string;
    price: FlightPrice;
    fareDetailsBySegment: FareDetails[];
  }
  
  export interface FareDetails {
    segmentId: string;
    cabin: string;
    class: string;
    fareBasis: string;
    includedCheckedBags: CheckedBags;
    amenities?: Amenity[];
  }
  
  export interface CheckedBags {
    quantity: number;
  }
  
  export interface Amenity {
    description: string;
    isChargeable: boolean;
    amenityType: string;
  }
  

"use server"

export async function mapFlightOffers(sort_by_price: any[]): Promise<FlightOffer[]> {
    return sort_by_price.map((flight: any): FlightOffer => ({
        id: flight.id,
        source: flight.source,
        oneWay: flight.oneWay,
        lastTicketingDate: flight.lastTicketingDate,
        numberOfBookableSeats: flight.numberOfBookableSeats,
        price: {
            currency: flight.price.currency,
            total: flight.price.total,
            base: flight.price.base,
            grandTotal: flight.price.grandTotal
        },
        itineraries: flight.itineraries.map((itinerary: any): Itinerary => ({
            duration: itinerary.duration,
            segments: itinerary.segments.map((segment: any): FlightSegment => ({
                id: segment.id,
                departure: {
                    iataCode: segment.departure.iataCode,
                    terminal: segment.departure.terminal ?? undefined,
                    at: segment.departure.at
                },
                arrival: {
                    iataCode: segment.arrival.iataCode,
                    terminal: segment.arrival.terminal ?? undefined,
                    at: segment.arrival.at
                },
                carrierCode: segment.carrierCode,
                number: segment.number,
                aircraft: {
                    code: segment.aircraft.code
                },
                duration: segment.duration,
                numberOfStops: segment.numberOfStops
            }))
        })),
        validatingAirlineCodes: flight.validatingAirlineCodes,
        travelerPricings: flight.travelerPricings.map((traveler: any): TravelerPricing => ({
            travelerId: traveler.travelerId,
            travelerType: traveler.travelerType,
            price: {
                currency: traveler.price.currency,
                total: traveler.price.total,
                base: traveler.price.base,
                grandTotal: traveler.price.grandTotal
            },
            fareDetailsBySegment: traveler.fareDetailsBySegment.map((fare: any): FareDetails => ({
                segmentId: fare.segmentId,
                cabin: fare.cabin,
                class: fare.class,
                fareBasis: fare.fareBasis,
                includedCheckedBags: {
                    quantity: fare.includedCheckedBags?.quantity ?? 0
                },
                amenities: fare.amenities?.map((amenity: any): Amenity => ({
                    description: amenity.description,
                    isChargeable: amenity.isChargeable,
                    amenityType: amenity.amenityType
                })) ?? []
            }))
        }))
    }));
}
