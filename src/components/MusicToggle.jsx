import { useEffect, useRef, useState } from 'react'
import { Music, Pause } from 'lucide-react'
import { useLanguage } from '../lib/i18n'
import { musicTrack } from '../lib/assets'

/**
 * Nút bật/tắt nhạc nền. Trình duyệt chặn tự phát nhạc khi chưa có tương tác,
 * nên ta thử phát ngay ở lần chạm đầu tiên của khách và im lặng bỏ qua nếu bị chặn.
 */
export default function MusicToggle() {
  const { t } = useLanguage()
  const audioRef = useRef(null)
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    if (!musicTrack) return

    const startOnFirstInteraction = () => {
      audioRef.current?.play().then(
        () => setPlaying(true),
        () => {
          /* trình duyệt vẫn chặn — khách tự bấm nút */
        },
      )
    }

    document.addEventListener('pointerdown', startOnFirstInteraction, { once: true })
    return () => document.removeEventListener('pointerdown', startOnFirstInteraction)
  }, [])

  if (!musicTrack) return null

  const toggle = () => {
    const audio = audioRef.current
    if (!audio) return
    if (audio.paused) {
      audio.play().then(
        () => setPlaying(true),
        () => setPlaying(false),
      )
    } else {
      audio.pause()
      setPlaying(false)
    }
  }

  return (
    <>
      <audio ref={audioRef} src={musicTrack} loop preload="none" />
      <button
        onClick={toggle}
        aria-label={playing ? t('music.pause') : t('music.play')}
        className="fixed bottom-5 right-5 z-40 cursor-pointer rounded-full border border-border bg-background/90 p-3 text-primary shadow-md backdrop-blur transition-colors hover:border-primary"
      >
        {playing ? <Pause className="h-5 w-5" /> : <Music className="h-5 w-5" />}
      </button>
    </>
  )
}
