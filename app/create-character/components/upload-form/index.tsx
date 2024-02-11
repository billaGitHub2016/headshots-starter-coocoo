'use client';

import { Form, Input, Button, Tag, Checkbox, message, Upload, Space } from 'antd';
import type { GetProp, UploadFile, UploadProps } from 'antd';
import { UploadChangeParam } from 'antd/lib/upload/interface';
import ImgCrop from 'antd-img-crop';
import Image from 'next/image';
import Link from 'next/link';
import { User, createClient } from '@supabase/supabase-js';
import { useMemo, useState, useCallback } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import cookies from 'js-cookie';
import bat from '/public/bat.png';

type FieldType = {
    files?: string[];
    prompt?: string;
    finetune?: boolean;
};
type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];
interface FileItem {
    uid: string;
    filename: string;
    status?: string;
    thumbUrl?: string;
    url?: string;
    lastModifiedTime?: string;
}

const customizeRequiredMark = (label: React.ReactNode, { required }: { required: boolean }) => (
    <>
        {required ? <></> : <></>}
        {label}
    </>
);

function upload2Item(uploadFile: UploadFile): FileItem {
    return {
        uid: uploadFile.uid,
        filename: uploadFile.name,
        status: uploadFile.status,

        // 这里对应到 onSuccess 的回调参数
        url: uploadFile.response,
        thumbUrl: uploadFile.response,
        lastModifiedTime: uploadFile.lastModifiedDate?.toUTCString(),
    };
}

