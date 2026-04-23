import React, { useRef, useState, useEffect } from 'react'
import LoginForm from './components/LoginForm'
import IntroScreen from './components/IntroScreen'
import introVideo from './assets/intro.mp4'
import ambientAudio from './assets/ambient.mp3'

const TRIGGER_TIME = 5.0

export default function App() {
  const videoRef = useRef(null)
  const audioRef = useRef(null)
  const hasTriggered = useRef(false)
  const fadeRefs = useRef([])

  const [started, setStarted] = useState(false)
  const [loginVisible, setLoginVisible] = useState(false)
  const [videoBlurred, setVideoBlurred] = useState(false)

  const fadeVolume = (el, from, to, durationMs) => {
    const steps = 60
    const interval = durationMs / steps
    const delta = (to - from) / steps
    let current = from
    let step = 0
    const timer = setInterval(() => {
      current += delta
      step++
      el.volume = Math.min(Math.max(current, 0), 1)
      if (step >= steps) clearInterval(timer)
    }, interval)
    fadeRefs.current.push(timer)
    return timer
  }

  const clearAllFades = () => {
    fadeRefs.current.forEach(t => clearInterval(t))
    fadeRefs.current = []
  }

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    video.load()
  }, [])

  const handleEnter = () => {
    setStarted(true)
    const video = videoRef.current
    const audio = audioRef.current

    if (video) {
      video.muted = false
      video.volume = 0
      video.play()
      fadeVolume(video, 0, 0.75, 800)
      setTimeout(() => fadeVolume(video, 0.75, 0.0, 4200), 800)
    }

    if (audio) {
      audio.volume = 0
      audio.play().catch(() => {})
      fadeVolume(audio, 0, 0.04, 800)
      setTimeout(() => fadeVolume(audio, 0.04, 0.28, 4000), 800)
    }
  }

  const handleTimeUpdate = () => {
    if (hasTriggered.current) return
    const currentTime = videoRef.current?.currentTime ?? 0
    if (currentTime >= TRIGGER_TIME) {
      hasTriggered.current = true
      triggerLoginSequence()
    }
  }

  const triggerLoginSequence = () => {
    clearAllFades()
    const video = videoRef.current
    const audio = audioRef.current
    if (video) fadeVolume(video, video.volume, 0, 300)
    if (audio) fadeVolume(audio, audio.volume, 0.88, 400)
    setLoginVisible(true)
    setTimeout(() => setVideoBlurred(true), 200)
  }

  return (
    <div className="scene">
      <video
        ref={videoRef}
        className={`bg-video ${videoBlurred ? 'blurred' : ''}`}
        src={introVideo}
        playsInline
        preload="auto"
        onTimeUpdate={handleTimeUpdate}
      />
      <audio
        ref={audioRef}
        src={ambientAudio}
        loop
        preload="auto"
      />
      <div className="scene-overlay" />
      <LoginForm visible={loginVisible} />
      {!started && <IntroScreen onEnter={handleEnter} />}
    </div>
  )
}
