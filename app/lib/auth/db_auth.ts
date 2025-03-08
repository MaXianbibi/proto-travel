"use server"

import prisma from "@/app/lib/prisma";

import {User} from "./interface"
import Password from "antd/es/input/Password";



export async function add_user(user: User) {
    try {
        return await prisma.user.createManyAndReturn({
            data: {
                email: user.email,
                password: user.password
            }
        });

        
    } catch (error) {
        console.error("❌ Erreur lors de l'ajout d'un user :", error);
        return null;
    }
}


export async function getUserByEmail(email: string): Promise<User | null> {

    try {
        return await prisma.user.findUnique({
            where: { email }
        });
    } catch (error) {
        console.error("❌ Erreur lors de la récupération de l'utilisateur :", error);
        return null;
    }
}