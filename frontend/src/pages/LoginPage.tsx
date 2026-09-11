import { useState, type FormEvent } from 'react';
import { Box, Button, Container, IconButton, InputAdornment, Stack, TextField, Typography } from '@mui/material';
import { ArrowLeft, ArrowRight, LockKeyhole, Mail, Moon, Sun } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { GlassCard } from '../components/ui/GlassCard';
import { useAuth } from '../features/auth/AuthContext';
import { useAppTheme } from '../theme/ThemeProvider';

const MotionDiv = motion.create('div');

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading } = useAuth();
  const { mode, toggleMode } = useAppTheme();

  const back = () => {
    const from = (location.state as { from?: string } | null)?.from;
    if (from && from !== '/login') {
      navigate(from, { replace: true });
      return;
    }
    if (window.history.length > 1) navigate(-1);
    else navigate('/');
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    try {
      await login({ email: email.trim(), password });
      const from = (location.state as { from?: string } | null)?.from ?? '/admin/dashboard';
      navigate(from, { replace: true });
    } catch {
      setError('Unable to sign in. Check your credentials and confirm that the backend is running.');
    }
  };

  return <Box className="hv-login-page">
    <Box className="hv-login-orbit" />
    <Container maxWidth="xl" className="hv-login-shell">
      <Stack width="100%" gap={2}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Button onClick={back} startIcon={<ArrowLeft size={16} />} className="hv-login-back">Back to site</Button>
          <IconButton onClick={toggleMode} aria-label={mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'} className="hv-icon-button">{mode === 'dark' ? <Sun size={18} /> : <Moon size={18} />}</IconButton>
        </Stack>
        <Box className="hv-login-grid">
          <MotionDiv initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: .6, ease: [0.22, 1, 0.36, 1] }}>
            <Box sx={{ maxWidth: 720 }}>
              <Box component="img" src="/hirevibe-logo-transparent.png" alt="HireVibe" className="hv-footer-logo" />
              <Typography className="hv-section-eyebrow" sx={{ mt: 3.5 }}>TEAM WORKSPACE</Typography>
              <Typography className="hv-login-title">A focused place to run the <span>recruitment pipeline.</span></Typography>
              <Typography color="text.secondary" sx={{ mt: 2.2, maxWidth: 600, fontSize: '1.05rem', lineHeight: 1.8 }}>Sign in to manage roles, applications, candidate communication, content and operational activity from the HireVibe workspace.</Typography>
            </Box>
          </MotionDiv>

          <MotionDiv initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .6, delay: .08, ease: [0.22, 1, 0.36, 1] }}>
            <Box component="form" onSubmit={submit}>
              <GlassCard className="hv-login-card" interactive={false} sx={{ p: { xs: 2.7, md: 3.6 } }}>
                <Stack gap={2.1}>
                  <Box><Typography variant="h4">Welcome back</Typography><Typography variant="body2" color="text.secondary" sx={{ mt: .45 }}>Secure enterprise access for authorized team members.</Typography></Box>
                  <TextField label="Work email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required autoComplete="email" slotProps={{ input: { startAdornment: <InputAdornment position="start"><Mail size={17} /></InputAdornment> } }} />
                  <TextField label="Password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required autoComplete="current-password" slotProps={{ input: { startAdornment: <InputAdornment position="start"><LockKeyhole size={17} /></InputAdornment> } }} />
                  {error && <Typography color="error" variant="body2" sx={{ lineHeight: 1.6 }}>{error}</Typography>}
                  <Button type="submit" variant="contained" size="large" disabled={isLoading} endIcon={<ArrowRight size={17} />} sx={{ py: 1.35 }}>{isLoading ? 'Signing in…' : 'Sign in'}</Button>
                  <Button type="button" onClick={back} variant="text" startIcon={<ArrowLeft size={15} />} sx={{ alignSelf: 'center' }}>Return to website</Button>
                  <Typography variant="caption" color="text.secondary" textAlign="center">Authorized workspace · Choose light or dark mode</Typography>
                </Stack>
              </GlassCard>
            </Box>
          </MotionDiv>
        </Box>
      </Stack>
    </Container>
  </Box>;
}
