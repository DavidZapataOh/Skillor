const ELIZA_SERVER_URL = process.env.NEXT_PUBLIC_ELIZA_SERVER_URL || 'http://localhost:5173';

export const elizaService = {
  async sendMessage(message) {
    try {
      const response = await fetch(`${ELIZA_SERVER_URL}/api/vitalik/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: message,
          userId: "user",
          roomId: "default-room-vitalik"
        })
      });
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      const data = await response.json();
      return {
        message: data[data.length - 1].text
      };
    } catch (error) {
      console.error('Error sending message to Eliza:', error);
      throw error;
    }
  }
}; 