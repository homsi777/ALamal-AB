import { Navigate, Route, Routes } from 'react-router-dom'
import { InvoiceForm } from './invoices/InvoiceForm'
import { InvoiceList } from './invoices/InvoiceList'

export function InvoicesPage() {
  return (
    <Routes>
      <Route index element={<Navigate to="sales/new" replace />} />
      <Route path="sales/new" element={<InvoiceForm mode="sales" />} />
      <Route path="sales" element={<InvoiceList mode="sales" />} />
      <Route path="purchase/new" element={<InvoiceForm mode="purchase" />} />
      <Route path="purchase" element={<InvoiceList mode="purchase" />} />
    </Routes>
  )
}
