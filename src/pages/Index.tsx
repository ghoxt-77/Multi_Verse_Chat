
import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import ChatArea from '@/components/ChatArea';
import { categories, Category, Channel, currentUser, initialState, Message } from '@/data/chatData';

const Index = () => {
  const [currentCategory, setCurrentCategory] = useState<Category>(initialState.currentCategory);
  const [currentChannel, setCurrentChannel] = useState<Channel>(initialState.currentChannel);
  const [allMessages, setAllMessages] = useState<{[channelId: string]: Message[]}>(
    categories.reduce((acc, category) => {
      category.channels.forEach(channel => {
        acc[channel.id] = [...channel.messages];
      });
      return acc;
    }, {} as {[channelId: string]: Message[]})
  );

  const handleSelectChannel = (category: Category, channel: Channel) => {
    setCurrentCategory(category);
    setCurrentChannel(channel);
  };

  const handleSendMessage = (text: string) => {
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      text,
      userId: currentUser.id,
      timestamp: new Date().toISOString(),
    };

    setAllMessages(prev => ({
      ...prev,
      [currentChannel.id]: [...(prev[currentChannel.id] || []), newMessage]
    }));
  };

  return (
    <div className="flex h-screen overflow-hidden bg-dark">
      <Sidebar 
        currentCategory={currentCategory}
        currentChannel={currentChannel}
        categories={categories}
        onSelectChannel={handleSelectChannel}
      />
      
      <div className="flex-1 overflow-hidden">
        <ChatArea 
          currentCategory={currentCategory}
          currentChannel={currentChannel}
          currentUser={currentUser}
          messages={allMessages[currentChannel.id] || []}
          onSendMessage={handleSendMessage}
        />
      </div>
    </div>
  );
};

export default Index;
