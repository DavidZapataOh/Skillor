'use client';

import Sidebar from "@/components/agents/sidebar";
import Header from "@/components/agents/header";
import MainContent from "@/components/agents/mainContent";

export default function Agents() {
  return (
    <div className="flex bg-background min-h-screen text-secondary font-sans">
      <Sidebar />
      <div className="flex-1">
        <Header />
        <MainContent />
      </div>
    </div>
  );
}
