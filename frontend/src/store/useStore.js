import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useStore = create(
  persist(
    (set, get) => ({
      areaStats: {
        solidity: { 
          stars: 0, 
          score: 0,
          completedChallenges: [],
          challenges: []
        },
        security: { 
          stars: 0, 
          score: 0,
          completedChallenges: [],
          challenges: []
        },
        zk: { 
          stars: 0, 
          score: 0,
          completedChallenges: [],
          challenges: []
        },
        avalanche: { 
          stars: 0, 
          score: 0,
          completedChallenges: [],
          challenges: []
        }
      },

      activeChallenge: {
        solidity: null,
        security: null,
        zk: null,
        avalanche: null
      },

      lastEvaluation: null,
      evaluationHistory: [],
      skills: {},
      streak: 0,

      testAttempts: {}, 

      setActiveChallenge: (area, challenge) => set(state => ({
        activeChallenge: {
          ...state.activeChallenge,
          [area]: challenge
        }
      })),

      setLastEvaluation: (evaluation) => set({ 
        lastEvaluation: evaluation 
      }),

      addEvaluationToHistory: (evaluation) => set(state => ({
        evaluationHistory: [...state.evaluationHistory, evaluation]
      })),

      completeChallenge: (area, challengeId, evaluation) => set(state => {
        if (!state.areaStats[area]) {
          state.areaStats[area] = {
            stars: 0,
            score: 0,
            completedChallenges: [],
            challenges: []
          };
        }

        const areaStats = state.areaStats[area];
        const challengeData = {
          id: challengeId,
          score: evaluation.score,
          date: new Date().toISOString(),
          metrics: evaluation.metrics,
          feedback: evaluation.feedback
        };

        const updatedStats = {
          ...areaStats,
          completedChallenges: [
            ...(areaStats.completedChallenges || []),
            challengeData
          ],
          score: areaStats.score ? (areaStats.score + evaluation.score) / 2 : evaluation.score,
          stars: (areaStats.stars || 0) + (evaluation.stars || 0)
        };

        const updatedSkills = { ...state.skills };
        Object.entries(evaluation.metrics || {}).forEach(([skill, value]) => {
          updatedSkills[skill] = Math.min(100, (updatedSkills[skill] || 0) + value);
        });

        return {
          areaStats: {
            ...state.areaStats,
            [area]: updatedStats
          },
          skills: updatedSkills,
          lastEvaluation: evaluation
        };
      }),

      getLastNChallenges: (n = 5) => {
        const state = get();
        return state.evaluationHistory.slice(-n);
      },

      calculateCurrentLevel: () => {
        const state = get();
        const totalScore = Object.values(state.skills).reduce((acc, curr) => acc + curr, 0);
        return Math.floor(totalScore / 100);
      },

      getNextChallengeRecommendation: () => {
        const state = get();
        return {
          recentPerformance: state.getLastNChallenges(),
          skillLevels: state.skills,
          currentLevel: state.calculateCurrentLevel()
        };
      },

      addChallenge: (area, challenge) => set(state => ({
        areaStats: {
          ...state.areaStats,
          [area]: {
            ...state.areaStats[area],
            challenges: [...state.areaStats[area].challenges, challenge]
          }
        }
      })),

      resetArea: (area) => set(state => ({
        areaStats: {
          ...state.areaStats,
          [area]: {
            stars: 0,
            score: 0,
            completedChallenges: [],
            challenges: []
          }
        },
        activeChallenge: {
          ...state.activeChallenge,
          [area]: null
        }
      })),

      incrementTestAttempts: (challengeId) => set(state => ({
        testAttempts: {
          ...state.testAttempts,
          [challengeId]: (state.testAttempts[challengeId] || 0) + 1
        }
      })),

      resetTestAttempts: (challengeId) => set(state => ({
        testAttempts: {
          ...state.testAttempts,
          [challengeId]: 0
        }
      }))
    }),
    {
      name: 'blockchain-academy-storage',
      version: 1,
    }
  )
);

export default useStore; 