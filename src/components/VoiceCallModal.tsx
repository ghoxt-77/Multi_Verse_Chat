
import React, { useEffect, useRef, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { User } from '@/data/chatData';
import { Mic, MicOff, PhoneOff, Volume2, VolumeX } from 'lucide-react';
import UserAvatar from './UserAvatar';
import { cn } from '@/lib/utils';

interface VoiceCallModalProps {
  isOpen: boolean;
  onClose: () => void;
  caller: User;
  receiver: User;
  isIncoming?: boolean;
  onAccept?: () => void;
  onReject?: () => void;
}

const VoiceCallModal: React.FC<VoiceCallModalProps> = ({
  isOpen,
  onClose,
  caller,
  receiver,
  isIncoming = false,
  onAccept,
  onReject,
}) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOff, setIsSpeakerOff] = useState(false);
  const [callStatus, setCallStatus] = useState<'connecting' | 'active' | 'ended'>(
    isIncoming ? 'connecting' : 'active'
  );
  const [callDuration, setCallDuration] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const toggleMute = () => setIsMuted(!isMuted);
  const toggleSpeaker = () => setIsSpeakerOff(!isSpeakerOff);

  const handleEndCall = () => {
    setCallStatus('ended');
    setTimeout(() => {
      onClose();
    }, 1000);
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    if (callStatus === 'active') {
      timerRef.current = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [callStatus]);

  const handleAcceptCall = () => {
    if (onAccept) onAccept();
    setCallStatus('active');
  };

  const handleRejectCall = () => {
    if (onReject) onReject();
    handleEndCall();
  };

  // Simulated call connection
  useEffect(() => {
    if (isOpen && !isIncoming) {
      // Simulate connection delay
      const timer = setTimeout(() => {
        setCallStatus('active');
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [isOpen, isIncoming]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-dark-dark border-dark-lighter sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold">
            {isIncoming && callStatus === 'connecting' 
              ? 'Chamada recebida' 
              : callStatus === 'active' 
                ? 'Chamada em andamento' 
                : 'Chamada finalizada'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col items-center py-6 space-y-4">
          <UserAvatar 
            user={isIncoming ? caller : receiver} 
            size="lg"
            showStatus={false}
            className="w-24 h-24 border-4 border-neon-purple" 
          />
          
          <div className="text-center">
            <h3 className="text-lg font-semibold">
              {isIncoming ? caller.name : receiver.name}
            </h3>
            
            {callStatus === 'connecting' && isIncoming ? (
              <p className="text-gray-400">Está te ligando...</p>
            ) : callStatus === 'connecting' ? (
              <p className="text-gray-400">Conectando...</p>
            ) : callStatus === 'active' ? (
              <p className="text-neon-green">{formatDuration(callDuration)}</p>
            ) : (
              <p className="text-gray-400">Chamada encerrada</p>
            )}
          </div>
          
          {/* Call controls */}
          {callStatus === 'connecting' && isIncoming ? (
            <div className="flex justify-center gap-6 mt-4">
              <button 
                onClick={handleRejectCall}
                className="p-4 bg-red-500 rounded-full hover:bg-red-600 transition-colors"
              >
                <PhoneOff size={24} />
              </button>
              <button 
                onClick={handleAcceptCall}
                className="p-4 bg-green-500 rounded-full hover:bg-green-600 transition-colors"
              >
                <Volume2 size={24} />
              </button>
            </div>
          ) : callStatus === 'active' ? (
            <div className="flex justify-center gap-6 mt-6">
              <button 
                onClick={toggleMute}
                className={cn(
                  "p-3 rounded-full transition-colors",
                  isMuted ? "bg-gray-700" : "bg-dark-lighter hover:bg-gray-700"
                )}
              >
                {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
              </button>
              
              <button 
                onClick={handleEndCall}
                className="p-4 bg-red-500 rounded-full hover:bg-red-600 transition-colors"
              >
                <PhoneOff size={24} />
              </button>
              
              <button 
                onClick={toggleSpeaker}
                className={cn(
                  "p-3 rounded-full transition-colors",
                  isSpeakerOff ? "bg-gray-700" : "bg-dark-lighter hover:bg-gray-700"
                )}
              >
                {isSpeakerOff ? <VolumeX size={20} /> : <Volume2 size={20} />}
              </button>
            </div>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VoiceCallModal;
