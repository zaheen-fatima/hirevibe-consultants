import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import {
  Alert,
  Box,
  Button,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { Check, Moon, Sun } from 'lucide-react';
import { useAppTheme } from '../theme/ThemeProvider';
import { GlassCard } from '../components/ui/GlassCard';
import { SectionHeader } from '../components/ui/SectionHeader';
import { authApi } from '../services/api';

export function SettingsPage() {
  const { mode, setMode } = useAppTheme();

  const [currentPassword, setCurrentPassword] =
      useState('');

  const [newPassword, setNewPassword] =
      useState('');

  const [confirmPassword, setConfirmPassword] =
      useState('');

  const passwordMutation = useMutation({
    mutationFn: () =>
        authApi.changePassword({
          currentPassword,
          newPassword,
        }),

    onSuccess: () => {
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    },
  });

  const passwordsMatch =
      newPassword === confirmPassword;

  const canChangePassword =
      currentPassword.length > 0 &&
      newPassword.length >= 8 &&
      confirmPassword.length >= 8 &&
      passwordsMatch;

  return (
      <Stack gap={3}>
        <SectionHeader
            eyebrow="APPEARANCE"
            title="Workspace appearance"
            description="Keep the interface restrained: one visual system, two modes, no accent selector."
        />

        <GlassCard
            sx={{
              p: {
                xs: 2.5,
                md: 3.5,
              },
            }}
        >
          <Stack
              direction={{
                xs: 'column',
                md: 'row',
              }}
              gap={3}
              alignItems={{
                md: 'center',
              }}
              justifyContent="space-between"
          >
            <Box>
              <Typography variant="h6">
                Theme mode
              </Typography>

              <Typography
                  color="text.secondary"
                  sx={{
                    mt: 0.5,
                  }}
              >
                Choose the light or dark presentation used
                across the enterprise workspace.
              </Typography>
            </Box>

            <Stack
                direction="row"
                gap={1}
                flexWrap="wrap"
            >
              <Button
                  variant={
                    mode === 'light'
                        ? 'contained'
                        : 'outlined'
                  }
                  startIcon={
                    mode === 'light'
                        ? <Check size={16} />
                        : <Sun size={16} />
                  }
                  onClick={() =>
                      setMode('light')
                  }
              >
                Light
              </Button>

              <Button
                  variant={
                    mode === 'dark'
                        ? 'contained'
                        : 'outlined'
                  }
                  startIcon={
                    mode === 'dark'
                        ? <Check size={16} />
                        : <Moon size={16} />
                  }
                  onClick={() =>
                      setMode('dark')
                  }
              >
                Dark
              </Button>
            </Stack>
          </Stack>
        </GlassCard>

        <GlassCard
            sx={{
              p: {
                xs: 2.5,
                md: 3.5,
              },
            }}
        >
          <Stack gap={2}>
            <Box>
              <Typography variant="h6">
                Change password
              </Typography>

              <Typography
                  color="text.secondary"
                  sx={{
                    mt: 0.5,
                  }}
              >
                Update your administrator password securely
                without changing any other account settings.
              </Typography>
            </Box>

            {passwordMutation.isError && (
                <Alert severity="error">
                  The password could not be changed.
                  Verify your current password and try again.
                </Alert>
            )}

            {passwordMutation.isSuccess && (
                <Alert severity="success">
                  Password changed successfully. Your other
                  active sessions have been signed out.
                </Alert>
            )}

            <TextField
                fullWidth
                type="password"
                label="Current password"
                value={currentPassword}
                onChange={(event) =>
                    setCurrentPassword(
                        event.target.value,
                    )
                }
            />

            <TextField
                fullWidth
                type="password"
                label="New password"
                value={newPassword}
                onChange={(event) =>
                    setNewPassword(
                        event.target.value,
                    )
                }
                helperText="Use at least 8 characters."
            />

            <TextField
                fullWidth
                type="password"
                label="Confirm new password"
                value={confirmPassword}
                onChange={(event) =>
                    setConfirmPassword(
                        event.target.value,
                    )
                }
                error={
                    confirmPassword.length > 0 &&
                    !passwordsMatch
                }
                helperText={
                  confirmPassword.length > 0 &&
                  !passwordsMatch
                      ? 'Passwords do not match.'
                      : undefined
                }
            />

            <Button
                variant="contained"
                disabled={
                    passwordMutation.isPending ||
                    !canChangePassword
                }
                onClick={() =>
                    passwordMutation.mutate()
                }
                sx={{
                  alignSelf: 'flex-start',
                }}
            >
              {
                passwordMutation.isPending
                    ? 'Changing…'
                    : 'Change password'
              }
            </Button>
          </Stack>
        </GlassCard>
      </Stack>
  );
}