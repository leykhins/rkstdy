import { useEffect, useState } from "react"

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"

const navItems = [
  { label: "Home", href: "#home" },
  { label: "Services", href: "#services" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
]

interface HeaderNavProps {
  variant?: "desktop" | "mobile" | "both"
}

export default function HeaderNav({ variant = "both" }: HeaderNavProps) {
  const [activeSection, setActiveSection] = useState("#home")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const sections = navItems.map(item => item.href.substring(1))
      const scrollPosition = window.scrollY + 100

      for (const section of sections.reverse()) {
        const element = document.getElementById(section)
        if (element && element.offsetTop <= scrollPosition) {
          setActiveSection(`#${section}`)
          break
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    handleScroll()
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Close mobile menu when clicking a link
  const handleLinkClick = () => {
    setMobileMenuOpen(false)
  }

  const desktopNav = (
    <nav className="hidden md:flex items-center gap-1">
      {navItems.map((item) => (
        <a
          key={item.href}
          href={item.href}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            activeSection === item.href
              ? "text-[var(--brand-red)] bg-red-50"
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          }`}
        >
          {item.label}
        </a>
      ))}
    </nav>
  )

  const mobileMenu = (
    <Drawer open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
      {/* Mobile Menu Button */}
      <DrawerTrigger asChild>
        <button
          className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 border border-gray-200 transition-colors"
          aria-label="Toggle menu"
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/>
            </svg>
          )}
        </button>
      </DrawerTrigger>

      {/* Mobile Menu Drawer */}
      <DrawerContent className="p-0 md:hidden">
        <div className="flex flex-col h-full">
          <DrawerHeader className="flex items-center justify-between p-4 border-b text-left">
            <DrawerTitle className="font-semibold text-gray-900">Menu</DrawerTitle>
            <DrawerClose asChild>
              <button
                className="flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="Close menu"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
                </svg>
              </button>
            </DrawerClose>
          </DrawerHeader>

          <nav className="flex-1 p-4">
            <div className="flex flex-col gap-2">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={handleLinkClick}
                  className={`px-4 py-3 text-base font-medium rounded-lg transition-colors ${
                    activeSection === item.href
                      ? "text-[var(--brand-red)] bg-red-50"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  {item.label}
                </a>
              ))}
            </div>
          </nav>

          <div className="p-4 border-t">
            <a
              href="#quote-form"
              onClick={handleLinkClick}
              className="flex items-center justify-center gap-2 w-full bg-[var(--brand-red)] hover:bg-[var(--brand-red-hover)] text-white font-semibold py-3 px-6 rounded-lg text-[15px] transition-colors"
            >
              Request a Quote
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 7h10v10"/><path d="M7 17 17 7"/>
              </svg>
            </a>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )

  if (variant === "desktop") return desktopNav
  if (variant === "mobile") return mobileMenu
  return (
    <>
      {desktopNav}
      {mobileMenu}
    </>
  )
}
