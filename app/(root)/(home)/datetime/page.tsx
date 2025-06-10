import DateTime from '@/components/DateTime'; // Changed import
import React from 'react';

const DateTime = () => {
  return (
    <section className="flex size-full flex-col items-center justify-center gap-10 text-white p-8"> {/* Added centering and padding */}
      <h1 className="text-3xl font-bold self-start">Date & Time</h1> {/* Keep title, but align self-start if page is centered */}
      <div className="flex flex-col items-center justify-center rounded-lg bg-dark-2 p-12 shadow-xl"> {/* Added a styled container */}
        <DateTime /> {/* Use the DateTime component */}
      </div>
    </section>
  );
};

export default DateTime;
