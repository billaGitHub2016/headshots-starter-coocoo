'use client';

import { Form, Input, Button, Tag, Checkbox, message } from 'antd';
import Image from 'next/image';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
import { useState } from 'react';
import cookies from 'js-cookie';
import su1 from '/public/su1.png';
import su2 from '/public/su2.png';
import su3 from '/public/su3.png';
import su4 from '/public/su4.png';
import su5 from '/public/su5.png';
import su6 from '/public/su6.png';
import { useRouter } from 'next/navigation'

type FieldType = {
    email?: string;
    password?: string;
    confirmPassword?: string;
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
            .signUp({
                email: values.email,
                password: values.password,
                options: {
                    data: {
                        inviteCode: values.inviteCode,
                    },
                    // emailRedirectTo: 'http://localhost:3000/home'
                },
            })
            .then(res => {
                const { data, error } = res;
                if (error) {
                    console.log('error = ', error);
                    setErrMessage(error.message);
                }
                if (data && data.user && data.session) {
                    console.log('data = ', data);
                    message.success('Sign up success');

                    cookies.set('access_token', data.session.access_token, { expires: new Date(data.session.expires_at as number * 1000) });
                    cookies.set('refresh_token', data.session.refresh_token);

                    setTimeout(() => {
                        window.location.href = '/home';
                    }, 1500)
                }
            }).finally(() => {
              setLoading(false);
            });
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };
    return (
        <div className='flex flex-col items-center'>
            <div className='flex flex-col lg:flex-row items-center gap-8 p-8 pt-0 max-w-6xl w-full'>
                <div className='flex flex-col space-y-4 lg:w-1/2 w-full'>
                    <div className='flex align-middle'>
                        <h2 className='text-2xl font-bold'>Sign Up</h2>
                        <h2 className='text-2xl font-bold text-primary'>
                            - Start Creating Characters
                        </h2>
                    </div>

                    <div className='mt-4 text-gray-500'>
                        <span>Already a member? </span>
                        <Button type='link' href='/login' style={{ color: 'hsl(var(--primary))' }}>
                            Sign In
                        </Button>
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
                            label='Password'
                            name='password'
                            rules={[{ required: true, message: 'Please input your password!' }, { type: 'string', min: 6, message: 'The password length cannot be less than 6'}]}
                        >
                            <Input.Password />
                        </Form.Item>

                        <Form.Item<FieldType>
                            label='Confirm Password'
                            name='confirmPassword'
                            dependencies={['password']}
                            rules={[{ required: true, message: 'Please input your password again!' }, ({ getFieldValue }) => ({
                              validator(_, value) {
                                if (!value || getFieldValue('password') === value) {
                                  return Promise.resolve();
                                }
                                return Promise.reject(new Error('The new password that you entered do not match!'));
                              },
                            })]}
                        >
                            <Input.Password />
                        </Form.Item>

                        <Form.Item<FieldType>
                            name='inviteCode'
                            label='Invitation Code'
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item<FieldType>>
                            <div>
                                <span>
                                    By signing up, you agree to our{' '}
                                    <Link href='/' className='underline'>
                                        Terms of Service
                                    </Link>{' '}
                                    and{' '}
                                    <Link href='/' className='underline'>
                                        Privacy Policy
                                    </Link>
                                    .
                                </span>
                            </div>
                        </Form.Item>

                        <Form.Item<FieldType> name='remember' valuePropName='checked'>
                            <Checkbox>You can email me about product updates</Checkbox>
                        </Form.Item>
                        
                        <Form.Item<FieldType>>
                          {errMessage && (
                              <Tag bordered={false} color='warning'>
                                  {errMessage}
                              </Tag>
                          )}
                        </Form.Item>

                        <Form.Item wrapperCol={{ offset: 2, span: 16 }}>
                            <Button type='primary' htmlType='submit' loading={loading}>
                                Start Creating Characters
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
                <div className='lg:w-1/2 w-full mt-8 lg:mt-0 grid lg:grid-cols-3 lg:gap-6 md:grid-cols-3 grid-cols-2 gap-6'>
                    <Image src={su1} alt='hero' className='w-40 h-40'></Image>
                    <Image src={su2} alt='hero' className='w-40 h-40'></Image>
                    <Image src={su3} alt='hero' className='w-40 h-40'></Image>
                    <Image src={su4} alt='hero' className='w-40 h-40'></Image>
                    <Image src={su5} alt='hero' className='w-40 h-40'></Image>
                    <Image src={su6} alt='hero' className='w-40 h-40'></Image>
                </div>
            </div>
        </div>
    );
}