export default function Index() {
    const [errMessage, setErrMessage] = useState('');
    const [form] = Form.useForm();
    const [isLoading, setIsLoading] = useState(false);

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceRoleKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const supabase = useMemo(() => {
        return createClient(supabaseUrl as string, supabaseServiceRoleKey as string);
    }, [supabaseUrl, supabaseServiceRoleKey]);

    const accessToken = cookies.get('access_token');
    let user: User | null = null;
    if (accessToken) {
        supabase.auth.getUser(accessToken).then(res => {
            user = res.data.user;
        });
    }

    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const createQueryString = useCallback(
        (name: string, value: string, search?: string) => {
            const params = new URLSearchParams(searchParams.toString() || search);
            params.set(name, value);

            return params.toString();
        },
        [searchParams]
    );

    const onFinish = async (values: any) => {
        setErrMessage('');
        setIsLoading(true);
        const { data, error } = await supabase.from('image_upload_logs').insert([
            {
                user_id: user?.id,
                images: values.files.map((item: any) => item.url),
                prompt: values.prompt,
                finetune: values.finetune,
            },
        ]);
        setIsLoading(false);

        if (error) {
            console.log('submit err = ', error);
            setErrMessage(`submit failed : ${error.message}`);
            return
        } else {
            message.success('submit success');
        }

        setTimeout(() => {
          let newSearch = createQueryString('step', '1')
          newSearch = createQueryString('images', values.files.map((item: any) => item.url), newSearch)
          router.push(pathname + '?' + newSearch);
        }, 1500)
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    const normFile = (e: any) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e?.fileList;
    };

    const onPreview = async (file: UploadFile) => {
        let src = file.url as string;
        if (!src) {
            src = await new Promise(resolve => {
                const reader = new FileReader();
                reader.readAsDataURL(file.originFileObj as FileType);
                reader.onload = () => resolve(reader.result as string);
            });
        }
        const image = document.createElement('img');
        image.src = src;
        const imgWindow = window.open(src);
        imgWindow?.document.write(image.outerHTML);
    };

    const onFileUpload = async (option: any) => {
        const { file, onSuccess, onError } = option;

        console.log('onFileUpload = ', file);
        const { data, error } = await supabase.storage
            .from('images')
            .upload(`public/${new Date().getTime()}_${file.name}`, file);
        if (error) {
            message.error('upload fail, please try again later');
            console.log('upload error = ', error);
            onError(error);
            return '';
        }
        console.log('upload data = ', data);

        const urlData = supabase.storage.from('images').getPublicUrl(data.path);
        console.log('publicUrl data = ', urlData);

        // onSuccess的回调参数可以在 UploadFile.response 中获取
        onSuccess(urlData?.data.publicUrl);
    };

    const handleUploadChange = (info: UploadChangeParam) => {
        form.setFieldValue('files', info.fileList.map(upload2Item));
    };

    const onReset = () => {
        form.resetFields();
    };

    return (
        <div className='flex flex-col items-center'>
            <div className='mb-4 text-gray-500'>
                <span>
                    The quality of your drawing greatly affects the outcome of AI-generated
                    character.
                </span>
                <br />
                <span>
                    Please kindly read the instructions below to ensure a good-quality drawing is
                    uploaded.
                </span>
            </div>
            <div className='flex flex-col lg:flex-row items-center gap-8 p-8 pt-0 max-w-6xl w-full'>
                <div className='flex flex-col space-y-4 lg:w-2/3 w-full'>
                    <Form
                        form={form}
                        name='upload'
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
                            label='Upload Images'
                            valuePropName='files'
                            name='files'
                            getValueFromEvent={normFile}
                            rules={[{ required: true, message: 'Please upload your images!' }]}
                        >
                            <ImgCrop rotationSlider aspect={4/3}>
                                <Upload
                                    customRequest={onFileUpload}
                                    listType='picture-card'
                                    onPreview={onPreview}
                                    onChange={handleUploadChange}
                                >
                                    {'Click or drag file to upload'}
                                </Upload>
                            </ImgCrop>
                        </Form.Item>

                        <Form.Item<FieldType>
                            label='Prompt'
                            name='prompt'
                            rules={[{ required: true, message: 'Please input your prompt!' }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item<FieldType> name='finetune' valuePropName='checked'>
                            <Checkbox>Finetune</Checkbox>
                        </Form.Item>

                        {errMessage && (
                            <Form.Item<FieldType>>
                                <Tag bordered={false} color='warning'>
                                    {errMessage}
                                </Tag>
                            </Form.Item>
                        )}

                        <Form.Item wrapperCol={{ offset: 0, span: 16 }}>
                            <Space>
                                <Button htmlType='button' onClick={onReset}>
                                    Reset
                                </Button>
                                <Button type='primary' htmlType='submit' loading={isLoading}>
                                    Submit
                                </Button>
                            </Space>
                        </Form.Item>
                    </Form>
                </div>
                <div className='lg:w-1/3 w-full mt-8 lg:mt-0'>
                    <div className='mb-4 text-black text-sm leading-5 w-full'>
                        <p className='font-bold'>Instructions:</p>
                        <ul>
                            <li>1. Draw your character on a plain, white paper.</li>
                            <li>2. Better to use thick & black pen for drawing</li>
                            <li>3. XXXX.</li>
                        </ul>
                        <div className='mt-3'>
                            <p className='text-gray-400'>✅Good examples:</p>
                            <div className='flex align-middle'>
                                <Image src={bat} alt='hero' className='w-28 h-28 mr-3'></Image>
                                <Image src={bat} alt='hero' className='w-28 h-28 mr-3'></Image>
                                <Image src={bat} alt='hero' className='w-28 h-28 mr-3'></Image>
                            </div>
                            <p className='text-gray-400'>❌Bad examples:</p>
                            <div className='flex align-middle'>
                                <Image src={bat} alt='hero' className='w-28 h-28 mr-3'></Image>
                                <Image src={bat} alt='hero' className='w-28 h-28 mr-3'></Image>
                                <Image src={bat} alt='hero' className='w-28 h-28 mr-3'></Image>
                            </div>
                        </div>
                    </div>
                    {/* <NextImage src={hero1} alt='hero' className='w-40 h-40'></NextImage> */}
                    {/* <Image src={bat} alt='hero' className='w-40 h-40'></Image>
                    <Image src={hero3} alt='hero' className='w-40 h-40'></Image>
                    <Image src={hero4} alt='hero' className='w-40 h-40'></Image>
                    <Image src={hero5} alt='hero' className='w-40 h-40'></Image>
                    <Image src={hero6} alt='hero' className='w-40 h-40'></Image> */}
                </div>
            </div>
        </div>
    );
}
