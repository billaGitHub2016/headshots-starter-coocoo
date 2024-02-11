'use client'

import { Steps, Modal } from 'antd';
import { ExclamationCircleFilled } from '@ant-design/icons';

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { getSupabaseClient } from '@/lib/utils';

const { confirm } = Modal;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const stepsConfig = [{ title: 'Upload Your Drawing', description: '' }, { title: 'CooCoo AI is working', description: '' }, { title: 'Pick the character', description: '' }, { title: 'Your personalized story is ready!', description: '' } ]
  const searchParams = useSearchParams()
  const step = parseInt(searchParams.get('step') || '0')
  const [userLoading, setUserLoading] = useState(false)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const supabase = getSupabaseClient();
    setUserLoading(true)
    supabase.auth.getUser().then(res => {
      if (res.data && res.data.user) {
        setUser(res.data.user)
      } else if (res.error) {
        throw new Error(res.error.message)
      }
    }).catch(err => {
      setUser(err)
    }).finally(() => {
      setUserLoading(false)
    });
  }, [])

  useEffect(() => {
    if (user instanceof Error) {
      Modal.warning({
        title: 'Tips',
        content: 'Please sign in first',
        okText: 'Go to sign in',
        onOk() {
          router.replace('/signin')
        },
      });
    }
  }, [user])

  return (<div className="flex w-full flex-col px-4 lg:px-40 justify-center align-middle">
    { (<h3 className="text-2xl	text-primary font-bold text-center">Welcome to CooCoo Personalized Story!</h3>) }
    { (<h3 className="text-2xl	text-[#fd826f] font-bold text-center mb-6">Create Your Unique Character & Story Now.</h3>) }

    <Steps
      current={step}
      items={stepsConfig}
    />
    <div className='pt-6'>
      { 
        children
      }
    </div>
  </div>);
}
