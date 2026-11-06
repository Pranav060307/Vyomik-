import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { SignInPage } from '../pages/SignInPage';
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

describe('SignInPage Component & Validation', () => {
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
            <SignInPage />
          </ToastProvider>
        </AuthProvider>
      </BrowserRouter>
    );

  it('renders all form fields, buttons, and navigation elements from 4-sign-in.html', () => {
    renderComponent();

    expect(screen.getByPlaceholderText('Email Address')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByText('Remember me')).toBeInTheDocument();
    expect(screen.getByText('Forgot Password?')).toBeInTheDocument();
    expect(screen.getByText('SIGN IN')).toBeInTheDocument();
    expect(screen.getByText('Continue with Google')).toBeInTheDocument();
    expect(screen.getByText(/Don't have an account\?/i)).toBeInTheDocument();
    expect(screen.getByText(/CREATE ACCOUNT/i)).toBeInTheDocument();
  });

  it('shows validation errors when submitting with empty fields', async () => {
    renderComponent();

    const submitBtn = screen.getByText('SIGN IN');
    fireEvent.click(submitBtn);

    expect(await screen.findByText('Enter a valid email')).toBeInTheDocument();
    expect(screen.getByText('Enter your password')).toBeInTheDocument();
  });

  it('clears field errors as user enters input', async () => {
    renderComponent();

    fireEvent.click(screen.getByText('SIGN IN'));
    expect(await screen.findByText('Enter a valid email')).toBeInTheDocument();

    const emailInput = screen.getByPlaceholderText('Email Address');
    fireEvent.change(emailInput, { target: { value: 'user@example.com' } });

    expect(screen.queryByText('Enter a valid email')).not.toBeInTheDocument();
  });

  it('toggles password visibility when eye icon is clicked', () => {
    renderComponent();

    const passwordInput = screen.getByPlaceholderText('Password') as HTMLInputElement;
    const eyeBtn = screen.getByRole('button', { name: /show password/i });

    expect(passwordInput.type).toBe('password');
    fireEvent.click(eyeBtn);
    expect(passwordInput.type).toBe('text');
    fireEvent.click(eyeBtn);
    expect(passwordInput.type).toBe('password');
  });

  it('handles Forgot Password workflow correctly', async () => {
    renderComponent();

    const forgotBtn = screen.getByText('Forgot Password?');

    // 1. Forgot password clicked without email
    fireEvent.click(forgotBtn);
    expect(await screen.findByText('Enter your email first')).toBeInTheDocument();

    // 2. Forgot password with non-existing email
    fireEvent.change(screen.getByPlaceholderText('Email Address'), {
      target: { value: 'notfound@example.com' },
    });
    fireEvent.click(forgotBtn);
    expect(await screen.findByText('No account found for that email')).toBeInTheDocument();

    // 3. Forgot password with existing email
    localStorage.setItem(
      'vyomik_users',
      JSON.stringify([{ name: 'Test User', email: 'test@example.com', hash: 'abc' }])
    );
    fireEvent.change(screen.getByPlaceholderText('Email Address'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.click(forgotBtn);
    expect(
      await screen.findByText('Reset link sent to test@example.com (demo)')
    ).toBeInTheDocument();
  });

  it('shows error when user does not exist or password is wrong', async () => {
    renderComponent();

    fireEvent.change(screen.getByPlaceholderText('Email Address'), {
      target: { value: 'unknown@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'randompass' },
    });

    fireEvent.click(screen.getByText('SIGN IN'));
    expect(
      await screen.findByText('No account found. Create one first')
    ).toBeInTheDocument();
  });

  it('successfully signs in with valid credentials and redirects to /home', async () => {
    // Setup user
    const password = 'password123';
    let realHash = '';
    if (window.crypto?.subtle) {
      const buf = await window.crypto.subtle.digest('SHA-256', new TextEncoder().encode(password));
      realHash = Array.from(new Uint8Array(buf))
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');
    } else {
      let h = 0;
      for (let i = 0; i < password.length; i++) {
        h = (h * 31 + password.charCodeAt(i)) | 0;
      }
      realHash = 'x' + h;
    }

    localStorage.setItem(
      'vyomik_users',
      JSON.stringify([
        {
          name: 'Sarah Connor',
          email: 'sarah@example.com',
          hash: realHash,
        },
      ])
    );

    renderComponent();

    fireEvent.change(screen.getByPlaceholderText('Email Address'), {
      target: { value: 'sarah@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: password },
    });

    // Check remember me box
    const checkbox = document.querySelector('[data-box]')!;
    fireEvent.click(checkbox);

    fireEvent.click(screen.getByText('SIGN IN'));

    expect(await screen.findByText(/Welcome back, Sarah!/i)).toBeInTheDocument();

    await waitFor(
      () => {
        expect(mockNavigate).toHaveBeenCalledWith('/home');
      },
      { timeout: 2000 }
    );
  });

  it('navigates to /sign-up when clicking CREATE ACCOUNT', () => {
    renderComponent();

    const createAccountLink = screen.getByText(/CREATE ACCOUNT/i);
    fireEvent.click(createAccountLink);

    expect(mockNavigate).toHaveBeenCalledWith('/sign-up');
  });

  it('triggers Google OAuth demo toast when clicked', async () => {
    renderComponent();

    const googleBtn = screen.getByText('Continue with Google');
    fireEvent.click(googleBtn);

    expect(
      await screen.findByText('Google sign-in needs a backend (OAuth). Use email for this demo.')
    ).toBeInTheDocument();
  });
});
