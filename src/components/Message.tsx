
import React from 'react';
import { cn } from "@/lib/utils";
import { Message as MessageType, User } from '@/data/chatData';
import UserAvatar from './UserAvatar';
import { Play, Pause } from 'lucide-react';

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
  const [isPlaying, setIsPlaying] = React.useState(false);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);
  
  const formattedTime = new Date(message.timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  });

  const handlePlayAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
  };
  
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
        "chat-bubble max-w-[70%]",
        isCurrentUser ? "user-chat-bubble" : ""
      )}>
        {!isCurrentUser && (
          <div className="text-sm font-semibold text-neon-purple mb-1">
            {sender.name}
          </div>
        )}
        
        {message.type === 'audio' && message.audioUrl ? (
          <div className="flex items-center">
            <button 
              onClick={handlePlayAudio}
              className="p-2 bg-dark-lighter rounded-full mr-2 hover:bg-geek transition-colors"
            >
              {isPlaying ? <Pause size={16} /> : <Play size={16} />}
            </button>
            <div className="w-32 h-12 bg-dark-lighter rounded-md relative overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-full h-1 bg-gray-700">
                  <div className={cn(
                    "h-full bg-neon-purple transition-all",
                    isPlaying ? "w-full duration-[20s]" : "w-0"
                  )}></div>
                </div>
              </div>
            </div>
            <audio 
              ref={audioRef} 
              src={message.audioUrl} 
              onEnded={handleAudioEnded}
              className="hidden" 
            />
          </div>
        ) : (
          <div className="text-sm">{message.text}</div>
        )}
        
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
