'use client';

import { useState } from 'react';
import { motion } from "framer-motion";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import * as Accordion from '@radix-ui/react-accordion';
import { cn } from '@/lib/utils';

const areas = [
  { id: 'solidity', name: 'Solidity' },
  { id: 'security', name: 'Cybersecurity/Hacking' },
  { id: 'zk', name: 'Zero Knowledge' },
  { id: 'avalanche', name: 'Avalanche' },
];

const challenges = [
  {
    id: 1,
    title: "Basic Token Implementation",
    description: "Create a basic ERC20 token with custom features",
    requirements: [
      "Implement mint function with access control",
      "Add burn functionality",
      "Include transfer restrictions based on user roles",
      "Implement proper events for all main actions"
    ],
    testInstructions: "The contract will be tested for proper access control, event emissions, and transfer logic.",
    area: 'solidity'
  },
  {
    id: 2,
    title: "Secure Vault Contract",
    description: "Develop a secure vault contract with time locks",
    requirements: [
      "Implement time-based withdrawal restrictions",
      "Add emergency withdrawal mechanism",
      "Include multi-signature approval system",
      "Protect against reentrancy attacks"
    ],
    testInstructions: "Tests will verify security measures, time locks, and proper access controls.",
    area: 'security'
  },
];

export default function MainContent() {
  const [selectedArea, setSelectedArea] = useState('solidity');

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
              onClick={() => setSelectedArea(area.id)}
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

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-background p-6 rounded-xl border-1 border-muted"
      >
        <Accordion.Root type="single" collapsible className="space-y-4">
          {challenges
            .filter(challenge => challenge.area === selectedArea)
            .map((challenge) => (
              <Accordion.Item
                key={challenge.id}
                value={`challenge-${challenge.id}`}
                className="overflow-hidden"
              >
                <Accordion.Trigger className="w-full">
                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    className="flex items-center p-4 rounded-xl bg-background_secondary transition-all"
                  >
                    <div className="bg-primary text-background_secondary px-4 py-2 font-semibold text-xl rounded-lg">
                      #{challenge.id}
                    </div>
                    <h3 className="flex-1 text-text text-lg font-medium ml-4">
                      {challenge.title}
                    </h3>
                    <ChevronDownIcon className="w-6 h-6 text-textSecondary transition-transform duration-300 ease-[cubic-bezier(0.87,0,0.13,1)] group-data-[state=open]:rotate-180" />
                  </motion.div>
                </Accordion.Trigger>

                <Accordion.Content className="data-[state=open]:animate-slideDown data-[state=closed]:animate-slideUp">
                  <div className="p-6 bg-background_secondary rounded-xl mt-2 space-y-6">
                    <div>
                      <h4 className="text-text font-medium mb-2">Description</h4>
                      <p className="text-textSecondary">{challenge.description}</p>
                    </div>

                    <div>
                      <h4 className="text-text font-medium mb-2">Requirements</h4>
                      <ul className="list-disc list-inside text-textSecondary space-y-1">
                        {challenge.requirements.map((req, index) => (
                          <li key={index}>{req}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-text font-medium mb-2">Test Instructions</h4>
                      <p className="text-textSecondary">{challenge.testInstructions}</p>
                    </div>

                    <div className="flex gap-4">
                      <input
                        type="text"
                        placeholder="Contract Address (0x...)"
                        className="flex-1 bg-background text-text placeholder-textSecondary px-4 py-2 rounded-lg border-1 border-muted focus:outline-none focus:border-primary transition-colors"
                      />
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        className="bg-primary text-background px-6 py-2 rounded-lg hover:bg-secondary transition-colors"
                      >
                        Test Contract
                      </motion.button>
                    </div>
                  </div>
                </Accordion.Content>
              </Accordion.Item>
            ))}
        </Accordion.Root>
      </motion.div>
    </div>
  );
}