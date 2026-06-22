import { Navigate, Route, Routes } from 'react-router-dom'
import { PartyFormPage } from './parties/PartyFormPage'
import { PartyListPage } from './parties/PartyListPage'
import { PartyAccountStatementPage } from './parties/PartyAccountStatementPage'
import { PartyInvoiceStatementPage } from './parties/PartyInvoiceStatementPage'
import { CustomerOpeningBalancePage } from './parties/CustomerOpeningBalancePage'

export function PartiesPage() {
  return (
    <Routes>
      <Route index element={<Navigate to="customers" replace />} />
      <Route path="customers" element={<PartyFormPage type="customer" />} />
      <Route path="customers/register" element={<PartyListPage type="customer" />} />
      <Route path="customers/opening-balance" element={<CustomerOpeningBalancePage />} />
      <Route path="customers/statement" element={<PartyAccountStatementPage type="customer" />} />
      <Route path="customers/invoice-statement" element={<PartyInvoiceStatementPage type="customer" />} />
      <Route path="suppliers" element={<PartyFormPage type="supplier" />} />
      <Route path="suppliers/register" element={<PartyListPage type="supplier" />} />
      <Route path="suppliers/statement" element={<PartyAccountStatementPage type="supplier" />} />
      <Route path="suppliers/invoice-statement" element={<PartyInvoiceStatementPage type="supplier" />} />
    </Routes>
  )
}
