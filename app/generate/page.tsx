"use client";

import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import Image, { StaticImageData } from 'next/image';
import hotel from '@/public/hotel.jpg';
import food from '@/public/food.jpg';
import taxi from '@/public/taxi.jpg';
import TypeWritter from '../Components/typeWriterEffect/TypeWriter';
import { containerClasses } from '@mui/material';
import { useUser } from '../lib/customHook/custumHooks';
import { User } from '../lib/auth/interface';
import { add_travel_profile } from '../lib/db_lib/user';

interface Question {
    title: string;
    preference: {
        hook: string;
        preference: string[];
    };
    options: {
        src: StaticImageData;
        alt: string;
        text: string;
    }[];
    default?: string;
}

interface QuestionList {
    questions: Question[];
    map: string[];
}


async function pushTravelProfile(profile: string, user : User | null) {
    console.log("sending data")
    if (user) await add_travel_profile(user, profile);

}

export default function Page() {
    const searchParams = useSearchParams();
    const [chooseQuestion, setChooseQuestion] = useState<boolean>(false);
    const [selectedOption, setSelectedOption] = useState<QuestionList>({
        questions: [
            {
                title: "Où rêvez-vous de poser vos valises ?",
                preference: { hook: "Quand je pense à mon nid douillet en voyage, j’imagine ", preference: [] },
                options: [
                    { src: hotel, alt: "Chambre d’hôtel moderne", text: "un hôtel confortable avec services" },
                    { src: hotel, alt: "Appartement cosy", text: "un appartement local pour vivre comme un habitant" },
                    { src: hotel, alt: "Tente sous les étoiles", text: "un hébergement insolite en pleine nature" }
                ],
                default: "un équilibre entre confort moderne et une touche d’authenticité locale"
            },
            {
                title: "Qu’est-ce qui vous attire dans la culture d’une destination ?",
                preference: { hook: "J’aime plonger dans une culture à travers ", preference: [] },
                options: [
                    { src: hotel, alt: "Musée avec statues", text: "les musées et sites historiques" },
                    { src: food, alt: "Foule dans un festival", text: "les festivals et événements locaux" },
                    { src: food, alt: "Marché coloré", text: "les marchés et l’artisanat traditionnel" }
                ],
                default: "une combinaison de découvertes historiques et d’immersion dans la vie locale"
            },
            {
                title: "Comment organisez-vous vos journées en voyage ?",
                preference: { hook: "Quand je découvre une ville, je préfère ", preference: [] },
                options: [
                    { src: taxi, alt: "Carnet avec itinéraire", text: "suivre un planning bien structuré" },
                    { src: taxi, alt: "Rues animées", text: "me perdre dans les rues au gré de mes envies" },
                    { src: food, alt: "Café en terrasse", text: "prendre le temps dans un café ou un parc" }
                ],
                default: "un savant dosage entre exploration libre et moments de détente planifiés"
            },
            {
                title: "Comment aimez-vous découvrir la cuisine locale ?",
                preference: { hook: "Pour moi, un voyage passe aussi par ", preference: [] },
                options: [
                    { src: food, alt: "Étal de street food", text: "la street food authentique" },
                    { src: food, alt: "Table élégante", text: "les restaurants réputés" },
                    { src: food, alt: "Cours de cuisine", text: "cuisiner avec des ingrédients locaux" }
                ],
                default: "un mélange de saveurs locales goûtées sur le pouce et de repas mémorables"
            },

            {
                title: "Quelle aventure en pleine nature vous tente ?",
                preference: { hook: "Quand je suis entouré(e) de nature, j’aime ", preference: [] },
                options: [
                    { src: taxi, alt: "Randonnée en montagne", text: "partir en randonnée dans les montagnes" },
                    { src: hotel, alt: "Plage ensoleillée", text: "me détendre sur une plage de rêve" },
                    { src: taxi, alt: "Vélo dans la campagne", text: "explorer à vélo des paysages magnifiques" }
                ],
                default: "un équilibre entre aventure active et pauses relaxantes au grand air"
            },
            {
                title: "Comment répartissez-vous vos dépenses pour manger ?",
                preference: { hook: "Quand il s’agit de repas en voyage, je mise sur ", preference: [] },
                options: [
                    { src: food, alt: "Repas simple", text: "des options abordables et locales" },
                    { src: food, alt: "Plat gastronomique", text: "quelques expériences gastronomiques mémorables" },
                    { src: food, alt: "Buffet varié", text: "un mélange des deux selon l’humeur" } // wtf
                ],
                default: "une combinaison intelligente entre petits plaisirs locaux et découvertes raffinées"
            },
            {
                title: "Qu’aimez-vous ramener de vos voyages ?",
                preference: { hook: "Pour garder un souvenir tangible, je choisis ", preference: [] },
                options: [
                    { src: hotel, alt: "Artisanat local", text: "des objets artisanaux uniques" },
                    { src: food, alt: "Spécialités locales", text: "des spécialités culinaires à partager" },
                    { src: taxi, alt: "Appareil photo", text: "juste des photos, pas d’achats" }
                ],
                default: "un mix de petits trésors locaux et de souvenirs immortalisés en images"
            },
            {
                title: "Quel rythme vous convient le mieux en voyage ?",
                preference: { hook: "Quand je pars à l’aventure, j’aime ", preference: [] },
                options: [
                    { src: taxi, alt: "Horloge qui tourne", text: "un rythme soutenu pour tout voir" },
                    { src: hotel, alt: "Hamac relaxant", text: "prendre mon temps pour profiter" },
                    { src: taxi, alt: "Montre et paysage", text: "alterner entre action et repos" }
                ],
                default: "un rythme harmonieux qui combine découvertes et pauses bien méritées"
            },
            {
                title: "Comment aimez-vous rencontrer les habitants ?",
                preference: { hook: "Pour moi, les rencontres en voyage, c’est ", preference: [] },
                options: [
                    { src: food, alt: "Discussion animée", text: "discuter avec les locaux dans les cafés" },
                    { src: taxi, alt: "Guide local", text: "suivre un guide pour des histoires authentiques" },
                    { src: hotel, alt: "Personne seule", text: "observer sans trop interagir" }
                ],
                default: "un équilibre entre échanges spontanés et découvertes guidées"
            }
        ],
        map: [],
    });

    const [oldOption, setOldOption] = useState<string[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);



    const handleOptionClick = (text: string) => {
        setOldOption(selectedOption.map);
        setSelectedOption((prev) => {
            const updatedQuestions = [...prev.questions];
            const currentQuestion = { ...updatedQuestions[currentQuestionIndex] };
            const currentPreferences = [...currentQuestion.preference.preference];

            // Si l'option est déjà sélectionnée, la retirer
            if (currentPreferences.includes(text)) {
                currentQuestion.preference = {
                    ...currentQuestion.preference,
                    preference: currentPreferences.filter((pref) => pref !== text),
                };
            }
            // Sinon, l'ajouter (pas de limite)
            else {
                currentQuestion.preference = {
                    ...currentQuestion.preference,
                    preference: [...currentPreferences, text],
                };
            }

            updatedQuestions[currentQuestionIndex] = currentQuestion;

            const newMap = updatedQuestions.map((q) => {
                const allOptions = q.options.map((opt) => opt.text);
                const selectedPrefs = q.preference.preference;
                // Si toutes les options sont sélectionnées, afficher "Pas de préférence"
                if (selectedPrefs.length === allOptions.length && allOptions.every((opt) => selectedPrefs.includes(opt))) {
                    return q.preference.hook + q.default;
                }
                // Sinon, lister les préférences sélectionnées
                return selectedPrefs.length > 0 ? `${q.preference.hook} ${selectedPrefs.join(" et/ou ")}` : "";
            }).filter(Boolean);

            return { ...prev, questions: updatedQuestions, map: newMap };
        });
    };

    const handlePrevious = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex((prev) => prev - 1);
            setOldOption(selectedOption.map);
        }
    };

    const handleNext = () => {
        if (currentQuestionIndex < selectedOption.questions.length - 1) {
            setCurrentQuestionIndex((prev) => prev + 1);
            setOldOption(selectedOption.map);
        }
    };


    const user : User | null = useUser();



    return (
        <div className="w-svw flex flex-col h-fit ">
            <header className="w-svw h-20 shadow-lg border-b flex items-center justify-center">
                <p className="text-3xl">Choisissez l'option qui vous correspond</p>
            </header>

            {chooseQuestion ? (
                <main>
                    <div className="flex w-svw h-full justify-center items-center mt-28 gap-8">
                        <div className="w-[30svw] h-[50svh] shadow-lg p-4 flex flex-col gap-10 items-center">
                            <div className="flex flex-col gap-2">
                                <h1 className="text-3xl font-bold">On vous aide à créer le voyage parfait !</h1>
                                <div className="border border-green-500 w-fit px-2 rounded-md">
                                    <h2>choix recommandé</h2>
                                </div>
                            </div>
                            <p className="text-gray-500">
                                Prenez quelques minutes pour répondre à ces questions, et nous vous aiderons à concevoir un voyage sur mesure, parfaitement adapté à vos envies, vos centres d'intérêt et votre façon de voyager.
                            </p>
                            <div className="h-full items-center justify-center flex">
                                <button
                                    className="bg-blue-500 text-white p-2 rounded-md shadow-lg w-fit px-2"
                                    onClick={() => setChooseQuestion(false)}
                                >
                                    Créer mon itinéraire parfait
                                </button>
                            </div>
                        </div>

                        <div className="h-[35svh] border "></div>

                        <div className="w-[30svw] h-[50svh] shadow-lg flex flex-col p-4 bg-white justify-end">
                            <div className="h-2/3 flex flex-col gap-10">
                                <h1 className="text-3xl font-bold">Plan Your Perfect Journey 🤩</h1>
                                <p className="text-gray-500">
                                    Let our AI craft the ultimate travel experience tailored just for you! <br />
                                    Share as many details as possible—your favorite cuisine, music, ideal destinations, and budget.
                                    It's even better if you specify what you prefer to spend on—food, experiences, luxury stays, or anything else!
                                    The more details you provide, the more personalized your journey will be.
                                </p>
                            </div>
                            <form action="" className="w-full flex items-center gap-2 p-2 border-t h-1/3 shadow-lg mb-8">
                                <textarea
                                    name="message"
                                    id="message"
                                    rows={2}
                                    className="flex-1 resize-none rounded-md shadow-sm focus:outline-none p-2 h-full"
                                    placeholder="Plan your perfect journey right here!"
                                />
                                <button className="bg-blue-500 text-white p-2 rounded-full shadow-lg w-12 h-12 flex items-center justify-center">
                                    ➤
                                </button>
                            </form>
                        </div>
                    </div>
                </main>
            ) : (
                <div className="w-full h-[70svh] flex flex-col items-center mt-20 gap-8 overflow-hidden">
                    <div className='flex flex-col justify-center items-center'>
                        <h1 className="font-bold text-4xl font-inter">{selectedOption.questions[currentQuestionIndex].title}</h1>
                        <h2>Vous pouvez choisir plus d'une option</h2>
                    </div>
                    <div className="w-full h-fit flex items-center justify-center gap-4">
                        <div className="w-96 h-[600px]  absolute left-16 top-1/2 -translate-y-1/2 border p-2 flex flex-col">
                            <div className="flex gap-1 flex-col">
                                <h2 className='text-lg border-b py-2'>Votre profile voyageur</h2>
                                <TypeWritter fullText={selectedOption.map} oldOption={oldOption} />
                            </div>
                        </div>

                        {selectedOption.questions[currentQuestionIndex].options.map((item, index) => {
                            const isSelected = selectedOption.questions[currentQuestionIndex].preference.preference.includes(item.text);
                            return (
                                <div
                                    key={index}
                                    className={`relative w-[300px] h-[500px] overflow-hidden rounded-lg group hover:shadow-lg cursor-pointer hover:w-[350px] transition-all duration-300 ${isSelected ? 'shadow-lg shadow-blue-600' : ''
                                        }`}
                                    onClick={() => handleOptionClick(item.text)}
                                >
                                    <Image
                                        src={item.src}
                                        alt={item.alt}
                                        fill
                                        className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                                        <p className="text-white text-lg font-semibold">{item.text}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <div className="w-5/12 h-fit flex justify-between">
                        <button
                            onClick={handlePrevious}
                            className="px-6 py-2 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-100 active:bg-gray-200 transition"
                            disabled={currentQuestionIndex === 0}
                        >
                            Previous
                        </button>
                        {
                            currentQuestionIndex !== selectedOption.questions.length - 1 ?
                                <button
                                    onClick={handleNext}
                                    className="px-6 py-2 border border-blue-600 text-blue-600 font-medium rounded-md hover:bg-blue-600 hover:text-white active:bg-blue-700 transition"
                                    disabled={currentQuestionIndex === selectedOption.questions.length - 1}
                                >
                                    Next
                                </button> :

                                <button
                                    onClick={() => { pushTravelProfile(selectedOption.map.join(' \n \n'), user); }}
                                    className="px-6 py-2 border border-blue-600 text-blue-600 font-medium rounded-md hover:bg-blue-600 hover:text-white active:bg-blue-700 transition"
                                >
                                    Submit
                                </button>
                        }
                    </div>
                </div>
            )}
        </div>
    );
}