export type PartyStatus = 'active' | 'inactive'
export type PartyType = 'customer' | 'supplier'

export type PartyRecord = {
  id: string
  type: PartyType
  nameAr: string
  nameEn: string
  phone: string
  cityAr: string
  cityEn: string
  addressAr: string
  addressEn: string
  balance: number
  currency: 'usd' | 'syp' | 'egp'
  creditLimit: number
  status: PartyStatus
  lastActivity: string
  invoiceCount: number
  notesAr?: string
  notesEn?: string
}

export type StatementEntryType = 'opening' | 'invoice' | 'receipt' | 'payment'

export type StatementEntry = {
  id: string
  partyId: string
  date: string
  type: StatementEntryType
  ref: string
  debit: number
  credit: number
  balance: number
  noteAr: string
  noteEn: string
}

export type CustomerReconciliation = {
  partyId: string
  date: string
  invoicesTotal: number
  receiptsTotal: number
  paymentsTotal: number
  closingBalance: number
}

export type CustomerVoucherType = 'receipt' | 'payment'

export type CustomerVoucher = {
  id: string
  partyId: string
  type: CustomerVoucherType
  ref: string
  date: string
  amount: number
  /** الفاتورة المرتبطة عند البيع — لعرض السند تحتها في كشف الحساب */
  invoiceNo?: string
  noteAr: string
  noteEn: string
}

export type CustomerStatementLine = {
  id: string
  partyId: string
  goodsTypeAr: string
  goodsTypeEn: string
  pieces: number
  totalLength: number
  unitAr: string
  unitEn: string
  unitPrice: number
  lineTotal: number
  invoiceNo: string
  date: string
  notesAr: string
  notesEn: string
}

export type SupplierReconciliation = CustomerReconciliation

export const customers: PartyRecord[] = [
  {
    id: 'CUS-001',
    type: 'customer',
    nameAr: 'محل الأناقة',
    nameEn: 'Al-Anaqa Store',
    phone: '0933 111 222',
    cityAr: 'دمشق',
    cityEn: 'Damascus',
    addressAr: 'المزة — شارع الجلاء',
    addressEn: 'Al-Mazzah — Al-Jalaa St.',
    balance: 3200,
    currency: 'usd',
    creditLimit: 10000,
    status: 'active',
    lastActivity: '2026-06-17',
    invoiceCount: 24,
  },
  {
    id: 'CUS-002',
    type: 'customer',
    nameAr: 'خياطة الرافدين',
    nameEn: 'Al-Rafidain Tailoring',
    phone: '0955 333 444',
    cityAr: 'حلب',
    cityEn: 'Aleppo',
    addressAr: 'العزيزية — سوق الأقمشة',
    addressEn: 'Al-Aziziyah — Fabric market',
    balance: 1850,
    currency: 'usd',
    creditLimit: 5000,
    status: 'active',
    lastActivity: '2026-06-16',
    invoiceCount: 18,
  },
  {
    id: 'CUS-003',
    type: 'customer',
    nameAr: 'مؤسسة النور',
    nameEn: 'Al-Noor Co.',
    phone: '0944 555 666',
    cityAr: 'دمشق',
    cityEn: 'Damascus',
    addressAr: 'أبو رمانة',
    addressEn: 'Abu Rummaneh',
    balance: 5400,
    currency: 'usd',
    creditLimit: 15000,
    status: 'active',
    lastActivity: '2026-06-16',
    invoiceCount: 31,
  },
  {
    id: 'CUS-004',
    type: 'customer',
    nameAr: 'بوتيك ليلى',
    nameEn: 'Layla Boutique',
    phone: '0966 777 888',
    cityAr: 'حمص',
    cityEn: 'Homs',
    addressAr: 'الوعر — شارع الحمراء',
    addressEn: 'Al-Waer — Al-Hamra St.',
    balance: 0,
    currency: 'usd',
    creditLimit: 3000,
    status: 'inactive',
    lastActivity: '2026-05-28',
    invoiceCount: 9,
  },
]

