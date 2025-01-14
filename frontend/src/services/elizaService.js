import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css';
import hljsDefineSolidity from 'highlightjs-solidity';

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

  async evaluateChallenge(solution, challengeId, userId) {
    const res = await fetch(`/api/mentor_chief/evaluate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        solution,
        challengeId,
        userId,
        lastChallenges: 5, 
      }),
    });
    
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    return await res.json();
  },

  async generateNextChallenge(userId) {
    const res = await fetch(`/api/mentor_chief/challenge`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        skillLevels: await this.getUserSkillLevels(userId),
      }),
    });

    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    return await res.json();
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