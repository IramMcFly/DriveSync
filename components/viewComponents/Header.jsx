'use client'

import Link from "next/link"
import { useState } from "react"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-gradient-to-r from-[#5D2A0C] to-[#8B4513] shadow-md">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex h-16 items-center">
          <div className="flex items-center gap-2 mr-8">
            <div className="bg-black rounded-full p-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-orange-500"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
              </svg>
            </div>
            <span className="font-bold text-white text-lg">DriveSync Servicios</span>
          </div>

          <nav className={`
            absolute left-0 right-0 top-16 bg-[#5D2A0C] md:bg-transparent
            md:static md:flex md:items-center
            ${isMenuOpen ? 'block' : 'hidden'}
          `}>
            <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 p-4 md:p-0 md:ml-64">
              <NavItem href="/servicios" active>
                Servicios Express
              </NavItem>
              <NavItem href="/lugares">Lugares Afiliados</NavItem>
              <NavItem href="/asistencia">Asistencia Especial</NavItem>
            </div>
          </nav>

          <div className="ml-auto">
            <button className="text-white hover:bg-orange-800/20 p-2 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </button>
          </div>

          <button 
            className="md:hidden text-white hover:bg-orange-800/20 p-2 rounded-full ml-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {isMenuOpen ? (
                <path d="M18 6L6 18M6 6l12 12" />
              ) : (
                <>
                  <line x1="4" y1="12" x2="20" y2="12" />
                  <line x1="4" y1="6" x2="20" y2="6" />
                  <line x1="4" y1="18" x2="20" y2="18" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>
    </header>
  )
}

function NavItem({ href, children, active }) {
  return (
    <Link
      href={href}
      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
        active ? "bg-orange-600 text-white" : "text-white hover:bg-orange-700/30"
      }`}
    >
      {children}
    </Link>
  )
}