export const suppliers: PartyRecord[] = [
  {
    id: 'SUP-001',
    type: 'supplier',
    nameAr: 'Guangzhou Textile Co.',
    nameEn: 'Guangzhou Textile Co.',
    phone: '+86 20 8888 0001',
    cityAr: 'قوانغتشو',
    cityEn: 'Guangzhou',
    addressAr: 'الصين — منطقة الأقمشة',
    addressEn: 'China — Textile district',
    balance: -8500,
    currency: 'usd',
    creditLimit: 50000,
    status: 'active',
    lastActivity: '2026-06-15',
    invoiceCount: 12,
  },
  {
    id: 'SUP-002',
    type: 'supplier',
    nameAr: 'Shaoxing Fabrics Ltd.',
    nameEn: 'Shaoxing Fabrics Ltd.',
    phone: '+86 575 8888 0002',
    cityAr: 'شاوكسينغ',
    cityEn: 'Shaoxing',
    addressAr: 'الصين — حي الأقمشة',
    addressEn: 'China — Fabric zone',
    balance: -3200,
    currency: 'usd',
    creditLimit: 30000,
    status: 'active',
    lastActivity: '2026-06-14',
    invoiceCount: 8,
  },
  {
    id: 'SUP-003',
    type: 'supplier',
    nameAr: 'مصنع الأقمشة السوري',
    nameEn: 'Syrian Fabrics Factory',
    phone: '011 222 3333',
    cityAr: 'دمشق',
    cityEn: 'Damascus',
    addressAr: 'الصناعة — المنطقة الحرة',
    addressEn: 'Industrial zone',
    balance: -1200,
    currency: 'syp',
    creditLimit: 20000000,
    status: 'active',
    lastActivity: '2026-06-10',
    invoiceCount: 5,
  },
]

export const customerReconciliations: CustomerReconciliation[] = [
  {
    partyId: 'CUS-001',
    date: '2026-06-14',
    invoicesTotal: 73500,
    receiptsTotal: 800,
    paymentsTotal: 250,
    closingBalance: 3200,
  },
  {
    partyId: 'CUS-002',
    date: '2026-06-16',
    invoicesTotal: 58240,
    receiptsTotal: 900,
    paymentsTotal: 0,
    closingBalance: 1850,
  },
  {
    partyId: 'CUS-003',
    date: '2026-06-10',
    invoicesTotal: 80575,
    receiptsTotal: 0,
    paymentsTotal: 1500,
    closingBalance: 5400,
  },
  {
    partyId: 'CUS-004',
    date: '2026-05-28',
    invoicesTotal: 12400,
    receiptsTotal: 12400,
    paymentsTotal: 0,
    closingBalance: 0,
  },
]

