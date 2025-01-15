import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css';
import hljsDefineSolidity from 'highlightjs-solidity';
import useStore from '@/store/useStore';
import { generateInitialChallenge } from '@/data/challenges';

hljsDefineSolidity(hljs);

const formatCode = (code, language) => {
  const lines = code.split('\n');
  
  const minIndent = lines
    .filter(line => line.trim().length > 0)
    .reduce((min, line) => {
      const indent = line.match(/^\s*/)[0].length;
      return Math.min(min, indent);
    }, Infinity);

  const formattedCode = lines.join('\n');

  try {
    const highlighted = hljs.highlight(formattedCode, { language: language.toLowerCase() }).value;
    return `<pre><code class="hljs language-${language}" style="white-space: pre; padding: 1em;">${highlighted}</code></pre>`;
  } catch (e) {
    console.warn('Error highlighting code:', e);
    return `<pre><code style="white-space: pre; padding: 1em;">${formattedCode}</code></pre>`;
  }
};

const formatResponse = (text) => {
  text = text.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, language, code) => {
    if (language) {
      return formatCode(code, language);
    }
    return `<pre><code style="white-space: pre; padding: 1em;">${code}</code></pre>`;
  });

  text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

  return text;
};

export const elizaService = {
  async sendMessage(text, agentId = 'vitalik') {
    const res = await fetch(`/api/${agentId}/message`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        userId: 'user',
        roomId: `default-room-${agentId}`,
      }),
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    return {
      message: formatResponse(data[data.length - 1].text)
    };
  },

  async getAgents() {
    const res = await fetch('/api/agents');
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const data = await res.json();
    console.log('Agentes activos:', data.agents);
    if (!data.agents || data.agents.length === 0) {
      throw new Error("No agents found");
    }
    return data.agents;
  },

  async evaluateChallenge(solution, challengeId, area, userId) {
    const store = useStore.getState();
    
    const prompt = `Por favor, evalúa esta solución en formato JSON con la siguiente estructura:
    {
      "score": number,
      "feedback": {
        "successes": string[],
        "improvements": string[]
      },
      "metrics": {
        "skill_name": number
      }
    }
    
    Solución: ${solution}
    Reto ID: ${challengeId}
    Área: ${area}
    
    IMPORTANTE: Responde SOLO con el objeto JSON, sin texto adicional.`;

    try {
      const res = await fetch(`/api/mentor_chief/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: prompt,
          userId,
          roomId: `evaluation-${area}`,
          context: {
            solution,
            challengeId,
            area,
            stats: store.areaStats[area],
            skills: store.skills
          }
        }),
      });

      if (!res.ok) {
        console.warn(`API error (${res.status}), using fallback evaluation`);
        return this.getFallbackEvaluation();
      }

      const data = await res.json();
      const jsonResponse = data.reverse().find(msg => {
        try {
          return JSON.parse(msg.text) && true;
        } catch {
          return false;
        }
      });

      if (jsonResponse) {
        const evaluation = JSON.parse(jsonResponse.text);
        this.updateEvaluationStore(evaluation);
        return evaluation;
      }
    } catch (error) {
      console.error('Error accessing API:', error);
    }

    return this.getFallbackEvaluation();
  },

  getFallbackEvaluation() {
    const evaluation = {
      score: 70,
      feedback: {
        successes: ['Solución básica implementada'],
        improvements: ['Considera optimizar el código']
      },
      metrics: {
        smart_contracts: 5,
        gas_optimization: 3,
        security_best_practices: 2
      },
      date: new Date().toISOString()
    };
    this.updateEvaluationStore(evaluation);
    return evaluation;
  },

  updateEvaluationStore(evaluation) {
    useStore.setState((state) => ({
      ...state,
      lastEvaluation: evaluation,
      evaluationHistory: [...state.evaluationHistory, evaluation]
    }));
  },

  async generateNextChallenge(area, userId) {
    const store = useStore.getState();
    
    if (!store.areaStats[area]) {
      throw new Error(`Área ${area} no encontrada`);
    }

    const areaStats = store.areaStats[area];
    const completedCount = areaStats.completedChallenges.length;
    const currentLevel = Math.floor(completedCount / 10);

    const prompt = `Por favor, genera un nuevo reto de programación en formato JSON con la siguiente estructura:
    {
      "id": string,
      "title": string,
      "description": string,
      "theory": string,
      "example": string,
      "requirements": string[],
      "testCases": array,
      "startingCode": string,
      "difficulty": string,
      "category": string
    }
    
    Área: ${area}
    Nivel actual: ${currentLevel}
    
    IMPORTANTE: Responde SOLO con el objeto JSON, sin texto adicional.`;

    try {
      const res = await fetch(`/api/mentor_chief/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: prompt,
          userId,
          roomId: `challenge-${area}`,
          context: {
            area,
            stats: areaStats,
            completedCount,
            currentLevel,
            skills: store.skills
          }
        }),
      });

      if (!res.ok) {
        console.warn(`API error (${res.status}), using fallback template`);
        return this.useInitialTemplate(area);
      }

      const data = await res.json();
      const jsonResponse = data.reverse().find(msg => {
        try {
          return JSON.parse(msg.text) && true;
        } catch {
          return false;
        }
      });

      if (jsonResponse) {
        const challenge = JSON.parse(jsonResponse.text);
        this.updateStore(area, challenge);
        return challenge;
      }
    } catch (error) {
      console.error('Error accessing API:', error);
    }

    return this.useInitialTemplate(area);
  },

  useInitialTemplate(area) {
    const initialChallenge = generateInitialChallenge(area);
    this.updateStore(area, initialChallenge);
    return initialChallenge;
  },

  updateStore(area, challenge) {
    useStore.setState((state) => ({
      ...state,
      activeChallenge: {
        ...state.activeChallenge,
        [area]: challenge
      }
    }));
  },

  async getUserSkillLevels(userId) {
    const skillsData = [
      "smart_contracts",
      "gas_optimization",
      "security_best_practices",
    ].map(skill => ({
      skill,
      score: calculateSkillScore(skill)
    }));

    return skillsData;
  }
}; 