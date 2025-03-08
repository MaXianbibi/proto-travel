"use client"

import { useState } from "react";
import { loginSchema } from "../lib/auth/parsing";
import { auth } from "../lib/auth/auth";
import { message } from "antd";

import { useRouter } from "next/navigation"

export default function page() {
    const router = useRouter();
    const [errors, setErrors] = useState<Record<string, string[]>>({});
    const [visiblePass, setVisiblePass] = useState<boolean>(false);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        const res = loginSchema.safeParse({ email, password });

        if (!res.success) {
            // ✅ Stocke uniquement les erreurs des champs
            setErrors(res.error.flatten().fieldErrors);
        } else {
            setErrors({}); // ✅ Reset des erreurs si la validation passe
            const res = await auth(email, password)

            if (res.state !== "SUCCESS") {
                setErrors({
                    [String(res.key)]: [res.message]
                })
            } else {
                router.push("/")
            }

        }
    }





    return (
        <div className="w-screen h-screen flex justify-center items-center bg-gradient-to-br  to-indigo-600 gap-2">
            <div className="w-96 bg-white shadow-lg rounded-lg p-8 flex flex-col items-center">
                {/* Titre */}
                <h1 className="font-bold text-3xl text-gray-800 border-b-2 w-full pb-2 text-center">
                    Connexion
                </h1>

                {/* Formulaire */}
                <form className="w-full flex flex-col gap-4 mt-6" onSubmit={handleSubmit}>
                    {/* Email */}
                    <input
                        type="email"
                        name="email"
                        required
                        placeholder="jhondoe@gmail.com"
                        className="w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-indigo-400 outline-none transition duration-200"
                    />

                    {/* Mot de passe */}
                    <input
                        type="text"
                        required
                        name="password"
                        placeholder="••••••••"
                        className="w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-indigo-400 outline-none transition duration-200"
                    />

                    {/* Bouton */}
                    <button
                        type="submit"
                        className="w-full bg-indigo-600 text-white font-semibold py-3 rounded-md shadow-md hover:bg-indigo-700 transition duration-200"
                    >
                        Se connecter
                    </button>

                    {/* Lien d'inscription */}
                    <p className="text-gray-600 text-sm text-center">
                        Pas encore de compte ?{" "}
                        <a href="/signup" className="text-indigo-600 font-semibold hover:underline">
                            Inscris-toi ici
                        </a>
                    </p>
                </form>
            </div>

            {Object.keys(errors).length > 0 && (
                <div className="absolute bottom-5 right-5  w-full max-w-sm bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg shadow-md transition-all duration-300">

                    <div className="flex items-center">
                        {/* Icône d'alerte */}
                        <svg className="w-6 h-6 text-red-600 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M4.93 19h14.14a2 2 0 001.73-3L13.73 4a2 2 0 00-3.46 0L3.2 16a2 2 0 001.73 3z"></path>
                        </svg>
                        <strong className="font-semibold">Erreurs :</strong>
                    </div>

                    <ul className="mt-2 pl-6 list-disc text-sm">
                        {Object.entries(errors).map(([field, messages]) => (
                            <li key={field}>
                                <strong className="capitalize">{field}:</strong> {messages.join(", ")}
                            </li>
                        ))}
                    </ul>
                </div>
            )}


        </div>
    );
}