export const customerVouchers: CustomerVoucher[] = [
  {
    id: 'CV-001',
    partyId: 'CUS-001',
    type: 'receipt',
    ref: 'REC-088',
    date: '2026-06-14',
    amount: 800,
    invoiceNo: 'SINV-1042',
    noteAr: 'تحصيل نقدي — مطابقة كشف',
    noteEn: 'Cash collection — statement reconciliation',
  },
  {
    id: 'CV-002',
    partyId: 'CUS-001',
    type: 'payment',
    ref: 'RET-031',
    date: '2026-06-11',
    amount: 250,
    invoiceNo: 'SINV-1035',
    noteAr: 'SINV-1035',
    noteEn: 'SINV-1035',
  },
  {
    id: 'CV-005',
    partyId: 'CUS-001',
    type: 'receipt',
    ref: 'REC-075',
    date: '2026-06-06',
    amount: 12000,
    invoiceNo: 'SINV-1030',
    noteAr: 'تحصيل جزئي',
    noteEn: 'Partial collection',
  },
  {
    id: 'CV-006',
    partyId: 'CUS-001',
    type: 'payment',
    ref: 'RET-018',
    date: '2026-06-04',
    amount: 1200,
    invoiceNo: 'SINV-1028',
    noteAr: 'SINV-1028',
    noteEn: 'SINV-1028',
  },
  {
    id: 'CV-007',
    partyId: 'CUS-001',
    type: 'receipt',
    ref: 'REC-081',
    date: '2026-06-13',
    amount: 25000,
    invoiceNo: 'SINV-1038',
    noteAr: 'تحصيل آجل',
    noteEn: 'Deferred collection',
  },
  {
    id: 'CV-003',
    partyId: 'CUS-002',
    type: 'receipt',
    ref: 'REC-092',
    date: '2026-06-16',
    amount: 900,
    invoiceNo: 'SINV-1041',
    noteAr: 'سند قبض — تحصيل آجل',
    noteEn: 'Receipt voucher — credit collection',
  },
  {
    id: 'CV-004',
    partyId: 'CUS-003',
    type: 'payment',
    ref: 'RET-028',
    date: '2026-06-09',
    amount: 1500,
    invoiceNo: 'SINV-1040',
    noteAr: 'SINV-1040',
    noteEn: 'SINV-1040',
  },
]

