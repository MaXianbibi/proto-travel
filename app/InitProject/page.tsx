
"use client"

import React from 'react'
import initProject from '../lib/init_project'

export default function Home() {
    
    async function handleClick() {
        await initProject()
    }

  return (
    <div>
        <button onClick={handleClick}>
            yoo : )
        </button>

    </div>
  )
}
