'use client';

import { Form, Input, Button, Tag, Checkbox, message } from 'antd';
import Image from 'next/image';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
import { useState } from 'react';
import cookies from 'js-cookie';
import signin from '/public/signin.jpeg';
import { useRouter } from 'next/navigation'

type FieldType = {
    email?: string;
    password?: string;
    remember?: string;
    inviteCode?: string;
};

const customizeRequiredMark = (label: React.ReactNode, { required }: { required: boolean }) => (
    <>
        {required ? <></> : <></>}
        {label}
    </>
);

export default function Index() {
    const [errMessage, setErrMessage] = useState('');
    const router = useRouter()
    const [loading, setLoading] = useState(false);

    const onFinish = (values: any) => {
        console.log('Success:', values);
        setErrMessage('');
        setLoading(true);
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseServiceRoleKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
        const supabase = createClient(supabaseUrl as string, supabaseServiceRoleKey as string);
        supabase.auth
            .signInWithPassword({
                email: values.email,
                password: values.password
            })
            .then(res => {
                const { data, error } = res;
                if (error) {
                    console.log('error = ', error);
                    setErrMessage(error.message);
                }
                if (data && data.user && data.session) {
                    console.log('data = ', data);
                    message.success('Sign in success');

                    cookies.set('access_token', data.session.access_token, { expires: new Date(data.session.expires_at as number * 1000) });
                    cookies.set('refresh_token', data.session.refresh_token);

                    setTimeout(() => {
                        // router.replace('/home')
                        window.location.href = '/home';
                    }, 1000)
                }
            }).finally(() => {
                setLoading(false);
            });
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    const onForgot = () => {
        router.push('/reset-password-email')
    }
    return (
        <div className='flex flex-col items-center'>
            <div className='flex flex-col lg:flex-row items-center gap-8 p-8 pt-0 max-w-6xl w-full'>
                <div className='flex flex-col space-y-4 lg:w-1/2 w-full'>
                    <div className='flex align-middle'>
                        <h2 className='text-2xl font-bold'>Sign In</h2>
                    </div>

                    <Form
                        name='basic'
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                        style={{ maxWidth: 600 }}
                        initialValues={{ remember: true }}
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        autoComplete='off'
                        layout='vertical'
                        requiredMark={customizeRequiredMark}
                    >
                        <Form.Item<FieldType>
                            label='Email'
                            name='email'
                            rules={[{ required: true, message: 'Please input your email!' }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item<FieldType>
                            style={{marginBottom: '5px'}}
                            label='Password'
                            name='password'
                            rules={[{ required: true, message: 'Please input your password!' }]}
                        >
                            <Input.Password autoComplete='new-password'/>
                        </Form.Item>
                        <Button type='link' onClick={onForgot} style={{paddingLeft: 0, color: '#748d8b'}} className='mb-5'>
                            Forgot Password?
                        </Button>
                        
                        {errMessage && (<Form.Item<FieldType>>
                            <Tag bordered={false} color='warning'>
                                {errMessage}
                            </Tag>
                        </Form.Item>)}

                        <Form.Item wrapperCol={{ offset: 0, span: 24 }} className='flex align-middle'>
                            <Button type='primary' htmlType='submit' className='mr-2' loading={loading}>
                                Sign In
                            </Button>
                            <span>Haven’t signed in?</span>
                            <Button type='link' href='/signup' style={{ color: 'rgb(255, 145, 77)' }}>
                                Create an account NOW!
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
                <div className='lg:w-1/2 w-full mt-8 lg:mt-0'>
                    <Image src={signin} alt='signin' className='w-full h-full'></Image>
                </div>
            </div>
        </div>
    );
}
