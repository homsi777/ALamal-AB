import { Navigate, Route, Routes } from 'react-router-dom'
import { ReportsSectionPage } from './reports/ReportsSectionPage'

export function ReportsPage() {
  return (
    <Routes>
      <Route index element={<Navigate to="financial-statements" replace />} />
      <Route path="financial-statements" element={<ReportsSectionPage sectionId="financial-statements" />} />
      <Route path="accounts" element={<ReportsSectionPage sectionId="accounts" />} />
      <Route path="budget-analysis" element={<ReportsSectionPage sectionId="budget-analysis" />} />
      <Route path="treasury" element={<ReportsSectionPage sectionId="treasury" />} />
      <Route path="fixed-assets" element={<ReportsSectionPage sectionId="fixed-assets" />} />
      <Route path="tax" element={<ReportsSectionPage sectionId="tax" />} />
      <Route path="cost" element={<ReportsSectionPage sectionId="cost" />} />
      <Route path="management-bi" element={<ReportsSectionPage sectionId="management-bi" />} />
    </Routes>
  )
}
