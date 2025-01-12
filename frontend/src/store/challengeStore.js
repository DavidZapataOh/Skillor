import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useStore = create(
  persist(
    (set, get) => ({
      streak: 0,
      lastChallengeDate: null,
      areaStats: {
        solidity: { stars: 0, score: 0, completedChallenges: [] },
        security: { stars: 0, score: 0, completedChallenges: [] },
        zk: { stars: 0, score: 0, completedChallenges: [] },
        avalanche: { stars: 0, score: 0, completedChallenges: [] }
      },
      generalScores: [],

      updateStreak: () => {
        const today = new Date().toDateString();
        const lastDate = get().lastChallengeDate;
        
        if (lastDate === today) return;
        
        if (lastDate === new Date(Date.now() - 86400000).toDateString()) {
          set(state => ({ 
            streak: state.streak + 1,
            lastChallengeDate: today
          }));
        } else {
          set({ streak: 1, lastChallengeDate: today });
        }
      },

      completeChallenge: (area, challengeId, result) => {
        const { score, feedback } = result;
        set(state => {
          const areaStats = state.areaStats[area];
          const newCompletedChallenges = [
            ...areaStats.completedChallenges,
            { id: challengeId, score, feedback, date: new Date().toISOString() }
          ];

          const recentScores = newCompletedChallenges.slice(-5).map(c => c.score);
          const avgScore = recentScores.reduce((a, b) => a + b, 0) / recentScores.length;
          const newStars = Math.min(5, Math.floor(avgScore / 20));

          return {
            areaStats: {
              ...state.areaStats,
              [area]: {
                stars: newStars,
                score: avgScore,
                completedChallenges: newCompletedChallenges
              }
            }
          };
        });
      }
    }),
    {
      name: 'challenge-storage'
    }
  )
);

export default useStore; 