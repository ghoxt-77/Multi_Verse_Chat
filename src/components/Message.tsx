
import React from 'react';
import { cn } from "@/lib/utils";
import { Message as MessageType, User } from '@/data/chatData';
import UserAvatar from './UserAvatar';

interface MessageProps {
  message: MessageType;
  sender: User;
  isCurrentUser: boolean;
}

const Message: React.FC<MessageProps> = ({ 
  message, 
  sender, 
  isCurrentUser 
}) => {
  const formattedTime = new Date(message.timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  });
  
  return (
    <div className={cn(
      "flex items-start gap-3 mb-4",
      isCurrentUser ? "flex-row-reverse" : "flex-row"
    )}>
      <UserAvatar 
        user={sender} 
        size="sm"
        className={cn(isCurrentUser ? "mt-1" : "mt-1")}
      />
      
      <div className={cn(
        "chat-bubble",
        isCurrentUser ? "user-chat-bubble" : ""
      )}>
        {!isCurrentUser && (
          <div className="text-sm font-semibold text-neon-purple mb-1">
            {sender.name}
          </div>
        )}
        
        <div className="text-sm">{message.text}</div>
        
        <div className={cn(
          "text-xs text-gray-400 mt-1",
          isCurrentUser ? "text-right" : "text-left"
        )}>
          {formattedTime}
        </div>
      </div>
    </div>
  );
};

export default Message;
