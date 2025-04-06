
import React, { useState, useRef } from 'react';
import { cn } from "@/lib/utils";
import { SendHorizontal, Smile, Paperclip, Mic } from 'lucide-react';
import { Channel, User } from '@/data/chatData';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface MessageInputProps {
  currentChannel: Channel;
  currentUser: User;
  onSendMessage: (text: string) => void;
  onSendAudio?: (audioBlob: Blob) => void;
}

const emojiCategories = [
  { name: "Smileys", emojis: ["😀", "😁", "😂", "🤣", "😃", "😄", "😅", "😆", "😉", "😊", "😋", "😎", "😍", "🥰", "😘"] },
  { name: "Gestures", emojis: ["👍", "👎", "👌", "✌️", "🤞", "🤟", "🤘", "👊", "✊", "🤛", "🤜", "👏", "🙌", "👐", "🤲"] },
  { name: "People", emojis: ["👶", "👦", "👧", "👨", "👩", "👴", "👵", "👨‍⚕️", "👩‍⚕️", "👨‍🎓", "👩‍🎓", "👨‍🏫", "👩‍🏫"] },
  { name: "Animals", emojis: ["🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼", "🐨", "🐯", "🦁", "🐮", "🐷", "🐸", "🐵"] },
  { name: "Food", emojis: ["🍎", "🍐", "🍊", "🍋", "🍌", "🍉", "🍇", "🍓", "🍈", "🍒", "🍑", "🥭", "🍍", "🥥", "🥝"] },
  { name: "Games", emojis: ["🎮", "🕹️", "🎲", "♟️", "🎯", "🎳", "🎪", "🎭", "🎨", "🧩", "🎰", "🎮", "🎬", "🎤", "🎧"] },
  { name: "Custom", emojis: [
    <img key="custom-emoji-1" src="/lovable-uploads/c4d861f1-dd71-489b-9d44-aa01986608b3.png" alt="Custom Bot Emoji" className="w-6 h-6 inline-block" />
  ] },
];

const MessageInput: React.FC<MessageInputProps> = ({ 
  currentChannel, 
  currentUser,
  onSendMessage,
  onSendAudio
}) => {
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  const addEmoji = (emoji: string | JSX.Element) => {
    // If emoji is a JSX Element (custom image), use its alt text or a placeholder
    if (React.isValidElement(emoji)) {
      const imgElement = emoji as React.ReactElement<{alt: string}>;
      onSendMessage(`[Custom Emoji: ${imgElement.props.alt || 'Bot'}]`);
    } else {
      setMessage(prev => prev + emoji);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      mediaRecorder.addEventListener('dataavailable', (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      });
      
      mediaRecorder.addEventListener('stop', () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        audioChunksRef.current = [];
        
        if (onSendAudio) {
          onSendAudio(audioBlob);
        }
        
        // Stop all tracks from the stream
        stream.getTracks().forEach(track => track.stop());
        setIsRecording(false);
      });
      
      audioChunksRef.current = [];
      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting audio recording:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
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
        
        <Popover>
          <PopoverTrigger asChild>
            <button 
              type="button" 
              className="text-gray-400 hover:text-neon-purple transition-colors p-1"
              aria-label="Add emoji"
            >
              <Smile size={20} />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0 bg-dark-dark border-dark-lighter">
            <div className="p-3 max-h-96 overflow-y-auto">
              {emojiCategories.map((category) => (
                <div key={category.name} className="mb-4">
                  <h3 className="text-sm font-medium text-gray-300 mb-2">{category.name}</h3>
                  <div className="grid grid-cols-8 gap-1">
                    {category.emojis.map((emoji, index) => (
                      <button
                        key={index}
                        onClick={() => addEmoji(emoji)}
                        className="text-xl hover:bg-dark-lighter p-1.5 rounded-md transition-colors"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </PopoverContent>
        </Popover>
        
        <button 
          type="button" 
          className={cn(
            "p-1.5 rounded-full transition-colors",
            isRecording ? "bg-red-500 text-white" : "text-gray-400 hover:text-neon-purple"
          )}
          onClick={isRecording ? stopRecording : startRecording}
          aria-label={isRecording ? "Stop recording" : "Record audio"}
        >
          <Mic size={20} />
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
