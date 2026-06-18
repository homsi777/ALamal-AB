import { useState } from 'react'
import { PageHeader } from '../../components/ui/PageHeader'
import { GlossButton } from '../../components/ui/GlossButton'
import { useApp } from '../../context/AppProvider'

type PartyFormPageProps = {
  type: 'customer' | 'supplier'
}

export function PartyFormPage({ type }: PartyFormPageProps) {
  const { t } = useApp()
  const prefix = type === 'customer' ? 'parties.customersForm' : 'parties.suppliersForm'
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [city, setCity] = useState('')
  const [address, setAddress] = useState('')
  const [creditLimit, setCreditLimit] = useState('')
  const [notes, setNotes] = useState('')

  return (
    <>
      <PageHeader
        title={t(`${prefix}.title`)}
        subtitle={t(`${prefix}.subtitle`)}
        actions={
          <>
            <GlossButton variant="ghost">{t(`${prefix}.saveDraft`)}</GlossButton>
            <GlossButton variant="accent">{t(`${prefix}.save`)}</GlossButton>
          </>
        }
      />

      <div className="invoice-form">
        <div className="card invoice-form__meta">
          <div className="invoice-form__meta-head">
            <span className="invoice-form__badge">{type === 'customer' ? '👤' : '🏭'}</span>
            <div>
              <div className="invoice-form__status">{t(`${prefix}.statusNew`)}</div>
              <div className="invoice-form__hint">{t(`${prefix}.hint`)}</div>
            </div>
          </div>

          <div className="invoice-form__grid">
            <label className="form-field">
              <span className="form-field__label form-field__label--required">{t('parties.form.name')}</span>
              <input
                type="text"
                className="form-input"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder={t('parties.form.namePlaceholder')}
              />
            </label>

            <label className="form-field">
              <span className="form-field__label form-field__label--required">{t('common.phone')}</span>
              <input
                type="tel"
                className="form-input"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                placeholder={t('parties.form.phonePlaceholder')}
              />
            </label>

            <label className="form-field">
              <span className="form-field__label">{t('parties.form.city')}</span>
              <input
                type="text"
                className="form-input"
                value={city}
                onChange={(event) => setCity(event.target.value)}
                placeholder={t('parties.form.cityPlaceholder')}
              />
            </label>

            <label className="form-field">
              <span className="form-field__label">{t('common.address')}</span>
              <input
                type="text"
                className="form-input"
                value={address}
                onChange={(event) => setAddress(event.target.value)}
                placeholder={t('parties.form.addressPlaceholder')}
              />
            </label>

            <label className="form-field">
              <span className="form-field__label">{t('parties.form.creditLimit')}</span>
              <input
                type="number"
                min="0"
                className="form-input"
                value={creditLimit}
                onChange={(event) => setCreditLimit(event.target.value)}
                placeholder={t('parties.form.creditLimitPlaceholder')}
              />
            </label>

            <label className="form-field">
              <span className="form-field__label">{t('parties.form.currency')}</span>
              <select className="form-input" defaultValue="usd">
                <option value="usd">{t('invoices.form.currencyUsd')}</option>
                <option value="syp">{t('invoices.form.currencySyp')}</option>
                <option value="egp">{t('invoices.form.currencyEgp')}</option>
              </select>
            </label>

            <label className="form-field form-field--wide">
              <span className="form-field__label">{t('invoices.form.notes')}</span>
              <input
                type="text"
                className="form-input"
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                placeholder={t('parties.form.notesPlaceholder')}
              />
            </label>
          </div>
        </div>
      </div>
    </>
  )
}
