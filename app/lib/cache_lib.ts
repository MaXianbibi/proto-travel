"use server"

import client from "@/app/lib/redis"

import { FlightQuery } from "./interface";
import { ReadonlyURLSearchParams } from "next/navigation";
import { decryptParams } from "./encrypt";

export async function check_for_cache(data: string ) : Promise<string | null> {
    if( !client.isOpen) {
        console.log("Redis n'est pas connecté");
        return null;
    }
    const value = await client.get(data);
    if (value) {
        return value;
    }
    return null
}