
export interface Trigger {
  id: string
  words: string[]
  label: string
}

export interface TriggerCount {
  [id: string]: number
}

export const TRIGGERS:Trigger[] = [
  {
    id: 'like',
    words: ['like', 'lake'],
    label: 'Like',
  },
  {
    id: 'whatever',
    words: ['whatever'],
    label: 'Whatever',
  },
  {
    id: 'youknow',
    words: ['you know'],
    label: 'You know...',
  },
]

export type Stage = 'intro' | 'listening' | 'word'