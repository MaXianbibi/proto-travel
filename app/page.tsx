"use client"

import Image from "next/image";

import TextInput from "@/app/Components/text-input/TextInput"
import { IoSearchCircle } from "react-icons/io5";


import { search_airport } from "@/app/lib/db_func";
import { Airport } from "@prisma/client";
import { use, useEffect, useState } from "react";
import { Button } from "@mui/material";



import { DatePicker, Space } from 'antd';
import dayjs, { Dayjs } from 'dayjs';


import { useRouter } from 'next/navigation';


import { encryptParams } from "@/app/lib/encrypt";
import { User } from "./lib/auth/interface";
import { getUser, logout } from "./lib/auth/getUser";

export default function Home() {
  const router = useRouter()

  const [airportsList, setAirportsList] = useState<Airport[]>([])

  const [fromPannel, setfromPannel] = useState(false)
  const [toPannel, setToPannel] = useState(false)


  const [from, setfrom] = useState<Airport | null>(null)
  const [to, setTo] = useState<Airport | null>(null)

  const [selectedDates, setSelectedDates] = useState<string[]>([]);

  const { RangePicker } = DatePicker;
  const [user, setUser] = useState<User | null>(null)

  async function search(value: string) {
    if (value.length < 2) {
      setAirportsList([])
      return
    }
    const airports: Airport[] = await search_airport(value)
    if (airports.length == 0) return
    setAirportsList(airports)
  }

  function onDateChange(_dates: [Dayjs | null, Dayjs | null] | null, dateStrings: [string, string]) {
    setSelectedDates(dateStrings)
  }

  async function encrypt() {

    const query: Record<string, string> = {
      from: from?.iata_code || '',
      to: to?.iata_code || '',
      departureDate: selectedDates[0],
      returnDate: selectedDates[1],
      adults: '1',
      currency: 'USD'
    }
    const encryptedParams: string = await encryptParams(query)

    router.push(`/journey?data=${encryptedParams}`)
  }


  useEffect(() => {
    async function getUserClient() {
      const res: User | null = await getUser()
      if (res) {
        setUser(res)
      }
      console.log("👤 User", res)
    }
    getUserClient()
  }, [])



  async function logout_client() {
    await logout()
    window.location.reload()

  }

  return (
    <>
      <div className="w-svw h-svh flex flex-col items-center gap-2 ">
        <header>

          {
            user ?
              <div className="w-svw h-16 shadow-md flex justify-end items-center px-8">
                <p className="text-blue-400 p-2 px-4  underline font-bold">{user.email}</p>
                <button className="text-blue-400 p-2 px-4  underline font-bold" onClick={() => {
                  logout_client()
                }}>
                  Log out
                </button>
              </div>
              :


            <div className="w-svw h-16 shadow-md flex justify-end items-center px-8">

            <button className="text-blue-400 p-2 px-4  underline font-bold" onClick={() => {
              router.push("/login")
            }}>
              Log in
            </button>


            <button className="text-blue-400 p-2 px-4  underline font-bold" onClick={() => {
              router.push("/signup")
            }}>
              Sign Up
            </button>


          </div>
          }
        </header>
        <div className="flex-col w-2/3  p-24 flex gap-5">
          <div className="flex justify-between w-10/12">

            <h1 className="font-bold text-2xl ">Proto Travel</h1>
            <Space direction="horizontal" size={20}>
              <RangePicker onChange={onDateChange} format="YYYY-MM-DD" />
            </Space>

          </div>
          <div className="flex gap-2">

            <div className={`flex gap-5 w-10/12 inter-font`}>
              <Button
                variant="contained"
                onClick={() => {
                  setfromPannel(true);
                  setToPannel(false);
                }}
                style={{
                  backgroundColor: "#f5f5f5",
                  color: "black",
                  textAlign: "left",
                  fontFamily: [
                    '-apple-system',
                    'BlinkMacSystemFont',
                    '"Segoe UI"',
                    'Roboto',
                    '"Helvetica Neue"',
                    'Arial',
                    'sans-serif',
                    '"Apple Color Emoji"',
                    '"Segoe UI Emoji"',
                    '"Segoe UI Symbol"',
                  ].join(','),
                }}
                className="w-1/2"
                size="large"
              >
                {from ? `${from.municipality} - ${from.iata_code}` : "Where from?"}
              </Button>
              <Button
                variant="contained"
                onClick={() => {
                  setfromPannel(false);
                  setToPannel(true);
                }}
                style={{
                  backgroundColor: "#f5f5f5",
                  color: "black",
                  textAlign: "left",
                  fontFamily: [
                    '-apple-system',
                    'BlinkMacSystemFont',
                    '"Segoe UI"',
                    'Roboto',
                    '"Helvetica Neue"',
                    'Arial',
                    'sans-serif',
                    '"Apple Color Emoji"',
                    '"Segoe UI Emoji"',
                    '"Segoe UI Symbol"',
                  ].join(','),
                }}
                className="w-1/2"
                size="large"
              >
                {to ? `${to.municipality} - ${to.iata_code}` : "Where to?"}
              </Button>
            </div>
            <IoSearchCircle size={50} onClick={() => {
              encrypt()
            }} />
          </div>

          {fromPannel && (
            <div
              className="fixed inset-0 flex justify-center items-center backdrop-blur-[3px] z-10"
              onClick={() => setfromPannel(false)} // 👈 Ferme en cliquant à l'extérieur
            >
              <div
                className="w-[30vw] h-[65svh] bg-slate-100 bg-opacity-90  rounded-lg flex flex-col p-6 shadow-lg"
                onClick={(e) => e.stopPropagation()} // 👈 Empêche la fermeture en cliquant à l'intérieur
              >
                <div className="flex gap-1 flex-col">
                  <TextInput onType={search} placeHolder="Where from ?" />

                  {airportsList.map((airport) => (
                    <div
                      key={airport.id}
                      onClick={() => {
                        setfrom(airport);
                        setfromPannel(false);
                      }}
                      className="w-full h-12 bg-white hover:bg-blue-200 transition-all duration-200 rounded-md cursor-pointer"
                    >
                      <div className="flex items-center justify-start p-2 h-full">
                        <p className="inter-font">
                          {airport.full_name_country}, {airport.name}
                          <span className="opacity-50 text-xs"> {airport.iata_code} </span>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}


          {toPannel && (
            <div
              className="fixed inset-0 flex justify-center items-center backdrop-blur-lg z-10"
              onClick={() => setToPannel(false)} // 👈 Ferme en cliquant à l'extérieur
            >
              <div
                className="w-[30vw] h-[65svh] bg-slate-100 bg-opacity-70 backdrop-blur-lg rounded-lg flex flex-col p-6 shadow-lg"
                onClick={(e) => e.stopPropagation()} // 👈 Empêche la fermeture en cliquant à l'intérieur
              >
                <div className="flex gap-1 flex-col">
                  <TextInput onType={search} placeHolder="Where to ?" />
                  {airportsList.map((airport) => (
                    <div
                      key={airport.id}
                      onClick={() => {
                        setTo(airport);
                        setToPannel(false);
                      }}
                      className="w-full h-12 bg-white hover:bg-blue-200 transition-all duration-200 rounded-md cursor-pointer"
                    >
                      <div className="flex items-center justify-start p-2 h-full">
                        <p className="inter-font">
                          {airport.full_name_country}, {airport.name}
                          <span className="opacity-50 text-xs"> {airport.iata_code} </span>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}




        </div>
      </div>

    </>
  );
}
