"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useGetCalls } from "@/hooks/useGetCalls";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "./ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";

interface MeetingCardProps {
  title: string;
  date: string;
  icon: string;
  isPreviousMeeting?: boolean;
  buttonIcon1?: string;
  buttonText?: string;
  handleClick: () => void;
  link: string;
  call?: Call;
}

const MeetingCard = ({
  title,
  date,
  icon,
  isPreviousMeeting,
  buttonIcon1,
  handleClick,
  link,
  buttonText,
  call,
}: MeetingCardProps) => {
  const { user } = useUser();
  const router = useRouter();
  const client = useStreamVideoClient();
  const { toast } = useToast();
  const [callDetails, setCallDetails] = useState<Call>();

  // Get participants - handle case when call is not provided
  const participants = call?.state?.participants || callDetails?.state?.participants || [];
  return (
    <div className="bg-dark-1 rounded-lg p-6 flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <div className="p-2 bg-dark-2 rounded-lg">
          <img src={icon} alt="icon" width={24} height={24} />
        </div>
        <h2 className="text-xl font-semibold">{title || 'Untitled Meeting'}</h2>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <p className="text-sm text-gray-300">{date}</p>
          {call?.state?.startsAt && (
            <p className="text-xs text-gray-400">
              {new Date(call.state.startsAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
              {call.state.endedAt && (
                <span> - {new Date(call.state.endedAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
              )}
            </p>
          )}
        </div>
        {(isPreviousMeeting || !call?.state?.startsAt) && (
          <div className="flex -space-x-2">
            {participants?.length > 0 ? (
              participants
                .filter(p => p && p.source)
                .slice(0, 5)
                .map((participant, index) => (
                  <Avatar 
                    key={participant.sessionId || `participant-${index}`} 
                    className="h-8 w-8 border-2 border-dark-1"
                  >
                    <AvatarFallback className="bg-dark-3 text-white">
                      {String.fromCharCode(65 + index)}
                    </AvatarFallback>
                  </Avatar>
                ))
            ) : (
              <Avatar className="h-8 w-8 border-2 border-dark-1">
                <AvatarFallback className="bg-dark-3 text-white">
                  {user?.firstName?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
            )}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-4">
        {!isPreviousMeeting && (
          <Button
            onClick={handleClick}
            className="bg-blue-1 hover:bg-blue-600 text-white rounded-lg py-2 px-4 w-full"
          >
            {buttonIcon1 && (
              <img src={buttonIcon1} alt="feature" className="mr-2" />
            )}
            {buttonText || 'Start Meeting'}
          </Button>
        )}
        
        {!isPreviousMeeting && link && (
          <Button
            onClick={() => {
              navigator.clipboard.writeText(link);
              toast({
                title: 'Link copied to clipboard',
                duration: 2000,
              });
            }}
            className="bg-dark-3 hover:bg-dark-4 text-white rounded-lg py-2 px-4 w-full"
          >
            <img src="/icons/copy.svg" alt="copy" width={20} height={20} className="mr-2" />
            Copy Invitation
          </Button>
        )}
      </div>
    </div>
  );
};

export default MeetingCard;