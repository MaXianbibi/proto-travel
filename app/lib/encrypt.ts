"use server"

import crypto from "crypto";

const SECRET_KEY = Buffer.from(process.env.SECRET_KEY || "", "hex"); // Clé 256 bits
const HMAC_KEY = Buffer.from(process.env.HMAC_KEY || "", "hex"); // Clé pour HMAC
const IV_LENGTH = 16; // Longueur du vecteur d'initialisation

export async  function encryptParams(params: Record<string, string | number>): Promise<string> {
    const iv = crypto.randomBytes(IV_LENGTH);
    
    // Ajoute une expiration (timestamp UNIX + 5 minutes)
    // const timestamp = Math.floor(Date.now() / 1000) + 300;
    // params["exp"] = timestamp;

    // Convertit les paramètres en string JSON
    const jsonParams = JSON.stringify(params);

    // Génère une signature HMAC pour assurer l’intégrité
    const hmac = crypto.createHmac("sha256", HMAC_KEY).update(jsonParams).digest("hex");

    // Ajoute la signature aux paramètres
    const finalPayload = JSON.stringify({ data: jsonParams, hmac });

    // Chiffre avec AES-256-CBC
    const cipher = crypto.createCipheriv("aes-256-cbc", SECRET_KEY, iv);
    let encrypted = cipher.update(finalPayload, "utf8", "hex");
    encrypted += cipher.final("hex");

    // Retourne IV + données chiffrées (encodées en hex)
    return iv.toString("hex") + encrypted;
}

export async function decryptParams(encryptedText: string): Promise<Record<string, string> | null> {
    try {
        const iv = Buffer.from(encryptedText.slice(0, IV_LENGTH * 2), "hex");
        const encrypted = encryptedText.slice(IV_LENGTH * 2);
        
        // Déchiffrement
        const decipher = crypto.createDecipheriv("aes-256-cbc", SECRET_KEY, iv);
        let decrypted = decipher.update(encrypted, "hex", "utf8");
        decrypted += decipher.final("utf8");

        // Extraction des données et de la signature HMAC
        const { data, hmac } = JSON.parse(decrypted);
        
        // Vérifie l’intégrité avec HMAC
        const expectedHmac = crypto.createHmac("sha256", HMAC_KEY).update(data).digest("hex");
        if (expectedHmac !== hmac) {
            throw new Error("Signature HMAC invalide !");
        }
   
        const params = JSON.parse(data);

        // Vérifie l’expiration
        // if (params.exp < Math.floor(Date.now() / 1000)) {
        //     throw new Error("URL expirée !");
        // }

        return params;
    } catch (error) {
        console.error("Erreur de déchiffrement :", error);
        return null;
    }
}
