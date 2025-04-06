
import React, { useState } from 'react';
import { cn } from "@/lib/utils";
import { SendHorizontal, Smile, Paperclip } from 'lucide-react';
import { Channel, User } from '@/data/chatData';

interface MessageInputProps {
  currentChannel: Channel;
  currentUser: User;
  onSendMessage: (text: string) => void;
}

const MessageInput: React.FC<MessageInputProps> = ({ 
  currentChannel, 
  currentUser,
  onSendMessage
}) => {
  const [message, setMessage] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };
  
  return (
    <div className="bg-dark-light p-3 rounded-lg mt-2">
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <button 
          type="button" 
          className="text-gray-400 hover:text-neon-purple transition-colors p-1"
          aria-label="Attach file"
        >
          <Paperclip size={20} />
        </button>
        
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={`Mensagem para #${currentChannel.name}`}
          className="flex-1 bg-dark-lighter px-4 py-2 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-neon-purple"
        />
        
        <button 
          type="button" 
          className="text-gray-400 hover:text-neon-purple transition-colors p-1"
          aria-label="Add emoji"
        >
          <Smile size={20} />
        </button>
        
        <button 
          type="submit" 
          className={cn(
            "p-2 rounded-full transition-colors",
            message.trim() 
              ? "bg-geek hover:bg-geek-light text-white" 
              : "bg-dark-lighter text-gray-500 cursor-not-allowed"
          )}
          disabled={!message.trim()}
          aria-label="Send message"
        >
          <SendHorizontal size={18} />
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
