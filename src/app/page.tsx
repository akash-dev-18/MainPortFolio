"use client";

import ScrollProvider from "@/components/ScrollProvider";
import ScrollProgress from "@/components/ScrollProgress";
import Navbar from "@/components/Navbar";
import AboutSection from "@/components/AboutSection";
import SkillsSection from "@/components/SkillsSection";
import ProjectsSection from "@/components/ProjectsSection";
import ContactSection from "@/components/ContactSection";
import CertificationsSection from "@/components/CertificationsSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <ScrollProvider>
      <div className="grain"></div>
      <ScrollProgress />
      <Navbar />

      <main className="pt-20">
        <AboutSection />
        <SkillsSection />
        <ProjectsSection />
        <CertificationsSection />
        <ContactSection />
      </main>

      <Footer />
    </ScrollProvider>
  );
}
