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
  async sendMessage(text) {
    const res = await fetch(`/api/vitalik/message`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        userId: 'user',
        roomId: 'default-room-vitalik',
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
    return data.agents;
  }
}; 