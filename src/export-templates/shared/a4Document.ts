import type { ExportLocale, ExportMode } from './types'
import { getA4BaseStyles, getExcelPreviewStyles } from './a4Styles'

type WrapA4Options = {
  title: string
  locale: ExportLocale
  mode: ExportMode
  bodyHtml: string
  previewBanner?: string
  printLabel?: string
  closeLabel?: string
  /** أنماط إضافية خاصة بقالب معيّن */
  extraStyles?: string
  /** عند المعاينة داخل التطبيق — إخفاء شريط الأدوات المكرر */
  embedded?: boolean
}

export function wrapA4Document({
  title,
  locale,
  mode,
  bodyHtml,
  previewBanner = 'معاينة — بيانات تجريبية',
  printLabel = 'طباعة',
  closeLabel = 'إغلاق',
  embedded = false,
  extraStyles = '',
}: WrapA4Options) {
  const dir = locale === 'ar' ? 'rtl' : 'ltr'
  const lang = locale === 'ar' ? 'ar' : 'en'
  const isPreview = mode === 'preview'

  const toolbar = isPreview && !embedded
    ? `
    <div class="preview-toolbar">
      <span class="preview-toolbar__badge">👁 ${previewBanner}</span>
      <div class="preview-toolbar__actions">
        <button type="button" class="preview-toolbar__btn preview-toolbar__btn--ghost" onclick="window.close()">${closeLabel}</button>
        <button type="button" class="preview-toolbar__btn preview-toolbar__btn--primary" onclick="window.print()">🖨 ${printLabel}</button>
      </div>
    </div>`
  : ''

  const autoPrint = mode === 'print'
    ? `<script>window.addEventListener('load',function(){window.focus();window.print();});</script>`
    : ''

  return `<!DOCTYPE html>
<html lang="${lang}" dir="${dir}">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${title}</title>
  <style>${getA4BaseStyles()}${extraStyles}</style>
</head>
<body>
  ${toolbar}
  <div class="a4-page">${bodyHtml}</div>
  ${autoPrint}
</body>
</html>`
}

export function wrapExcelPreviewDocument({
  title,
  locale,
  bodyHtml,
  previewBanner = 'معاينة Excel — بيانات تجريبية',
  printLabel = 'طباعة',
  closeLabel = 'إغلاق',
  embedded = false,
}: Omit<WrapA4Options, 'mode' | 'bodyHtml'> & { bodyHtml: string }) {
  const dir = locale === 'ar' ? 'rtl' : 'ltr'
  const lang = locale === 'ar' ? 'ar' : 'en'

  const toolbar = embedded
    ? ''
    : `
  <div class="preview-toolbar">
    <span class="preview-toolbar__badge">📊 ${previewBanner}</span>
    <div class="preview-toolbar__actions">
      <button type="button" class="preview-toolbar__btn preview-toolbar__btn--ghost" onclick="window.close()">${closeLabel}</button>
      <button type="button" class="preview-toolbar__btn preview-toolbar__btn--primary" onclick="window.print()">🖨 ${printLabel}</button>
    </div>
  </div>`

  return `<!DOCTYPE html>
<html lang="${lang}" dir="${dir}">
<head>
  <meta charset="utf-8" />
  <title>${title}</title>
  <style>${getExcelPreviewStyles()}</style>
</head>
<body>
  ${toolbar}
  <div class="excel-wrap">${bodyHtml}</div>
</body>
</html>`
}
