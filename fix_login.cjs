const fs = require('fs');
const file = 'c:/ascendra/frontend/src/pages/auth/Login.jsx';
let content = fs.readFileSync(file, 'utf8');

const updatedState = \  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [recoveryStep, setRecoveryStep] = useState(1);
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');\;

content = content.replace(/  const \[isLoading, setIsLoading\] = useState\(false\);\s+const \[error, setError\] = useState\(null\);\s+const \[isForgotPassword, setIsForgotPassword\] = useState\(false\);\s+const \[recoverySent, setRecoverySent\] = useState\(false\);/, updatedState);

const handleFunctions = \  const handleSendOtp = () => {
    if (!email) { setError("Please enter your email"); return; }
    setIsLoading(true);
    setError(null);
    setTimeout(() => {
      setIsLoading(false);
      setRecoveryStep(2);
    }, 1200);
  };

  const handleVerifyOtp = () => {
    if (!otp) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      if (otp === '123456') {
        setRecoveryStep(3);
        setError(null);
      } else {
        setError("Invalid OTP code. (Hint: use 123456)");
      }
    }, 1000);
  };

  const handleResetPassword = async () => {
    if (!newPassword || newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(\\\\\\/api/auth/reset-password\\\, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, new_password: newPassword })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Password reset failed');
      setRecoveryStep(4);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e) => {\;

content = content.replace(/  const handleLogin = async \(e\) => \{/, handleFunctions);

const renderBlock = \        <div className="auth-form" style={{ marginTop: '24px' }}>
          {error && <div style={{ color: '#EF4444', marginBottom: '16px', fontSize: '14px', textAlign: 'center' }}>{error}</div>}
          {isForgotPassword ? (
            <>
              {recoveryStep === 1 && (
                <>
                  <p className="p-medium" style={{ marginBottom: '16px', textAlign: 'center' }}>Enter your email to receive an OTP.</p>
                  <div className="form-group">
                    <label className="label">Email Address</label>
                    <div className="input-wrapper">
                      <Mail className="input-icon" size={20} />
                      <input type="email" className="input-field with-icon" placeholder="john@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                  </div>
                  <button onClick={handleSendOtp} disabled={isLoading} className="btn-primary w-100" style={{ marginTop: '24px', width: '100%' }}>
                    {isLoading ? 'Sending OTP...' : 'Send OTP'}
                  </button>
                  <button onClick={() => {setIsForgotPassword(false); setError(null);}} className="btn-secondary w-100" style={{ marginTop: '12px', width: '100%', border: 'none', background: 'transparent' }}>Cancel</button>
                </>
              )}
              {recoveryStep === 2 && (
                <>
                  <p className="p-medium" style={{ marginBottom: '16px', textAlign: 'center' }}>Enter the 6-digit OTP sent to your email.</p>
                  <div className="form-group">
                    <label className="label">OTP Code</label>
                    <div className="input-wrapper">
                      <Lock className="input-icon" size={20} />
                      <input type="text" className="input-field with-icon" placeholder="123456" value={otp} onChange={(e) => setOtp(e.target.value)} required />
                    </div>
                  </div>
                  <button onClick={handleVerifyOtp} disabled={isLoading} className="btn-primary w-100" style={{ marginTop: '24px', width: '100%' }}>
                    {isLoading ? 'Verifying...' : 'Verify OTP'}
                  </button>
                </>
              )}
              {recoveryStep === 3 && (
                <>
                  <p className="p-medium" style={{ marginBottom: '16px', textAlign: 'center' }}>Set your new password.</p>
                  <div className="form-group">
                    <label className="label">New Password</label>
                    <div className="input-wrapper">
                      <Lock className="input-icon" size={20} />
                      <input type="password" className="input-field with-icon" placeholder="••••••••" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
                    </div>
                  </div>
                  <button onClick={handleResetPassword} disabled={isLoading} className="btn-primary w-100" style={{ marginTop: '24px', width: '100%' }}>
                    {isLoading ? 'Updating...' : 'Update Password'}
                  </button>
                </>
              )}
              {recoveryStep === 4 && (
                <div style={{ textAlign: 'center', padding: '24px 0' }}>
                  <div style={{ color: '#10B981', marginBottom: '16px' }}>
                    <Mail size={48} style={{ margin: '0 auto' }} />
                  </div>
                  <h3 className="h3">Password Updated!</h3>
                  <p className="p-medium text-muted" style={{ margin: '12px 0 24px 0' }}>Your account has been recovered successfully.</p>
                  <button onClick={() => { setIsForgotPassword(false); setRecoveryStep(1); setOtp(''); setNewPassword(''); }} className="btn-primary w-100" style={{ width: '100%' }}>Back to Login</button>
                </div>
              )}
            </>
          ) : (
            <>
              <form onSubmit={handleLogin} className="auth-form-inner">
                {method === 'email' ? (
                  <div className="form-group">
                    <label className="label">Email Address</label>
                    <div className="input-wrapper">
                      <Mail className="input-icon" size={20} />
                      <input type="email" className="input-field with-icon" placeholder="john@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                  </div>
                ) : (
                  <div className="form-group">
                    <label className="label">Mobile Number</label>
                    <div className="input-wrapper">
                      <Phone className="input-icon" size={20} />
                      <input type="tel" className="input-field with-icon" placeholder="+1 (555) 000-0000" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                  </div>
                )}

                <div className="form-group">
                  <div className="flex-between" style={{ marginBottom: '8px' }}>
                    <label className="label" style={{ margin: 0 }}>Password</label>
                    <span onClick={() => {setIsForgotPassword(true); setError(null);}} className="p-small text-gradient" style={{ cursor: 'pointer' }}>Forgot password?</span>
                  </div>
                  <div className="input-wrapper">
                    <Lock className="input-icon" size={20} />
                    <input type="password" className="input-field with-icon" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
                  </div>
                </div>

                <button type="submit" disabled={isLoading} className="btn-primary w-100" style={{ marginTop: '24px', width: '100%', opacity: isLoading ? 0.7 : 1 }}>
                  {isLoading ? 'Signing In...' : 'Sign In'}
                  {!isLoading && <ArrowRight size={20} />}
                </button>
              </form>

              <p className="auth-footer text-center p-small" style={{ marginTop: '24px' }}>
                Don't have an account? <Link to="/register" className="text-gradient" style={{ fontWeight: 600 }}>Create one</Link>
              </p>
            </>
          )}
        </div>\;

content = content.replace(/          \{isForgotPassword \? \([\s\S]*?<\/p>\n            <\/>\n          \)\}\n        <\/div>/, renderBlock);

fs.writeFileSync(file, content);
console.log('Login logic updated!');
