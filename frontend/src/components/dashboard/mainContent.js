'use client';

import { useEffect } from 'react';
import { FireIcon, TrophyIcon, CurrencyDollarIcon } from "@heroicons/react/24/solid";
import { motion } from "framer-motion";
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import ActivityCalendar from 'react-activity-calendar';
import { Tooltip as MuiTooltip } from '@mui/material';
import { withAuth } from '../hoc/withAuth';
import { useTokenBalance } from '@/hooks/useTokenBalance';
import useStore from '@/store/challengeStore';
import { challenges } from '@/data/challenges';

function MainContent() {
  const tokenBalance = useTokenBalance();
  const { streak, areaStats } = useStore();

  const totalChallenges = Object.values(areaStats).reduce(
    (total, area) => total + area.completedChallenges.length,
    0
  );

  const statsCards = [
    { title: "Streak", value: `${streak} days`, icon: <FireIcon className="w-8 h-8" /> },
    { title: "Challenges met", value: totalChallenges, icon: <TrophyIcon className="w-8 h-8" /> },
    { 
      title: "Coins earned", 
      value: `${tokenBalance.toLocaleString(undefined, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
      })} $SKLLR`, 
      icon: <CurrencyDollarIcon className="w-8 h-8" /> 
    }
  ];

  const calculateSkillScore = (skill) => {
    let score = 0;
    Object.values(areaStats).forEach(area => {
      const relevantChallenges = area.completedChallenges.filter(
        challenge => challenge.feedback.skills?.includes(skill)
      );
      if (relevantChallenges.length > 0) {
        score += relevantChallenges.reduce((acc, curr) => acc + curr.score, 0) / relevantChallenges.length;
      }
    });
    return Math.round(score);
  };

  const skillsData = [
    { name: "Smart Contract Development", score: calculateSkillScore("smart_contracts") },
    { name: "Gas Optimization", score: calculateSkillScore("gas_optimization") },
    { name: "Security Best Practices", score: calculateSkillScore("security_best_practices") },
    { name: "Testing & Debugging", score: calculateSkillScore("testing_and_debugging") },
    { name: "DeFi Protocols", score: calculateSkillScore("defi_protocols") },
    { name: "ERC Standards", score: calculateSkillScore("erc_standards") },
    { name: "Blockchain Architecture", score: calculateSkillScore("blockchain_architecture") },
    { name: "Web3 Integration", score: calculateSkillScore("web3_integration") },
    { name: "Tokenomics", score: calculateSkillScore("tokenomics") },
    { name: "NFT Development", score: calculateSkillScore("nft_development") },
    { name: "Layer 2 Solutions", score: calculateSkillScore("layer_2_solutions") },
    { name: "Cross-chain Development", score: calculateSkillScore("cross_chain_development") },
    { name: "Consensus Mechanisms", score: calculateSkillScore("consensus_mechanisms") },
    { name: "ZK Proofs", score: calculateSkillScore("zk_proofs") },
    { name: "DAO Structures", score: calculateSkillScore("dao_structures") },
    { name: "MEV Protection", score: calculateSkillScore("mev_protection") },
    { name: "Upgradeable Contracts", score: calculateSkillScore("upgradeable_contracts") },
    { name: "Oracle Integration", score: calculateSkillScore("oracle_integration") },
    { name: "Governance Systems", score: calculateSkillScore("governance_systems") },
    { name: "Flash Loans", score: calculateSkillScore("flash_loans") }
  ];

  const progressData = Object.entries(areaStats).map(([area, stats]) => {
    const recentScores = stats.completedChallenges
      .slice(-5)
      .map(challenge => challenge.score);
      
    return {
      area: area.charAt(0).toUpperCase() + area.slice(1),
      stars: stats.stars,
      recentScores,
      totalScore: Math.round(stats.score)
    };
  });

  const pendingChallenges = challenges
    .filter(challenge => {
      const areaStats = useStore.getState().areaStats[challenge.area];
      return !areaStats.completedChallenges.some(cc => cc.id === challenge.id);
    })
    .slice(0, 4)
    .map(challenge => challenge.title);

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

  const getColorFromScore = (score) => {
    const saturation = 30 + ((score - 1) / 19) * 70;
    return `hsl(86, ${saturation}%, 36%)`;
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
              <span 
                className="px-2 py-1 rounded-lg text-sm inline-block min-w-[38px] text-center border-2 font-bold" 
                style={{ 
                  color: getColorFromScore(skill.score),
                  borderColor: getColorFromScore(skill.score)
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