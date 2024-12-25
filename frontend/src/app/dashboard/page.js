'use client';

import Sidebar from "@/components/agents/sidebar";
import Header from "@/components/agents/header";
import MainContent from "@/components/agents/mainContent";
import { useAuth } from "@crossmint/client-sdk-react-ui";

export default function Agents() {
  return (
    <div className="flex bg-background_secondary min-h-screen text-secondary font-sans">
      <Sidebar />
      <div className="flex-1">
        <Header />
        <MainContent />
      </div>
    </div>
  );
}