import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Sidebar } from "@/components/layout/Sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { MagicExpenseLogger } from "@/components/MagicExpenseLogger";
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
            
            <div className="hidden md:flex h-14 items-center justify-end border-b px-6 lg:h-[60px] bg-background gap-4">
              <MagicExpenseLogger />
              <ThemeToggle />
            </div>
            <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 flex flex-col">
              <div className="flex-1">
                {children}
              </div>
              <footer className="mt-12 py-6 text-center text-sm text-muted-foreground">
                Designed by <a href="https://www.alphaautomations.xyz/" target="_blank" rel="noopener noreferrer" className="font-medium text-primary hover:underline transition-colors">AlphaAIAutomations</a>
              </footer>
            </main>
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