export const customerStatements: CustomerStatementLine[] = [
  {
    id: 'CSL-001',
    partyId: 'CUS-001',
    goodsTypeAr: 'كتان F12 — أبيض',
    goodsTypeEn: 'Linen F12 — White',
    pieces: 10,
    totalLength: 4200,
    unitAr: 'يارد',
    unitEn: 'yard',
    unitPrice: 12.5,
    lineTotal: 52500,
    invoiceNo: 'SINV-1035',
    date: '2026-06-10',
    notesAr: 'تفنيد من المستودع — حاوية CN-2026-A1',
    notesEn: 'Warehouse detailing — container CN-2026-A1',
  },
  {
    id: 'CSL-002',
    partyId: 'CUS-001',
    goodsTypeAr: 'كتان F12 — بيج',
    goodsTypeEn: 'Linen F12 — Beige',
    pieces: 4,
    totalLength: 1680,
    unitAr: 'يارد',
    unitEn: 'yard',
    unitPrice: 12.5,
    lineTotal: 21000,
    invoiceNo: 'SINV-1035',
    date: '2026-06-10',
    notesAr: 'نفس الفاتورة — لون ثانٍ',
    notesEn: 'Same invoice — second color',
  },
  {
    id: 'CSL-003',
    partyId: 'CUS-001',
    goodsTypeAr: 'قطن مصري — أبيض',
    goodsTypeEn: 'Egyptian cotton — White',
    pieces: 6,
    totalLength: 2410,
    unitAr: 'يارد',
    unitEn: 'yard',
    unitPrice: 11,
    lineTotal: 26510,
    invoiceNo: 'SINV-1042',
    date: '2026-06-17',
    notesAr: 'فاتورة بيع جديدة',
    notesEn: 'New sales invoice',
  },
  {
    id: 'CSL-003a',
    partyId: 'CUS-001',
    goodsTypeAr: 'كتان F12 — رمادي',
    goodsTypeEn: 'Linen F12 — Grey',
    pieces: 8,
    totalLength: 3200,
    unitAr: 'يارد',
    unitEn: 'yard',
    unitPrice: 12.5,
    lineTotal: 40000,
    invoiceNo: 'SINV-1026',
    date: '2026-06-02',
    notesAr: 'طلبية افتتاحية — الفترة',
    notesEn: 'Opening period order',
  },
  {
    id: 'CSL-003b',
    partyId: 'CUS-001',
    goodsTypeAr: 'شيفون — أبيض',
    goodsTypeEn: 'Chiffon — White',
    pieces: 5,
    totalLength: 1900,
    unitAr: 'يارد',
    unitEn: 'yard',
    unitPrice: 9.5,
    lineTotal: 18050,
    invoiceNo: 'SINV-1027',
    date: '2026-06-03',
    notesAr: 'بيع نقدي',
    notesEn: 'Cash sale',
  },
  {
    id: 'CSL-003c',
    partyId: 'CUS-001',
    goodsTypeAr: 'حرير طبيعي — كريمي',
    goodsTypeEn: 'Natural silk — Cream',
    pieces: 3,
    totalLength: 870,
    unitAr: 'يارد',
    unitEn: 'yard',
    unitPrice: 28,
    lineTotal: 24360,
    invoiceNo: 'SINV-1028',
    date: '2026-06-04',
    notesAr: 'صنف فاخر',
    notesEn: 'Premium item',
  },
  {
    id: 'CSL-003d',
    partyId: 'CUS-001',
    goodsTypeAr: 'كتان F12 — أزرق',
    goodsTypeEn: 'Linen F12 — Blue',
    pieces: 7,
    totalLength: 2940,
    unitAr: 'يارد',
    unitEn: 'yard',
    unitPrice: 12.5,
    lineTotal: 36750,
    invoiceNo: 'SINV-1029',
    date: '2026-06-05',
    notesAr: 'توريد فرع دمشق',
    notesEn: 'Damascus branch delivery',
  },
  {
    id: 'CSL-003e',
    partyId: 'CUS-001',
    goodsTypeAr: 'قطن مصري — بيج',
    goodsTypeEn: 'Egyptian cotton — Beige',
    pieces: 9,
    totalLength: 3780,
    unitAr: 'يارد',
    unitEn: 'yard',
    unitPrice: 11,
    lineTotal: 41580,
    invoiceNo: 'SINV-1030',
    date: '2026-06-06',
    notesAr: 'فاتورة آجلة',
    notesEn: 'Credit invoice',
  },
  {
    id: 'CSL-003f',
    partyId: 'CUS-001',
    goodsTypeAr: 'شيفون — ذهبي',
    goodsTypeEn: 'Chiffon — Gold',
    pieces: 4,
    totalLength: 1520,
    unitAr: 'يارد',
    unitEn: 'yard',
    unitPrice: 9.5,
    lineTotal: 14440,
    invoiceNo: 'SINV-1031',
    date: '2026-06-07',
    notesAr: 'مناسبة موسمية',
    notesEn: 'Seasonal order',
  },
  {
    id: 'CSL-003g',
    partyId: 'CUS-001',
    goodsTypeAr: 'كتان F12 — أخضر',
    goodsTypeEn: 'Linen F12 — Green',
    pieces: 6,
    totalLength: 2520,
    unitAr: 'يارد',
    unitEn: 'yard',
    unitPrice: 12.5,
    lineTotal: 31500,
    invoiceNo: 'SINV-1033',
    date: '2026-06-09',
    notesAr: 'تفنيد سريع',
    notesEn: 'Express detailing',
  },
  {
    id: 'CSL-003h',
    partyId: 'CUS-001',
    goodsTypeAr: 'قطن مصري — أبيض',
    goodsTypeEn: 'Egyptian cotton — White',
    pieces: 5,
    totalLength: 2100,
    unitAr: 'يارد',
    unitEn: 'yard',
    unitPrice: 11,
    lineTotal: 23100,
    invoiceNo: 'SINV-1036',
    date: '2026-06-11',
    notesAr: 'فاتورة صباحية',
    notesEn: 'Morning invoice',
  },
  {
    id: 'CSL-003i',
    partyId: 'CUS-001',
    goodsTypeAr: 'حرير طبيعي — وردي',
    goodsTypeEn: 'Natural silk — Pink',
    pieces: 2,
    totalLength: 560,
    unitAr: 'يارد',
    unitEn: 'yard',
    unitPrice: 28,
    lineTotal: 15680,
    invoiceNo: 'SINV-1037',
    date: '2026-06-11',
    notesAr: 'فاتورة مسائية — نفس اليوم',
    notesEn: 'Evening invoice — same day',
  },
  {
    id: 'CSL-003j',
    partyId: 'CUS-001',
    goodsTypeAr: 'كتان F12 — أسود',
    goodsTypeEn: 'Linen F12 — Black',
    pieces: 11,
    totalLength: 4620,
    unitAr: 'يارد',
    unitEn: 'yard',
    unitPrice: 12.5,
    lineTotal: 57750,
    invoiceNo: 'SINV-1038',
    date: '2026-06-13',
    notesAr: 'طلبية كبيرة',
    notesEn: 'Large order',
  },
  {
    id: 'CSL-004',
    partyId: 'CUS-002',
    goodsTypeAr: 'كتان F12 — أبيض',
    goodsTypeEn: 'Linen F12 — White',
    pieces: 8,
    totalLength: 3360,
    unitAr: 'يارد',
    unitEn: 'yard',
    unitPrice: 12.5,
    lineTotal: 42000,
    invoiceNo: 'SINV-1041',
    date: '2026-06-12',
    notesAr: 'بيع آجل — فرع حلب',
    notesEn: 'Credit sale — Aleppo branch',
  },
  {
    id: 'CSL-005',
    partyId: 'CUS-002',
    goodsTypeAr: 'حرير طبيعي — ذهبي',
    goodsTypeEn: 'Natural silk — Gold',
    pieces: 2,
    totalLength: 580,
    unitAr: 'يارد',
    unitEn: 'yard',
    unitPrice: 28,
    lineTotal: 16240,
    invoiceNo: 'SINV-1041',
    date: '2026-06-12',
    notesAr: 'صنف خاص — كمية محدودة',
    notesEn: 'Special item — limited quantity',
  },
  {
    id: 'CSL-006',
    partyId: 'CUS-003',
    goodsTypeAr: 'كتان F12 — أبيض',
    goodsTypeEn: 'Linen F12 — White',
    pieces: 12,
    totalLength: 5040,
    unitAr: 'يارد',
    unitEn: 'yard',
    unitPrice: 12.5,
    lineTotal: 63000,
    invoiceNo: 'SINV-1040',
    date: '2026-06-08',
    notesAr: 'طلبية كبيرة — تسليم على دفعتين',
    notesEn: 'Large order — split delivery',
  },
  {
    id: 'CSL-007',
    partyId: 'CUS-003',
    goodsTypeAr: 'شيفون — وردي',
    goodsTypeEn: 'Chiffon — Pink',
    pieces: 5,
    totalLength: 1850,
    unitAr: 'يارد',
    unitEn: 'yard',
    unitPrice: 9.5,
    lineTotal: 17575,
    invoiceNo: 'SINV-1040',
    date: '2026-06-08',
    notesAr: 'نفس الفاتورة',
    notesEn: 'Same invoice',
  },
]

