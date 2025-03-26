"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Zap, MapPin, LifeBuoy, User, Menu, X } from "lucide-react"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Detectar si es dispositivo móvil
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    // Verificar al cargar y cuando cambie el tamaño de la ventana
    checkIfMobile()
    window.addEventListener("resize", checkIfMobile)

    return () => {
      window.removeEventListener("resize", checkIfMobile)
    }
  }, [])

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-gradient-to-r from-[#5D2A0C] to-[#8B4513] shadow-md">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex h-16 items-center">
            <div className="flex items-center gap-2 mr-8">
              <div className="bg-black rounded-full p-2">
                <Zap size={20} className="text-orange-500" />
              </div>
              <span className="font-bold text-white text-lg">DriveSync Servicios</span>
            </div>

            <nav
              className={`
              absolute left-0 right-0 top-16 bg-[#5D2A0C] md:bg-transparent
              md:static md:flex md:items-center
              ${isMenuOpen ? "block" : "hidden md:flex"}
            `}
            >
              <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 p-4 md:p-0 md:ml-64">
                <NavItem href="/view" active icon={<Zap size={16} />}>
                  Servicios Express
                </NavItem>
                <NavItem href="/lugares" icon={<MapPin size={16} />}>
                  Lugares Afiliados
                </NavItem>
                <NavItem href="/asistencia" icon={<LifeBuoy size={16} />}>
                  Asistencia Especial
                </NavItem>
              </div>
            </nav>

            <div className="ml-auto">
              <button className="text-white hover:bg-orange-800/20 p-2 rounded-full">
                <User size={20} />
              </button>
            </div>

            <button
              className="md:hidden text-white hover:bg-orange-800/20 p-2 rounded-full ml-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* Contenido principal con padding para la barra inferior en móviles */}
      <main className={`flex-1 ${isMobile ? "pb-16" : ""}`}>{/* Aquí va el contenido de tu aplicación */}</main>

      {/* Barra de navegación inferior para móviles */}
      {isMobile && (
        <nav className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-[#5D2A0C] to-[#8B4513] text-white h-16 flex items-center justify-around z-50 shadow-[0_-2px_10px_rgba(0,0,0,0.1)]">
          <MobileNavItem href="/view" icon={<Zap size={24} />}>
            Servicios Express
          </MobileNavItem>
          <MobileNavItem href="/lugares" icon={<MapPin size={24} />}>
            Lugares Afiliados
          </MobileNavItem>
          <MobileNavItem href="/asistencia" icon={<LifeBuoy size={24} />}>
            Asistencia Especial
          </MobileNavItem>
        </nav>
      )}
    </>
  )
}

function NavItem({ href, children, active, icon }) {
  return (
    <Link
      href={href}
      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center ${
        active ? "bg-orange-600 text-white" : "text-white hover:bg-orange-700/30"
      }`}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </Link>
  )
}

function MobileNavItem({ href, children, icon }) {
  return (
    <Link href={href} className="flex flex-col items-center justify-center text-xs">
      <span className="mb-1 text-orange-400">{icon}</span>
      <span>{children}</span>
    </Link>
  )
}

