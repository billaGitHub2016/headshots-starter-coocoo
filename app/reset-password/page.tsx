'use client';

import { Form, Input, Button, Tag, message } from 'antd';
import { createClient } from '@supabase/supabase-js';
import { useState } from 'react';
import cookies from 'js-cookie';
import signin from '/public/signin.jpeg';
import { useRouter } from 'next/navigation'

type FieldType = {
    password?: string;
    confirmPassword?: string;
};

const customizeRequiredMark = (label: React.ReactNode, { required }: { required: boolean }) => (
    <>
        {required ? <></> : <></>}
        {label}
    </>
);

export default function Index() {
    const [errMessage, setErrMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const onFinish = (values: any) => {
        console.log('reset password success:', values);
        setErrMessage('');
        setLoading(true);
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseServiceRoleKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
        const supabase = createClient(supabaseUrl as string, supabaseServiceRoleKey as string);
        supabase.auth.updateUser({
          password: values.password
        })
            .then(res => {
                const { data, error } = res;
                if (error) {
                    console.log('error = ', error);
                    setErrMessage(error.message);
                    return;
                }
                console.log('data = ', data);
                message.success('Reset password success');

                setTimeout(() => {
                    router.replace('/signin');
                }, 1500)
            }).finally(() => {
              setLoading(false);
            });
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };
    return (
        <div className='flex flex-col items-center'>
            <div className='flex flex-col items-center p-8 pt-0 max-w-6xl w-full'>
                <div className='flex flex-col space-y-4 w-full'>
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
                            label='Password'
                            name='password'
                            rules={[{ required: true, message: 'Please input your password!' }, { type: 'string', min: 6, message: 'Password must be at least 6 characters long'}]}
                        >
                            <Input />
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
                        
                        {errMessage && (<Form.Item<FieldType>>
                            <Tag bordered={false} color='warning'>
                                {errMessage}
                            </Tag>
                        </Form.Item>)}

                        <Form.Item wrapperCol={{ offset: 6, span: 24 }} className='flex align-middle mt-6'>
                            <Button type='primary' htmlType='submit' className='mr-2' loading={loading}>
                                Submit
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