export const supplierReconciliations: SupplierReconciliation[] = [
  {
    partyId: 'SUP-001',
    date: '2026-06-14',
    invoicesTotal: 6200,
    receiptsTotal: 0,
    paymentsTotal: 2700,
    closingBalance: -8500,
  },
  {
    partyId: 'SUP-002',
    date: '2026-06-12',
    invoicesTotal: 3200,
    receiptsTotal: 0,
    paymentsTotal: 1000,
    closingBalance: -3200,
  },
  {
    partyId: 'SUP-003',
    date: '2026-06-10',
    invoicesTotal: 1200,
    receiptsTotal: 0,
    paymentsTotal: 0,
    closingBalance: -1200,
  },
]

export const supplierStatementLines: CustomerStatementLine[] = [
  {
    id: 'SSL-001',
    partyId: 'SUP-001',
    goodsTypeAr: 'كتان F12 — أبيض',
    goodsTypeEn: 'Linen F12 — White',
    pieces: 12,
    totalLength: 5040,
    unitAr: 'يارد',
    unitEn: 'yard',
    unitPrice: 9.8,
    lineTotal: 49392,
    invoiceNo: 'PINV-880',
    date: '2026-06-08',
    notesAr: 'فاتورة شراء — حاوية CN-2026-A1',
    notesEn: 'Purchase invoice — container CN-2026-A1',
  },
  {
    id: 'SSL-002',
    partyId: 'SUP-001',
    goodsTypeAr: 'كتان F12 — بيج',
    goodsTypeEn: 'Linen F12 — Beige',
    pieces: 5,
    totalLength: 2100,
    unitAr: 'يارد',
    unitEn: 'yard',
    unitPrice: 6,
    lineTotal: 12600,
    invoiceNo: 'PINV-880',
    date: '2026-06-08',
    notesAr: 'نفس فاتورة الشراء — لون ثانٍ',
    notesEn: 'Same purchase invoice — second color',
  },
  {
    id: 'SSL-003',
    partyId: 'SUP-002',
    goodsTypeAr: 'شيفون — أسود',
    goodsTypeEn: 'Chiffon — Black',
    pieces: 8,
    totalLength: 2960,
    unitAr: 'يارد',
    unitEn: 'yard',
    unitPrice: 7.5,
    lineTotal: 22200,
    invoiceNo: 'PINV-875',
    date: '2026-06-05',
    notesAr: 'فاتورة شراء — مورد صيني',
    notesEn: 'Purchase invoice — Chinese supplier',
  },
  {
    id: 'SSL-004',
    partyId: 'SUP-002',
    goodsTypeAr: 'حرير طبيعي — كريمي',
    goodsTypeEn: 'Natural silk — Cream',
    pieces: 2,
    totalLength: 490,
    unitAr: 'يارد',
    unitEn: 'yard',
    unitPrice: 20,
    lineTotal: 9800,
    invoiceNo: 'PINV-875',
    date: '2026-06-05',
    notesAr: 'صنف فاخر — كمية محدودة',
    notesEn: 'Premium item — limited quantity',
  },
  {
    id: 'SSL-005',
    partyId: 'SUP-003',
    goodsTypeAr: 'قطن مصري — أبيض',
    goodsTypeEn: 'Egyptian cotton — White',
    pieces: 6,
    totalLength: 2520,
    unitAr: 'يارد',
    unitEn: 'yard',
    unitPrice: 4.8,
    lineTotal: 12096,
    invoiceNo: 'PINV-870',
    date: '2026-06-10',
    notesAr: 'فاتورة شراء محلية',
    notesEn: 'Local purchase invoice',
  },
]

