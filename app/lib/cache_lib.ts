"use server"

import client from "@/app/lib/redis"



export async function check_for_cache(data: string ) : Promise<string | null> {
    const value = await client.get(data);
    if (value) {
        return value;
    }
    return null
}

export async function set_cache(data: string, value: string, time: number) {
    client.setex(data, time, value);
}