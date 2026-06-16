type GlossButtonProps = {
  variant: 'receipt' | 'payment' | 'accent' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
  onClick?: () => void
  disabled?: boolean
}

export function GlossButton({ variant, size = 'md', children, onClick, disabled }: GlossButtonProps) {
  const sizeClass = size === 'sm' ? 'btn--sm' : size === 'lg' ? 'btn--lg' : ''
  return (
    <button
      type="button"
      className={`btn btn--${variant} ${sizeClass}`.trim()}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  )
}
