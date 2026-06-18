import { Navigate, Route, Routes } from 'react-router-dom'
import { PartyFormPage } from './parties/PartyFormPage'
import { PartyListPage } from './parties/PartyListPage'
import { PartyStatementPage } from './parties/PartyStatementPage'

export function PartiesPage() {
  return (
    <Routes>
      <Route index element={<Navigate to="customers" replace />} />
      <Route path="customers" element={<PartyFormPage type="customer" />} />
      <Route path="customers/register" element={<PartyListPage type="customer" />} />
      <Route path="customers/statement" element={<PartyStatementPage type="customer" />} />
      <Route path="suppliers" element={<PartyFormPage type="supplier" />} />
      <Route path="suppliers/register" element={<PartyListPage type="supplier" />} />
      <Route path="suppliers/statement" element={<PartyStatementPage type="supplier" />} />
    </Routes>
  )
}
