"use client"
import React, { useEffect, useState } from 'react';

const DateTime: React.FC = () => {
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();

      // Format time as "11:30 PM"
      const formattedTime = now.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
      });

      // Format date as "Sunday, March 20, 2024"
      const formattedDate = now.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });

      setTime(formattedTime);
      setDate(formattedDate);
    };

    updateDateTime();
    const intervalId = setInterval(updateDateTime, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-4xl font-extrabold lg:text-7xl">
        {time}
      </h1>
      <p className="text-lg font-medium text-sky-1 lg:text-2xl">
        {date}
      </p>
    </div>
  );
};

export default DateTime;
