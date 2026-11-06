import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { SignUpPage } from '../pages/SignUpPage';
import { AuthProvider } from '../context/AuthContext';
import { ToastProvider } from '../context/ToastContext';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('SignUpPage Component & Validation', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    mockNavigate.mockClear();
  });

  const renderComponent = () =>
    render(
      <BrowserRouter>
        <AuthProvider>
          <ToastProvider>
            <SignUpPage />
          </ToastProvider>
        </AuthProvider>
      </BrowserRouter>
    );

  it('renders all form fields, buttons, and navigation elements from 3-sign-up.html', () => {
    renderComponent();

    expect(screen.getByPlaceholderText('Full Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email Address')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Confirm Password')).toBeInTheDocument();
    expect(screen.getByText('CREATE ACCOUNT')).toBeInTheDocument();
    expect(screen.getByText('Continue with Google')).toBeInTheDocument();
    expect(screen.getByText(/Already have an account\?/i)).toBeInTheDocument();
    expect(screen.getByText(/SIGN IN/i)).toBeInTheDocument();
  });

  it('shows validation errors when submitting with empty fields', async () => {
    renderComponent();

    const submitBtn = screen.getByText('CREATE ACCOUNT');
    fireEvent.click(submitBtn);

    expect(await screen.findByText('Enter your full name')).toBeInTheDocument();
    expect(screen.getByText('Enter a valid email')).toBeInTheDocument();
    expect(screen.getByText('Use at least 6 characters')).toBeInTheDocument();
    expect(screen.getByText('Passwords do not match')).toBeInTheDocument();
  });

  it('clears field errors as user enters input', async () => {
    renderComponent();

    fireEvent.click(screen.getByText('CREATE ACCOUNT'));
    expect(await screen.findByText('Enter your full name')).toBeInTheDocument();

    const nameInput = screen.getByPlaceholderText('Full Name');
    fireEvent.change(nameInput, { target: { value: 'Alex Morgan' } });

    expect(screen.queryByText('Enter your full name')).not.toBeInTheDocument();
  });

  it('toggles password visibility when eye icons are clicked', () => {
    renderComponent();

    const passwordInput = screen.getByPlaceholderText('Password') as HTMLInputElement;
    const eyeBtns = screen.getAllByRole('button', { name: /show password/i });

    expect(passwordInput.type).toBe('password');
    fireEvent.click(eyeBtns[0]);
    expect(passwordInput.type).toBe('text');
    fireEvent.click(eyeBtns[0]);
    expect(passwordInput.type).toBe('password');
  });

  it('requires Terms of Service checkbox before creating account', async () => {
    renderComponent();

    fireEvent.change(screen.getByPlaceholderText('Full Name'), { target: { value: 'Jane Doe' } });
    fireEvent.change(screen.getByPlaceholderText('Email Address'), { target: { value: 'jane@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'secret123' } });
    fireEvent.change(screen.getByPlaceholderText('Confirm Password'), { target: { value: 'secret123' } });

    fireEvent.click(screen.getByText('CREATE ACCOUNT'));

    // Toast appears
    expect(await screen.findByText('Please accept the Terms of Service and Privacy Policy')).toBeInTheDocument();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('successfully creates account and navigates when all fields are valid and terms checked', async () => {
    renderComponent();

    fireEvent.change(screen.getByPlaceholderText('Full Name'), { target: { value: 'John Smith' } });
    fireEvent.change(screen.getByPlaceholderText('Email Address'), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByPlaceholderText('Confirm Password'), { target: { value: 'password123' } });

    // Click terms checkbox
    const checkbox = document.querySelector('[data-box]')!;
    fireEvent.click(checkbox);

    fireEvent.click(screen.getByText('CREATE ACCOUNT'));

    expect(await screen.findByText('Account created. Welcome, John!')).toBeInTheDocument();

    await waitFor(
      () => {
        expect(mockNavigate).toHaveBeenCalledWith('/home');
      },
      { timeout: 2000 }
    );
  });

  it('shows error if email is already registered', async () => {
    // Pre-populate users
    localStorage.setItem(
      'vyomik_users',
      JSON.stringify([{ name: 'Existing User', email: 'existing@example.com', hash: 'abc' }])
    );

    renderComponent();

    fireEvent.change(screen.getByPlaceholderText('Full Name'), { target: { value: 'New User' } });
    fireEvent.change(screen.getByPlaceholderText('Email Address'), { target: { value: 'existing@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByPlaceholderText('Confirm Password'), { target: { value: 'password123' } });

    const checkbox = document.querySelector('[data-box]')!;
    fireEvent.click(checkbox);

    fireEvent.click(screen.getByText('CREATE ACCOUNT'));

    expect(await screen.findByText('An account with this email already exists')).toBeInTheDocument();
  });

  it('navigates to /sign-in when clicking SIGN IN', () => {
    renderComponent();

    const signInLink = screen.getByText(/SIGN IN/i);
    fireEvent.click(signInLink);

    expect(mockNavigate).toHaveBeenCalledWith('/sign-in');
  });
});
