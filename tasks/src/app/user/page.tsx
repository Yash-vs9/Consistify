'use client'
import React, {JSX, useEffect, useState } from 'react'

const Page = (): JSX.Element => {
    const [quote,setQuote]=useState("")
    useEffect( ()=>{
        fetch('https://api.api-ninjas.com/v1/advice', {
            headers: {
              'X-Api-key': 'GdSg4mzhgZPgjOFFIE3QHw==WeAvyEQnvuEYXJf2'
            }
          })
            .then(res => res.json())
            .then(data => {
              setQuote(data.advice); // Extract 'advice' from response object
            })
            .catch(error => {
              console.error('Error fetching advice:', error);
              setQuote('Failed to load advice.');
        })
    },[])
  return (
    <div>
        {quote}
    </div>
  )
}

export default Page
