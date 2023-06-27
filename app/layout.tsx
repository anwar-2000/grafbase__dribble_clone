import Footer from '@/components/Footer'
import NavBar from '@/components/NavBar'
import React from 'react'
import './globals.css'



export const metadata = {
    title : 'Friibble',
    description : 'showcase and discover remarkabale dev projects'
}

export default function RootLayout  ({
    children
}:{
    children : React.ReactNode
})  {
  return (
    <html lang="en">
        <body>
            <NavBar />
            <main>
            {children}
            </main>
            <Footer />
        </body>
    </html>
  )
}
