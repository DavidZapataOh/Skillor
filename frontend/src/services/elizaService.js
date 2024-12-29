const ELIZA_SERVER_URL = process.env.NEXT_PUBLIC_ELIZA_SERVER_URL || 'http://localhost:5173';

export const elizaService = {
  async sendMessage(message) {
    try {
      const response = await fetch(`${ELIZA_SERVER_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message })
      });
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error sending message to Eliza:', error);
      throw error;
    }
  }
}; 