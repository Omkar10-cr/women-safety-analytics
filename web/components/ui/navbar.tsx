"use client";

import * as React from "react";
import Link from "next/link";
import {
  Activity,
  LayoutDashboard,
  LogIn,
  MapPin,
  Menu,
  Shield,
  ShieldAlert,
  X,
} from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
  ListItem,
} from "@/components/ui/navigation-menu";

const navigation = [
  {
    title: "Platform",
    items: [
      {
        title: "Dashboard",
        description: "Monitor your personal safety analytics.",
        href: "/dashboard",
        icon: LayoutDashboard,
      },
      {
        title: "Safety Analytics",
        description: "View risk levels and safety insights.",
        href: "/dashboard#analytics",
        icon: Activity,
      },
      {
        title: "Safety Map",
        description: "Explore location-based safety information.",
        href: "/dashboard#map",
        icon: MapPin,
      },
    ],
  },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [platformOpen, setPlatformOpen] = React.useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      {/* Glass background */}
      <div className="absolute inset-0 border-b border-white/[0.08] bg-black/60 backdrop-blur-2xl" />

      <nav className="relative mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8">
        {/* Logo */}
        <Link
          href="/"
          className="group flex items-center gap-3"
          onClick={() => setMobileOpen(false)}
        >
          <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl border border-blue-400/20 bg-blue-500/10">
            <div className="absolute inset-0 bg-blue-400/10 opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100" />

            <Shield className="relative h-5 w-5 text-blue-400 transition-transform duration-500 group-hover:scale-110" />
          </div>

          <div className="hidden sm:block">
            <p className="text-sm font-semibold tracking-wide text-white">
              Women Safety
            </p>

            <p className="text-[10px] uppercase tracking-[0.25em] text-gray-500">
              Analytics
            </p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-1 md:flex">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Platform</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[360px] gap-2 p-3 md:w-[420px]">
                    <li className="px-2 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-[0.25em] text-gray-500">
                      Safety Platform
                    </li>

                    {navigation[0].items.map((item) => {
                      const Icon = item.icon;

                      return (
                        <ListItem
                          key={item.title}
                          href={item.href}
                          title={item.title}
                          className="group flex gap-3 rounded-xl p-3 transition-all duration-300 hover:bg-white/[0.07]"
                          onClick={() => setPlatformOpen(false)}
                        >
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04]">
                            <Icon className="h-4 w-4 text-blue-400 transition-transform duration-300 group-hover:scale-110" />
                          </span>
                          <span className="block text-left text-xs leading-5 text-gray-500">
                            {item.description}
                          </span>
                        </ListItem>
                      );
                    })}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>

            <NavigationMenuViewport />
          </NavigationMenu>

          <NavLink href="/">Home</NavLink>
          <NavLink href="/dashboard">Dashboard</NavLink>

          <NavLink href="/dashboard#emergency">
            Emergency
          </NavLink>
        </div>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/login"
            className="group flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm font-medium text-gray-300 transition-all duration-300 hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
          >
            <LogIn className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            Login
          </Link>

          <Link
            href="/dashboard#emergency"
            className="group relative flex items-center gap-2 overflow-hidden rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-black transition-all duration-300 hover:scale-[1.02] hover:bg-gray-200"
          >
            <ShieldAlert className="h-4 w-4" />
            Emergency
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          aria-label="Toggle navigation"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-gray-300 transition hover:bg-white/[0.08] hover:text-white md:hidden"
        >
          {mobileOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </nav>

      {/* Mobile navigation */}
      {mobileOpen && (
        <div className="relative border-b border-white/10 bg-black/95 px-5 pb-6 pt-2 backdrop-blur-2xl md:hidden">
          <div className="mx-auto max-w-7xl space-y-2">
            <MobileLink
              href="/"
              onClick={() => setMobileOpen(false)}
            >
              Home
            </MobileLink>

            <MobileLink
              href="/dashboard"
              onClick={() => setMobileOpen(false)}
            >
              Dashboard
            </MobileLink>

            <MobileLink
              href="/dashboard#analytics"
              onClick={() => setMobileOpen(false)}
            >
              Safety Analytics
            </MobileLink>

            <MobileLink
              href="/dashboard#map"
              onClick={() => setMobileOpen(false)}
            >
              Safety Map
            </MobileLink>

            <MobileLink
              href="/dashboard#emergency"
              onClick={() => setMobileOpen(false)}
            >
              Emergency
            </MobileLink>

            <div className="pt-3">
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-gray-200"
              >
                <LogIn className="h-4 w-4" />
                Login
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

/* Desktop navigation link */
function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="relative rounded-xl px-4 py-2.5 text-sm text-gray-300 transition-all duration-300 hover:bg-white/[0.06] hover:text-white"
    >
      {children}
    </Link>
  );
}

/* Mobile navigation link */
function MobileLink({
  href,
  children,
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center rounded-xl border border-transparent px-4 py-3 text-sm text-gray-300 transition-all duration-300 hover:border-white/10 hover:bg-white/[0.05] hover:text-white"
    >
      {children}
    </Link>
  );
}