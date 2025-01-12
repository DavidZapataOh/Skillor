"use client";

import Sidebar from "@/components/common/sidebar";
import Header from "@/components/common/header";
import ChallengeContent from "@/components/challenges/challengeContent";
import { withAuth } from '@/components/hoc/withAuth';

function ChallengePage() {
  return (
    <div className="flex bg-background_secondary min-h-screen text-secondary font-sans">
      <Sidebar />
      <div className="flex-1">
        <Header />
        <ChallengeContent />
      </div>
    </div>
  );
}

export default withAuth(ChallengePage); 