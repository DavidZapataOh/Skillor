'use client';

import { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import * as Accordion from '@radix-ui/react-accordion';
import { cn } from '@/lib/utils';
import { withAuth } from '@/components/hoc/withAuth';
import useStore from '@/store/challengeStore';
import { elizaService } from '@/services/elizaService';
import Link from 'next/link';

const areas = [
  { id: 'solidity', name: 'Solidity' },
  { id: 'security', name: 'Cybersecurity/Hacking' },
  { id: 'zk', name: 'Zero Knowledge' },
  { id: 'avalanche', name: 'Avalanche' },
];

function MainContent() {
  const [selectedArea, setSelectedArea] = useState('solidity');
  const { activeChallenge } = useStore();

  useEffect(() => {
    const loadInitialChallenge = async () => {
      if (!activeChallenge[selectedArea]) {
        await elizaService.generateNextChallenge(selectedArea, 'user');
      }
    };
    loadInitialChallenge();
  }, [selectedArea]);

  const handleAreaChange = async (areaId) => {
    setSelectedArea(areaId);
    if (!activeChallenge[areaId]) {
      await elizaService.generateNextChallenge(areaId, 'user');
    }
  };

  return (
    <div className="p-6 ml-64">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-background p-6 rounded-xl border-1 border-muted mb-4"
      >
        <h2 className="text-text text-xl font-bold mb-6">Challenges</h2>
        <div className="flex gap-4">
          {areas.map((area) => (
            <motion.button
              key={area.id}
              whileHover={{ scale: 1.02 }}
              onClick={() => handleAreaChange(area.id)}
              className={cn(
                "px-4 py-2 rounded-lg transition-all",
                selectedArea === area.id
                  ? "bg-primary/20 text-primary"
                  : "text-textSecondary hover:bg-background_secondary"
              )}
            >
              {area.name}
            </motion.button>
          ))}
        </div>
      </motion.div>
  
      <div className="grid grid-cols-2 gap-4">
        {activeChallenge[selectedArea] && (
          <Link
            href={`/challenges/${selectedArea}`}
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-background p-6 rounded-xl border-1 border-muted cursor-pointer"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-primary text-background px-4 py-2 rounded-lg">
                  Active Challenge
                </div>
                <h3 className="text-text text-lg font-medium">
                  {activeChallenge[selectedArea].title}
                </h3>
              </div>
              <p className="text-textSecondary">
                {activeChallenge[selectedArea].description}
              </p>
            </motion.div>
          </Link>
        )}
      </div>
    </div>
  );
}

export default withAuth(MainContent);