export const supplierVouchers: CustomerVoucher[] = [
  {
    id: 'SV-001',
    partyId: 'SUP-001',
    type: 'payment',
    ref: 'PAY-110',
    date: '2026-06-15',
    amount: 2700,
    noteAr: 'سند صرف — دفعة لمورد الصين',
    noteEn: 'Payment voucher — China supplier installment',
  },
  {
    id: 'SV-002',
    partyId: 'SUP-002',
    type: 'payment',
    ref: 'PAY-105',
    date: '2026-06-12',
    amount: 1000,
    noteAr: 'سند صرف — تحويل بنكي',
    noteEn: 'Payment voucher — bank transfer',
  },
  {
    id: 'SV-003',
    partyId: 'SUP-001',
    type: 'receipt',
    ref: 'REC-S12',
    date: '2026-06-09',
    amount: 350,
    noteAr: 'سند قبض — رد فرق جودة',
    noteEn: 'Receipt voucher — quality difference refund',
  },
]

export const supplierStatements: StatementEntry[] = [
  { id: 'ST-S1', partyId: 'SUP-001', date: '2026-06-01', type: 'opening', ref: 'OB-S1', debit: 0, credit: 0, balance: -5000, noteAr: 'رصيد افتتاحي', noteEn: 'Opening balance' },
  { id: 'ST-S2', partyId: 'SUP-001', date: '2026-06-08', type: 'invoice', ref: 'PINV-880', debit: 0, credit: 6200, balance: -11200, noteAr: 'فاتورة شراء', noteEn: 'Purchase invoice' },
  { id: 'ST-S3', partyId: 'SUP-001', date: '2026-06-15', type: 'payment', ref: 'PAY-110', debit: 2700, credit: 0, balance: -8500, noteAr: 'سند صرف', noteEn: 'Payment voucher' },
  { id: 'ST-S4', partyId: 'SUP-002', date: '2026-06-05', type: 'invoice', ref: 'PINV-875', debit: 0, credit: 3200, balance: -3200, noteAr: 'فاتورة شراء', noteEn: 'Purchase invoice' },
  { id: 'ST-S5', partyId: 'SUP-003', date: '2026-06-10', type: 'invoice', ref: 'PINV-870', debit: 0, credit: 1200, balance: -1200, noteAr: 'فاتورة شراء محلية', noteEn: 'Local purchase invoice' },
]

