"use client";

import { useSearchParams } from 'next/navigation';
import React, { useState } from 'react';
import Image, { StaticImageData } from 'next/image';
import hotel from '@/public/hotel.jpg';
import food from '@/public/food.jpg';
import taxi from '@/public/taxi.jpg';
import TypeWritter from '../Components/typeWriterEffect/TypeWriter';

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

export default function Page() {
    const searchParams = useSearchParams();
    const [chooseQuestion, setChooseQuestion] = useState<boolean>(true);
    const [selectedOption, setSelectedOption] = useState<QuestionList>({
        questions: [
            {
                title: "Dans quoi préférez-vous dépenser ?",
                preference: { hook: "Pour moi, le voyage c'est avant tout ", preference: [] },
                options: [
                    { src: taxi, alt: "Taxi", text: "le confort des transports" },
                    { src: hotel, alt: "Hôtel", text: "la qualité de l'hébergement" },
                    { src: food, alt: "Nourriture", text: "la découverte culinaire" },
                ],
                default: "profiter d'un mix parfait entre confort, repos et saveurs locales",
            },
            {
                title: "Comment préférez-vous explorer une destination ?",
                preference: { hook: "J'aime découvrir un lieu à travers ", preference: [] },
                options: [
                    { src: taxi, alt: "Excursions", text: "les visites guidées organisées" },
                    { src: food, alt: "Culture", text: "l'immersion dans la culture locale" },
                    { src: hotel, alt: "Aventure", text: "les aventures en plein air" },
                ],
                default: "un savant mélange d'aventures spontanées et de découvertes culturelles guidées",
            },
            {
                title: "Quel type d'expérience recherchez-vous ?",
                preference: { hook: "Ce qui me motive en voyage, c'est ", preference: [] },
                options: [
                    { src: hotel, alt: "Détente", text: "la détente et le repos" },
                    { src: taxi, alt: "Exploration", text: "l'exploration de nouveaux lieux" },
                    { src: food, alt: "Rencontres", text: "les rencontres avec les locaux" },
                ],
                default: "me ressourcer tout en explorant et en tissant des liens authentiques",
            },
            {
                title: "Comment organisez-vous vos journées en voyage ?",
                preference: { hook: "Ma journée idéale en voyage repose sur ", preference: [] },
                options: [
                    { src: taxi, alt: "Planification", text: "un planning structuré" },
                    { src: food, alt: "Spontanéité", text: "la spontanéité et l’improvisation" },
                    { src: hotel, alt: "Repos", text: "des moments de repos" },
                ],
                default: "un rythme fluide où je planifie juste assez pour laisser place à l’imprévu",
            },
            {
                title: "Ques qui vous attire le plus dans votre prochaine destination ?",
                preference: { hook: "Je choisis une destination pour ", preference: [] },
                options: [
                    { src: food, alt: "Cuisine", text: "sa cuisine et ses saveurs" },
                    { src: taxi, alt: "Histoire", text: "son histoire et son patrimoine" },
                    { src: hotel, alt: "Nature", text: "sa beauté naturelle" },
                ],
                default: "un endroit qui m'émerveille par sa nature et me raconte une histoire à chaque bouchée",
            },
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
                return selectedPrefs.length > 0 ? `${q.preference.hook} ${selectedPrefs.join(" et ")}` : "";
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
                        <div className="w-96 h-fit min-h-96 absolute left-16 top-1/2 -translate-y-1/2 border p-2 flex flex-col">
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
                        <button
                            onClick={handleNext}
                            className="px-6 py-2 border border-blue-600 text-blue-600 font-medium rounded-md hover:bg-blue-600 hover:text-white active:bg-blue-700 transition"
                            disabled={currentQuestionIndex === selectedOption.questions.length - 1}
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}