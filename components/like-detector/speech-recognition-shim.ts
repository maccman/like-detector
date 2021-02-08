if (typeof window != 'undefined' && !window['SpeechRecognition']) {
  window['SpeechRecognition'] = window['webkitSpeechRecognition']
  window['SpeechGrammarList'] = window['webkitSpeechGrammarList']
}

export {}