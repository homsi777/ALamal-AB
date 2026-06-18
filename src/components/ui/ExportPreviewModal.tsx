import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

type ExportPreviewModalProps = {
  html: string
  title: string
  onClose: () => void
  printLabel: string
  closeLabel: string
}

export function ExportPreviewModal({
  html,
  title,
  onClose,
  printLabel,
  closeLabel,
}: ExportPreviewModalProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [onClose])

  function handlePrint() {
    const frameWindow = iframeRef.current?.contentWindow
    if (!frameWindow) return
    frameWindow.focus()
    frameWindow.print()
  }

  return createPortal(
    <div className="export-preview" role="presentation">
      <button
        type="button"
        className="export-preview__backdrop"
        aria-label={closeLabel}
        onClick={onClose}
      />
      <div className="export-preview__panel" role="dialog" aria-label={title}>
        <header className="export-preview__header">
          <div className="export-preview__header-text">
            <strong>{title}</strong>
          </div>
          <div className="export-preview__actions">
            <button type="button" className="export-preview__btn export-preview__btn--ghost" onClick={onClose}>
              {closeLabel}
            </button>
            <button type="button" className="export-preview__btn export-preview__btn--primary" onClick={handlePrint}>
              🖨 {printLabel}
            </button>
          </div>
        </header>
        <iframe
          ref={iframeRef}
          className="export-preview__frame"
          srcDoc={html}
          title={title}
          sandbox="allow-same-origin allow-scripts allow-modals"
        />
      </div>
    </div>,
    document.body,
  )
}
