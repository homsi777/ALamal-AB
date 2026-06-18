import { Navigate, Route, Routes } from 'react-router-dom'
import { FinanceSectionPage } from './finance/FinanceSectionPage'

export function FinancePage() {
  return (
    <Routes>
      <Route index element={<Navigate to="general-ledger" replace />} />
      <Route path="general-ledger" element={<FinanceSectionPage sectionId="general-ledger" />} />
      <Route path="payable" element={<FinanceSectionPage sectionId="payable" />} />
      <Route path="receivable" element={<FinanceSectionPage sectionId="receivable" />} />
      <Route path="treasury" element={<FinanceSectionPage sectionId="treasury" />} />
      <Route path="fixed-assets" element={<FinanceSectionPage sectionId="fixed-assets" />} />
      <Route path="budgeting" element={<FinanceSectionPage sectionId="budgeting" />} />
      <Route path="tax" element={<FinanceSectionPage sectionId="tax" />} />
      <Route path="cost" element={<FinanceSectionPage sectionId="cost" />} />
    </Routes>
  )
}
