import type { Metadata } from "next";
import ClientCursor from "@/components/ClientCursor";
import "./globals.css";

export const metadata: Metadata = {
  title: "AKASH KUMAR // Security-Focused Backend Engineer",
  description: "Portfolio of Akash Kumar, a Security-First Backend Developer & Cyber Architect specializing in FastAPI, Spring Boot, and Agentic AI systems.",
  keywords: ["Akash Kumar", "Backend Engineer", "Cyber Security", "FastAPI", "Spring Boot", "Agentic AI", "Portfolio"],
  openGraph: {
    title: "AKASH KUMAR // Portfolio",
    description: "Security-First Backend Developer & Cyber Architect",
    type: "website",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="font-mono antialiased bg-obsidian text-white">
        <ClientCursor />
        {children}
      </body>
    </html>
  );
}
