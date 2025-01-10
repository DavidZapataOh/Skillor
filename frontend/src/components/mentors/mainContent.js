'use client';

import { useState, useEffect } from 'react';
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { FileCode2, Github, Image, Paperclip, Send, X } from 'lucide-react';
import { motion } from "framer-motion";
import { cn } from '@/lib/utils';
import { elizaService } from '@/services/elizaService';
import { withAuth } from '@/components/hoc/withAuth';

const mentors = [
  {
    name: "Vitalik Butterbean",
    role: "Solidity Expert",
    image: "/mentors/vitalik.jpg",
    available: true,
    agentId: "vitalik",
    description: "Expert in smart contracts and Solidity development. Specialized in gas optimization and secure design patterns."
  },
  {
    name: "Johnny Clock",
    role: "Security Expert",
    image: "/mentors/johnny.jpg",
    available: true,
    agentId: "johnny",
    description: "Smart contract security specialist. Experienced in auditing and implementing secure DeFi protocols."
  },
  {
    name: "Eli Bean-salsa",
    role: "ZK Specialist",
    image: "/mentors/eli.jpg",
    available: true,
    agentId: "eli",
    description: "Zero-knowledge proof expert. Focused on scalability solutions and privacy-preserving protocols."
  },
  {
    name: "Emin Fun",
    role: "Avalanche Expert",
    image: "/mentors/emin.jpg",
    available: true,
    agentId: "emin",
    description: "Avalanche blockchain expert. Specialized in L1 development and cross-chain protocols."
  }
];

