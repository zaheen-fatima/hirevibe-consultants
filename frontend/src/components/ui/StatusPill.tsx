import { Chip } from '@mui/material';

export type StatusPillTone = 'success' | 'warning' | 'error' | 'info' | 'default' | 'neutral' | 'danger';

const chipColor: Record<StatusPillTone, 'success' | 'warning' | 'error' | 'info' | 'default'> = {
  success: 'success',
  warning: 'warning',
  error: 'error',
  info: 'info',
  default: 'default',
  neutral: 'default',
  danger: 'error',
};

export function StatusPill({ label, tone = 'default' }: { label: string; tone?: StatusPillTone }) {
  return (
    <Chip
      size="small"
      label={label}
      color={chipColor[tone]}
      variant="outlined"
      sx={{ fontWeight: 700, borderRadius: 1.5 }}
    />
  );
}
