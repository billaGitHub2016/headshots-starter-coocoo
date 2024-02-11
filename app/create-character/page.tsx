'use client'
import UploadForm from './components/upload-form'
import AiProgress from './components/ai-progress'
import PickCharacter from './components/pick-character'
import StoryReady from './components/story-ready'
import { useSearchParams } from 'next/navigation'

export default function Index() {
  const searchParams = useSearchParams()
  const step = searchParams.get('step')

  if (step === '1') {
    return <AiProgress></AiProgress>
  } else if (step === '2') {
    return <PickCharacter></PickCharacter>
  } else if (step === '3') {
    return <StoryReady></StoryReady>
  }
  return <UploadForm/>
}