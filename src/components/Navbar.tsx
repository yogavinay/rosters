"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { ShoppingCart, LogOut, Package, User as UserIcon } from "lucide-react";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="border-b bg-background sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between items-center">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl font-bold text-primary">Andhra Rosters</span>
            </Link>
            <div className="hidden md:flex ml-10 space-x-8">
              <Link href="/products" className="text-foreground/80 hover:text-primary transition-colors">
                Marketplace
              </Link>
              {session?.user?.role === "seller" && (
                <Link href="/dashboard/seller" className="text-foreground/80 hover:text-primary transition-colors">
                  Seller Dashboard
                </Link>
              )}
              {session?.user?.role === "admin" && (
                <Link href="/dashboard/admin" className="text-foreground/80 hover:text-primary transition-colors">
                  Admin Dashboard
                </Link>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/cart" className="relative p-2 text-foreground/80 hover:text-primary transition-colors">
              <ShoppingCart className="h-6 w-6" />
              {/* Cart count badge would go here */}
            </Link>

            {session ? (
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium hidden sm:block">
                  Hello, {session.user?.name}
                </span>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="flex items-center gap-2 text-sm font-medium text-destructive hover:text-destructive/80 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link
                  href="/login"
                  className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
                >
                  Sign in
                </Link>
                <Link
                  href="/register"
                  className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
