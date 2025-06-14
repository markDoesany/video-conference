"use client"
import React, { useState } from 'react'
import HomeCard from './HomeCard'
import { useRouter } from 'next/navigation'
import MeetingModal from './MeetingModal'
import { useUser } from '@clerk/nextjs'
import { Call, useStreamVideoClient } from '@stream-io/video-react-sdk'
import { useToast } from './ui/use-toast'
import { Textarea } from './ui/textarea'
import ReactDatePicker from 'react-datepicker'
import { Input } from "@/components/ui/input"

const MeetingTypeList = () => {
  const router = useRouter();
  const [meetingState, setMeetingState] = useState<'isScheduleMeeting' | 'isJoiningMeeting' | 'isInstantMeeting' | undefined>();
  const [values, setValues] = useState({
    title: '',
    dateTime: new Date(),
    description: '',
    link: ''
  });
  const [callDetails, setCallDetails] = useState<Call>();
  const { user } = useUser();
  const client = useStreamVideoClient();
  const {toast} = useToast();

  const createMeeting = async() => {
    if (!client || !user) return

    try {
      if (!values.dateTime){
        toast({
          title: 'Please select a date and time',
          variant: "destructive",
        })
        return
      };

      const callId = crypto.randomUUID();
      const call = client.call("default", callId);

      if (!call){
        throw new Error("Failed to create call");
      }

      const startsAt = values.dateTime.toISOString();
      const description = values.description || "Scheduled meeting";

      await call.getOrCreate({
        data: {
          starts_at: startsAt,
          custom: {
            description: values.title || 'Untitled Meeting',
            ...(values.description && { details: values.description })
          }
        }
      });

      toast({
        title: "Meeting Created",
        description: `Meeting scheduled for ${values.dateTime.toLocaleString()}`,
      });

      // Redirect to the meeting room
      router.push(`/meeting/${call.id}`);
    } catch (error) {
      console.error(error);
      toast({
        title: "Failed to create meeting",
        variant: "destructive",
      });
    }
  };

  const meetingLink = `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${callDetails?.id}`;

  return (
    <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
      <HomeCard
        img="/icons/add-meeting.svg"
        title="New Meeting"
        description="Start an instant meeting"
        handleClick={() => setMeetingState('isInstantMeeting')}
        bgColor="bg-orange-1"
        iconBg="bg-orange-1/10"
        bgIcon="/icons/video.svg"
      />
      <HomeCard
        img="/icons/schedule.svg"
        title="Schedule Meeting"
        description="Plan your meeting"
        handleClick={() => setMeetingState('isScheduleMeeting')}
        bgColor="bg-blue-1"
        iconBg="bg-blue-1/10"
        bgIcon="/icons/calendar.svg"
      />
      <HomeCard
        img="/icons/recordings.svg"
        title="View Recordings"
        description="Check out your recordings"
        handleClick={() => router.push('/recordings')}
        bgColor="bg-purple-1"
        iconBg="bg-purple-1/10"
        bgIcon="/icons/play.svg"
      />
      <HomeCard
        img="/icons/join-meeting.svg"
        title="Join Meeting"
        description="via invitation link"
        handleClick={() => setMeetingState('isJoiningMeeting')}
        bgColor="bg-yellow-1"
        iconBg="bg-yellow-1/10"
        bgIcon="/icons/link.svg"
      />

      {/* Schedule Meeting Modal */}
      {!callDetails ? (
        <MeetingModal
          isOpen={meetingState === 'isScheduleMeeting'}
          onClose={() => setMeetingState(undefined)}
          title="Schedule Meeting"
          buttonText="Schedule Meeting"
          handleClick={createMeeting}
        >
          <div className="flex flex-col gap-2.5">
            <label className="text-base text-normal leading-[22px] text-sky-2">
              Meeting Title
            </label>
            <Input
              className="border-none bg-dark-3 focus-visible:ring-0 focus-visible:ring-offset-0"
              onChange={(e) =>
                setValues({ ...values, title: e.target.value })
              }
              placeholder="Enter meeting title"
            />
            <label className="text-base text-normal leading-[22px] text-sky-2">
              Add a description
            </label>
            <Textarea
              className="border-none bg-dark-3 focus-visible:ring-0 focus-visible:ring-offset-0"
              onChange={(e) =>
                setValues({ ...values, description: e.target.value })
              }
            />
          </div>
          <div className="flex w-full flex-col gap-2.5">
            <label className="text-base text-normal leading-[22px] text-sky-2">
              Select Date and Time
            </label>
            <ReactDatePicker
              selected={values.dateTime}
              onChange={(date) => setValues({ ...values, dateTime: date! })}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              timeCaption="time"
              dateFormat="MMMM d, yyyy h:mm aa"
              className="w-full rounded bg-dark-3 p-2 focus:outline-none"
            />
          </div>
        </MeetingModal>
      ) : (
        <MeetingModal
          isOpen={meetingState === 'isScheduleMeeting'}
          onClose={() => setMeetingState(undefined)}
          title="Meeting Created"
          className="text-center"
          buttonText="Copy Meeting Link"
          handleClick={() => {
            navigator.clipboard.writeText(meetingLink);
            toast({ title: 'Link copied' });
          }}
          image="/icons/checked.svg"
          buttonIcon="/icons/copy.svg"
        />
      )}

      {/* Join Meeting Modal */}
      <MeetingModal
        isOpen={meetingState === 'isJoiningMeeting'}
        onClose={() => setMeetingState(undefined)}
        title="Join Meeting"
        buttonText="Join Meeting"
        handleClick={() => {
          if (values.link) {
            const meetingId = values.link.split('/').pop();
            if (meetingId) {
              router.push(`/meeting/${meetingId}`);
            } else {
              toast({
                title: 'Invalid meeting link',
                variant: 'destructive',
              });
            }
          } else {
            toast({
              title: 'Please enter a meeting link',
              variant: 'destructive',
            });
          }
        }}
      >
        <Input
          placeholder="Meeting link"
          className="border-none bg-dark-3 focus-visible:ring-0 focus-visible:ring-offset-0"
          onChange={(e) => setValues({ ...values, link: e.target.value })}
        />
      </MeetingModal>
    </section>
  );
};

export default MeetingTypeList;