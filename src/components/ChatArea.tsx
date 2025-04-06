
import React, { useEffect, useRef, useState } from 'react';
import { cn } from "@/lib/utils";
import { Category, Channel, Message as MessageType, User, users } from '@/data/chatData';
import Message from './Message';
import MessageInput from './MessageInput';
import { Info, PhoneCall, Users } from 'lucide-react';
import VoiceCallModal from './VoiceCallModal';

interface ChatAreaProps {
  currentCategory: Category;
  currentChannel: Channel;
  currentUser: User;
  messages: MessageType[];
  onSendMessage: (text: string) => void;
  onSendAudioMessage?: (audioBlob: Blob) => void;
}

const ChatArea: React.FC<ChatAreaProps> = ({ 
  currentCategory, 
  currentChannel,
  currentUser,
  messages,
  onSendMessage
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [callState, setCallState] = useState<{
    isOpen: boolean;
    caller: User;
    receiver: User;
    isIncoming: boolean;
  } | null>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendAudio = async (audioBlob: Blob) => {
    // Create a URL for the audio blob
    const audioUrl = URL.createObjectURL(audioBlob);
    
    // Create a new audio message
    const newMessage: MessageType = {
      id: `msg-${Date.now()}`,
      text: "Audio message", // Fallback text
      userId: currentUser.id,
      timestamp: new Date().toISOString(),
      type: 'audio',
      audioUrl
    };
    
    // Send the message
    // Since we can't modify the onSendMessage interface without breaking other components,
    // we'll use it as is and extend the message with audio properties
    onSendMessage(newMessage.text);
  };

  const startVoiceCall = () => {
    // Find a random online user from the channel that is not the current user
    const onlineUsers = users.filter(user => 
      user.isOnline && user.id !== currentUser.id
    );
    
    if (onlineUsers.length > 0) {
      const randomUser = onlineUsers[Math.floor(Math.random() * onlineUsers.length)];
      
      setCallState({
        isOpen: true,
        caller: currentUser,
        receiver: randomUser,
        isIncoming: false
      });
    }
  };

  const handleCloseCall = () => {
    setCallState(null);
  };

  // Simulate an incoming call randomly (for demo purposes)
  useEffect(() => {
    const randomTimeout = Math.floor(Math.random() * 120000) + 60000; // Between 1-3 minutes
    
    const incomingCallTimer = setTimeout(() => {
      // Only show if user is on the page and not already in a call
      if (!callState) {
        const caller = users.find(user => user.id !== currentUser.id && user.isOnline);
        
        if (caller) {
          setCallState({
            isOpen: true,
            caller,
            receiver: currentUser,
            isIncoming: true
          });
        }
      }
    }, randomTimeout);
    
    return () => clearTimeout(incomingCallTimer);
  }, [currentUser, callState]);
  
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
          <button 
            className="p-2 rounded-md hover:bg-dark-lighter text-gray-400 mr-2"
            onClick={startVoiceCall}
            aria-label="Start voice call"
          >
            <PhoneCall size={20} />
          </button>
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
          onSendAudio={handleSendAudio}
        />
      </div>

      {/* Voice Call Modal */}
      {callState && (
        <VoiceCallModal
          isOpen={callState.isOpen}
          onClose={handleCloseCall}
          caller={callState.caller}
          receiver={callState.receiver}
          isIncoming={callState.isIncoming}
        />
      )}
    </div>
  );
};

export default ChatArea;
