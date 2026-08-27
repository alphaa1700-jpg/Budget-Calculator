import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Sidebar } from "@/components/layout/Sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Personal Finance Command Center",
  description: "Track your income, expenses, budgets, and goals.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} flex h-screen bg-background text-foreground overflow-hidden`}>
        <ThemeProvider defaultTheme="system">
          {/* Desktop Sidebar */}
          <div className="hidden md:flex md:w-64 md:flex-col">
            <Sidebar />
          </div>
          
          {/* Main Content Area */}
          <div className="flex flex-col flex-1 overflow-hidden">
            {/* Mobile Header */}
            <header className="flex h-14 md:hidden items-center justify-between border-b px-4 lg:h-[60px] bg-card">
              <span className="font-bold">Finance Center</span>
              <ThemeToggle />
            </header>
            
            <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
              {children}
            </main>
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
