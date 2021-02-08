import React, { useEffect, useMemo, useState } from 'react'
import { debounce } from 'lodash'
import sleep from './sleep'

const DEFAULT_WATCH_WORDS = [
  'like',
  'whatever',
  'you know'
]



// const SpeechRecognition = typeof window != 'undefined' && (
//   window['SpeechRecognition'] || window['webkitSpeechRecognition']
// )

type Stage = 'intro' | 'mic' | 'listening' | 'word'

export const LikeDetector:React.FC = () => {
  const [watchWords, setWatchWords] = useState(DEFAULT_WATCH_WORDS)
  const [currentWord, setCurrentWord] = useState<string>(null)
  const [stage, setStage] = useState<Stage>('intro')

  const clearupCurrentWord = useMemo(() => debounce(() => {
    setCurrentWord(null)
    setStage('listening')
  }, 2000), [])

  const onResult = (event) => {
    let words = []

    for (let i = event.resultIndex; i < event.results.length; ++i) {
      const result = event.results[i]

      if (result[0].confidence > 0.7) {
        words = words.concat(result[0].transcript.split(' '))
      }
    }

    for (const word of watchWords) {
      if (words.join(' ').includes(word)) {
        setCurrentWord(word)
        setStage('word')
        return
      }
    }

    clearupCurrentWord()
  }

  const recognition = useMemo(() => {
    if ( !SpeechRecognition ) return

    const recognition = new SpeechRecognition()
    recognition.continuous = true
    recognition.interimResults = true
    recognition.onresult = onResult
    return recognition
  }, [])

  useEffect(() => {
    (async () => {
      setStage('intro')
      await sleep(1000)
      setStage('mic')
      recognition.start()
      await sleep(1000)
      setStage('listening')
    })()

    return () => {
      recognition?.stop()
    }
  }, [])

  if ( !SpeechRecognition ) return <h1>Disabled</h1>

  if (currentWord) {
    return <>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <h1 className="text-8xl text-red-500">{currentWord}</h1>
      </div>
    </>
  }

  return <>
    <div className="absolute inset-0 flex flex-col items-center justify-center">
      <h1 className="text-8xl">Like Detector {stage}</h1>
    </div>
  </>
}