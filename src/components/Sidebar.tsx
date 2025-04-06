
import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Hash, Users, Menu } from 'lucide-react';
import { cn } from "@/lib/utils";
import { Category, Channel, initialState } from '@/data/chatData';
import UserAvatar from './UserAvatar';

interface SidebarProps {
  currentCategory: Category;
  currentChannel: Channel;
  categories: Category[];
  onSelectChannel: (category: Category, channel: Channel) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  currentCategory, 
  currentChannel, 
  categories, 
  onSelectChannel 
}) => {
  const [expandedCategories, setExpandedCategories] = useState<{[key: string]: boolean}>({
    [currentCategory.id]: true
  });
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  const toggleSidebar = () => {
    setIsSidebarCollapsed(prev => !prev);
  };
  
  return (
    <div className={cn(
      "h-screen bg-dark-dark border-r border-dark-lighter flex flex-col transition-all duration-300",
      isSidebarCollapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="p-4 border-b border-dark-lighter flex items-center justify-between">
        {!isSidebarCollapsed && (
          <h1 className="text-xl font-bold text-white">GeekVerse</h1>
        )}
        <button 
          onClick={toggleSidebar}
          className="p-1 rounded-md hover:bg-dark-lighter text-gray-400"
        >
          <Menu size={20} />
        </button>
      </div>
      
      {/* Categories and Channels */}
      <div className="flex-grow overflow-y-auto py-2">
        {categories.map(category => (
          <div key={category.id} className="mb-2">
            {/* Category Header */}
            <button
              onClick={() => toggleCategory(category.id)}
              className={cn(
                "flex items-center w-full p-2 hover:bg-dark-lighter transition-colors text-left",
                isSidebarCollapsed ? "justify-center" : "justify-between px-4"
              )}
            >
              {!isSidebarCollapsed && (
                <span className="font-medium text-gray-300">{category.name}</span>
              )}
              {!isSidebarCollapsed && (
                expandedCategories[category.id] ? <ChevronDown size={16} /> : <ChevronRight size={16} />
              )}
              {isSidebarCollapsed && (
                <div className="flex items-center justify-center w-8 h-8 bg-dark-lighter rounded-full">
                  <span>{category.name.charAt(0)}</span>
                </div>
              )}
            </button>
            
            {/* Channels */}
            {expandedCategories[category.id] && (
              <div className={cn("mt-1", isSidebarCollapsed ? "px-2" : "")}>
                {category.channels.map(channel => (
                  <button
                    key={channel.id}
                    onClick={() => onSelectChannel(category, channel)}
                    className={cn(
                      "flex items-center w-full py-1 px-4 rounded-md transition-colors text-left text-sm",
                      currentChannel.id === channel.id 
                        ? "bg-geek/30 text-white" 
                        : "text-gray-400 hover:bg-dark-lighter hover:text-gray-300",
                      isSidebarCollapsed ? "justify-center p-2" : ""
                    )}
                  >
                    <span className="mr-1.5 flex-shrink-0">{channel.icon}</span>
                    {!isSidebarCollapsed && (
                      <span className="truncate">{channel.name}</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      
      {/* Online Users */}
      {!isSidebarCollapsed && (
        <div className="p-3 border-t border-dark-lighter">
          <div className="flex items-center text-sm text-gray-400 mb-2">
            <Users size={16} className="mr-2" />
            <span>Online</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {initialState.users
              .filter(user => user.isOnline)
              .map(user => (
                <UserAvatar key={user.id} user={user} size="sm" />
              ))}
          </div>
        </div>
      )}
      
      {/* Current User */}
      <div className="p-3 bg-dark-lighter flex items-center">
        <UserAvatar user={initialState.currentUser} size="sm" />
        {!isSidebarCollapsed && (
          <div className="ml-2 overflow-hidden">
            <div className="font-medium text-sm truncate">{initialState.currentUser.name}</div>
            <div className="text-xs text-neon-green">Online</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
