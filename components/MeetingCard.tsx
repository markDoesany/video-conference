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
}: MeetingCardProps) => {
  const { user } = useUser();
  const router = useRouter();
  const client = useStreamVideoClient();
  const { toast } = useToast();
  const [callDetails, setCallDetails] = useState<Call>();
  const { calls, loading } = useGetCalls();

  // Get meeting link
  const meetingLink = `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${callDetails?.id}`;

  // Get participants
  const participants = callDetails?.state?.participants || [];

  return (
    <div className="bg-dark-1 rounded-lg p-6 flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <div className="p-2 bg-dark-2 rounded-lg">
          <img src={icon} alt="icon" width={24} height={24} />
        </div>
        <h2 className="text-xl font-semibold">{title}</h2>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-300">{date}</p>
        <div className="flex -space-x-2">
          {participants.length > 0 ? (
            participants.slice(0, 5).map((participant) => (
              <Avatar key={participant.sessionId} className="h-8 w-8 border-2 border-dark-1">
                <AvatarImage 
                  src={participant.user?.image} 
                  alt={participant.user?.name || 'Participant'} 
                />
                <AvatarFallback className="bg-dark-3 text-white">
                  {participant.user?.name?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
            ))
          ) : (
            <Avatar className="h-8 w-8 border-2 border-dark-1">
              <AvatarImage 
                src={user?.imageUrl} 
                alt={user?.fullName || 'You'} 
              />
              <AvatarFallback className="bg-dark-3 text-white">
                {user?.fullName?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
          )}
          {participants.length > 5 && (
            <div className="h-8 w-8 rounded-full bg-dark-3 flex items-center justify-center text-xs">
              +{participants.length - 5}
            </div>
          )}
        </div>
      </div>

      {!isPreviousMeeting && (
        <div className="flex gap-2">
          <Button onClick={handleClick} className="bg-blue-1 hover:bg-blue-1/80">
            {buttonIcon1 && (
              <img src={buttonIcon1} alt="feature" width={20} height={20} />
            )}
            &nbsp; {buttonText || 'Start'}
          </Button>
          <Button
            onClick={() => {
              navigator.clipboard.writeText(meetingLink);
              toast({ title: 'Link copied' });
            }}
            className="bg-dark-4 px-6"
          >
            <img
              src="/icons/copy.svg"
              alt="feature"
              width={20}
              height={20}
            />
            &nbsp; Copy Link
          </Button>
        </div>
      )}
    </div>
  );
};

export default MeetingCard;