'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
  SidebarInset,
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  Map,
  Search,
  Sparkles,
  Ticket,
  User,
  LogIn,
  LogOut
} from 'lucide-react';
import { Icons } from './icons';
import { Button } from './ui/button';
import { logout } from '@/lib/auth';

const navItems = [
  {
    href: '/dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
  },
  {
    href: '/discover',
    label: 'Discover',
    icon: Search,
  },
  {
    href: '/itinerary',
    label: 'Itinerary Generator',
    icon: Map,
  },
  {
    href: '/bookings',
    label: 'My Bookings',
    icon: Ticket,
  },
  {
    href: '/profile',
    label: 'Profile',
    icon: User,
  },
];

const pageTitles: { [key: string]: string } = {
  '/': 'Welcome',
  '/dashboard': 'Dashboard',
  '/discover': 'Discover Points of Interest',
  '/itinerary': 'Itinerary Generator',
  '/bookings': 'My Bookings',
  '/profile': 'User Profile',
  '/login': 'Login',
  '/signup': 'Sign Up'
};


export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    // Since login is removed, this will just redirect to dashboard.
    // When you re-enable login, you can point it back to '/'
    router.push('/dashboard');
  }

  // The original authentication page is at /login, we will keep it for now
  const isAuthPage = pathname === '/login';

  if (isAuthPage) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-background">
        {children}
      </div>
    );
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <Link href="/dashboard" className="flex items-center gap-2">
            <Icons.logo className="w-8 h-8 text-primary" />
            <span className="text-xl font-headline font-bold">
              Wanderlust
            </span>
          </Link>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname.startsWith(item.href)}
                  tooltip={item.label}
                >
                  <Link href={item.href}>
                    <item.icon />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
           <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={handleLogout} tooltip="Logout">
                    <LogOut />
                    <span>Logout</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          <div className="text-center text-xs text-muted-foreground p-4">
            &copy; {new Date().getFullYear()} Wanderlust India
          </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="p-4 flex items-center gap-4">
          <SidebarTrigger />
          <h1 className="font-headline text-2xl font-bold">
            {pageTitles[pathname] || 'Wanderlust India'}
          </h1>
        </header>
        <main className="p-4">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
