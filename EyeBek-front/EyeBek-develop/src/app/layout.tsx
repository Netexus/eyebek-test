"use client"
import Navbar from '@/components/navbar/Navbar';
import Footer from '@/components/footer/Footer';
// @ts-ignore
import './globals.css';
import { usePathname } from 'next/navigation';
import { Providers } from './providers';

export default function RootLayout({ children }: { children: React.ReactNode }) {

  const pathname=usePathname()
  const isDashboard = pathname.startsWith('/dashboard')


  return (
    <html lang="es">
      <body className="min-h-screen flex flex-col">
        <Providers>
          {!isDashboard && <Navbar />}
          
          <main>
            {children}
          </main>

          {!isDashboard && <Footer />}
        </Providers>
      </body>
    </html>
  );
}