import { useEffect, useRef, useState } from 'react'
import type { Lang } from '../../i18n/types'
import { useLanguage } from '../../i18n'
import './VoiceSearchButton.scss'

interface RecognitionAlternative {
  transcript: string
}

interface RecognitionResult {
  readonly length: number
  [index: number]: RecognitionAlternative
}

interface RecognitionResultEvent {
  readonly resultIndex: number
  readonly results: {
    readonly length: number
    [index: number]: RecognitionResult
  }
}

interface SpeechRecognitionLike {
  lang: string
  interimResults: boolean
  maxAlternatives: number
  onresult: ((event: RecognitionResultEvent) => void) | null
  onerror: ((event: { error: string }) => void) | null
  onend: (() => void) | null
  start: () => void
  stop: () => void
  abort: () => void
}

type SpeechRecognitionConstructor = new () => SpeechRecognitionLike

function getSpeechRecognitionConstructor() {
  const speechWindow = window as Window & {
    SpeechRecognition?: SpeechRecognitionConstructor
    webkitSpeechRecognition?: SpeechRecognitionConstructor
  }
  return speechWindow.SpeechRecognition ?? speechWindow.webkitSpeechRecognition
}

function VoiceSearchButton({
  lang,
  onTranscript,
}: {
  lang: Lang
  onTranscript: (transcript: string) => void
}) {
  const { t } = useLanguage()
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null)
  const [listening, setListening] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(
    () => () => {
      recognitionRef.current?.abort()
    },
    [],
  )

  const toggleListening = () => {
    if (listening) {
      recognitionRef.current?.stop()
      return
    }

    const Recognition = getSpeechRecognitionConstructor()
    if (!Recognition) {
      setMessage(t.voiceSearch.unsupported)
      return
    }

    setMessage('')
    const recognition = new Recognition()
    recognitionRef.current = recognition
    recognition.lang = lang === 'np' ? 'ne-NP' : 'en-US'
    recognition.interimResults = false
    recognition.maxAlternatives = 1
    recognition.onresult = (event) => {
      const transcript = event.results[event.resultIndex]?.[0]?.transcript.trim()
      if (transcript) {
        onTranscript(transcript)
      }
    }
    recognition.onerror = ({ error }) => {
      if (error === 'not-allowed' || error === 'service-not-allowed') {
        setMessage(t.voiceSearch.permissionDenied)
      } else if (error === 'no-speech') {
        setMessage(t.voiceSearch.noSpeech)
      } else if (error !== 'aborted') {
        setMessage(t.voiceSearch.error)
      }
    }
    recognition.onend = () => {
      setListening(false)
      if (recognitionRef.current === recognition) recognitionRef.current = null
    }

    try {
      recognition.start()
      setListening(true)
    } catch {
      recognitionRef.current = null
      setListening(false)
      setMessage(t.voiceSearch.error)
    }
  }

  return (
    <div className="voice-search">
      <button
        className={`voice-search__button${listening ? ' voice-search__button--listening' : ''}`}
        type="button"
        aria-label={listening ? t.voiceSearch.stop : t.voiceSearch.start}
        aria-pressed={listening}
        title={listening ? t.voiceSearch.stop : t.voiceSearch.start}
        onClick={toggleListening}
      >
        <span className="material-symbols-outlined" aria-hidden="true">
          {listening ? 'graphic_eq' : 'mic'}
        </span>
      </button>
      <span className="voice-search__announcement" role="status" aria-live="polite">
        {message || (listening ? t.voiceSearch.listening : '')}
      </span>
    </div>
  )
}

export default VoiceSearchButton
