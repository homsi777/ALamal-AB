export function sanitizeExportFileName(value: string) {
  return value.replace(/[^\w\u0600-\u06FF-]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')
}
