"use client"
import React from 'react'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { sideBarLinks } from '@/constants'
import { cn } from '@/lib/utils'

const MobileNav = () => {
  const pathname = usePathname();

  return (
    <section className='w-full max-w-[264px] sm:hidden'>
      <Sheet>
        <SheetTrigger asChild>
          <Image src='/icons/hamburger.svg' height={32} width={32} alt='menu' className='cursor-pointer'/>
        </SheetTrigger>
        <SheetContent side="left" className='bg-dark-1 border-none text-white'>
          <Link
          href="/"
          className='flex items-center gap-1'>
          <Image
            src="/icons/logo.svg"
            width={32}
            height={32}
            alt='Goom logo'
            className='max-sm:size-10'
          />
          <p className='text-[26px] font-extrabold text-white'>Goom</p>
        </Link>
        <div className='flex h-[calc(100vh-72px)] flex-col justify-between overflow-y-auto'>
          <SheetClose asChild>
              <section className='flex h-full flex-col gap-6 pt-16 text-white'>
                {
                  sideBarLinks.map((link)=>{
                    const isActive = pathname === link.route;

                    return (
                      <SheetClose asChild key={link.route}>
                        <Link 
                          href={link.route} 
                          key={link.label}
                          className={cn('flex gap-4 items-center p-4 rounded-lg w-full max-w-60', {'bg-blue-1': isActive})}
                          >
                            <Image 
                                src={link.imgUrl}
                                alt={link.label}
                                width={20}
                                height={20}/>
                            <p className='font-semibold'>
                              {link.label}
                            </p>
                        </Link>
                      </SheetClose>
                    )
                  })
                }
              </section>
          </SheetClose>
        </div>
        </SheetContent>
      </Sheet>

    </section>
  )
}

export default MobileNav