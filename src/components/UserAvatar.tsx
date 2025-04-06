
import React from 'react';
import { cn } from "@/lib/utils";
import { User } from '@/data/chatData';

interface UserAvatarProps {
  user: User;
  size?: 'sm' | 'md' | 'lg';
  showStatus?: boolean;
  className?: string;
}

const UserAvatar: React.FC<UserAvatarProps> = ({ 
  user, 
  size = 'md', 
  showStatus = true,
  className
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  };

  const statusDotSize = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-3.5 h-3.5'
  };
  
  return (
    <div className={cn("relative inline-block", className)}>
      <div className={cn(
        "rounded-full overflow-hidden border-2", 
        sizeClasses[size],
        user.isOnline ? "border-neon-green" : "border-gray-500"
      )}>
        <img 
          src={user.avatar} 
          alt={user.name} 
          className="w-full h-full object-cover"
        />
      </div>
      
      {showStatus && (
        <div className={cn(
          "absolute bottom-0 right-0 rounded-full border-2 border-dark",
          statusDotSize[size],
          user.isOnline ? "bg-neon-green" : "bg-gray-500"
        )} />
      )}
    </div>
  );
};

export default UserAvatar;
