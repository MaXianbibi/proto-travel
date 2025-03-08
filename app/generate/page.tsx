"use client"

import { useSearchParams } from 'next/navigation';
import React, { useState } from 'react'

import Image from 'next/image'

import hotel from '@/public/hotel.jpg'
import food from '@/public/food.jpg'
import taxi from '@/public/taxi.jpg'

export default function page() {
    const searchParams = useSearchParams();

    const [chooseQuestion, setChooseQuestion] = useState<boolean>(false);



    return (
        <div className='w-svw flex flex-col h-fit'>
            <header className='w-svw h-20 shadow-lg border-b flex items-center justify-center'>
                <p className='text-3xl'>Choisissez l'option qui vous correspond</p>
            </header>

            {
                chooseQuestion ?
                    <main>
                        <div className='flex w-svw h-full justify-center items-center mt-28 gap-8'>
                            <div className='w-[30svw] h-[50svh] shadow-lg p-4 flex flex-col gap-10 items-center'>
                                <div className='flex flex-col gap-2'>
                                    <h1 className="text-3xl font-bold">
                                        On vous aide à créer le voyage parfait !
                                    </h1>
                                    <div className='border border-green-500 w-fit px-2 rounded-md'><h2>choix recommender</h2></div>
                                </div>

                                <p className="text-gray-500">
                                    Prenez quelques minutes pour répondre à ces questions, et nous vous aiderons à concevoir un voyage sur mesure, parfaitement adapté à vos envies, vos centres d'intérêt et votre façon de voyager.
                                </p>

                                <div className='h-full items-center justify-center flex '>
                                    <button className='bg-blue-500 text-white p-2 rounded-md shadow-lg w-fit px-2' onClick={() => {
                                        setChooseQuestion(true)
                                    }}>
                                        Créer mon itinéraire parfait
                                    </button>
                                </div>

                            </div>

                            <div className='h-[35svh] border'></div>


                            <div className="w-[30svw] h-[50svh] shadow-lg flex flex-col p-4 bg-white justify-end">
                                <div className='h-2/3 flex flex-col gap-10'>

                                    <h1 className="text-3xl font-bold">
                                        Plan Your Perfect Journey 🤩
                                    </h1>
                                    <p className="text-gray-500">
                                        Let our AI craft the ultimate travel experience tailored just for you!  <br />
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
                                        className="flex-1 resize-none  rounded-md shadow-sm focus:outline-none p-2 h-full"
                                        placeholder="Plan your perfect journey right here!"
                                    />
                                    <button className="bg-blue-500 text-white p-2 rounded-full shadow-lg w-12 h-12 flex items-center justify-center">
                                        ➤
                                    </button>
                                </form>
                            </div>
                        </div>
                    </main> :
                   <div className='w-full h-[80svh] flex items-center justify-center gap-4'>
                   {[
                     { src: hotel, alt: "Hôtel", text: "Best hotels" },
                     { src: food, alt: "Nourriture", text: "Best foods" },
                     { src: taxi, alt: "Taxi", text: "Best transports" },

                   ].map((item, index) => (
                     <div key={index} className="relative w-[300px] h-[500px] overflow-hidden rounded-lg group hover:shadow-lg cursor-pointer hover:w-[350px] transition-all duration-300">
                       {/* Image */}
                       <Image
                         src={item.src}
                         alt={item.alt}
                         layout="fill"
                         objectFit="cover"
                         className="transition-transform duration-300 ease-in-out group-hover:scale-105"
                       />
                 
                       {/* Overlay + Texte */}
                       <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                         <p className="text-white text-lg font-semibold">{item.text}</p>
                       </div>
                     </div>
                   ))}
                 </div>
                 



            }
        </div>
    )
}
