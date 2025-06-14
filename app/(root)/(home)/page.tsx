'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { Call, useStreamVideoClient } from '@stream-io/video-react-sdk';
import DateTime from '@/components/DateTime';
import MeetingTypeList from '@/components/MeetingTypeList';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Clock, Video } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const Home = () => {
  const [nextMeeting, setNextMeeting] = useState<Call | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useUser();
  const client = useStreamVideoClient();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const loadUpcomingMeetings = async () => {
      if (!client || !user?.id) return;
      
      setIsLoading(true);
      try {
        const now = new Date();
        const { calls } = await client.queryCalls({
          sort: [{ field: 'starts_at', direction: 1 }],
          filter_conditions: {
            $and: [
              { starts_at: { $exists: true } },
              { starts_at: { $gt: now.toISOString() } },
              {
                $or: [
                  { created_by_user_id: user.id },
                  { 'members.user_id': user.id },
                ],
              },
            ],
          },
          limit: 1,
        });

        setNextMeeting(calls[0] || null);
      } catch (error) {
        console.error('Error loading upcoming meetings:', error);
        toast({
          title: 'Error',
          description: 'Failed to load upcoming meetings',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadUpcomingMeetings();
    
    // Refresh the meeting list every 30 seconds
    const interval = setInterval(loadUpcomingMeetings, 30000);
    return () => clearInterval(interval);
  }, [client, user?.id, toast]);

  const formatMeetingTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const joinMeeting = () => {
    if (nextMeeting) {
      router.push(`/meeting/${nextMeeting.id}`);
    }
  };

  return (
    <section className='flex size-full flex-col gap-10 max-md:text-white'>
      <div className='h-[300px] w-full rounded-[20px] bg-hero bg-cover'>
        <div className='flex h-full flex-col justify-between p-5 md:px-5 md:py-8 lg:p-11'>
          {isLoading ? (
            <div className='glassmorphism max-w-[300px] rounded py-2 text-center text-sm font-normal'>
              Loading...
            </div>
          ) : nextMeeting ? (
            <div className='glassmorphism max-w-[400px] rounded-lg p-3'>
              <div className='flex items-start justify-between gap-2'>
                <div className='flex-1 min-w-0'>
                  <h2 className='text-sm font-medium truncate text-gray-800'>
                    {nextMeeting.state.custom?.description || 'Upcoming Meeting'}
                  </h2>
                  <div className='flex items-center gap-2 text-xs text-gray-800 mt-1'>
                    <Clock className='h-3 w-3 flex-shrink-0' />
                    <span className='truncate'>
                      {nextMeeting.state.startsAt && (
                        <>
                          {new Date(nextMeeting.state.startsAt).toLocaleString([], {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </>
                      )}
                    </span>
                  </div>
                </div>
                <Button 
                  onClick={joinMeeting}
                  className='bg-blue-1 hover:bg-blue-600 h-8 px-3 text-xs whitespace-nowrap'
                >
                  Join Now
                </Button>
              </div>
            </div>
          ) : (
            <div className='glassmorphism max-w-[300px] rounded py-2 px-3 text-center text-sm font-normal'>
              No upcoming meetings
            </div>
          )}
          <DateTime />
        </div>
      </div>
      <MeetingTypeList />
    </section>
  );
};

export default Home;