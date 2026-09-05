import { useState } from 'react'
import { useLanguage } from '../lib/i18n'
import { config } from '../config'
import { submitRsvp } from '../lib/rsvp'
import { guestName, guestSide } from '../lib/guest'
import { useReveal } from '../hooks/useReveal'
import { RevealGroup } from './Reveal'

/* Link đích danh (?guest=…&side=trai) điền sẵn giúp khách hai ô đầu tiên */
const EMPTY_FORM = {
  name: guestName,
  phone: '',
  side: guestSide ?? 'groom',
  attending: 'yes',
  guests: '1',
  message: '',
}

/**
 * Đoạn kết. Cả trang chuyển sang nền olive sẫm và ở nguyên đó cho tới hết -
 * một cú tắt đèn duy nhất sau khi đã đi qua toàn bộ phần giấy sáng.
 *
 * Form nằm THẲNG trên nền tối, không nằm trong một cái thẻ trắng nổi lên
 * giữa nền tối như trước. Mỗi ô nhập chỉ là một nét kẻ tóc, như dòng kẻ sẵn
 * trên một tấm thiệp hồi âm; nút gửi là một nét viền mảnh chứ không phải một
 * khối màu đặc.
 */
export default function Rsvp() {
  const { t } = useLanguage()
  const ref = useReveal()
  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | sending | success | error
  const [errorText, setErrorText] = useState('')

  const set = (field) => (e) => {
    const value = e.target.value
    setForm((f) => ({ ...f, [field]: value }))
    setErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev))
  }

  const validate = () => {
    const next = {}
    if (form.name.trim().length < 2) next.name = t('rsvp.nameTooShort')
    // Số điện thoại VN: cho phép khoảng trắng, dấu chấm, gạch ngang và +84
    if (!/^\+?[\d\s.-]{9,15}$/.test(form.phone.trim())) next.phone = t('rsvp.phoneInvalid')
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    if (status === 'sending' || !validate()) return

    setStatus('sending')
    const result = await submitRsvp({
      name: form.name.trim(),
      phone: form.phone.trim(),
      side: form.side === 'bride' ? t('rsvp.sideBride') : t('rsvp.sideGroom'),
      attending: form.attending === 'yes',
      guests: form.attending === 'yes' ? Math.max(1, Number(form.guests) || 1) : 0,
      message: form.message.trim(),
    })

    if (result.ok) {
      setStatus('success')
    } else {
      const reasons = {
        'not-configured': t('rsvp.notConfigured'),
        'dev-url': t('rsvp.devUrl'),
      }
      setErrorText(reasons[result.reason] ?? t('rsvp.errorDesc'))
      setStatus('error')
    }
  }

  return (
    <section id="rsvp" data-deep className="sec-lg gutter bg-deep text-deep-foreground">
      <div ref={ref} className="reveal mx-auto max-w-xl">
        <div className="text-center">
          <span aria-hidden className="mx-auto block h-px w-10 bg-gold" />
          <h2 className="t-display mt-9 text-[clamp(2.25rem,8vw,4rem)] text-deep-foreground">
            {t('rsvp.title')}
          </h2>
          <p className="t-caption mt-6 text-deep-foreground/65">
            {t('rsvp.subtitle')(config.rsvp.deadline)}
          </p>
        </div>

        {status === 'success' ? (
          <div className="fade-up mt-20 text-center">
            <p className="t-quote text-[clamp(1.5rem,4.5vw,2.25rem)] text-deep-foreground">
              {t('rsvp.successTitle')}
            </p>
            <p className="t-caption mx-auto mt-6 max-w-sm text-pretty text-deep-foreground/60">
              {t('rsvp.successDesc')}
            </p>
            <button
              onClick={() => {
                setForm(EMPTY_FORM)
                setStatus('idle')
              }}
              className="t-eyebrow rule-link rule-on mt-10 cursor-pointer text-deep-foreground/70 transition-colors duration-500 hover:text-deep-foreground"
            >
              {t('rsvp.again')}
            </button>
          </div>
        ) : (
          <form onSubmit={onSubmit} noValidate className="mt-16 md:mt-20">
            <RevealGroup step={90} className="space-y-12">
              <Field label={t('rsvp.nameLabel')} error={errors.name} htmlFor="rsvp-name">
                <input
                  id="rsvp-name"
                  type="text"
                  value={form.name}
                  onChange={set('name')}
                  placeholder={t('rsvp.namePlaceholder')}
                  autoComplete="name"
                  className={`ink-field w-full ${errors.name ? 'ink-field--error' : ''}`}
                />
              </Field>

              <Field label={t('rsvp.phoneLabel')} error={errors.phone} htmlFor="rsvp-phone">
                <input
                  id="rsvp-phone"
                  type="tel"
                  inputMode="tel"
                  value={form.phone}
                  onChange={set('phone')}
                  placeholder={t('rsvp.phonePlaceholder')}
                  autoComplete="tel"
                  className={`ink-field w-full ${errors.phone ? 'ink-field--error' : ''}`}
                />
              </Field>

              <Field label={t('rsvp.sideLabel')}>
                <Choices
                  name="side"
                  value={form.side}
                  onChange={set('side')}
                  options={[
                    { value: 'groom', label: t('rsvp.sideGroom') },
                    { value: 'bride', label: t('rsvp.sideBride') },
                  ]}
                />
              </Field>

              <Field label={t('rsvp.attendingLabel')}>
                <Choices
                  name="attending"
                  value={form.attending}
                  onChange={set('attending')}
                  options={[
                    { value: 'yes', label: t('rsvp.accept') },
                    { value: 'no', label: t('rsvp.decline') },
                  ]}
                />
              </Field>

              {form.attending === 'yes' && (
                <div className="fade-up">
                  <Field label={t('rsvp.guestsLabel')} htmlFor="rsvp-guests">
                    <input
                      id="rsvp-guests"
                      type="number"
                      min="1"
                      max={config.rsvp.maxGuests}
                      value={form.guests}
                      onChange={set('guests')}
                      className="ink-field w-20"
                    />
                  </Field>
                </div>
              )}

              <Field label={t('rsvp.messageLabel')} htmlFor="rsvp-message">
                <textarea
                  id="rsvp-message"
                  rows={2}
                  value={form.message}
                  onChange={set('message')}
                  placeholder={t('rsvp.messagePlaceholder')}
                  className="ink-field w-full resize-none"
                />
              </Field>
            </RevealGroup>

            {status === 'error' && (
              <div className="mt-12 border-l border-[#c98b7a] pl-5">
                <p className="t-eyebrow text-[#e0a996]">{t('rsvp.errorTitle')}</p>
                <p className="t-caption mt-2 text-deep-foreground/70">{errorText}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={status === 'sending'}
              className="t-eyebrow mt-16 w-full cursor-pointer border border-deep-foreground/40 py-5 text-deep-foreground transition-colors duration-500 hover:border-deep-foreground hover:bg-deep-foreground hover:text-deep disabled:cursor-default disabled:opacity-45 md:mt-20"
            >
              {status === 'sending' ? t('rsvp.submitting') : t('rsvp.submit')}
            </button>
          </form>
        )}
      </div>
    </section>
  )
}

/**
 * Nhãn + ô nhập. Truyền `htmlFor` cho ô nhập đơn (render <label>);
 * bỏ trống khi bên trong là nhóm radio, vì <label> không được lồng nhau.
 */
function Field({ label, error, htmlFor, children }) {
  const Tag = htmlFor ? 'label' : 'div'
  return (
    <Tag className="block" {...(htmlFor ? { htmlFor } : { role: 'group', 'aria-label': label })}>
      <span className="t-eyebrow mb-4 block text-deep-foreground/60">{label}</span>
      {children}
      {error && <span className="t-caption mt-3 block text-[#e0a996]">{error}</span>}
    </Tag>
  )
}

/**
 * Lựa chọn dạng radio, vẽ lại hoàn toàn: một vòng tròn kẻ tóc, tâm đặc dần
 * khi được chọn. Ô radio thật vẫn nằm đó nhưng trong suốt và phủ kín vùng
 * bấm - nhờ vậy bàn phím, trình đọc màn hình và việc gửi form vẫn nguyên vẹn.
 */
function Choices({ name, value, onChange, options }) {
  return (
    <div className="flex flex-col gap-5 sm:flex-row sm:gap-10">
      {options.map((option) => {
        const checked = value === option.value
        return (
          <label
            key={option.value}
            className="group relative flex min-h-11 cursor-pointer items-center gap-3.5"
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={checked}
              onChange={onChange}
              /* Ô radio thật nằm trong suốt phủ kín vùng bấm. `peer` để vòng
                 tròn vẽ tay bên dưới còn sáng lên được khi đi bằng bàn phím -
                 outline mặc định sẽ tàng hình theo chính ô này. */
              className="peer absolute inset-0 h-full w-full cursor-pointer opacity-0"
            />
            <span
              aria-hidden
              className={`flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full border transition-colors duration-500 peer-focus-visible:ring-1 peer-focus-visible:ring-gold peer-focus-visible:ring-offset-4 peer-focus-visible:ring-offset-deep ${
                checked ? 'border-gold' : 'border-deep-foreground/30'
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full bg-gold transition-transform duration-500 ${
                  checked ? 'scale-100' : 'scale-0'
                }`}
              />
            </span>
            <span
              className={`font-serif text-[1.0625rem] font-light transition-colors duration-500 ${
                checked ? 'text-deep-foreground' : 'text-deep-foreground/65'
              }`}
            >
              {option.label}
            </span>
          </label>
        )
      })}
    </div>
  )
}
