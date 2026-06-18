export type ReportsSectionId =
  | 'financial-statements'
  | 'accounts'
  | 'budget-analysis'
  | 'treasury'
  | 'fixed-assets'
  | 'tax'
  | 'cost'
  | 'management-bi'

export type ReportModuleItem = {
  icon: string
  titleKey: string
  descKey: string
}

export type ReportModuleGroup = {
  titleKey: string
  modules: ReportModuleItem[]
}

export type ReportsSectionConfig = {
  id: ReportsSectionId
  titleKey: string
  subtitleKey: string
  modules?: ReportModuleItem[]
  groups?: ReportModuleGroup[]
}

export const REPORTS_SECTIONS: Record<ReportsSectionId, ReportsSectionConfig> = {
  'financial-statements': {
    id: 'financial-statements',
    titleKey: 'reports.sections.financialStatements.title',
    subtitleKey: 'reports.sections.financialStatements.subtitle',
    modules: [
      { icon: '⚖️', titleKey: 'reports.sections.financialStatements.modules.balanceSheet.title', descKey: 'reports.sections.financialStatements.modules.balanceSheet.desc' },
      { icon: '📈', titleKey: 'reports.sections.financialStatements.modules.incomeStatement.title', descKey: 'reports.sections.financialStatements.modules.incomeStatement.desc' },
      { icon: '💧', titleKey: 'reports.sections.financialStatements.modules.cashFlow.title', descKey: 'reports.sections.financialStatements.modules.cashFlow.desc' },
      { icon: '📊', titleKey: 'reports.sections.financialStatements.modules.equityChanges.title', descKey: 'reports.sections.financialStatements.modules.equityChanges.desc' },
    ],
  },
  accounts: {
    id: 'accounts',
    titleKey: 'reports.sections.accounts.title',
    subtitleKey: 'reports.sections.accounts.subtitle',
    groups: [
      {
        titleKey: 'reports.sections.accounts.groups.generalLedger',
        modules: [
          { icon: '📖', titleKey: 'reports.sections.accounts.modules.accountStatement.title', descKey: 'reports.sections.accounts.modules.accountStatement.desc' },
          { icon: '✍️', titleKey: 'reports.sections.accounts.modules.journalDetail.title', descKey: 'reports.sections.accounts.modules.journalDetail.desc' },
          { icon: '⚖️', titleKey: 'reports.sections.accounts.modules.trialBalance.title', descKey: 'reports.sections.accounts.modules.trialBalance.desc' },
        ],
      },
      {
        titleKey: 'reports.sections.accounts.groups.receivable',
        modules: [
          { icon: '⏳', titleKey: 'reports.sections.accounts.modules.arAging.title', descKey: 'reports.sections.accounts.modules.arAging.desc' },
          { icon: '👤', titleKey: 'reports.sections.accounts.modules.customerStatement.title', descKey: 'reports.sections.accounts.modules.customerStatement.desc' },
          { icon: '⚠️', titleKey: 'reports.sections.accounts.modules.overdueRisk.title', descKey: 'reports.sections.accounts.modules.overdueRisk.desc' },
        ],
      },
      {
        titleKey: 'reports.sections.accounts.groups.payable',
        modules: [
          { icon: '📅', titleKey: 'reports.sections.accounts.modules.apAging.title', descKey: 'reports.sections.accounts.modules.apAging.desc' },
          { icon: '🏭', titleKey: 'reports.sections.accounts.modules.supplierStatement.title', descKey: 'reports.sections.accounts.modules.supplierStatement.desc' },
          { icon: '💸', titleKey: 'reports.sections.accounts.modules.paymentDue.title', descKey: 'reports.sections.accounts.modules.paymentDue.desc' },
        ],
      },
    ],
  },
  'budget-analysis': {
    id: 'budget-analysis',
    titleKey: 'reports.sections.budgetAnalysis.title',
    subtitleKey: 'reports.sections.budgetAnalysis.subtitle',
    modules: [
      { icon: '📊', titleKey: 'reports.sections.budgetAnalysis.modules.actualVsPlan.title', descKey: 'reports.sections.budgetAnalysis.modules.actualVsPlan.desc' },
      { icon: '🎯', titleKey: 'reports.sections.budgetAnalysis.modules.variance.title', descKey: 'reports.sections.budgetAnalysis.modules.variance.desc' },
      { icon: '🏢', titleKey: 'reports.sections.budgetAnalysis.modules.costCenters.title', descKey: 'reports.sections.budgetAnalysis.modules.costCenters.desc' },
      { icon: '💹', titleKey: 'reports.sections.budgetAnalysis.modules.profitability.title', descKey: 'reports.sections.budgetAnalysis.modules.profitability.desc' },
    ],
  },
  treasury: {
    id: 'treasury',
    titleKey: 'reports.sections.treasury.title',
    subtitleKey: 'reports.sections.treasury.subtitle',
    modules: [
      { icon: '🏦', titleKey: 'reports.sections.treasury.modules.bankBalances.title', descKey: 'reports.sections.treasury.modules.bankBalances.desc' },
      { icon: '🔄', titleKey: 'reports.sections.treasury.modules.reconciliation.title', descKey: 'reports.sections.treasury.modules.reconciliation.desc' },
      { icon: '📆', titleKey: 'reports.sections.treasury.modules.dailyCashFlow.title', descKey: 'reports.sections.treasury.modules.dailyCashFlow.desc' },
      { icon: '🔮', titleKey: 'reports.sections.treasury.modules.cashForecast.title', descKey: 'reports.sections.treasury.modules.cashForecast.desc' },
    ],
  },
  'fixed-assets': {
    id: 'fixed-assets',
    titleKey: 'reports.sections.fixedAssets.title',
    subtitleKey: 'reports.sections.fixedAssets.subtitle',
    modules: [
      { icon: '📦', titleKey: 'reports.sections.fixedAssets.modules.register.title', descKey: 'reports.sections.fixedAssets.modules.register.desc' },
      { icon: '📉', titleKey: 'reports.sections.fixedAssets.modules.depreciation.title', descKey: 'reports.sections.fixedAssets.modules.depreciation.desc' },
      { icon: '♻️', titleKey: 'reports.sections.fixedAssets.modules.disposed.title', descKey: 'reports.sections.fixedAssets.modules.disposed.desc' },
      { icon: '💎', titleKey: 'reports.sections.fixedAssets.modules.revaluation.title', descKey: 'reports.sections.fixedAssets.modules.revaluation.desc' },
    ],
  },
  tax: {
    id: 'tax',
    titleKey: 'reports.sections.tax.title',
    subtitleKey: 'reports.sections.tax.subtitle',
    modules: [
      { icon: '🧮', titleKey: 'reports.sections.tax.modules.vat.title', descKey: 'reports.sections.tax.modules.vat.desc' },
      { icon: '📑', titleKey: 'reports.sections.tax.modules.taxSummary.title', descKey: 'reports.sections.tax.modules.taxSummary.desc' },
      { icon: '🗓️', titleKey: 'reports.sections.tax.modules.periodicReturn.title', descKey: 'reports.sections.tax.modules.periodicReturn.desc' },
      { icon: '✂️', titleKey: 'reports.sections.tax.modules.withholding.title', descKey: 'reports.sections.tax.modules.withholding.desc' },
    ],
  },
  cost: {
    id: 'cost',
    titleKey: 'reports.sections.cost.title',
    subtitleKey: 'reports.sections.cost.subtitle',
    modules: [
      { icon: '🛒', titleKey: 'reports.sections.cost.modules.cogs.title', descKey: 'reports.sections.cost.modules.cogs.desc' },
      { icon: '📦', titleKey: 'reports.sections.cost.modules.margin.title', descKey: 'reports.sections.cost.modules.margin.desc' },
      { icon: '⚖️', titleKey: 'reports.sections.cost.modules.breakEven.title', descKey: 'reports.sections.cost.modules.breakEven.desc' },
      { icon: '🔀', titleKey: 'reports.sections.cost.modules.allocation.title', descKey: 'reports.sections.cost.modules.allocation.desc' },
    ],
  },
  'management-bi': {
    id: 'management-bi',
    titleKey: 'reports.sections.managementBi.title',
    subtitleKey: 'reports.sections.managementBi.subtitle',
    modules: [
      { icon: '📊', titleKey: 'reports.sections.managementBi.modules.dashboard.title', descKey: 'reports.sections.managementBi.modules.dashboard.desc' },
      { icon: '📐', titleKey: 'reports.sections.managementBi.modules.kpis.title', descKey: 'reports.sections.managementBi.modules.kpis.desc' },
      { icon: '📆', titleKey: 'reports.sections.managementBi.modules.periodCompare.title', descKey: 'reports.sections.managementBi.modules.periodCompare.desc' },
      { icon: '🔔', titleKey: 'reports.sections.managementBi.modules.alerts.title', descKey: 'reports.sections.managementBi.modules.alerts.desc' },
      { icon: '📤', titleKey: 'reports.sections.managementBi.modules.export.title', descKey: 'reports.sections.managementBi.modules.export.desc' },
    ],
  },
}
