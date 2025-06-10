"use client"; // Required for hooks

import DateTime from '@/components/DateTime'
import MeetingTypeList from '@/components/MeetingTypeList'
// import { Metadata } from 'next'; // Metadata should be handled differently for client components if needed, or moved to layout
import React, { useEffect, useState } from 'react' // Added useEffect and useState for potential local state management
import { useGetCalls } from '@/hooks/useGetCalls';
import { Call } from '@stream-io/video-react-sdk';
import { useRouter } from 'next/navigation'; // Import useRouter

// export const metadata: Metadata = { // Metadata export is not directly supported in client components.
//   title: "Goom",
//   description: "Video calling application for noobs",
//   icons: {
//     icon: '/icons/logo.svg',
//   }
// };

const Home: React.FC = () => {
  const router = useRouter(); // Initialize router
  const { upcomingCalls, isLoading } = useGetCalls();
  const [meetings, setMeetings] = useState<Call[]>([]);
  const [nextUpcomingMeeting, setNextUpcomingMeeting] = useState<Call | undefined>();

  useEffect(() => {
    if (upcomingCalls) {
      setMeetings(upcomingCalls);
      // console.log('All upcoming meetings loaded:', upcomingCalls);
    }
  }, [upcomingCalls]);

  useEffect(() => {
    if (meetings && meetings.length > 0) {
      setNextUpcomingMeeting(meetings[0]);
      // console.log('Next upcoming meeting set:', meetings[0]);
    } else {
      setNextUpcomingMeeting(undefined);
    }
  }, [meetings]);

  // TODO: Add loading indicator based on isLoading if necessary - Handled below

  const getMeetingInfo = () => {
    if (isLoading) {
      return "Loading upcoming meeting...";
    }

    if (nextUpcomingMeeting) {
      const title = nextUpcomingMeeting.state?.custom?.description?.substring(0, 22) || "Upcoming Meeting";
      const startTime = nextUpcomingMeeting.state?.startsAt;
      if (startTime) {
        const formattedTime = new Date(startTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        return `${title} at ${formattedTime}`;
      }
      return title; // In case startTime is not available
    }

    return "No upcoming meetings";
  };

  return (
    <section className='flex size-full flex-col gap-10 text-white'>
      <div
        className={`h-[300px] w-full rounded-[20px] bg-hero bg-cover ${nextUpcomingMeeting && !isLoading ? 'cursor-pointer' : ''}`}
        onClick={() => {
          if (nextUpcomingMeeting && !isLoading) {
            router.push(`/meeting/${nextUpcomingMeeting.id}`);
          }
        }}
      >
        <div className='flex h-full flex-col justify-between p-5 md:px-5 md:py-8 lg:p-11'>
          <h2 className='glassmorphism max-w-[270px] rounded py-2 text-center text-base font-normal'>
            {getMeetingInfo()}
          </h2>
          <DateTime/>
        </div>
      </div>
      <MeetingTypeList/>
    </section>
  )
}

export default Home