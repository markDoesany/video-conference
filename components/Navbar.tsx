import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import MobileNav from './MobileNav'
import { SignedIn, UserButton } from '@clerk/nextjs'

const Navbar = () => {
  return (
    <nav className='flex-between fixed z-50 w-full bg-dark-1 px-4 py-3 lg:px-6'>
      <Link
        href="/"
        className='flex items-center gap-1'>
        <Image
          src="/icons/goom.png"
          width={50}
          height={50}
          alt='Goom logo'
          className='max-sm:size-8'
        />
        <p className='text-[22px] font-extrabold text-white max-sm:hidden'>Goom</p>
      </Link>

      <div className='flex-between gap-4'>
        <SignedIn>
          <UserButton afterSignOutUrl="/sign-in" />
        </SignedIn>
        <MobileNav/>
      </div>
    </nav>
  )
}

export default Navbar