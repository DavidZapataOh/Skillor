"use client";
import { FireIcon, CurrencyDollarIcon } from "@heroicons/react/24/solid";
import AuthButton from "@/config/authButton";
import { useTokenBalance } from '@/hooks/useTokenBalance';
import useStore from '@/store/challengeStore';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

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
          fill="#7FB800"
        />
      );
    } else if (i === fullStars && hasHalfStar) {
      stars.push(
        <div key={i} className="relative w-4 h-4">
          <StarIcon 
            className="absolute w-4 h-4" 
            fill="#141414"
          />
          <div className="absolute w-2 h-4 overflow-hidden">
            <StarIcon 
              className="w-4 h-4" 
              fill="#7FB800"
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
        />
      );
    }
  }
  return stars;
};

export default function Header() {
  const tokenBalance = useTokenBalance();
  const { areaStats } = useStore();
  const router = useRouter();
  
  const averageStars = Object.values(areaStats).reduce(
    (acc, area) => acc + area.stars, 
    0
  ) / Object.keys(areaStats).length;

  const handleReset = async () => {
    if (confirm('¿Estás seguro? Esto reiniciará todo tu progreso y comenzarás desde cero.')) {
      useStore.setState({
        areaStats: {
          solidity: { stars: 0, score: 0, completedChallenges: [], challenges: [] },
          security: { stars: 0, score: 0, completedChallenges: [], challenges: [] },
          zk: { stars: 0, score: 0, completedChallenges: [], challenges: [] },
          avalanche: { stars: 0, score: 0, completedChallenges: [], challenges: [] }
        },
        activeChallenge: {
          solidity: generateInitialChallenge('solidity'),
          security: generateInitialChallenge('security'),
          zk: generateInitialChallenge('zk'),
          avalanche: generateInitialChallenge('avalanche')
        },
        lastEvaluation: null,
        evaluationHistory: [],
        skills: {},
        streak: 0,
        testAttempts: {}
      });

      try {
        const currentArea = window.location.pathname.split('/')[2] || 'solidity';
        await elizaService.generateNextChallenge(currentArea, 'user');
        router.push('/dashboard');
        window.location.reload();
      } catch (error) {
        console.error('Error generating initial challenge:', error);
      }
    }
  };

  return (
    <header className="ml-64 flex justify-between items-center px-6 py-4 bg-background shadow-lg border-b border-muted relative z-10">
      <h1 className="text-lg font-bold text-primary">SKILLOR</h1>
      
      <div className="flex items-center gap-12">
        <motion.button
          whileHover={{ scale: 1.02 }}
          onClick={handleReset}
          className="px-4 py-2 rounded-lg bg-red-500/20 text-red-500 hover:bg-red-500/30 transition-all"
        >
          Reset Progress
        </motion.button>

        <div className="flex items-center bg-primary p-2 rounded-lg">
          <div className="flex gap-0.5">
            {renderStars(averageStars)}
          </div>
        </div>

        <div className="flex items-center gap-1 bg-background_secondary px-4 py-2 rounded-lg">
          <FireIcon className="w-6 h-6 text-primary" />
          <span className="text-text font-medium">{useStore().streak}</span>
        </div>

        <div className="flex items-center justify-center gap-1 bg-primary p-2 rounded-lg min-w-[100px]">
          <CurrencyDollarIcon className="w-6 h-6 text-background shrink-0" />
          <span className="text-background font-semibold text-center">
            {tokenBalance.toLocaleString(undefined, {
              minimumFractionDigits: 0,
              maximumFractionDigits: 2
            })}
          </span>
        </div>

        <AuthButton />
      </div>
    </header>
  );
}
  

  