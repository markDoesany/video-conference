import DateTime from '@/components/DateTime'
import MeetingTypeList from '@/components/MeetingTypeList'
import { Metadata } from 'next';
import React from 'react'

export const metadata: Metadata = {
  title: "Goom",
  description: "Video calling application for noobs",
  icons: {
    icon: '/icons/logo.svg',
  }
};

const Home: React.FC = () => {
  return (
    <section className='flex size-full flex-col gap-10 text-white'>
      <div className='h-[300px] w-full rounded-[20px] bg-hero bg-cover'>
        <div className='flex h-full flex-col justify-between p-5 md:px-5 md:py-8 lg:p-11'>
          <h2 className='glassmorphism max-w-[270px] rounded py-2 text-center text-base font-normal'>Upcoming Meeting at 11:30 PM</h2>
          <DateTime/>
        </div>
      </div>
      <MeetingTypeList/>
    </section>
  )
}

export default Home