import React, { useEffect, useMemo, useState } from 'react'
import sleep from './sleep'
import { Transition } from '@headlessui/react'
import './speech-recognition-shim'
import { Microphone } from 'heroicons-react'
import { Trigger, Stage, TriggerCount, TRIGGERS } from './types'

export const LikeDetector:React.FC = () => {
  const [currentTrigger, setCurrentTrigger] = useState<Trigger>(null)
  const [stage, setStage] = useState<Stage>('intro')

  const clientSide = typeof window != 'undefined'
  const speechAvailable = typeof window != 'undefined' && !!window['SpeechRecognition']

  const triggerCount = useMemo<TriggerCount>(() => ({}), [])

  const parseCommand = async (command: string) => {
    console.log('Parsing:', command)

    for (const trigger of TRIGGERS) {
      for (const word of trigger.words) {
        if (command.includes(word)) {
          await activateTrigger(trigger)
          return
        }
      }
    }
  }

  const activateTrigger = async (trigger: Trigger) => {
    if (stage != 'listening') return

    console.log('Activating trigger', trigger)

    triggerCount[trigger.id] = triggerCount[trigger.id] || 0
    triggerCount[trigger.id] += 1

    setCurrentTrigger(trigger)
    setStage('word')

    await sleep(3000)
    setStage('listening')
  }

  const onResult = (event: SpeechRecognitionEvent) => {
    const speechRecognitionResult = event.results[event.resultIndex]

    const results:string[] = []

    for (let k = 0; k < speechRecognitionResult.length; k++) {
      results[k] = speechRecognitionResult[k].transcript.toLowerCase()
    }

    for (const result of results) {
      parseCommand(result)
    }
  }

  const recognition = useMemo(() => {
    if ( !speechAvailable ) return

    const recognition = new SpeechRecognition()
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = 'en-US'
    recognition.maxAlternatives = 3
    // onError

    return recognition
  }, [])

  const autoRestart = async () => {
    await sleep(3000)
    console.log('autorestart')
    recognition.start()
  }

  if (recognition) {
    recognition.onresult = onResult
    recognition.onerror = console.error
    recognition.onend = autoRestart
  }

  useEffect(() => {
    if ( !recognition ) return

    (async () => {
      setStage('intro')
      await sleep(3000)
      recognition.start()
      setStage('listening')
    })()

    return () => {
      recognition.stop()
    }
  }, [])

  if ( !speechAvailable && clientSide ) {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <h3 className="text-3xl font-bold">Speech API not available :(</h3>
        <h4 className="text-3xl font-bold mt-3">Try in Google Chrome</h4>
      </div>
    )
  }

  console.log('Stage', stage)

  const count = currentTrigger ? triggerCount[currentTrigger?.id] : 0

  return <>
    <Transition
      show={stage === 'intro'}
      enter="transition-opacity duration-100"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="transition-opacity duration-100"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <h1 className="text-8xl font-bold animate-bounce-in">&quot;Like&quot; Detector</h1>
      </div>
    </Transition>

    <Transition
      show={stage === 'word'}
      enter="transition-opacity duration-100"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="transition-opacity duration-100"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-red-500">
        <h2 className="text-9xl text-white font-bold animate-bounce-in">
          {currentTrigger?.label}

          {
            count > 1 &&
              <span className="text-3xl ml-5 inline-block align-top">({count})</span>
          }
        </h2>
      </div>
    </Transition>

    <Transition
      show={stage === 'listening'}
      enter="transition-opacity duration-100"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="transition-opacity duration-100"
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
  </>
}