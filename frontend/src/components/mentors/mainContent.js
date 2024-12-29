'use client';

import { useState, useEffect } from 'react';
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { FileCode2, Github, Image, Paperclip, Send } from 'lucide-react';
import { motion } from "framer-motion";
import { cn } from '@/lib/utils';
import { elizaService } from '@/services/elizaService';

const mentors = [
  {
    name: "Vitalik Butterbean",
    role: "Solidity Expert",
    image: "/mentors/vitalik.jpg",
    available: true,
    description: "Expert in smart contracts and Solidity development. Specialized in gas optimization and secure design patterns."
  },
  {
    name: "Johnny Clock",
    role: "Security Expert",
    image: "/mentors/johnny.jpg",
    available: false,
    description: "Smart contract security specialist. Experienced in auditing and implementing secure DeFi protocols."
  },
  {
    name: "Eli Bean-salsa",
    role: "ZK Specialist",
    image: "/mentors/eli.jpg",
    available: false,
    description: "Zero-knowledge proof expert. Focused on scalability solutions and privacy-preserving protocols."
  },
  {
    name: "Emin Fun",
    role: "Avalanche Expert",
    image: "/mentors/emin.jpg",
    available: false,
    description: "Avalanche blockchain expert. Specialized in L1 development and cross-chain protocols."
  }
];

export default function MainContent() {
  const [selectedMentor, setSelectedMentor] = useState(mentors[0]);
  const [dots, setDots] = useState([]);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  
  useEffect(() => {
    setDots([...Array(800)].map(() => ({
      opacity: Math.random() * 0.1
    })));
  }, []);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;
    
    try {
      setMessages(prev => [...prev, {
        type: 'user',
        content: inputMessage
      }]);
      
      setInputMessage('');
      
      const response = await elizaService.sendMessage(inputMessage);
      
      setMessages(prev => [...prev, {
        type: 'mentor',
        content: response.message
      }]);
      
    } catch (error) {
      console.error('Error sending message:', error);
    }
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
                      mentor.available ? "border-primary" : "border-transparent grayscale"
                    )}
                  />
                  {mentor.available && (
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
                    {mentor.available ? "Available" : "Unavailable"}
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
                        .map(p => p.trim())
                        .filter(p => p)
                        .map(p => `<p class="mb-4">${p}</p>`)
                        .join('')
                    }}
                  />
                </div>
              ))}
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
                className="flex-1 bg-transparent text-text placeholder-textSecondary focus:outline-none"
              />
              <div className="flex items-center gap-3">
                <motion.button 
                  whileHover={{ scale: 1.1 }}
                  className="p-2 hover:bg-background_secondary rounded-full transition-colors"
                >
                  <FileCode2 className="w-5 h-5 text-textSecondary" />
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.1 }}
                  className="p-2 hover:bg-background_secondary rounded-full transition-colors"
                >
                  <Github className="w-5 h-5 text-textSecondary" />
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.1 }}
                  className="p-2 hover:bg-background_secondary rounded-full transition-colors"
                >
                  <Image className="w-5 h-5 text-textSecondary" />
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.1 }}
                  className="p-2 hover:bg-background_secondary rounded-full transition-colors"
                >
                  <Paperclip className="w-5 h-5 text-textSecondary" />
                </motion.button>
                <motion.button 
                  onClick={handleSendMessage}
                  whileHover={{ scale: 1.1 }}
                  className="p-2 hover:bg-primary/20 rounded-full transition-colors"
                >
                  <Send className="w-5 h-5 text-primary" />
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}