import { useRef, useState } from 'react'
import { PageHeader } from '../../components/ui/PageHeader'
import { GlossButton } from '../../components/ui/GlossButton'
import { Badge } from '../../components/ui/Badge'
import { categoryPath } from '../../data/categories'
import { useInventory } from '../../context/InventoryProvider'
import { useApp } from '../../context/AppProvider'
import {
  downloadImportTemplate,
  parseExcelImportFile,
  type ParsedImportRow,
} from '../../utils/excelImport'

export function ImportPage() {
  const { t, locale } = useApp()
  const { categories, importHistory, importRows } = useInventory()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [dragActive, setDragActive] = useState(false)
  const [fileName, setFileName] = useState<string | null>(null)
  const [parsedRows, setParsedRows] = useState<ParsedImportRow[]>([])
  const [parseError, setParseError] = useState<string | null>(null)
  const [importMessage, setImportMessage] = useState<string | null>(null)

  const validRows = parsedRows.filter((row) => row.status === 'valid')
  const errorRows = parsedRows.filter((row) => row.status === 'error')

  const statusMap = {
    success: { text: t('inventory.import.statusSuccess'), variant: 'success' as const },
    partial: { text: t('inventory.import.statusPartial'), variant: 'warning' as const },
    failed: { text: t('inventory.import.statusFailed'), variant: 'danger' as const },
  }

  const parseMessages = {
    missingGoodsType: t('inventory.import.errorMissingGoodsType'),
    missingRollCode: t('inventory.import.errorMissingRollCode'),
    missingColor: t('inventory.import.errorMissingColor'),
    missingPieces: t('inventory.import.errorMissingPieces'),
    missingLength: t('inventory.import.errorMissingLength'),
    missingUnit: t('inventory.import.errorMissingUnit'),
    invalidUnit: t('inventory.import.errorInvalidUnit'),
    invalidNumber: t('inventory.import.errorInvalidNumber'),
    unknownCategory: t('inventory.import.errorUnknownCategory'),
  }

  const processFile = async (file: File) => {
    setParseError(null)
    setImportMessage(null)

    if (!/\.(xlsx|xls)$/i.test(file.name)) {
      setParseError(t('inventory.import.errorFileType'))
      return
    }

    try {
      const buffer = await file.arrayBuffer()
      const rows = parseExcelImportFile(buffer, categories, parseMessages)
      setFileName(file.name)
      setParsedRows(rows)

      if (rows.length === 0) {
        setParseError(t('inventory.import.errorEmptyFile'))
      }
    } catch {
      setParseError(t('inventory.import.errorParseFailed'))
      setParsedRows([])
      setFileName(null)
    }
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) void processFile(file)
    event.target.value = ''
  }

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setDragActive(false)
    const file = event.dataTransfer.files?.[0]
    if (file) void processFile(file)
  }

  const handleConfirmImport = () => {
    if (!fileName || validRows.length === 0) return
    const entry = importRows(fileName, parsedRows)
    setImportMessage(
      entry.status === 'success'
        ? t('inventory.import.successMessage').replace('{count}', String(entry.validRows))
        : t('inventory.import.partialMessage')
            .replace('{valid}', String(entry.validRows))
            .replace('{errors}', String(entry.errorRows)),
    )
    setParsedRows([])
    setFileName(null)
  }

  const categoryLabel = (row: ParsedImportRow) => {
    const category = categories.find((item) => item.id === row.categoryId)
    if (category) return categoryPath(category, locale)
    if (row.goodsType && row.rollCode && row.color) {
      return [row.goodsType, row.rollCode, row.color, row.colorCode].filter(Boolean).join(' / ')
    }
    return '—'
  }

  return (
    <>
      <PageHeader
        title={t('inventory.import.title')}
        subtitle={t('inventory.import.subtitle')}
        actions={
          <>
            <GlossButton variant="ghost" onClick={() => downloadImportTemplate(locale)}>
              {t('inventory.import.downloadTemplate')}
            </GlossButton>
            <GlossButton variant="accent" onClick={() => fileInputRef.current?.click()}>
              {t('inventory.import.upload')}
            </GlossButton>
          </>
        }
      />

      <div className="import-steps" style={{ marginBottom: 'var(--space-6)' }}>
        {[
          { icon: '📄', title: t('inventory.import.step1'), desc: t('inventory.import.step1Desc') },
          { icon: '🏷️', title: t('inventory.import.step2'), desc: t('inventory.import.step2Desc') },
          { icon: '📊', title: t('inventory.import.step3'), desc: t('inventory.import.step3Desc') },
          { icon: '✅', title: t('inventory.import.step4'), desc: t('inventory.import.step4Desc') },
        ].map((item) => (
          <div key={item.title} className="import-step-card">
            <span className="import-step-card__icon">{item.icon}</span>
            <span className="import-step-card__title">{item.title}</span>
            <span className="import-step-card__desc">{item.desc}</span>
          </div>
        ))}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".xlsx,.xls"
        hidden
        onChange={handleFileChange}
      />

      <div
        className={`import-upload card ${dragActive ? 'import-upload--active' : ''}`}
        style={{ marginBottom: 'var(--space-6)' }}
        onDragOver={(event) => {
          event.preventDefault()
          setDragActive(true)
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
      >
        <div className="import-upload__icon">📊</div>
        <h2 className="import-upload__title">{t('inventory.import.dropTitle')}</h2>
        <p className="import-upload__desc">{t('inventory.import.dropDesc')}</p>
        <GlossButton variant="accent" onClick={() => fileInputRef.current?.click()}>
          {t('inventory.import.chooseFile')}
        </GlossButton>
        <p className="import-upload__hint">{t('inventory.import.formats')}</p>
        {fileName && <p className="import-upload__file">{fileName}</p>}
        {parseError && <p className="import-upload__error">{parseError}</p>}
        {importMessage && <p className="import-upload__success">{importMessage}</p>}
      </div>

      {parsedRows.length > 0 && (
        <>
          <div className="stat-grid stat-grid--3" style={{ marginBottom: 'var(--space-6)' }}>
            <div className="card card--accent-neutral">
              <div className="card__title">{t('inventory.import.previewTotal')}</div>
              <div className="card__value">{parsedRows.length}</div>
            </div>
            <div className="card card--accent-success">
              <div className="card__title">{t('inventory.import.previewValid')}</div>
              <div className="card__value">{validRows.length}</div>
            </div>
            <div className="card card--accent-warning">
              <div className="card__title">{t('inventory.import.previewErrors')}</div>
              <div className="card__value">{errorRows.length}</div>
            </div>
          </div>

          <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
            <div className="card-toolbar">
              <span className="card-toolbar__hint">{t('inventory.import.previewHint')}</span>
              <GlossButton variant="accent" onClick={handleConfirmImport} disabled={validRows.length === 0}>
                {t('inventory.import.confirmImport')}
              </GlossButton>
            </div>

            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>{t('inventory.import.colClassification')}</th>
                    <th>{t('inventory.import.colRollCode')}</th>
                    <th>{t('inventory.import.colColor')}</th>
                    <th>{t('inventory.import.colColorCode')}</th>
                    <th>{t('inventory.import.colPieces')}</th>
                    <th>{t('inventory.import.colLength')}</th>
                    <th>{t('inventory.import.colUnit')}</th>
                    <th>{t('common.status')}</th>
                    <th>{t('inventory.import.colNotes')}</th>
                  </tr>
                </thead>
                <tbody>
                  {parsedRows.map((row) => (
                    <tr key={row.rowNumber} className={row.status === 'error' ? 'import-row--error' : 'import-row--valid'}>
                      <td>{row.rowNumber}</td>
                      <td>{categoryLabel(row)}</td>
                      <td><span className="category-code">{row.rollCode}</span></td>
                      <td>{row.color}</td>
                      <td>{row.colorCode || '—'}</td>
                      <td className="data-table__number">{row.pieces}</td>
                      <td className="data-table__number">{row.totalLength}</td>
                      <td>{row.unitRaw || '—'}</td>
                      <td>
                        <Badge variant={row.status === 'valid' ? 'success' : 'danger'}>
                          {row.status === 'valid'
                            ? t('inventory.import.rowValid')
                            : t('inventory.import.rowError')}
                        </Badge>
                      </td>
                      <td className="import-row__errors">
                        {row.errors.length > 0 ? row.errors.join(' · ') : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      <div className="card">
        <h2 style={{ fontSize: 'var(--font-size-lg)', marginBottom: 'var(--space-4)' }}>
          {t('inventory.import.recent')}
        </h2>
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>{t('inventory.import.number')}</th>
                <th>{t('inventory.import.file')}</th>
                <th>{t('inventory.import.rows')}</th>
                <th>{t('inventory.import.validRows')}</th>
                <th>{t('common.status')}</th>
                <th>{t('common.date')}</th>
              </tr>
            </thead>
            <tbody>
              {importHistory.map((row) => {
                const st = statusMap[row.status]
                return (
                  <tr key={row.id}>
                    <td><span className="session-no">{row.id}</span></td>
                    <td>{row.fileName}</td>
                    <td>{row.totalRows}</td>
                    <td>{row.validRows}</td>
                    <td><Badge variant={st.variant}>{st.text}</Badge></td>
                    <td>{row.date}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
