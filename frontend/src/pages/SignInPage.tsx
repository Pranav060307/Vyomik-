import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ResponsiveStage } from '../components/common/ResponsiveStage';
import { InputField } from '../components/forms/InputField';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const SignInPage: React.FC = () => {
  const navigate = useNavigate();
  const { signin, forgotPassword } = useAuth();
  const { toast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const EMAIL_REGEX = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

  const handleSignIn = async () => {
    const trimmedEmail = email.trim().toLowerCase();
    const newErrors: Record<string, string> = {};

    if (!EMAIL_REGEX.test(trimmedEmail)) {
      newErrors.email = 'Enter a valid email';
    }
    if (!password) {
      newErrors.password = 'Enter your password';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    const res = await signin(trimmedEmail, password, rememberMe);
    if (!res.success) {
      if (res.error?.includes('No account')) {
        setErrors({ email: res.error });
      } else {
        setErrors({ password: res.error || 'Wrong password' });
      }
    } else {
      const firstName = res.name ? res.name.split(' ')[0] : 'there';
      toast(`Welcome back, ${firstName}!`);
      setTimeout(() => {
        navigate('/home');
      }, 900);
    }
  };

  const handleForgotPassword = async () => {
    const trimmedEmail = email.trim().toLowerCase();
    if (!EMAIL_REGEX.test(trimmedEmail)) {
      setErrors((prev) => ({ ...prev, email: 'Enter your email first' }));
      return;
    }
    const res = await forgotPassword(trimmedEmail);
    toast(res.message);
  };

  return (
    <ResponsiveStage className="bg-black relative overflow-hidden font-montserrat">
      {/* Top Navigation */}
      <div className="nav">
        <div
          className="logo"
          onClick={() => navigate('/home')}
          role="button"
          tabIndex={0}
        >
          <svg className="logo-mark" viewBox="0 0 80 66" xmlns="http://www.w3.org/2000/svg">
            <polygon points="0,0 80,0 40,66" fill="#e10600" />
            <polygon points="14,8 38,8 40,22 52,8 66,8 40,52" fill="#0b0b0b" />
            <polygon points="28,16 40,34 52,16 44,16 40,22 36,16" fill="#e10600" />
          </svg>
          <span className="logo-text">VYOMIK</span>
        </div>
        <div className="links">
          <span onClick={() => navigate('/collections')}>COLLECTIONS</span>
          <span onClick={() => navigate('/our-story')}>OUR STORY</span>
          <span onClick={() => navigate('/contact')}>CONTACT</span>
        </div>
      </div>

      {/* Left Column: Hero Text */}
      <div className="hero">
        Everyday
        <br />
        <span className="red">Style.</span>
        <br />
        Your Way.
        <i />
      </div>

      {/* Red Background Box */}
      <div className="redbox" />

      {/* Tilted Tag */}
      <div className="tag">
        <svg className="logo-mark" viewBox="0 0 80 66" xmlns="http://www.w3.org/2000/svg">
          <polygon points="0,0 80,0 40,66" fill="#e10600" />
          <polygon points="14,8 38,8 40,22 52,8 66,8 40,52" fill="#0b0b0b" />
          <polygon points="28,16 40,34 52,16 44,16 40,22 36,16" fill="#e10600" />
        </svg>
        <b>VYOMIK</b>
        <p>
          PREMIUM
          <br />
          ESSENTIALS
        </p>
      </div>

      {/* Diagonal Stripes in bottom-left */}
      <div className="diag" />

      {/* Right Column: Panel */}
      <div className="panel">
        {/* Corner Polygon */}
        <div className="corner">
          <svg className="logo-mark" viewBox="0 0 80 66" xmlns="http://www.w3.org/2000/svg">
            <polygon points="0,0 80,0 40,66" fill="#0b0b0b" />
            <polygon points="14,8 38,8 40,22 52,8 66,8 40,52" fill="#e10600" />
            <polygon points="28,16 40,34 52,16 44,16 40,22 36,16" fill="#0b0b0b" />
          </svg>
        </div>

        {/* Bottom Left Triangle */}
        <div className="tri" />

        {/* Brand Bar */}
        <div className="brand">
          VYOMIK<i />
        </div>

        {/* Panel Heading */}
        <h2>
          Welcome
          <br />
          Back<span className="red">.</span>
        </h2>

        {/* Caption */}
        <div className="cap" style={{ top: '246px' }}>
          SIGN IN TO YOUR VYOMIK ACCOUNT
        </div>

        {/* Input: Email Address */}
        <InputField
          name="email"
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setErrors((prev) => ({ ...prev, email: '' }));
          }}
          onKeyDown={(e) => e.key === 'Enter' && handleSignIn()}
          error={errors.email}
          style={{ top: '306px' }}
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <path d="M3 7l9 6 9-6" />
            </svg>
          }
        />

        {/* Input: Password */}
        <InputField
          name="password"
          isPassword
          placeholder="Password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setErrors((prev) => ({ ...prev, password: '' }));
          }}
          onKeyDown={(e) => e.key === 'Enter' && handleSignIn()}
          error={errors.password}
          style={{ top: '384px' }}
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <rect x="5" y="11" width="14" height="10" rx="2" />
              <path d="M8 11V8a4 4 0 018 0v3" />
            </svg>
          }
        />

        {/* Remember me & Forgot Password */}
        <div className="chk" style={{ top: '466px', width: '620px' }}>
          <i
            data-box
            onClick={() => setRememberMe((prev) => !prev)}
            className={rememberMe ? 'on' : ''}
          />
          <span>Remember me</span>
          <u
            data-forgot
            onClick={handleForgotPassword}
            style={{ marginLeft: 'auto', borderBottom: '3px solid #e10600' }}
          >
            Forgot Password?
          </u>
        </div>

        {/* CTA: SIGN IN */}
        <div
          onClick={handleSignIn}
          className="cta"
          style={{ top: '522px' }}
          role="button"
          tabIndex={0}
        >
          SIGN IN
        </div>

        {/* OR Divider */}
        <div className="or" style={{ top: '630px' }}>
          <i />
          <span>OR</span>
          <i />
        </div>

        {/* Google Sign-in */}
        <div
          onClick={() =>
            toast('Google sign-in needs a backend (OAuth). Use email for this demo.')
          }
          className="g"
          style={{ top: '668px' }}
          role="button"
          tabIndex={0}
        >
          <span className="ico">
            <svg viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.500 12.200c0-.8-.1-1.500-.2-2.200H12v4.200h5.900a5 5 0 01-2.200 3.300v2.700h3.500c2.100-1.900 3.300-4.700 3.300-8z"
              />
              <path
                fill="#34A853"
                d="M12 23c3 0 5.400-1 7.200-2.700l-3.500-2.700c-1 .7-2.200 1-3.700 1-2.800 0-5.200-1.900-6-4.500H2.400v2.800A11 11 0 0012 23z"
              />
              <path
                fill="#FBBC05"
                d="M6 14.100a6.600 6.600 0 010-4.200V7.100H2.400a11 11 0 000 9.800z"
              />
              <path
                fill="#EA4335"
                d="M12 5.400c1.600 0 3 .6 4.100 1.600l3.100-3.100A11 11 0 002.400 7.100L6 9.900c.8-2.600 3.200-4.500 6-4.500z"
              />
            </svg>
          </span>
          Continue with Google
        </div>

        {/* Switch to Sign Up */}
        <div className="sw2" style={{ top: '768px' }}>
          <span>Don't have an account?</span>
          <b onClick={() => navigate('/sign-up')}>
            CREATE ACCOUNT{' '}
            <span className="ico">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 12h16M14 6l6 6-6 6" />
              </svg>
            </span>
          </b>
        </div>
      </div>
    </ResponsiveStage>
  );
};
