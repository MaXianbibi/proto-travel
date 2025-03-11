"use client"

import React, { useEffect, useState } from 'react'
import { User } from '../lib/auth/interface'
import { useUser } from '../lib/customHook/custumHooks'
import { get_travel_profile } from '../lib/db_lib/user'

export default function page() {
  const user : User  | null =  useUser()

  const [profile, setProfile] = useState<string | null>(null)

  useEffect(() => {
    if (!user?.id) return;
    async function getProfileTravel() {
      if (user) {
        const temp =  await get_travel_profile(user)
        if (temp) {
          setProfile(temp)
        }
      }
    }
    getProfileTravel()
  }, [user?.id])

  
  return (
    <div className='w-screen h-screen flex justify-center items-center'>

      {
        profile ? <div>{profile}</div> : <div>loading</div>
      }


    </div>
  )
}
