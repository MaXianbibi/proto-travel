
"use server"

import { hashPassword, verifyPassword } from "@/app/lib/auth/encrypt"
import { User } from "./interface";
import { add_user, getUserByEmail } from "./db_auth";
import { message } from "antd";
import { generateToken, setAuthCookie } from "./cookie";
import { cookies } from "next/headers";



export async function login(user: User, password : string) {

    const res = await verifyPassword(password, user.password)

    if (res){
        await setAuthCookie(user)
        return {state: "SUCCESS", message: "You are now logged in"}
    }
    return {state: "ERROR", key: "Login", message: "Invalid credentials"}

}


export async function auth(email : string, password : string) {
    
    const login_user : User | null = await getUserByEmail(email)
    if ( login_user ) return login(login_user, password)


    const hashPass = await  hashPassword(password);
    const user : User = {
        password: hashPass,
        email: email
    }
    const db_user =  await add_user(user)
    if (db_user == null) {
        return {state: "ERROR", key: "Account creation", message: "Impossible to create your account at the moment"}
    }
    await setAuthCookie(db_user[0])
    return {state: "SUCCESS", message: "You are now logged in"}
}