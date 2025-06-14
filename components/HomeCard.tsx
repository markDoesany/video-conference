import Image from 'next/image';
import React from 'react';
import { cn } from '@/lib/utils';

interface HomeCardProps {
  className?: string;
  img: string;
  title: string;
  description: string;
  handleClick: () => void;
  bgColor?: string;
  iconBg?: string;
  bgIcon?: string;
}

const HomeCard = ({
  className,
  img,
  title,
  description,
  handleClick,
  bgColor = 'bg-blue-1',
  iconBg = 'bg-blue-1/10',
  bgIcon
}: HomeCardProps) => {
  return (
    <div
      className={cn(
        'group relative px-6 py-8 flex flex-col justify-between w-full xl:max-w-[300px] min-h-[280px] rounded-2xl cursor-pointer',
        'transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20 hover:-translate-y-1',
        bgColor,
        className
      )}
      onClick={handleClick}
    >
      {bgIcon && (
        <div className='absolute right-4 top-4 opacity-10 group-hover:opacity-20 transition-opacity duration-300'>
          <Image src={bgIcon} width={120} height={120} alt='' aria-hidden />
        </div>
      )}
      
      <div className={cn(
        'flex-center w-14 h-14 rounded-2xl',
        'transition-all duration-300 group-hover:scale-110',
        iconBg
      )}>
        <Image src={img} width={24} height={24} alt={title} className='w-6 h-6' />
      </div>
      
      <div className='flex flex-col gap-3 relative z-10'>
        <h1 className='text-2xl font-bold text-white'>{title}</h1>
        <p className='text-gray-200 font-light'>{description}</p>
      </div>
    </div>
  );
};

export default HomeCard;