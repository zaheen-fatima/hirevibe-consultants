import { Box, Stack, Typography } from '@mui/material';
import type { ReactNode } from 'react';

export function SectionHeader({ eyebrow, title, description, action }: { eyebrow?: string; title: string; description?: string; action?: ReactNode }) {
  return <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'center' }} gap={2} mb={3}><Box><Typography variant="overline" color="primary" fontWeight={800}>{eyebrow}</Typography><Typography variant="h4" fontWeight={800}>{title}</Typography>{description && <Typography color="text.secondary" sx={{ mt: .5 }}>{description}</Typography>}</Box>{action}</Stack>;
}
