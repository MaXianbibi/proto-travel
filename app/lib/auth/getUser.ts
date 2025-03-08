"use server"

import { cookies } from "next/headers";
import { verifyToken } from "./cookie";
import { User } from "./interface";


export async function getUser() : Promise<User | null> {
    const cookieStore = await cookies();
    cookieStore.get("authToken")

    const authToken = cookieStore.get("authToken")?.value;

    const res =  authToken ? verifyToken(authToken) : null;

    if (res == null) {
        return null;
    }


    const user : User = {
        id: res.id,
        email: res.email,
        role: res.role,
        password: ""
    }

    return user

}


export async function logout() {
    const cookieStore = await cookies();
    cookieStore.delete("authToken")
}