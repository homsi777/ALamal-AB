import { Navigate, Route, Routes } from 'react-router-dom'
import { InvoiceForm } from './invoices/InvoiceForm'
import { InvoiceList } from './invoices/InvoiceList'
import { SalesInvoiceView } from './invoices/SalesInvoiceView'

import { SalesReturnForm } from './invoices/SalesReturnForm'

export function InvoicesPage() {
  return (
    <Routes>
      <Route index element={<Navigate to="sales/new" replace />} />
      <Route path="sales/new" element={<InvoiceForm mode="sales" />} />
      <Route path="sales/view/:workflowId" element={<SalesInvoiceView />} />
      <Route path="sales" element={<InvoiceList mode="sales" />} />
      <Route path="sales-return/new" element={<SalesReturnForm />} />
      <Route path="sales-return" element={<InvoiceList mode="sales-return" />} />
      <Route path="purchase/new" element={<InvoiceForm mode="purchase" />} />
      <Route path="purchase" element={<InvoiceList mode="purchase" />} />
    </Routes>
  )
}
