/**
 * فتح مستند HTML في نافذة جديدة عبر Blob URL (يعمل مع قيود المتصفح الحديثة).
 */
export function openExportWindow(html: string, title?: string) {
  const blob = new Blob(['\uFEFF', html], { type: 'text/html;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const printWindow = window.open(url, '_blank')

  if (!printWindow) {
    URL.revokeObjectURL(url)
    return null
  }

  const revoke = () => URL.revokeObjectURL(url)
  printWindow.addEventListener('load', () => {
    if (title) {
      try {
        printWindow.document.title = title
      } catch {
        /* نافذة منفصلة — تجاهل */
      }
    }
    window.setTimeout(revoke, 1000)
  })
  window.setTimeout(revoke, 120_000)

  return printWindow
}
