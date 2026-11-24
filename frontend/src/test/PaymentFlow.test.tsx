import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PaymentPage } from '../pages/PaymentPage';
import { AdminPaymentsPage } from '../admin/pages/AdminPaymentsPage';
import { AdminAuthProvider } from '../admin/context/AdminAuthContext';

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0 },
    },
  });

describe('Automatic UPI QR Payment Flow & Admin Console', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = createTestQueryClient();
    vi.restoreAllMocks();
  });

  it('renders Customer Payment Page with instructions and UPI input', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={['/payment/VY2611TEST01']}>
          <Routes>
            <Route path="/payment/:orderNumber" element={<PaymentPage />} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>
    );

    expect(screen.getByText(/Scan Dynamic UPI QR/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/e\.g\. yourname@okhdfcbank/i)).toBeInTheDocument();
    expect(screen.getByText(/I Have Completed Payment/i)).toBeInTheDocument();
    expect(screen.getByText(/No screenshot uploads needed/i)).toBeInTheDocument();
  });

  it('validates customer UPI ID input format', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={['/payment/VY2611TEST01']}>
          <Routes>
            <Route path="/payment/:orderNumber" element={<PaymentPage />} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>
    );

    const input = screen.getByPlaceholderText(/e\.g\. yourname@okhdfcbank/i);
    const updateBtn = screen.getByText(/Update Dynamic QR/i);

    // Enter invalid UPI
    fireEvent.change(input, { target: { value: 'invalid-upi-without-bank' } });
    fireEvent.click(updateBtn);

    await waitFor(() => {
      expect(screen.getByText(/Invalid UPI ID format/i)).toBeInTheDocument();
    });

    // Enter valid UPI
    fireEvent.change(input, { target: { value: 'vibhav@okhdfcbank' } });
    fireEvent.click(updateBtn);

    await waitFor(() => {
      expect(screen.queryByText(/Invalid UPI ID format/i)).not.toBeInTheDocument();
    });
  });

  it('renders Admin Payments ledger with metrics and status tabs', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <AdminAuthProvider>
            <AdminPaymentsPage />
          </AdminAuthProvider>
        </MemoryRouter>
      </QueryClientProvider>
    );

    expect(screen.getByText(/UPI QR Payments & Reconciliation/i)).toBeInTheDocument();
    expect(screen.getByText(/Total Volume Collected/i)).toBeInTheDocument();
    expect(screen.getByText(/Manual Review Queue/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Search by TR, Order, UTR, or UPI/i)).toBeInTheDocument();
  });
});
