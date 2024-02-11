import { cookies } from 'next/headers';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Button } from 'antd';
import Image from 'next/image';
import HowItWork from './components/how-it-work';
import Samples from './components/samples';
import { getSupabaseClient } from '@/lib/utils'

import hero1 from '/public/hero1.png';
import hero2 from '/public/hero2.png';
import hero3 from '/public/hero3.png';
import hero4 from '/public/hero4.png';
import hero5 from '/public/hero5.png';
import hero6 from '/public/hero6.png';

// import { Button } from "@/components/ui/button";
// import ExplainerSection from "@/components/ExplainerSection";
// import PricingSection from "@/components/PricingSection";

export const dynamic = 'force-dynamic';

export default async function Index() {
    const supabase = getSupabaseClient();
    const accessToken = cookies().get('access_token')?.value as unknown as string;
    const {
        data: { user },
    } = await supabase.auth.getUser(accessToken)

    return (
        <div className='flex flex-col items-center pt-0 md:pt-16'>
            <div className='flex flex-col lg:flex-row items-center gap-8 p-8 max-w-6xl w-full'>
                <div className='flex flex-col space-y-4 lg:w-1/2 w-full'>
                    <h1 className='text-5xl font-bold'>
                        From a drawing to a personalized character.
                    </h1>
                    <p className='text-primary text-lg'>
                        Every child is unique. Let children learn from the characters of their own.
                    </p>
                    <div className='flex flex-col space-y-2'>
                        <Link href='/create-character'>
                            <Button type='primary' className='w-full lg:w-1/2'>
                                {' '}
                                Start Creating Characters
                            </Button>
                        </Link>
                    </div>
                    { !user && (<div className='mt-4 text-gray-500'>
                        <span>Already a member? </span>
                        <Button type='link' href='/signin' style={{ color: 'hsl(var(--primary))' }}>
                            Sign In
                        </Button>
                    </div>)}
                </div>
                <div className='lg:w-1/2 w-full mt-8 lg:mt-0 grid grid-cols-3 gap-6'>
                    {/* <img
            src={hero.src}
            alt="AI Headshot Illustration"
            className="rounded-lg object-cover w-full h-full"
          /> */}
                    <Image src={hero1} alt='hero' className='w-40'></Image>
                    <Image src={hero2} alt='hero' className='w-40'></Image>
                    <Image src={hero3} alt='hero' className='w-40'></Image>
                    <Image src={hero4} alt='hero' className='w-40'></Image>
                    <Image src={hero5} alt='hero' className='w-40'></Image>
                    <Image src={hero6} alt='hero' className='w-40'></Image>
                </div>
            </div>

            <div
                id='how-it-work'
                className='w-full max-w-6xl mt-16 p-8 bg-gray-100 rounded-lg space-y-8'
            >
                <HowItWork />
            </div>
            <div id='samples' className='w-full max-w-6xl mt-16 mb-16 p-8 rounded-lg space-y-8'>
                <Samples />
            </div>
            <div id='about' className='flex flex-col items-center w-full max-w-6xl mt-16 p-8 bg-gray-100 rounded-lg space-y-8'>
                <p className='text-center text-black font-bold mb-9 text-3xl'>CooCoo 的简介/故事 Page</p>
                <Link href='/create-character'>
                    <Button type='primary' className='mt-7'>
                        Start Creating Characters
                    </Button>
                </Link>
            </div>
        </div>
    );
}
