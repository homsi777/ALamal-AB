import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AppProvider } from './context/AppProvider'
import { AppShell } from './components/layout/AppShell'
import { HomePage } from './pages/HomePage'
import { InventoryPage } from './pages/InventoryPage'
import { InvoicesPage } from './pages/InvoicesPage'
import { PartiesPage } from './pages/PartiesPage'
import { FinancePage } from './pages/FinancePage'
import { DeliveryPage } from './pages/DeliveryPage'
import { ChinaOrdersPage } from './pages/ChinaOrdersPage'
import { ReportsPage } from './pages/ReportsPage'
import { SettingsPage } from './pages/SettingsPage'

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<AppShell />}>
            <Route index element={<HomePage />} />
            <Route path="inventory/*" element={<InventoryPage />} />
            <Route path="invoices" element={<InvoicesPage />} />
            <Route path="parties" element={<PartiesPage />} />
            <Route path="finance" element={<FinancePage />} />
            <Route path="delivery" element={<DeliveryPage />} />
            <Route path="china-orders" element={<ChinaOrdersPage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  )
}
