import { useState } from 'react'
import { AlertCircle } from 'lucide-react'
import { useLanguage } from '../lib/i18n'
import { config } from '../config'
import { submitRsvp } from '../lib/rsvp'
import { guestName, guestSide } from '../lib/guest'
import { useReveal } from '../hooks/useReveal'

/* Link đích danh (?guest=…&side=trai) điền sẵn giúp khách hai ô đầu tiên */
const EMPTY_FORM = {
  name: guestName,
  phone: '',
  side: guestSide ?? 'groom',
  attending: 'yes',
  guests: '1',
  message: '',
}

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

  const inputClass = (field) =>
    `w-full rounded-none border-0 border-b-2 bg-transparent px-0 pb-2 text-lg outline-none transition-colors focus:border-primary ${
      errors[field] ? 'border-red-400' : 'border-border'
    }`

  return (
    <section id="rsvp" className="bg-deep px-6 py-24 text-deep-foreground md:py-28">
      <div ref={ref} className="reveal mx-auto max-w-2xl">
        <div className="mb-12 text-center">
          <h2 className="mb-4 font-serif text-4xl md:text-5xl">{t('rsvp.title')}</h2>
          <p className="font-serif text-lg italic text-deep-foreground/70">
            {t('rsvp.subtitle')(config.rsvp.deadline)}
          </p>
        </div>

        {status === 'success' ? (
          <div className="fade-up border border-deep-foreground/20 bg-deep-foreground/5 p-12 text-center backdrop-blur-sm">
            <h3 className="mb-4 font-serif text-2xl">{t('rsvp.successTitle')}</h3>
            <p className="text-deep-foreground/70">{t('rsvp.successDesc')}</p>
            <button
              onClick={() => {
                setForm(EMPTY_FORM)
                setStatus('idle')
              }}
              className="mt-8 cursor-pointer border border-deep-foreground px-6 py-3 text-xs uppercase tracking-widest transition-colors hover:bg-deep-foreground hover:text-deep"
            >
              {t('rsvp.again')}
            </button>
          </div>
        ) : (
          <form
            onSubmit={onSubmit}
            noValidate
            className="space-y-8 border border-border bg-background p-8 text-foreground md:p-12"
          >
            <Field label={t('rsvp.nameLabel')} error={errors.name} htmlFor="rsvp-name">
              <input
                id="rsvp-name"
                type="text"
                value={form.name}
                onChange={set('name')}
                placeholder={t('rsvp.namePlaceholder')}
                autoComplete="name"
                className={inputClass('name')}
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
                className={inputClass('phone')}
              />
            </Field>

            <Field label={t('rsvp.sideLabel')}>
              <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:gap-6">
                <Radio
                  name="side"
                  value="groom"
                  checked={form.side === 'groom'}
                  onChange={set('side')}
                  label={t('rsvp.sideGroom')}
                />
                <Radio
                  name="side"
                  value="bride"
                  checked={form.side === 'bride'}
                  onChange={set('side')}
                  label={t('rsvp.sideBride')}
                />
              </div>
            </Field>

            <Field label={t('rsvp.attendingLabel')}>
              <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:gap-6">
                <Radio
                  name="attending"
                  value="yes"
                  checked={form.attending === 'yes'}
                  onChange={set('attending')}
                  label={t('rsvp.accept')}
                />
                <Radio
                  name="attending"
                  value="no"
                  checked={form.attending === 'no'}
                  onChange={set('attending')}
                  label={t('rsvp.decline')}
                />
              </div>
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
                    className={`${inputClass('guests')} w-24`}
                  />
                </Field>
              </div>
            )}

            <Field label={t('rsvp.messageLabel')} htmlFor="rsvp-message">
              <textarea
                id="rsvp-message"
                rows={3}
                value={form.message}
                onChange={set('message')}
                placeholder={t('rsvp.messagePlaceholder')}
                className="w-full resize-none rounded-md border-2 border-border bg-transparent p-3 outline-none transition-colors focus:border-primary"
              />
            </Field>

            {status === 'error' && (
              <div className="flex items-start gap-3 rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <div>
                  <p className="font-medium">{t('rsvp.errorTitle')}</p>
                  <p>{errorText}</p>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={status === 'sending'}
              className="w-full cursor-pointer bg-deep py-4 text-sm uppercase tracking-[0.2em] text-deep-foreground transition-opacity hover:opacity-90 disabled:cursor-default disabled:opacity-60"
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
      <span className="mb-2 block text-xs uppercase tracking-widest text-muted-foreground">
        {label}
      </span>
      {children}
      {error && <span className="mt-2 block text-sm text-red-500">{error}</span>}
    </Tag>
  )
}

function Radio({ name, value, checked, onChange, label }) {
  return (
    <label className="flex cursor-pointer items-center gap-3">
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 accent-primary"
      />
      <span className="font-serif text-lg">{label}</span>
    </label>
  )
}
