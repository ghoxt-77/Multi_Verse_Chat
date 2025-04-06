
import React, { useEffect, useRef } from 'react';
import { cn } from "@/lib/utils";
import { Category, Channel, Message as MessageType, User, users } from '@/data/chatData';
import Message from './Message';
import MessageInput from './MessageInput';
import { Info, Users } from 'lucide-react';

interface ChatAreaProps {
  currentCategory: Category;
  currentChannel: Channel;
  currentUser: User;
  messages: MessageType[];
  onSendMessage: (text: string) => void;
}

const ChatArea: React.FC<ChatAreaProps> = ({ 
  currentCategory, 
  currentChannel,
  currentUser,
  messages,
  onSendMessage
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  return (
    <div className="flex flex-col h-screen">
      {/* Channel Header */}
      <div className="flex items-center justify-between p-4 border-b border-dark-lighter bg-dark-light">
        <div>
          <h2 className="text-lg font-semibold flex items-center">
            <span className="mr-2">{currentChannel.icon}</span>
            {currentChannel.name}
          </h2>
          <p className="text-sm text-gray-400">{currentChannel.description}</p>
        </div>
        <div className="flex items-center">
          <button className="p-2 rounded-md hover:bg-dark-lighter text-gray-400">
            <Users size={20} />
          </button>
          <button className="p-2 rounded-md hover:bg-dark-lighter text-gray-400">
            <Info size={20} />
          </button>
        </div>
      </div>
      
      {/* Messages Area */}
      <div className="flex-grow overflow-y-auto p-4">
        {messages.length > 0 ? (
          <>
            {messages.map(message => {
              const sender = users.find(u => u.id === message.userId) || currentUser;
              const isCurrentUser = message.userId === currentUser.id;
              
              return (
                <Message 
                  key={message.id} 
                  message={message} 
                  sender={sender}
                  isCurrentUser={isCurrentUser}
                />
              );
            })}
          </>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center p-6">
            <div className="w-16 h-16 bg-dark-lighter rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl">{currentChannel.icon}</span>
            </div>
            <h3 className="text-xl font-bold mb-2">
              Bem-vindo ao #{currentChannel.name}
            </h3>
            <p className="text-gray-400 max-w-md">
              Este é o início do canal. Seja o primeiro a enviar uma mensagem!
            </p>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Message Input */}
      <div className="p-4 border-t border-dark-lighter">
        <MessageInput 
          currentChannel={currentChannel}
          currentUser={currentUser}
          onSendMessage={onSendMessage}
        />
      </div>
    </div>
  );
};

export default ChatArea;
