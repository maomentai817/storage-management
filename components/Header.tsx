import React from 'react'

import Image from 'next/image'

import FileUpLoader from '@/components/FileUpLoader'
import Search from '@/components/Search'
import { Button } from '@/components/ui/button'
import { signOutUser } from '@/lib/actions/user.actions'

interface Props {
  userId: string
  accountId: string
}

const Header = (props: Props) => {
  const { userId, accountId } = props

  return (
    <header className='header'>
      <Search />
      <div className='header-wrapper'>
        <FileUpLoader ownerId={userId} accountId={accountId} />
        <form
          action={async () => {
            'use server'
            await signOutUser()
          }}
        >
          <Button type='submit' className='sign-out-button'>
            <Image
              src='/assets/icons/logout.svg'
              alt='logout'
              width={24}
              height={24}
              className='w-6'
            />
          </Button>
        </form>
      </div>
    </header>
  )
}

export default Header
