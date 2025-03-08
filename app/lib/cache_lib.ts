"use server"

import client from "@/app/lib/redis"



export async function check_for_cache(data: string ) : Promise<string | null> {
    const value = await client.get(data);
    if (value) {
        return value;
    }
    return null
}