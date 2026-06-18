/** أنماط A4 المشتركة — تُعدَّل هنا لينعكس التغيير على كل قوالب PDF */
export function getA4BaseStyles() {
  return `
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Segoe UI', 'Cairo', 'Tajawal', system-ui, sans-serif;
      color: #0f172a;
      font-size: 11px;
      line-height: 1.5;
      background: #e8ecf1;
    }
    @page { size: A4 portrait; margin: 12mm 14mm; }
    .a4-page {
      width: 210mm;
      min-height: 297mm;
      margin: 0 auto;
      padding: 14mm 16mm 18mm;
      background: #fff;
      box-shadow: 0 4px 24px rgba(15, 23, 42, 0.12);
    }
    .preview-toolbar {
      position: sticky;
      top: 0;
      z-index: 10;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      padding: 10px 16px;
      background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
      color: #f8fafc;
      font-size: 13px;
    }
    .preview-toolbar__badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 4px 10px;
      border-radius: 999px;
      background: rgba(251, 191, 36, 0.2);
      color: #fde68a;
      font-size: 11px;
      font-weight: 600;
    }
    .preview-toolbar__actions { display: flex; gap: 8px; }
    .preview-toolbar__btn {
      padding: 6px 14px;
      border: none;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      font-family: inherit;
    }
    .preview-toolbar__btn--primary {
      background: #b8860b;
      color: #fff;
    }
    .preview-toolbar__btn--ghost {
      background: rgba(255,255,255,0.12);
      color: #f8fafc;
    }
    .doc-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 16px;
      padding-bottom: 14px;
      margin-bottom: 16px;
      border-bottom: 3px solid #b8860b;
    }
    .doc-header__brand strong {
      display: block;
      font-size: 22px;
      font-weight: 800;
      color: #0f172a;
      letter-spacing: -0.02em;
    }
    .doc-header__brand span {
      font-size: 11px;
      color: #64748b;
    }
    .doc-header__company-meta {
      text-align: end;
      font-size: 10px;
      color: #64748b;
      line-height: 1.6;
    }
    .doc-title {
      font-size: 16px;
      font-weight: 700;
      color: #0f172a;
      margin-bottom: 12px;
    }
    .doc-meta {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 10px;
      margin-bottom: 18px;
      padding: 12px 14px;
      border-radius: 8px;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
    }
    .doc-meta__item span {
      display: block;
      font-size: 9px;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      margin-bottom: 2px;
    }
    .doc-meta__item strong {
      font-size: 12px;
      color: #0f172a;
    }
    .doc-meta__item--accent strong { color: #b8860b; }
    .data-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 16px;
      font-size: 10px;
    }
    .data-table th,
    .data-table td {
      border: 1px solid #cbd5e1;
      padding: 7px 9px;
      text-align: start;
    }
    .data-table th {
      background: linear-gradient(180deg, #f1f5f9 0%, #e2e8f0 100%);
      font-weight: 700;
      color: #334155;
      font-size: 9px;
      white-space: nowrap;
    }
    .data-table tbody tr:nth-child(even) { background: #fafbfc; }
    .data-table tfoot td {
      font-weight: 700;
      background: #fffbeb;
      border-top: 2px solid #b8860b;
    }
    .data-table .num { text-align: end; font-variant-numeric: tabular-nums; }
    .section-title {
      font-size: 12px;
      font-weight: 700;
      color: #334155;
      margin: 18px 0 10px;
      padding-inline-start: 8px;
      border-inline-start: 3px solid #b8860b;
    }
    .kpi-row {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 8px;
      margin-top: 14px;
    }
    .kpi-box {
      padding: 10px;
      border-radius: 6px;
      border: 1px solid #e2e8f0;
      background: #f8fafc;
      text-align: center;
    }
    .kpi-box span { display: block; font-size: 9px; color: #64748b; }
    .kpi-box strong { font-size: 13px; color: #0f172a; }
    .kpi-box--gold {
      border-color: rgba(184, 134, 11, 0.35);
      background: rgba(184, 134, 11, 0.08);
    }
    .kpi-box--gold strong { color: #b8860b; }
    .doc-party-card {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 10px;
      margin-bottom: 14px;
      padding: 12px 14px;
      border-radius: 8px;
      border: 1px solid #e2e8f0;
      background: #f8fafc;
    }
    .doc-party-card__item span {
      display: block;
      font-size: 9px;
      color: #64748b;
      margin-bottom: 2px;
    }
    .doc-party-card__item strong {
      font-size: 11px;
      color: #0f172a;
      line-height: 1.35;
    }
    .doc-financial {
      margin-bottom: 18px;
      padding: 12px 14px;
      border-radius: 8px;
      border: 1px solid rgba(184, 134, 11, 0.28);
      background: rgba(184, 134, 11, 0.06);
    }
    .doc-financial__title {
      font-size: 11px;
      font-weight: 700;
      color: #92400e;
      margin-bottom: 10px;
    }
    .doc-financial__grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 8px;
    }
    .doc-financial__item {
      padding: 8px 10px;
      border-radius: 6px;
      background: #fff;
      border: 1px solid rgba(184, 134, 11, 0.15);
    }
    .doc-financial__item span {
      display: block;
      font-size: 8px;
      color: #64748b;
      margin-bottom: 2px;
    }
    .doc-financial__item strong {
      font-size: 11px;
      color: #0f172a;
    }
    .doc-financial__item--accent {
      border-color: rgba(184, 134, 11, 0.4);
      background: rgba(184, 134, 11, 0.1);
    }
    .doc-financial__item--accent strong { color: #b8860b; }
    .doc-footer {
      margin-top: 20px;
      padding-top: 10px;
      border-top: 1px dashed #cbd5e1;
      font-size: 9px;
      color: #94a3b8;
      display: flex;
      justify-content: space-between;
    }
    @media print {
      body { background: #fff; }
      .preview-toolbar { display: none !important; }
      .a4-page {
        width: auto;
        min-height: auto;
        margin: 0;
        padding: 0;
        box-shadow: none;
      }
    }
  `
}

export function getExcelPreviewStyles() {
  return `
    * { box-sizing: border-box; }
    body {
      font-family: 'Segoe UI', 'Cairo', 'Tajawal', system-ui, sans-serif;
      margin: 0;
      padding: 16px;
      background: #e8ecf1;
      color: #0f172a;
    }
    .preview-toolbar {
      position: sticky;
      top: 0;
      z-index: 10;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      padding: 10px 16px;
      margin: -16px -16px 16px;
      background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
      color: #f8fafc;
      font-size: 13px;
    }
    .preview-toolbar__badge {
      padding: 4px 10px;
      border-radius: 999px;
      background: rgba(52, 211, 153, 0.2);
      color: #6ee7b7;
      font-size: 11px;
      font-weight: 600;
    }
    .excel-wrap {
      overflow-x: auto;
      background: #fff;
      border-radius: 8px;
      box-shadow: 0 2px 12px rgba(15,23,42,0.1);
      padding: 4px;
    }
    table { border-collapse: collapse; width: 100%; font-size: 12px; }
    td, th {
      border: 1px solid #d1d5db;
      padding: 6px 10px;
      text-align: start;
      white-space: nowrap;
    }
    tr:first-child td, tr:first-child th {
      background: #059669;
      color: #fff;
      font-weight: 700;
    }
    tr:nth-child(2) td { background: #f0fdf4; font-weight: 600; }
    @media print { .preview-toolbar { display: none; } body { background: #fff; } }
  `
}
