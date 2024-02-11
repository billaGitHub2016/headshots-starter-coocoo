'use client';

import { Form, Input, Button, Tag, Checkbox, message } from 'antd';
import { createClient } from '@supabase/supabase-js';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

type FieldType = {
    email?: string;
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
        console.log('reset send email success:', values);
        setErrMessage('');
        setLoading(true);
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        // console.log('supabaseUrl = ', supabaseUrl)
        const supabaseServiceRoleKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
        const hostName = process.env.NEXT_PUBLIC_PASSWORD_REDIRECT_URL;
        const supabase = createClient(supabaseUrl as string, supabaseServiceRoleKey as string);
        debugger
        // console.log('redirect url = ', `http://${hostName}/reset-password`);
        supabase.auth.resetPasswordForEmail(values.email, {
            // redirectTo: 'https://example.com/update-password',
            redirectTo: `http://${hostName}/reset-password`
        })
            .then(res => {
                const { data, error } = res;
                if (error) {
                    console.log('error = ', error);
                    setErrMessage(error.message);
                    return;
                }
                console.log('data = ', data);
                message.success('Send email success');

                setTimeout(() => {
                    router.replace('/signin')
                }, 1500)
            }).finally(() => {
                setLoading(false);
            });
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };
    return (
        <div className='flex flex-col items-center w-1/2'>
            <div className='flex flex-row items-center p-8 pt-0 max-w-6xl w-full'>
                <div className='flex flex-col space-y-4 lg:w-1/2 w-full'>
                    <div className='flex align-middle'>
                        <h2 className='text-2xl font-bold'>Reset your password</h2>
                    </div>

                    <Form
                        name='basic'
                        labelCol={{ span: 24 }}
                        wrapperCol={{ span: 24 }}
                        style={{ maxWidth: 600 }}
                        initialValues={{ remember: true }}
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        autoComplete='off'
                        layout='vertical'
                        requiredMark={customizeRequiredMark}
                    >
                        <Form.Item<FieldType>
                            label="Enter your user account's verified email address and we will send you a password reset link."
                            name='email'
                            rules={[{ required: true, message: 'Please input your email!' }, { type: 'email', message: 'The input is not valid E-mail!' }]}
                        >
                            <Input />
                        </Form.Item>
                        
                        {errMessage && (<Form.Item<FieldType>>
                            <Tag bordered={false} color='warning'>
                                {errMessage}
                            </Tag>
                        </Form.Item>)}

                        <Form.Item wrapperCol={{ offset: 6, span: 24 }} className='flex align-middle'>
                            <Button type='primary' htmlType='submit' className='mr-2'loading={loading} >
                                Send password reset email
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
                <div className='lg:w-1/2 w-full mt-8 lg:mt-0'>
                    {/* <Image src={signin} alt='signin' className='w-full h-full'></Image> */}
                </div>
            </div>
        </div>
    );
}
