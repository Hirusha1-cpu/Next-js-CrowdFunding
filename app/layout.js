import { CrowdFundingProvider } from '@/Context/CroudFunding'
import './globals.css'
import { Inter } from 'next/font/google'
import { Footer, NavBar } from '@/Components'

export const metadata = {
  title: 'Crowd funding Project',
  description: 'Crowd funding project',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
      <CrowdFundingProvider>
      <>
        <NavBar />
        <main>
          {children}
        </main>
        <Footer />
      </>
    </CrowdFundingProvider>
        
      </body>
    </html>
  )
}
