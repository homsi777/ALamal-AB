import { forwardRef } from 'react'

type GlossButtonProps = {
  variant: 'receipt' | 'payment' | 'accent' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  'aria-expanded'?: boolean
  'aria-haspopup'?: boolean | 'dialog' | 'menu' | 'listbox' | 'tree' | 'grid'
}

export const GlossButton = forwardRef<HTMLButtonElement, GlossButtonProps>(function GlossButton(
  { variant, size = 'md', children, onClick, disabled, ...aria },
  ref,
) {
  const sizeClass = size === 'sm' ? 'btn--sm' : size === 'lg' ? 'btn--lg' : ''
  return (
    <button
      ref={ref}
      type="button"
      className={`btn btn--${variant} ${sizeClass}`.trim()}
      onClick={onClick}
      disabled={disabled}
      {...aria}
    >
      {children}
    </button>
  )
})
