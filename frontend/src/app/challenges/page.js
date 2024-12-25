'use client';

import Sidebar from "@/components/common/sidebar";
import Header from "@/components/common/header";
import MainContent from "@/components/challenges/mainContent";
import { useAuth } from "@crossmint/client-sdk-react-ui";

export default function Challenges() {
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