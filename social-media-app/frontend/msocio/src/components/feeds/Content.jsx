import React, { useEffect } from 'react'
import ContentHeader from './ContentHeader'
import Posts from './Posts'
import { useAuth } from '@/context/AuthContext'

const Content = () => {
  const {getPosts} = useAuth();
  useEffect(()=>{
    getPosts();
  },[])
  return (
    <div className='flex flex-col w-full m-2'>
        <ContentHeader />
        <Posts />
    </div>
  )
}

export default Content