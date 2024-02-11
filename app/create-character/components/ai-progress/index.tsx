'use client';
import { Progress, Space, Button } from 'antd';
import { useEffect, useState, useCallback } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';

export default function AiProgress() {
    const [percent, setPercent] = useState(0);
    useEffect(() => {
        const timmer = setInterval(() => {
            if (percent < 100) {
                setPercent((prev) => prev + 5);
            } else {
                clearInterval(timmer);
            }
        }, 500);
    }, []);
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const createQueryString = useCallback(
      (name: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString())
        params.set(name, value)
   
        return params.toString()
      },
      [searchParams]
    )
    const updateStep = () => {
      router.push(pathname + '?' + createQueryString('step', '2'))
    };

    return (
        <div className='flex flex-col items-center'>
            <div className='w-1/2'>
                <Progress percent={percent} status='active' />
            </div>

            <div className='mb-12 mt-12 text-black text-3xl'>
                { percent < 100 && (<div>
                  <span>Please wait......(假装在生成)</span>
                  <br />
                  <span>CooCoo’s AI is doing its magic.</span>
                </div>)}

                {percent >= 100 && (<div>
                  <span>Finish, please click continue</span>
                </div>)}
            </div>

            <Space className='mb-8'>
                <Button type='primary' disabled={percent < 100} onClick={updateStep}>
                    Continue
                </Button>
            </Space>
        </div>
    );
}
