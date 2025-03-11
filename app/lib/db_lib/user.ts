"use server"

import prisma from "@/app/lib/prisma";
import { User } from "../auth/interface";



export async function add_travel_profile(user: User, profile : string) {
    try {

        console.log("sending data")
        return await prisma.user.update({
            where: {
                email: user.email
            },
            data: {
                travel_profile: profile
            }
        });

        
    } catch (error) {
        console.error("❌ Erreur lors de l'ajout d'un user :", error);
        return null;
    }
}
