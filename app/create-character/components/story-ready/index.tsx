import { Button } from 'antd';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import sb from '/public/sb.png';
import sa from '/public/sa.png';

export default function StoryReady() {
  const searchParams = useSearchParams();
  const c = searchParams.get('c');
  const images = searchParams.get('images')?.split(',');
  const onReadIt = () => {
    if (Array.isArray(images)) {
      const imgWindow = window.open();
      images.forEach((src) => {
        const image = document.createElement('img');
        image.src = src;
        imgWindow?.document.write(image.outerHTML);
      })
    }
  }

  return (
    <div className='flex flex-col items-center'>
      <div className='mb-7 text-black font-bold text-3xl text-center'>
          <span>Your personalized story is ready with the character you created.</span>
      </div>

      <Image src={c === 'A' ? sa : sb} alt='character' className='w-96'></Image>
      <Button type='primary' onClick={onReadIt} className='mt-7'>Read it now!</Button>
    </div>
  )
}
