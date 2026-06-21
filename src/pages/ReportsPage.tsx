import { Navigate, Route, Routes, useParams } from 'react-router-dom'
import { REPORTS_SECTIONS, type ReportsSectionId } from '../data/reportsSections'
import { ReportsModulePage } from './reports/ReportsModulePage'
import { ReportsSectionPage } from './reports/ReportsSectionPage'

const REPORT_SECTION_IDS = Object.keys(REPORTS_SECTIONS) as ReportsSectionId[]

function isReportsSectionId(value: string | undefined): value is ReportsSectionId {
  return !!value && REPORT_SECTION_IDS.includes(value as ReportsSectionId)
}

function ReportsSectionRoute() {
  const { sectionId } = useParams()

  if (!isReportsSectionId(sectionId)) {
    return <Navigate to="/reports/financial-statements" replace />
  }

  return <ReportsSectionPage sectionId={sectionId} />
}

export function ReportsPage() {
  return (
    <Routes>
      <Route index element={<Navigate to="financial-statements" replace />} />
      <Route path=":sectionId" element={<ReportsSectionRoute />} />
      <Route path=":sectionId/:moduleId" element={<ReportsModulePage />} />
    </Routes>
  )
}
