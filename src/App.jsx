import { config } from './config'
import Navbar from './components/Navbar'
import Cover from './components/Cover'
import PaperGrain from './components/PaperGrain'
import Hero from './components/Hero'
import Countdown from './components/Countdown'
import Families from './components/Families'
import Story from './components/Story'
import PhotoBand from './components/PhotoBand'
import Details from './components/Details'
import Gallery from './components/Gallery'
import Gift from './components/Gift'
import Rsvp from './components/Rsvp'
import Footer from './components/Footer'
import MusicToggle from './components/MusicToggle'

export default function App() {
  const { sections } = config
  const band = (i) => sections.photoBands && <PhotoBand index={i} />

  return (
    <div className="min-h-screen overflow-x-hidden bg-background">
      {sections.cover && <Cover />}
      <Navbar />

      {/* Mạch kể: gặp gỡ → xa cách → tìm lại nhau → ngày vui → lời mời.
          Ảnh mở chương đã đóng vai trò ngắt nhịp, nên chỉ còn một dải ảnh
          tràn viền duy nhất, đặt ngay trước phần xác nhận tham dự. */}
      <main>
        <Hero />
        {sections.countdown && <Countdown />}
        {sections.story && <Story />}
        {sections.families && config.families && <Families />}
        <Details />
        {sections.gallery && <Gallery />}
        {band(0)}
        {sections.gift && <Gift />}
        {sections.rsvp && <Rsvp />}
      </main>

      <Footer />
      {sections.music && <MusicToggle />}
      <PaperGrain />
    </div>
  )
}
