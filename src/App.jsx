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

/**
 * Nhịp của cả tấm thiệp. Đây là quyết định thiết kế quan trọng nhất của file
 * này - thứ tự và độ cao của các phần, chứ không phải nội dung từng phần:
 *
 *   BÌA        nghi thức     tối, kín màn hình
 *   MỞ ĐẦU     cao trào      ảnh kín màn hình, chữ đặt vào khoảng trời trống
 *   ĐẾM NGƯỢC  nghỉ          rất thấp, rất thoáng
 *   CHUYỆN     thân mật      cao nhất trang, trang đôi lệch trục
 *   ẢNH        lật trang     lại kín màn hình, không một chữ nào ngoài câu đề
 *   GIA ĐÌNH   trang trọng   đối xứng tuyệt đối, nền giấy da bò
 *   NGÀY CƯỚI  đồ hoạ        chữ số cỡ lớn, rồi tới chương trình và địa điểm
 *   ALBUM      phóng khoáng  dải ảnh tràn ra hai mép màn hình
 *   MỪNG CƯỚI  nhỏ tiếng     thấp nhất trang, gần như chỉ một dòng chữ
 *   XÁC NHẬN   đoạn kết      tắt đèn: nền olive sẫm cho tới hết trang
 *
 * Nền các phần đổi qua lại giấy ngà ↔ giấy da bò, và hai lần bị cắt hẳn bằng
 * một bức ảnh kín màn hình. Không phần nào cao bằng phần nào.
 */
export default function App() {
  const { sections } = config

  return (
    <div className="min-h-screen overflow-x-hidden bg-background">
      {sections.cover && <Cover />}
      <Navbar />

      <main>
        <Hero />
        {sections.countdown && <Countdown />}
        {sections.story && <Story />}
        {sections.photoBands && <PhotoBand index={0} />}
        {sections.families && config.families && <Families />}
        <Details />
        {sections.gallery && <Gallery />}
        {sections.gift && <Gift />}
        {sections.rsvp && <Rsvp />}
      </main>

      <Footer />
      {sections.music && <MusicToggle />}
      <PaperGrain />
    </div>
  )
}
