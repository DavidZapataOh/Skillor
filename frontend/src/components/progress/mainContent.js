'use client';

import { useState } from 'react';
import { motion } from "framer-motion";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, Area } from 'recharts';
import { cn } from '@/lib/utils';
import { withAuth } from '../hoc/withAuth';
import useStore from '@/store/challengeStore';

const StarIcon = ({ className, fill, selected }) => (
  <svg 
    className={className} 
    viewBox="0 0 24 24" 
    fill={fill}
    stroke={selected ? "#7FB800" : "#141414"}
    strokeWidth="2"
  >
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

function MainContent() {
  const { areaStats } = useStore();
  const [selectedArea, setSelectedArea] = useState('solidity');

  const getRecentChallenges = (challenges) => {
    return challenges
      .slice(-5)
      .map(c => ({
        date: c.timestamp ? new Date(c.timestamp).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        name: c.id,
        rating: c.score
      }))
      .filter(c => c.date && c.name && c.rating);
  };

  const progressData = Object.entries(areaStats).map(([area, stats]) => {
    const recentScores = getRecentChallenges(stats.completedChallenges || []);
    return {
      area: area.charAt(0).toUpperCase() + area.slice(1),
      stars: stats.stars || 0,
      recentScores,
      totalScore: Math.round(stats.score || 0)
    };
  });

  const selectedAreaData = progressData.find(a => a.area === selectedArea) || progressData[0];

  const renderStars = (count, selected = false) => {
    const stars = [];
    const fullStars = Math.floor(count);
    const hasHalfStar = count % 1 !== 0;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <StarIcon 
            key={i} 
            className="w-4 h-4" 
            fill="#7FB800"
            selected={selected}
          />
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <div key={i} className="relative w-4 h-4">
            <StarIcon 
              className="absolute w-4 h-4" 
              fill="#141414"
              selected={selected}
            />
            <div className="absolute w-2 h-4 overflow-hidden">
              <StarIcon 
                className="w-4 h-4" 
                fill="#7FB800"
                selected={selected}
              />
            </div>
          </div>
        );
      } else {
        stars.push(
          <StarIcon 
            key={i} 
            className="w-4 h-4" 
            fill="#141414"
            selected={selected}
          />
        );
      }
    }
    return stars;
  };

  return (
    <div className="p-6 ml-64">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-background p-6 rounded-xl border-1 border-muted mb-4"
      >
        <h2 className="text-text text-xl font-bold mb-6">Progress</h2>
        <div className="grid grid-cols-2 gap-4">
          {progressData.map((area) => (
            <motion.button
              key={area.area}
              whileHover={{ scale: 1.01 }}
              onClick={() => setSelectedArea(area.area)}
              className={cn(
                "w-full flex items-center p-4 rounded-xl border-1 border-muted transition-all",
                selectedArea === area.area
                  ? "bg-primary text-text"
                  : "bg-background_secondary text-text hover:bg-background_secondary/80"
              )}
            >
              <div className={cn(
                "flex gap-1 bg-background rounded-lg p-2",
                selectedArea === area.area
                  ? "bg-background"
                  : "bg-primary"
              )}>
                {renderStars(area.stars, selectedArea === area.area)}
              </div>
              <div className="flex-1 text-left pl-4">
                <span className="font-medium">{area.area}</span>
              </div>
              <div className=
                "px-3 py-1 rounded-lg border border-textSecondary text-textSecondary">
                <span className="font-semibold">{area.totalScore.toFixed(1)}</span>
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-background p-6 rounded-xl border-1 border-muted"
        >
          <h3 className="text-text text-lg font-bold mb-4">Positive</h3>
          <div className="space-y-3">
            {selectedAreaData.recentScores.filter(c => c.rating > 0).map((item, index) => (
              <div key={index} className="flex items-center gap-3 text-textSecondary">
                <CheckCircleIcon className="w-5 h-5 text-primary" />
                <span>{item.name}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-background p-6 rounded-xl border-1 border-muted"
        >
          <h3 className="text-text text-lg font-bold mb-4">Negative</h3>
          <div className="space-y-3">
            {selectedAreaData.recentScores.filter(c => c.rating < 0).map((item, index) => (
              <div key={index} className="flex items-center gap-3 text-textSecondary">
                <XCircleIcon className="w-5 h-5 text-red-500" />
                <span>{item.name}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-background p-6 rounded-xl border-1 border-muted"
      >
        <h3 className="text-text text-lg font-bold mb-6">Last 5 Challenges</h3>
        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-text font-medium">Performance</h4>
                <p className="text-textSecondary text-sm">Last 5 challenges rating</p>
              </div>
              <div className="px-3 py-1 rounded-lg border border-textSecondary text-textSecondary">
                <span className="font-semibold">
                  {(selectedAreaData.recentScores.reduce((acc, curr) => acc + curr.rating, 0) / 
                    selectedAreaData.recentScores.length / 10).toFixed(1)}
                </span>
              </div>
            </div>
            <div className="h-48 bg-background_secondary rounded-lg p-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={selectedAreaData.recentScores}>
                  <defs>
                    <linearGradient id="colorRating" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#7FB800" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#7FB800" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis 
                    dataKey="date" 
                    stroke="#4A4A4A"
                    tick={{ fill: '#4A4A4A' }}
                    axisLine={false}
                    tickLine={false}
                    dy={10}
                  />
                  <YAxis 
                    domain={[0, 100]} 
                    stroke="#4A4A4A"
                    tick={{ fill: '#4A4A4A' }}
                    axisLine={false}
                    tickLine={false}
                    dx={-10}
                    tickFormatter={(value) => (value/10).toFixed(1)}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#141414',
                      border: '1px solid #2A2A2A',
                      borderRadius: '8px',
                      padding: '8px'
                    }}
                    formatter={(value) => [(value/10).toFixed(1), "Rating"]}
                  />
                  <Area
                    type="monotone"
                    dataKey="rating"
                    stroke="#7FB800"
                    strokeWidth={2}
                    fill="url(#colorRating)"
                  />
                  <Line
                    type="monotone"
                    dataKey="rating"
                    stroke="#7FB800"
                    strokeWidth={2}
                    dot={{ fill: '#7FB800', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="space-y-2">
            {selectedAreaData.recentScores.map((challenge, index) => (
              <div
                key={index}
                className={cn(
                  "flex items-center justify-between p-3 rounded-lg",
                  index % 2 === 1 ? "bg-background_secondary" : ""
                )}
              >
                <div className="flex flex-col">
                  <span className="text-text font-medium">{challenge.name}</span>
                  <span className="text-textSecondary text-sm">{challenge.date}</span>
                </div>
                <div className="px-3 py-1 rounded-lg border border-textSecondary text-textSecondary">
                  <span className="font-semibold">{(challenge.rating / 10).toFixed(1)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default withAuth(MainContent);