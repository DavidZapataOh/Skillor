const ELIZA_SERVER_URL = process.env.NEXT_PUBLIC_ELIZA_SERVER_URL || 'http://localhost:5173';

const formatResponse = (text) => {
  text = text
    .replace(/^\d+\/\d+\s*/, '')
    .replace(/\.\.\.fascinating,\sright\?.*$/, '')
    .replace(/Fascinating topic\.\.\.\s*/, '')
    .replace(/\*adjusts glasses\*/g, '');

  text = text.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  
  const lines = text.split('\n');
  let inNumberedList = false;
  let inBulletList = false;
  let currentList = '';
  
  const processedLines = lines.map(line => {
    const mainNumberMatch = line.match(/^\s*(\d+)\.\s+\*\*([^*]+)\*\*:?/);
    if (mainNumberMatch) {
      if (!inNumberedList) {
        inNumberedList = true;
        currentList = '<ol class="list-decimal list-inside my-4">';
      }
      return `<li><strong>${mainNumberMatch[2]}</strong></li>`;
    }

    const bulletMatch = line.match(/^\s*-\s+(.+)/);
    if (bulletMatch) {
      if (!inBulletList) {
        inBulletList = true;
        return `<ul class="list-disc list-inside ml-4 my-2"><li>${bulletMatch[1]}</li>`;
      }
      return `<li>${bulletMatch[1]}</li>`;
    }

    if (line.trim() === '') {
      let closingTags = '';
      if (inBulletList) {
        closingTags += '</ul>';
        inBulletList = false;
      }
      if (inNumberedList) {
        closingTags += '</ol>';
        inNumberedList = false;
      }
      return closingTags + '\n';
    }

    return line;
  });

  text = processedLines.join('\n');

  if (inBulletList) text += '</ul>';
  if (inNumberedList) text += '</ol>';
  
  text = text
    .replace(/\s{2,}/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  text = text.replace(/(\w)\s*(Would you like|Do you want|Shall we|Could we)/g, '$1\n\n$2');

  return text;
};

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
      const lastMessage = data[data.length - 1].text;
      
      return {
        message: formatResponse(lastMessage)
      };
    } catch (error) {
      console.error('Error sending message to Eliza:', error);
      throw error;
    }
  }
}; 