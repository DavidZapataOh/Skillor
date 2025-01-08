'use client';

import { FireIcon, TrophyIcon, CurrencyDollarIcon } from "@heroicons/react/24/solid";
import { motion } from "framer-motion";
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import ActivityCalendar from 'react-activity-calendar';
import { Tooltip as MuiTooltip } from '@mui/material';
import { withAuth } from '../hoc/withAuth';
import { useTokenBalance } from '@/hooks/useTokenBalance';

function MainContent() {
  const tokenBalance = useTokenBalance();

  const statsCards = [
    { title: "Streak", value: "12 days", icon: <FireIcon className="w-8 h-8" /> },
    { title: "Challenges met", value: "48", icon: <TrophyIcon className="w-8 h-8" /> },
    { 
      title: "Coins earned", 
      value: `${tokenBalance.toLocaleString(undefined, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
      })} $SKLLR`, 
      icon: <CurrencyDollarIcon className="w-8 h-8" /> 
    }
  ];

  const skillsData = [
    { name: "Smart Contract Development", score: 17 },
    { name: "Gas Optimization", score: 18 },
    { name: "Security Best Practices", score: 15 },
    { name: "Testing & Debugging", score: 16 },
    { name: "DeFi Protocols", score: 14 },
    { name: "ERC Standards", score: 18 },
    { name: "Blockchain Architecture", score: 5 },
    { name: "Web3 Integration", score: 17 },
    { name: "Tokenomics", score: 15 },
    { name: "NFT Development", score: 17 },
    { name: "Layer 2 Solutions", score: 14 },
    { name: "Cross-chain Development", score: 16 },
    { name: "Consensus Mechanisms", score: 13 },
    { name: "ZK Proofs", score: 12 },
    { name: "DAO Structures", score: 15 },
    { name: "MEV Protection", score: 13 },
    { name: "Upgradeable Contracts", score: 16 },
    { name: "Oracle Integration", score: 15 },
    { name: "Governance Systems", score: 14 },
    { name: "Flash Loans", score: 13 }
  ];

  const progressData = [
    {
      area: "Solidity",
      stars: 4.5,
      recentScores: [85, 92, 88, 90, 87],
      totalScore: 88
    },
    {
      area: "Security",
      stars: 3.5,
      recentScores: [75, 82, 78, 80, 85],
      totalScore: 80
    },
    {
      area: "ZK Proofs",
      stars: 2.5,
      recentScores: [65, 70, 68, 72, 75],
      totalScore: 70
    }
  ];

  const pendingChallenges = [
    "Build a DEX with Order Book",
    "Implement ZK Rollup",
    "Create Governance Token",
    "Optimize Gas Usage"
  ];

  function getDatesInRange(startDate, endDate) {
    const date = new Date(startDate.getTime());
    const dates = [];
    
    while (date <= endDate) {
      dates.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }
    
    return dates;
  }

  function generateYearlyData() {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setFullYear(endDate.getFullYear() - 1);
    
    const dates = getDatesInRange(startDate, endDate);
    return dates.map(date => ({
      date: date.toISOString().split('T')[0],
      count: 0,
      level: 0
    }));
  }

  const StarIcon = ({ className, fill }) => (
    <svg 
      className={className} 
      viewBox="0 0 24 24" 
      fill={fill}
      stroke="#141414"
      strokeWidth="2"
    >
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );

  const renderStars = (count) => {
    const stars = [];
    const fullStars = Math.floor(count);
    const hasHalfStar = count % 1 !== 0;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <StarIcon 
            key={i} 
            className="w-4 h-4" 
            fill="#7FB800" // primary color
          />
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <div key={i} className="relative w-4 h-4">
            <StarIcon 
              className="absolute w-4 h-4" 
              fill="#141414" // background color
            />
            <div className="absolute w-2 h-4 overflow-hidden">
              <StarIcon 
                className="w-4 h-4" 
                fill="#7FB800" // primary color
              />
            </div>
          </div>
        );
      } else {
        stars.push(
          <StarIcon 
            key={i} 
            className="w-4 h-4" 
            fill="#141414" // background color
          />
        );
      }
    }
    return stars;
  };

  const activityData = [
    { date: "2024-01-01", count: 4, level: 4 },
    { date: "2024-01-02", count: 2, level: 2 },
    { date: "2024-01-03", count: 2, level: 2 },
  ];

  const allActivityData = generateYearlyData().map(baseDay => {
    const activityDay = activityData.find(day => day.date === baseDay.date);
    return activityDay || baseDay;
  });

  const getOpacityFromScore = (score) => {
    return 0.4 + ((score - 1) / 19) * 0.6;
  };

  return (
    <div className="p-6 ml-64">
      <div className="grid grid-cols-3 gap-4 mb-4">
        {statsCards.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-background p-6 rounded-xl border-1 border-muted relative"
          >
            <div className="absolute top-6 right-6 p-4 bg-primary rounded-lg">
              <div className="text-background">
                {stat.icon}
              </div>
            </div>
            <div className="pr-20">
              <p className="text-textSecondary text-sm mb-2">{stat.title}</p>
              <p className="text-text text-2xl font-bold">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-background p-6 rounded-xl border-1 border-muted mb-4"
      >
        <h2 className="text-text text-xl font-bold mb-6">General View</h2>
        <div className="grid grid-cols-5 gap-x-4">
          {skillsData.map((skill, index) => (
            <div
              key={index}
              className={`flex justify-between items-center py-2 px-2 ${
                Math.floor(index / 5) % 2 === 1 ? 'bg-background_secondary' : ''
              }`}
            >
              <span className="text-textSecondary text-sm">{skill.name}</span>
              <span className="border-1 border-primary px-2 py-1 rounded-lg text-sm inline-block min-w-[34px] text-center" 
                style={{ 
                  color: `rgba(127, 184, 0, ${getOpacityFromScore(skill.score)})`
                }}>
                {skill.score}
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-background p-6 rounded-xl border-1 border-muted mb-4"
      >
        <h2 className="text-text text-xl font-bold mb-6">Activity</h2>
        <div className="bg-background_secondary p-4 rounded-xl flex justify-center">
          <ActivityCalendar
            data={allActivityData}
            theme={{
              dark: ['#141414', '#7FB80033', '#7FB80066', '#7FB80099', '#7FB800']
            }}
            labels={{
              legend: {
                less: 'Less',
                more: 'More'
              },
              months: [
                "Jan", "Feb", "Mar", "Apr", "May", "Jun",
                "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
              ],
              weekdays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
            }}
            hideTotalCount
            hideColorLegend
            showWeekdayLabels
            blockMargin={6}
            blockSize={16}
            style={{
              width: '100%',
              height: '100%'
            }}
            renderBlock={(block, activity) => (
                <MuiTooltip title={`${activity.count} activities on ${activity.date}`}>
                  {block}
                </MuiTooltip>
              )}
              renderColorLegend={(block, level) => (
                <MuiTooltip title={`Level: ${level}`}>{block}</MuiTooltip>
              )}
            />
        </div>
      </motion.div>

      <div className="grid grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-background p-6 rounded-xl border-1 border-muted"
        >
          <h2 className="text-text text-xl font-bold mb-6">Progress</h2>
          <div className="space-y-4">
            {progressData.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="bg-primary p-2 rounded-lg">
                  <div className="flex gap-1">
                    {renderStars(item.stars)}
                  </div>
                </div>
                <span className="text-text font-medium">{item.area}</span>
                <div className="w-24 h-8">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={item.recentScores.map((score, i) => ({ value: score }))}>
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke="#7FB800"
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="border-1 border-textSecondary px-4 py-1 rounded-lg">
                  <span className="text-textSecondary">{item.totalScore}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-background p-6 rounded-xl border-1 border-muted"
        >
          <h2 className="text-text text-xl font-bold mb-6">Challenges</h2>
          <div className="grid grid-cols-2 gap-4">
            {pendingChallenges.map((challenge, index) => (
              <div
                key={index}
                className="bg-primary/20 p-4 rounded-lg"
              >
                <span className="text-primary font-medium">{challenge}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default withAuth(MainContent);