const currencySymbols = { usd: '$', syp: 'ل.س', egp: 'ج.م' } as const

export function formatPartyMoney(value: number, currency: PartyRecord['currency']) {
  const symbol = currencySymbols[currency]
  const formatted = Math.abs(value).toLocaleString('en-US', { useGrouping: true, maximumFractionDigits: 0 })
  if (value < 0) return `-${formatted} ${symbol}`
  return `${formatted} ${symbol}`
}

export function getPartiesByType(type: PartyType) {
  return type === 'customer' ? customers : suppliers
}

export function getStatementsByType(type: PartyType) {
  return type === 'customer' ? customerStatements : supplierStatements
}

export function getCustomerReconciliation(partyId: string) {
  return customerReconciliations.find((item) => item.partyId === partyId)
}

export function getCustomerVouchers(partyId: string) {
  return customerVouchers.filter((voucher) => voucher.partyId === partyId)
}

export function getCustomerVoucherTotals(vouchers: CustomerVoucher[]) {
  return vouchers.reduce(
    (totals, voucher) => {
      if (voucher.type === 'receipt') {
        totals.receipts += voucher.amount
      } else {
        totals.payments += voucher.amount
      }
      return totals
    },
    { receipts: 0, payments: 0 },
  )
}

export function getSupplierReconciliation(partyId: string) {
  return supplierReconciliations.find((item) => item.partyId === partyId)
}

export function getSupplierVouchers(partyId: string) {
  return supplierVouchers.filter((voucher) => voucher.partyId === partyId)
}

export function getSupplierStatementLines(partyId: string) {
  return supplierStatementLines.filter((line) => line.partyId === partyId)
}

export function getSupplierStatementTotals(lines: CustomerStatementLine[]) {
  return getCustomerStatementTotals(lines)
}

export function getPartyVoucherTotals(vouchers: CustomerVoucher[]) {
  return getCustomerVoucherTotals(vouchers)
}

export function getCustomerStatementLines(partyId: string) {
  return customerStatements.filter((line) => line.partyId === partyId)
}

export function getCustomerStatementTotals(lines: CustomerStatementLine[]) {
  return {
    pieces: lines.reduce((sum, line) => sum + line.pieces, 0),
    lengths: lines.reduce((sum, line) => sum + line.totalLength, 0),
    amount: lines.reduce((sum, line) => sum + line.lineTotal, 0),
  }
}

export function getPartyTotals(parties: PartyRecord[]) {
  const active = parties.filter((party) => party.status === 'active').length
  const totalBalance = parties.reduce((sum, party) => sum + party.balance, 0)
  const withBalance = parties.filter((party) => party.balance !== 0).length
  return { count: parties.length, active, totalBalance, withBalance }
}
