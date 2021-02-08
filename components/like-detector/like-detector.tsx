import React, { useEffect, useMemo, useState } from 'react'
import { debounce } from 'lodash'
import sleep from './sleep'
import { Transition } from '@headlessui/react'
import './speech-recognition-shim'
import { Microphone } from 'heroicons-react'

interface Trigger {
  words: string[]
  label: string
}

const TRIGGERS:Trigger[] = [
  {
    words: ['like', 'lake'],
    label: 'Like',
  },
  {
    words: ['whatever'],
    label: 'Whatever',
  },
  {
    words: ['you know'],
    label: 'You know...',
  },
]

type Stage = 'intro' | 'listening' | 'word'

export const LikeDetector:React.FC = () => {
  const [currentWord, setCurrentWord] = useState<string>(null)
  const [stage, setStage] = useState<Stage>('intro')

  const speechAvailable = typeof window != 'undefined' && !!window['SpeechRecognition']

  const cleanupCurrentWord = useMemo(() => debounce(() => {
    setCurrentWord(null)
    setStage('listening')
  }, 2000), [])

  const parseCommand = (command: string) => {
    console.log('Parsing:', command)

    for (const trigger of TRIGGERS) {
      for (const word of trigger.words) {
        if (command.includes(word)) {
          setCurrentWord(trigger.label)
          setStage('word')
        }
      }
    }
  }

  const onResult = (event: SpeechRecognitionEvent) => {
    const speechRecognitionResult = event.results[event.resultIndex]

    const results:string[] = []

    for (let k = 0; k < speechRecognitionResult.length; k++) {
      results[k] = speechRecognitionResult[k].transcript
    }

    parseCommand(results.join(' ').toLowerCase())
    cleanupCurrentWord()
  }

  const recognition = useMemo(() => {
    if ( !speechAvailable ) return


    const recognition = new SpeechRecognition()
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = 'en-US'
    recognition.maxAlternatives = 1
    recognition.onresult = onResult

    return recognition
  }, [])

  useEffect(() => {
    if ( !speechAvailable ) return

    (async () => {
      setStage('intro')
      await sleep(2000)
      recognition.start()
      setStage('listening')
    })()

    return () => {
      recognition.stop()
    }
  }, [])

  if ( !speechAvailable ) {
    return <h1>Disabled</h1>
  }

  console.log('Stage', stage)

  return <>
    <Transition
      show={stage === 'intro'}
      enter="transition-opacity duration-75"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="transition-opacity duration-75"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <h1 className="text-8xl font-bold animate-bounce-in">&quot;Like&quot; Detector</h1>
      </div>
    </Transition>

    <Transition
      show={stage === 'listening'}
      enter="transition-opacity duration-75"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="transition-opacity duration-75"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-gray-300">
          <Microphone size={100} />
        </div>

        <p className="italic text-sm text-gray-300 mt-10">
          Hint, say &quot;like&quot;.
        </p>
      </div>
    </Transition>

    <Transition
      show={stage === 'word'}
      enter="transition-opacity duration-75"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="transition-opacity duration-75"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-red-500">
        <h2 className="text-9xl text-white animate-bounce-in">{currentWord}</h2>
      </div>
    </Transition>
  </>
}