function MainContent() {
  const [selectedMentor, setSelectedMentor] = useState(mentors[0]);
  const [activeAgents, setActiveAgents] = useState([]);
  const [dots, setDots] = useState([]);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [attachment, setAttachment] = useState(null);
  const [isGistModalOpen, setIsGistModalOpen] = useState(false);
  
  useEffect(() => {
    const fetchActiveAgents = async () => {
      try {
        const agents = await elizaService.getAgents();
        setActiveAgents(agents.map(agent => agent.name));
      } catch (error) {
        console.error('Error fetching agents:', error);
        setActiveAgents([]);
      }
    };
    
    fetchActiveAgents();
  }, []);

  useEffect(() => {
    setDots([...Array(800)].map(() => ({
      opacity: Math.random() * 0.1
    })));
  }, []);

  const handleSendMessage = async () => {
    if ((!inputMessage.trim() && !attachment) || isProcessing) return;
    
    try {
      setIsProcessing(true);
      let finalMessage = inputMessage;

      if (attachment) {
        if (attachment.type === 'image') {
          finalMessage += `\n\n![${attachment.name}](${attachment.content})`;
        } else {
          finalMessage += `\n\n\`\`\`${attachment.type === 'solidity' ? 'solidity' : ''}\n${attachment.content}\n\`\`\``;
        }
      }

      setMessages(prev => [...prev, {
        type: 'user',
        content: finalMessage
      }]);
      
      setInputMessage('');
      setAttachment(null);
      
      const response = await elizaService.sendMessage(finalMessage, selectedMentor.agentId);
      
      setMessages(prev => [...prev, {
        type: 'mentor',
        content: response.message
      }]);
      
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleGistSubmit = async (gistUrl) => {
    try {
      const gistId = gistUrl.split('/').pop();
      const response = await fetch(`https://api.github.com/gists/${gistId}`);
      
      if (!response.ok) {
        throw new Error('Invalid Gist URL');
      }
      
      const data = await response.json();
      const firstFile = Object.values(data.files)[0];
      const content = firstFile.content;
      
      setAttachment({
        type: 'github',
        content: content,
        name: firstFile.filename
      });
    } catch (error) {
      console.error('Error fetching gist:', error);
      alert('Error loading Gist. Please make sure the URL is correct and the Gist is public.');
    } finally {
      setIsGistModalOpen(false);
    }
  };

  const handleFileSelect = async (type) => {
    if (type === 'github') {
      setIsGistModalOpen(true);
      return;
    }

    const input = document.createElement('input');
    input.type = 'file';
    
    switch(type) {
      case 'solidity':
        input.accept = '.sol';
        break;
      case 'image':
        input.accept = 'image/*';
        break;
      default:
        input.accept = '*/*';
    }

    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (file) {
        if (type === 'image') {
          const reader = new FileReader();
          reader.onload = (e) => {
            setAttachment({
              type: 'image',
              content: e.target.result,
              name: file.name
            });
          };
          reader.readAsDataURL(file);
        } else {
          const text = await file.text();
          setAttachment({
            type: type,
            content: text,
            name: file.name
          });
        }
      }
    };

    input.click();
  };

  return (
    <div className="p-6 ml-64">
      <div className="flex gap-4 h-[calc(100vh-120px)]">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-80 bg-background rounded-xl border-1 border-muted overflow-hidden flex flex-col"
        >
          <div className="p-6 border-b border-muted">
            <h2 className="text-text text-2xl font-bold">Inbox</h2>
            <p className="text-textSecondary mt-1">Conversations</p>
          </div>
          
          <div className="flex-1 overflow-y-auto space-y-2 p-3">
            {mentors.map((mentor, index) => (
              <motion.button
                key={mentor.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setSelectedMentor(mentor)}
                className={cn(
                  "w-full p-3 flex items-center gap-4 rounded-xl transition-all",
                  selectedMentor.name === mentor.name ? "bg-primary/20" : "hover:bg-background_secondary"
                )}
              >
                <div className="relative">
                  <img
                    src={mentor.image}
                    alt={mentor.name}
                    className={cn(
                      "w-12 h-12 rounded-full object-cover border-2",
                      activeAgents.includes(mentor.agentId) ? "border-primary" : "border-transparent grayscale"
                    )}
                  />
                  {activeAgents.includes(mentor.agentId) && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-primary border-2 border-background rounded-full" />
                  )}
                </div>
                <div className="flex-1 text-left">
                  <h3 className={cn(
                    "font-medium",
                    selectedMentor.name === mentor.name ? "text-primary" : "text-text"
                  )}>
                    {mentor.name}
                  </h3>
                  <p className="text-sm text-textSecondary">
                    {activeAgents.includes(mentor.agentId) ? "Available" : "Unavailable"}
                  </p>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex-1 bg-background rounded-xl border-1 border-muted flex flex-col overflow-hidden"
        >
          <div className="p-4 border-b border-muted flex items-center justify-between bg-background">
            <div className="flex items-center gap-4">
              <img
                src={selectedMentor.image}
                alt={selectedMentor.name}
                className={cn(
                  "w-12 h-12 rounded-full object-cover border-2",
                  selectedMentor.available ? "border-primary" : "border-transparent grayscale"
                )}
              />
              <div>
                <h3 className="font-medium text-text">{selectedMentor.name}</h3>
                <p className="text-sm text-textSecondary">{selectedMentor.role}</p>
              </div>
            </div>
            <button className="p-2 hover:bg-background_secondary rounded-full transition-colors">
              <MagnifyingGlassIcon className="w-6 h-6 text-textSecondary" />
            </button>
          </div>

          <div className="flex-1 bg-background_secondary p-6 overflow-y-auto relative">
            <div 
              className="absolute inset-0 grid grid-cols-[repeat(40,minmax(0,1fr))] gap-2 p-3 pointer-events-none"
              style={{
                maskImage: 'linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)'
              }}
            >
              {dots.map((dot, i) => (
                <div
                  key={i}
                  className="w-1 h-1 rounded-full bg-primary"
                  style={{ opacity: dot.opacity }}
                />
              ))}
            </div>
            <div className="relative z-10">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={cn(
                    "mb-4 max-w-[80%] p-4 rounded-xl",
                    message.type === 'user' 
                      ? "ml-auto bg-primary text-background" 
                      : "bg-background text-text"
                  )}
                >
                  <div 
                    className="prose prose-sm prose-ul:my-4 prose-li:my-2"
                    dangerouslySetInnerHTML={{ 
                      __html: message.content
                        .split('\n')
                        .filter(p => p)
                        .map(p => `<p class="mb-4">${p}</p>`)
                        .join('')
                    }}
                  />
                </div>
              ))}
              {isProcessing && (
                <div className="mb-4 max-w-[80%] bg-background rounded-xl">
                  <LoadingDots />
                </div>
              )}
            </div>
          </div>

          <div className="p-4 bg-background border-t border-muted">
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Send your message..."
                disabled={isProcessing}
                className="flex-1 bg-transparent text-text placeholder-textSecondary focus:outline-none disabled:opacity-50"
              />
              {attachment && (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-background_secondary rounded-lg text-sm">
                  <div className="flex items-center gap-2 text-textSecondary">
                    {attachment.type === 'image' ? (
                      <Image className="w-4 h-4" />
                    ) : attachment.type === 'solidity' ? (
                      <FileCode2 className="w-4 h-4" />
                    ) : attachment.type === 'github' ? (
                      <Github className="w-4 h-4" />
                    ) : (
                      <Paperclip className="w-4 h-4" />
                    )}
                    <span className="truncate max-w-[150px]">{attachment.name}</span>
                  </div>
                  <button 
                    onClick={() => setAttachment(null)}
                    className="hover:text-primary"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
              <div className="flex items-center gap-3">
                <motion.button 
                  whileHover={{ scale: 1.1 }}
                  onClick={() => handleFileSelect('solidity')}
                  className="p-2 hover:bg-background_secondary rounded-full transition-colors"
                >
                  <FileCode2 className="w-5 h-5 text-textSecondary" />
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.1 }}
                  onClick={() => handleFileSelect('github')}
                  className="p-2 hover:bg-background_secondary rounded-full transition-colors"
                >
                  <Github className="w-5 h-5 text-textSecondary" />
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.1 }}
                  onClick={() => handleFileSelect('image')}
                  className="p-2 hover:bg-background_secondary rounded-full transition-colors"
                >
                  <Image className="w-5 h-5 text-textSecondary" />
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.1 }}
                  onClick={() => handleFileSelect('any')}
                  className="p-2 hover:bg-background_secondary rounded-full transition-colors"
                >
                  <Paperclip className="w-5 h-5 text-textSecondary" />
                </motion.button>
                <motion.button 
                  onClick={handleSendMessage}
                  whileHover={{ scale: isProcessing ? 1 : 1.1 }}
                  disabled={isProcessing}
                  className="p-2 hover:bg-primary/20 rounded-full transition-colors disabled:opacity-50"
                >
                  <Send className="w-5 h-5 text-primary" />
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      <GistUrlModal
        isOpen={isGistModalOpen}
        onClose={() => setIsGistModalOpen(false)}
        onSubmit={handleGistSubmit}
      />
    </div>
  );
}

export function LoadingDots() {
  return (
    <div className="flex items-center gap-1 p-2">
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="w-2 h-2 bg-primary rounded-full"
          animate={{
            y: ["0%", "-50%", "0%"],
          }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            delay: i * 0.2,
          }}
        />
      ))}
    </div>
  );
}

function GistUrlModal({ isOpen, onClose, onSubmit }) {
  const [url, setUrl] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(url);
    setUrl('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-background rounded-xl p-6 w-full max-w-md">
        <h3 className="text-lg font-medium text-text mb-4">Enter Gist URL</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://gist.github.com/..."
            className="w-full p-2 rounded-lg bg-background_secondary text-text border border-muted focus:outline-none focus:border-primary"
            autoFocus
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg hover:bg-background_secondary transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-background rounded-lg hover:bg-primary/90 transition-colors"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default withAuth(MainContent);