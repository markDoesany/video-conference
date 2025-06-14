import { cn } from '@/lib/utils';
import { CallControls, CallingState, CallParticipantsList, PaginatedGridLayout, SpeakerLayout, useCallStateHooks } from '@stream-io/video-react-sdk';
import React, { useState } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LayoutGrid, Users, LayoutList, BarChart2 } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import EndCallButton from './EndCallButton';
import Loader from './Loader';

type CallLayoutType = 'grid' | 'speaker-left' | 'speaker-right';

const MeetingRoom = () => {
  const searchParams = useSearchParams();
  const isPersonalRoom = !!searchParams.get('personal');
  const [layout, setLayout] = useState<CallLayoutType>('speaker-left');
  const [showParticipants, setShowParticipants] = useState(false);
  
  const { useCallCallingState } = useCallStateHooks();
  const callingState = useCallCallingState();
  const router = useRouter();

  if (callingState !== CallingState.JOINED) return <Loader/>

  const CallLayout = () => {
    switch (layout){
      case 'grid':
        return <PaginatedGridLayout/>
      case 'speaker-left':
        return <SpeakerLayout participantsBarPosition='right'/>
      default:
        return <SpeakerLayout participantsBarPosition='left'/>
    }
  }

  return (
    <section className='relative h-screen w-full overflow-hidden bg-dark-1 text-white'>
      <div className='relative flex h-[calc(100vh-80px)] items-center justify-center p-2 sm:p-4'>
        <div className='relative size-full max-w-[1800px]'>
          <CallLayout/>  
        </div>
        <div className={cn(
          'fixed right-0 top-0 h-full w-full sm:w-[300px] bg-dark-2 transition-all duration-300 ease-in-out transform',
          { 'translate-x-0': showParticipants, 'translate-x-full': !showParticipants }
        )}>
          <CallParticipantsList 
            onClose={() => setShowParticipants(false)}
          />
        </div>
      </div>

      {/* Controls */}
      <div className='fixed bottom-0 left-0 right-0 z-10 flex h-16 sm:h-20 items-center justify-center gap-1 sm:gap-3 bg-dark-1 px-2 sm:px-4 shadow-[0_-2px_10px_rgba(0,0,0,0.3)]'>
        <div className='flex items-center overflow-x-auto w-full justify-center py-2'>
          <CallControls 
            onLeave={() => router.push('/')}
          />
          
          <div className='hidden ml-3 sm:block'>
            <DropdownMenu>
              <DropdownMenuTrigger className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-dark-3 transition-colors hover:bg-dark-4 flex-shrink-0">
                <LayoutGrid size={16} className="text-white sm:size-5"/>
              </DropdownMenuTrigger>
              <DropdownMenuContent className='border-dark-3 bg-dark-2 text-white min-w-[200px]'>
                {[
                  { value: 'grid', label: 'Grid View', icon: <LayoutGrid size={16} className="mr-2" /> },
                  { value: 'speaker-left', label: 'Speaker Left', icon: <LayoutList size={16} className="mr-2" /> },
                  { value: 'speaker-right', label: 'Speaker Right', icon: <LayoutList size={16} className="mr-2" /> },
                ].map((item) => (
                  <div key={`view-${item.value}`}>
                    <DropdownMenuItem
                      className='cursor-pointer hover:bg-dark-3 focus:bg-dark-3'
                      onClick={() => setLayout(item.value as CallLayoutType)}
                    >
                      {item.icon}
                      {item.label}
                    </DropdownMenuItem>
                  </div>
                ))}
                
                <DropdownMenuItem 
                  className='cursor-pointer hover:bg-dark-3 focus:bg-dark-3'
                  onClick={() => setShowParticipants(!showParticipants)}
                >
                  <Users size={16} className="mr-2" />
                  {showParticipants ? 'Hide Participants' : 'Show Participants'}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          {!isPersonalRoom && <EndCallButton/>}
        </div>
      </div>

      <style jsx global>{`
        .custom-grid-layout {
          --participants-per-page: 9;
          --participant-border-radius: 12px;
          --participant-spacing: 8px;
        }
        
        .custom-speaker-layout {
          --participant-border-radius: 12px;
          --participant-spacing: 8px;
        }
        
        .custom-call-controls {
          --call-controls-bg: transparent;
          --call-controls-hover-bg: rgba(255, 255, 255, 0.1);
          --call-controls-color: #fff;
          --call-controls-border-radius: 9999px;
          --call-controls-padding: 0.25rem;
        }

        @media (max-width: 640px) {
          .custom-call-controls {
            --call-controls-padding: 0.125rem;
          }
        }
      `}</style>
    </section>
  )
}

export default MeetingRoom