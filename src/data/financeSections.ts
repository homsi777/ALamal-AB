export type FinanceSectionId =
  | 'general-ledger'
  | 'payable'
  | 'receivable'
  | 'treasury'
  | 'fixed-assets'
  | 'budgeting'
  | 'tax'
  | 'cost'

export type FinanceModuleItem = {
  icon: string
  titleKey: string
  descKey: string
}

export type FinanceSectionConfig = {
  id: FinanceSectionId
  titleKey: string
  subtitleKey: string
  modules: FinanceModuleItem[]
}

export const FINANCE_SECTIONS: Record<FinanceSectionId, FinanceSectionConfig> = {
  'general-ledger': {
    id: 'general-ledger',
    titleKey: 'finance.sections.generalLedger.title',
    subtitleKey: 'finance.sections.generalLedger.subtitle',
    modules: [
      { icon: '📖', titleKey: 'finance.sections.generalLedger.modules.ledger.title', descKey: 'finance.sections.generalLedger.modules.ledger.desc' },
      { icon: '✍️', titleKey: 'finance.sections.generalLedger.modules.journal.title', descKey: 'finance.sections.generalLedger.modules.journal.desc' },
      { icon: '⚖️', titleKey: 'finance.sections.generalLedger.modules.trialBalance.title', descKey: 'finance.sections.generalLedger.modules.trialBalance.desc' },
      { icon: '📈', titleKey: 'finance.sections.generalLedger.modules.financialStatements.title', descKey: 'finance.sections.generalLedger.modules.financialStatements.desc' },
    ],
  },
  payable: {
    id: 'payable',
    titleKey: 'finance.sections.payable.title',
    subtitleKey: 'finance.sections.payable.subtitle',
    modules: [
      { icon: '🧾', titleKey: 'finance.sections.payable.modules.invoices.title', descKey: 'finance.sections.payable.modules.invoices.desc' },
      { icon: '💸', titleKey: 'finance.sections.payable.modules.paymentOrders.title', descKey: 'finance.sections.payable.modules.paymentOrders.desc' },
      { icon: '🔗', titleKey: 'finance.sections.payable.modules.poMatching.title', descKey: 'finance.sections.payable.modules.poMatching.desc' },
      { icon: '📅', titleKey: 'finance.sections.payable.modules.paymentSchedule.title', descKey: 'finance.sections.payable.modules.paymentSchedule.desc' },
    ],
  },
  receivable: {
    id: 'receivable',
    titleKey: 'finance.sections.receivable.title',
    subtitleKey: 'finance.sections.receivable.subtitle',
    modules: [
      { icon: '📄', titleKey: 'finance.sections.receivable.modules.invoices.title', descKey: 'finance.sections.receivable.modules.invoices.desc' },
      { icon: '💵', titleKey: 'finance.sections.receivable.modules.collections.title', descKey: 'finance.sections.receivable.modules.collections.desc' },
      { icon: '⏳', titleKey: 'finance.sections.receivable.modules.aging.title', descKey: 'finance.sections.receivable.modules.aging.desc' },
      { icon: '📋', titleKey: 'finance.sections.receivable.modules.statements.title', descKey: 'finance.sections.receivable.modules.statements.desc' },
    ],
  },
  treasury: {
    id: 'treasury',
    titleKey: 'finance.sections.treasury.title',
    subtitleKey: 'finance.sections.treasury.subtitle',
    modules: [
      { icon: '🏦', titleKey: 'finance.sections.treasury.modules.banks.title', descKey: 'finance.sections.treasury.modules.banks.desc' },
      { icon: '🔄', titleKey: 'finance.sections.treasury.modules.reconciliation.title', descKey: 'finance.sections.treasury.modules.reconciliation.desc' },
      { icon: '💧', titleKey: 'finance.sections.treasury.modules.cashFlow.title', descKey: 'finance.sections.treasury.modules.cashFlow.desc' },
      { icon: '💰', titleKey: 'finance.sections.treasury.modules.cashBoxes.title', descKey: 'finance.sections.treasury.modules.cashBoxes.desc' },
    ],
  },
  'fixed-assets': {
    id: 'fixed-assets',
    titleKey: 'finance.sections.fixedAssets.title',
    subtitleKey: 'finance.sections.fixedAssets.subtitle',
    modules: [
      { icon: '📦', titleKey: 'finance.sections.fixedAssets.modules.register.title', descKey: 'finance.sections.fixedAssets.modules.register.desc' },
      { icon: '📉', titleKey: 'finance.sections.fixedAssets.modules.depreciation.title', descKey: 'finance.sections.fixedAssets.modules.depreciation.desc' },
      { icon: '🔧', titleKey: 'finance.sections.fixedAssets.modules.maintenance.title', descKey: 'finance.sections.fixedAssets.modules.maintenance.desc' },
      { icon: '♻️', titleKey: 'finance.sections.fixedAssets.modules.disposal.title', descKey: 'finance.sections.fixedAssets.modules.disposal.desc' },
    ],
  },
  budgeting: {
    id: 'budgeting',
    titleKey: 'finance.sections.budgeting.title',
    subtitleKey: 'finance.sections.budgeting.subtitle',
    modules: [
      { icon: '📝', titleKey: 'finance.sections.budgeting.modules.planning.title', descKey: 'finance.sections.budgeting.modules.planning.desc' },
      { icon: '📊', titleKey: 'finance.sections.budgeting.modules.variance.title', descKey: 'finance.sections.budgeting.modules.variance.desc' },
      { icon: '🎯', titleKey: 'finance.sections.budgeting.modules.analysis.title', descKey: 'finance.sections.budgeting.modules.analysis.desc' },
    ],
  },
  tax: {
    id: 'tax',
    titleKey: 'finance.sections.tax.title',
    subtitleKey: 'finance.sections.tax.subtitle',
    modules: [
      { icon: '🧮', titleKey: 'finance.sections.tax.modules.calculation.title', descKey: 'finance.sections.tax.modules.calculation.desc' },
      { icon: '📑', titleKey: 'finance.sections.tax.modules.returns.title', descKey: 'finance.sections.tax.modules.returns.desc' },
      { icon: '🛡️', titleKey: 'finance.sections.tax.modules.compliance.title', descKey: 'finance.sections.tax.modules.compliance.desc' },
    ],
  },
  cost: {
    id: 'cost',
    titleKey: 'finance.sections.cost.title',
    subtitleKey: 'finance.sections.cost.subtitle',
    modules: [
      { icon: '🏭', titleKey: 'finance.sections.cost.modules.production.title', descKey: 'finance.sections.cost.modules.production.desc' },
      { icon: '📦', titleKey: 'finance.sections.cost.modules.profitability.title', descKey: 'finance.sections.cost.modules.profitability.desc' },
      { icon: '🛒', titleKey: 'finance.sections.cost.modules.cogs.title', descKey: 'finance.sections.cost.modules.cogs.desc' },
    ],
  },
}
