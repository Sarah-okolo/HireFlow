
import { Header } from "./Header";
import { ReactNode } from "react";

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 container py-8">{children}</main>
      <footer className="border-t py-6 bg-muted/40">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-center text-sm text-muted-foreground md:text-left">
            &copy; {new Date().getFullYear()} HireMatch. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
