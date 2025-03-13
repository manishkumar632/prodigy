import React from 'react'
import UserDetails from './UserDetails'
import MyPosts from './MyPosts'
import ContentHeader from '../feeds/ContentHeader'

const Profile_Layout = () => {
  return (
    <div className='flex flex-col w-full m-2 bg-white shadow rounded-lg p-2'>
      <UserDetails />
      <hr className='my-4 border-1' />
      <ContentHeader />
      <MyPosts />
    </div>
  )
}

export default Profile_Layout