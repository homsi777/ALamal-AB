import { useId, useRef, useState, type ChangeEvent, type InputHTMLAttributes } from 'react'

type DateInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'>

export function formatIsoDateDisplay(iso: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso)
  if (!match) return ''
  const [, year, month, day] = match
  return `${day}/${month}/${year}`
}

/** Date field that always displays Western digits as DD/MM/YYYY. */
export function DateInput({
  className = '',
  value,
  defaultValue,
  onChange,
  id,
  disabled,
  ...props
}: DateInputProps) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const nativeRef = useRef<HTMLInputElement>(null)
  const isControlled = value !== undefined
  const [internalValue, setInternalValue] = useState(
    typeof defaultValue === 'string' ? defaultValue : '',
  )

  const isoValue = isControlled ? String(value ?? '') : internalValue
  const displayValue = formatIsoDateDisplay(isoValue)

  const handleNativeChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (!isControlled) {
      setInternalValue(event.target.value)
    }
    onChange?.(event)
  }

  const openPicker = () => {
    if (disabled) return
    const native = nativeRef.current
    if (!native) return
    if (typeof native.showPicker === 'function') {
      native.showPicker()
      return
    }
    native.focus()
    native.click()
  }

  return (
    <div className={`date-input ${disabled ? 'date-input--disabled' : ''} ${className}`.trim()}>
      <input
        type="text"
        id={inputId}
        readOnly
        value={displayValue}
        placeholder="DD/MM/YYYY"
        className="form-input form-input--date date-input__display"
        dir="ltr"
        lang="en"
        disabled={disabled}
        onClick={openPicker}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            openPicker()
          }
        }}
      />
      <input
        ref={nativeRef}
        type="date"
        lang="en"
        className="date-input__native"
        tabIndex={-1}
        value={isControlled ? isoValue : undefined}
        defaultValue={!isControlled && defaultValue !== undefined ? String(defaultValue) : undefined}
        onChange={handleNativeChange}
        disabled={disabled}
        aria-hidden="true"
        {...props}
      />
      <button
        type="button"
        className="date-input__trigger"
        tabIndex={-1}
        disabled={disabled}
        onClick={openPicker}
        aria-hidden="true"
      />
    </div>
  )
}
