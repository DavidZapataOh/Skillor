const formatResponse = (text) => {
  // Reemplaza los asteriscos dobles con etiquetas strong
  return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
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