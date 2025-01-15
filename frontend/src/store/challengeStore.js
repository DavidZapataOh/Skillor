import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useStore = create(
  persist(
    (set, get) => ({
      areaStats: {
        solidity: { 
          stars: 0, 
          score: 0,
          completedChallenges: []
        },
        security: { 
          stars: 0, 
          score: 0,
          completedChallenges: []
        },
        zk: { 
          stars: 0, 
          score: 0,
          completedChallenges: []
        },
        avalanche: { 
          stars: 0, 
          score: 0,
          completedChallenges: []
        }
      },

      activeChallenge: {
        solidity: null,
        security: null,
        zk: null,
        avalanche: null
      },

      progressMetrics: {
        solidity: { level: 0, completedChallenges: 0, stars: 0 },
        security: { level: 0, completedChallenges: 0, stars: 0 },
        zk: { level: 0, completedChallenges: 0, stars: 0 },
        avalanche: { level: 0, completedChallenges: 0, stars: 0 }
      },
      
      setActiveChallenge: (area, challenge) => set(state => ({
        activeChallenge: {
          ...state.activeChallenge,
          [area]: challenge
        }
      })),

      updateProgress: (area, evaluation) => set(state => {
        const current = state.progressMetrics[area];
        const newCompleted = current.completedChallenges + 1;
        const newStars = Math.floor(newCompleted / 20);
        
        return {
          progressMetrics: {
            ...state.progressMetrics,
            [area]: {
              level: Math.floor(newCompleted / 10),
              completedChallenges: newCompleted,
              stars: Math.min(5, newStars)
            }
          }
        };
      })
    }),
    {
      name: 'blockchain-academy-storage',
      version: 1,
    }
  )
);

export default useStore; 