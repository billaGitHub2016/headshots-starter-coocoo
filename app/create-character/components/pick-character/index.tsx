'use client';

import { Form, Input, Button, Tag, message } from 'antd';
import Image from 'next/image';
import { useState, useCallback } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import ca from '/public/ca.png';
import cb from '/public/cb.png';

type FieldType = {
    name?: string;
};

const customizeRequiredMark = (label: React.ReactNode, { required }: { required: boolean }) => (
    <>
        {required ? <></> : <></>}
        {label}
    </>
);

export default function PickCharacter() {
    const [errMessage, setErrMessage] = useState('');
    const [form] = Form.useForm();
    const [isLoading, setIsLoading] = useState(false);

    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const createQueryString = useCallback(
        (name: string, value: string, search?: string) => {
            const params = new URLSearchParams(search || searchParams.toString());
            params.set(name, value);

            return params.toString();
        },
        [searchParams]
    );

    const onSelectCharacter = (c: string) => {
      form.validateFields().then((values) => {
        message.success('submit sueccess');

        setTimeout(() => {
          console.log('校验通过 values = ', values)
          let newSearch = createQueryString('step', '3')
          newSearch = createQueryString('c', c, newSearch)
          router.push(pathname + '?' + newSearch)
        }, 1000)
      }).catch((err) => {
        console.log('校验失败 err = ', err)
      })
    }

    return (
        <div className='flex flex-col items-center'>
            <div className='mb-6 text-primary font-bold text-3xl'>
                <span>Your character is ready!</span>
            </div>
            <div className='flex flex-col lg:flex-row gap-8 p-8 pt-0 max-w-6xl w-full'>
                <div className='lg:w-2/3 w-full mt-8 lg:mt-0'>
                    <div className='mb-4 text-black text-sm leading-5 w-full'>
                    <ul className='grid grid-cols-2 gap-5'>
                      <li className='flex flex-col justify-center items-center'>
                        <div className='relative h-52'>
                          <span className='absolute text-black text-sm font-bold left-1 top-1'>A</span>
                          <Image src={ca} alt='character' className='w-52 h-52'></Image>
                        </div>
                        <Button type='primary' onClick={onSelectCharacter.bind(null, 'A')}>I like Character A!</Button>
                      </li>
                      <li className='flex flex-col justify-center items-center'>
                        <div className='relative h-52'>
                          <span className='absolute text-black text-sm font-bold left-1 top-1'>B</span>
                          <Image src={cb} alt='character' className='w-52 h-52'></Image>
                        </div>
                        <Button type='primary' onClick={onSelectCharacter.bind(null, 'B')}>I like Character B!</Button>
                      </li>
                    </ul>
                    </div>
                </div>
                <div className='flex flex-col space-y-4 lg:w-1/3 w-full'>
                    <Form
                        form={form}
                        name='upload'
                        labelCol={{ span: 24 }}
                        wrapperCol={{ span: 24 }}
                        style={{ maxWidth: 600 }}
                        initialValues={{ remember: true }}
                        autoComplete='off'
                        layout='vertical'
                        requiredMark={customizeRequiredMark}
                    >
                        <Form.Item<FieldType>
                            label='Give your character a name (limit: 10 letters)'
                            name='name'
                            rules={[{ required: true, message: 'Please input character name!' }, { type: 'string', max: 10, message: 'Character name must be less than 10 characters!'}]}
                        >
                            <Input placeholder='Daisy' />
                        </Form.Item>

                        {errMessage && (
                            <Form.Item<FieldType>>
                                <Tag bordered={false} color='warning'>
                                    {errMessage}
                                </Tag>
                            </Form.Item>
                        )}
                    </Form>
                </div>
            </div>
        </div>
    );
}
