import { useEffect, useRef, useState } from 'react'
import { useLanguage } from '../lib/i18n'
import { musicTrack } from '../lib/assets'

/**
 * Bật/tắt nhạc nền. Trình duyệt chặn tự phát nhạc khi chưa có tương tác, nên
 * ta thử phát ngay ở lần chạm đầu tiên của khách và im lặng bỏ qua nếu bị chặn.
 *
 * Nút là hai nét kẻ dọc mảnh, không phải một cái icon nốt nhạc trong hộp tròn
 * đổ bóng - nó phải nhỏ đến mức gần như không nhìn thấy.
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
        className="fixed right-3 bottom-3 z-40 flex h-11 w-11 cursor-pointer items-center justify-center gap-[3px] text-primary"
      >
        <span
          aria-hidden
          className={`block w-px bg-current transition-all duration-500 ${playing ? 'h-3.5' : 'h-2'}`}
        />
        <span
          aria-hidden
          className={`block w-px bg-current transition-all duration-500 ${playing ? 'h-2' : 'h-3.5'}`}
        />
        <span
          aria-hidden
          className={`block w-px bg-current transition-all duration-500 ${playing ? 'h-3' : 'h-1.5'}`}
        />
      </button>
    </>
  )
}
