import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { User } from './interface';

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET!; // ⚠️ À définir dans `.env`
const ACCESS_TOKEN_EXPIRY = '1h'; // Durée de vie du token

// Générer un token JWT
export function generateToken(payload: object) {
    const token = jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY });
    return token

}

// Vérifier un token JWT
export function verifyToken(token: string) {
    try {
        return jwt.verify(token, ACCESS_TOKEN_SECRET);
    } catch (error) {
        return null;
    }
}

export async function setAuthCookie(user: User) {
    "use server"; // ✅ Bien placé en haut

    const payload = {
        id: user.id ?? "",
        email: user.email ?? "",
        role: user.role ?? ""
    }
    const token : string = generateToken(payload)
    const cookieStore = await cookies(); // ✅ Pas de `await`

    cookieStore.set({
        name: "authToken",
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 // 1 heure
    });
}


