import { Button } from 'antd';
import Link from "next/link";
import Image from 'next/image';
import how1 from '/public/how1.png';
import how2 from '/public/how2.png';
import how3 from '/public/how3.png';
import how4 from '/public/how4.png';
import how5 from '/public/how5.png';

export default function HowItWork() {
  return (
    <div className='flex flex-col items-center'>
      <div className='mb-7 text-black font-bold text-3xl text-center'>
          <span>How it works?</span>
      </div>

      <div className='flex flex-col items-center mb-10'>
        <p className='text-black text-xl mb-3'>1. Upload Your Drawing</p>
        <p className='text-gray-400 text-sm'>Upload 1+ high-quality drawing: drawn on plain white paper; no XXXX; .....</p>
        <Image src={how1} alt='1' className='w-52 mt-7'></Image>
      </div>

      <div className='flex flex-col items-center mb-10'>
        <p className='text-black text-xl mb-3'>2. Let the AI magic get to work & patiently wait</p>
        <p className='text-gray-400 text-sm'>The AI magic takes about ~ minutes,</p>
        <Image src={how2} alt='1' className='w-52 mt-7'></Image>
      </div>

      <div className='flex flex-col items-center mb-10'>
        <p className='text-black text-xl mb-3'>3. Get amazing characters & choose the one you like most</p>
        <p className='text-gray-400 text-sm'>Once your model is trained, we'll give you amazing characters!!</p>
        <div className='flex flex-row justify-center items-center mt-7'>
          <Image src={how3} alt='1' className='w-40'></Image>
          <Image src={how4} alt='1' className='w-40'></Image>
        </div>
      </div>

      <div className='flex flex-col items-center mb-10'>
        <p className='text-black text-xl mb-3'>4. Get the personalized story with the AI generated character.</p>
        <p className='text-gray-400 text-sm'>You will see the generated story that can be saved as a PDF file!</p>
        <Image src={how5} alt='1' className='w-80 mt-7'></Image>
      </div>

      <Link href='/create-character'>
        <Button type='primary' className='mt-7'>Start Creating Characters</Button>
      </Link>
    </div>
  )
}
