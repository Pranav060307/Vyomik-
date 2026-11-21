import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AdminAuthProvider } from '../admin/context/AdminAuthContext';
import { AdminRouteGuard } from '../admin/components/AdminRouteGuard';
import { AdminLayout } from '../admin/components/AdminLayout';
import { AdminLoginPage } from '../admin/pages/AdminLoginPage';
import { AdminDashboardPage } from '../admin/pages/AdminDashboardPage';
import { AdminOrdersPage } from '../admin/pages/AdminOrdersPage';
import { AdminProductsPage } from '../admin/pages/AdminProductsPage';
import { AdminCustomersPage } from '../admin/pages/AdminCustomersPage';
import { AdminInventoryPage } from '../admin/pages/AdminInventoryPage';
import { AdminFulfillmentPage } from '../admin/pages/AdminFulfillmentPage';

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0 },
    },
  });

describe('VYOMIK Admin Console Test Suite', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = createTestQueryClient();
    sessionStorage.clear();
  });

  it('renders Admin Login Page with security input and master bypass', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={['/admin/login']}>
          <AdminAuthProvider>
            <Routes>
              <Route path="/admin/login" element={<AdminLoginPage />} />
            </Routes>
          </AdminAuthProvider>
        </MemoryRouter>
      </QueryClientProvider>
    );

    expect(screen.getByText(/Operations Portal/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter administrative passkey/i)).toBeInTheDocument();
    expect(screen.getByText(/Use Team Preview Key/i)).toBeInTheDocument();
  });

  it('authenticates with master key and redirects to dashboard', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={['/admin/login']}>
          <AdminAuthProvider>
            <Routes>
              <Route path="/admin/login" element={<AdminLoginPage />} />
              <Route
                path="/admin/*"
                element={
                  <AdminRouteGuard>
                    <AdminLayout />
                  </AdminRouteGuard>
                }
              >
                <Route path="dashboard" element={<AdminDashboardPage />} />
              </Route>
            </Routes>
          </AdminAuthProvider>
        </MemoryRouter>
      </QueryClientProvider>
    );

    // Click quick dev key fill
    const bypassBtn = screen.getByText(/Use Team Preview Key/i);
    fireEvent.click(bypassBtn);

    const submitBtn = screen.getByText(/ENTER CONSOLE/i);
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/Operations Overview/i)).toBeInTheDocument();
    });
  });

  it('blocks unauthenticated access to /admin/orders and redirects to login', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={['/admin/orders']}>
          <AdminAuthProvider>
            <Routes>
              <Route path="/admin/login" element={<AdminLoginPage />} />
              <Route
                path="/admin/orders"
                element={
                  <AdminRouteGuard>
                    <AdminOrdersPage />
                  </AdminRouteGuard>
                }
              />
            </Routes>
          </AdminAuthProvider>
        </MemoryRouter>
      </QueryClientProvider>
    );

    expect(screen.getByText(/Operations Portal/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter administrative passkey/i)).toBeInTheDocument();
  });

  it('renders Products Catalog with create product trigger', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <AdminAuthProvider>
            <AdminProductsPage />
          </AdminAuthProvider>
        </MemoryRouter>
      </QueryClientProvider>
    );

    expect(screen.getByText(/Product Catalog \(PIM\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Create Product/i)).toBeInTheDocument();
  });

  it('renders Customers page with VIP Waitlist and CSV export', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <AdminAuthProvider>
            <AdminCustomersPage />
          </AdminAuthProvider>
        </MemoryRouter>
      </QueryClientProvider>
    );

    expect(screen.getByText(/Customers & VIP Audience/i)).toBeInTheDocument();
    expect(screen.getByText(/Export CSV/i)).toBeInTheDocument();
  });

  it('renders Inventory matrix with SKU tracking and low stock indicators', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <AdminAuthProvider>
            <AdminInventoryPage />
          </AdminAuthProvider>
        </MemoryRouter>
      </QueryClientProvider>
    );

    expect(screen.getByText(/Inventory & Stock Management/i)).toBeInTheDocument();
    expect(screen.getByText(/Active SKUs/i)).toBeInTheDocument();
    expect(screen.getByText(/Low Stock Alerts/i)).toBeInTheDocument();
  });

  it('renders Fulfillment page with Qikink sandbox diagnostic button', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <AdminAuthProvider>
            <AdminFulfillmentPage />
          </AdminAuthProvider>
        </MemoryRouter>
      </QueryClientProvider>
    );

    expect(screen.getByText(/Fulfillment & Qikink POD Console/i)).toBeInTheDocument();
    expect(screen.getByText(/Run Sandbox Test/i)).toBeInTheDocument();
  });
});
