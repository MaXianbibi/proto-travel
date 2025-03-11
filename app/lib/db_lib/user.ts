"use server"

import prisma from "@/app/lib/prisma";
import { User } from "../auth/interface";
import { check_for_cache, set_cache } from "../cache_lib";



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

export async function get_travel_profile(user: User) : Promise<string | null> {

    console.log("get travel profile")

    const cacheKey = `${user.id}:travel_profile`;
    const cache = await check_for_cache(cacheKey);
    if (cache) return cache;

    try {
        const travel_profile = await prisma.user.findUnique({
            where: { id: user.id }, // Utilisation de l'ID pour optimiser la requête
            select: { travel_profile: true } // Récupère uniquement travel_profile
        });

        if (!travel_profile?.travel_profile) {
            console.warn(`⚠️ Aucun profil de voyage trouvé pour l'utilisateur ${user.id}`);
            return null;
        }

        await set_cache(cacheKey, travel_profile.travel_profile, 60 * 60 * 24);
        return travel_profile.travel_profile;

    } catch (error) {
        console.error(`❌ Erreur lors de la récupération du profil de voyage de ${user.id}:`, error);
        return null;
    }
}
