import Image from 'next/image';
import { AvatarIcon } from '@radix-ui/react-icons';
// import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from './ui/dropdown-menu';
import Link from 'next/link';
import { Button as MyButton } from './ui/button';
import React from 'react';
import { Database } from '@/types/supabase';
import { Button, Dropdown, Space } from 'antd';
import type { MenuProps } from 'antd';
import { DownOutlined } from '@ant-design/icons';

import ClientSideCredits from './realtime/ClientSideCredits';
import logo from '/public/logo.png';

export const dynamic = 'force-dynamic';

export const revalidate = 0;

export default async function Navbar() {
    // const supabase = createServerComponentClient<Database>({ cookies });
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceRoleKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const supabase = createClient(supabaseUrl as string, supabaseServiceRoleKey as string);

    const accessToken = cookies().get('access_token')?.value as unknown as string;
    let user = null;
    if (accessToken) {
        const {
            data: { user: userInfo },
        } = await supabase.auth.getUser(accessToken);
        // console.log('access_token = ', cookies().get('access_token'));
        // console.log('user = ', user);
        user = userInfo;
    }

    const { data: credits } = await supabase
        .from('credits')
        .select('*')
        .eq('user_id', user?.id ?? '')
        .single();

    const items: MenuProps['items'] = [
        {
            label: <Link href='/home#how-it-work'>How it work</Link>,
            key: '0',
        },
        {
            label: <Link href='/home#samples'>Samples</Link>,
            key: '1',
        },
        {
            label: <Link href='/home#about'>About</Link>,
            key: '2',
        },
    ];

    return (
        <div className='flex w-full px-4 py-4 items-center border-b text-center gap-8 justify-between fixed md:relative bg-white z-10'>
            <div className='flex gap-2 h-full'>
                <Link href='/' className='flex'>
                    {/* <h2 className="font-bold">Headshots AI</h2> */}
                    <Image src={logo} alt='coocoo' width={32} height={32} className='mr-2' />
                    <h2 className='font-bold text-primary text-base leading-8 hidden md:block'>
                        CooCoo Personalized Story
                    </h2>
                </Link>
            </div>
            <div className='lg:flex flex-row gap-2 grow justify-end hidden md:block'>
                <Link href='/home#how-it-work'>
                    <Button type='link' className='text-font-color-black'>
                        How it works
                    </Button>
                    {/* <Button variant={"ghost"}>Home</Button> */}
                </Link>
                <Link href='/home#samples'>
                    <Button type='link' className='text-font-color-black'>
                        Samples
                    </Button>
                </Link>
                <Link href='/home#about'>
                    <Button type='link'>About</Button>
                </Link>
            </div>

            <div className='flex gap-4 lg:ml-auto'>
                <div className='md:hidden'>
                  <Dropdown menu={{ items }} trigger={['click']}>
                      <Button type='link'>
                          <Space>
                              Menu
                              <DownOutlined />
                          </Space>
                      </Button>
                  </Dropdown>
                </div>

                {!user && (
                    <Link href='/signin'>
                        <Button type='primary'>Signin</Button>
                    </Link>
                )}
                {user && (
                    <div className='flex flex-row gap-4 text-center align-middle justify-center'>
                        {/* {stripeIsConfigured && (
              <ClientSideCredits creditsRow={credits ? credits : null} />
            )} */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild className='cursor-pointer'>
                                <AvatarIcon height={24} width={24} className='text-primary' />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className='w-56'>
                                <DropdownMenuLabel className='text-primary text-center overflow-hidden text-ellipsis'>
                                    {user.email}
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <form action='/auth/sign-out' method='post'>
                                    <MyButton
                                        type='submit'
                                        className='w-full text-left'
                                        variant={'ghost'}
                                    >
                                        Log out
                                    </MyButton>
                                </form>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                )}
            </div>
        </div>
    );
}
