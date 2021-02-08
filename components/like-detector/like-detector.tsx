import React, { useEffect, useState } from 'react'

const DEFAULT_WATCH_WORDS = [
  'like',
  'whatever',
  'you know'
]

const SpeechRecognition = typeof window != 'undefined' && (
  window['SpeechRecognition'] || window['webkitSpeechRecognition']
)

export const LikeDetector:React.FC = () => {
  const [watchWords, setWatchWords] = useState(DEFAULT_WATCH_WORDS)
  const [currentWord, setCurrentWord] = useState<string>(null)

  const clearupCurrentWord = () => {
    setCurrentWord(null)
  }

  const onResult = (event) => {
    let words = []

    for (let i = event.resultIndex; i < event.results.length; ++i) {
      const result = event.results[i]

      if (result[0].confidence > 0.7) {
        words = words.concat(result[0].transcript.split(' '))
      }
    }

    for (const word of words) {
      if (watchWords.includes(word)) {
        setCurrentWord(word)
        return
      }
    }
  }

  useEffect(() => {
    if ( !SpeechRecognition ) return

    const recognition = new SpeechRecognition()
    recognition.continuous = true
    recognition.interimResults = true
    recognition.onresult = onResult
    recognition.start()

    return () => recognition.stop()
  })

  if ( !SpeechRecognition ) return <h1>Disabled</h1>

  return <>
    <div className="absolute inset-0 flex flex-col items-center justify-center">
      <h1 className="text-8xl">Like Detector</h1>
    </div>
  </>
}