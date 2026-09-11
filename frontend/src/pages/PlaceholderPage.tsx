import { Box, Button, Stack, Typography } from '@mui/material';
import { ArrowRight, Construction } from 'lucide-react';
import { GlassCard } from '../components/ui/GlassCard';
import { SectionHeader } from '../components/ui/SectionHeader';

export function PlaceholderPage({ title, description }: { title: string; description: string }) {
  return <><SectionHeader eyebrow="MODULE" title={title} description={description} /><GlassCard sx={{ minHeight: 430, display: 'grid', placeItems: 'center', textAlign: 'center' }}><Stack alignItems="center" gap={2} maxWidth={560}><Box sx={{ width: 72, height: 72, borderRadius: 4, bgcolor: 'primary.main', color: 'primary.contrastText', display: 'grid', placeItems: 'center' }}><Construction size={30} /></Box><Typography variant="h5" fontWeight={800}>Visual module foundation is ready</Typography><Typography color="text.secondary">This screen is intentionally a stable shell. The API client and DTO types are already separated so backend integration can happen module-by-module without disturbing the theme or layout.</Typography><Button variant="outlined" endIcon={<ArrowRight size={17} />}>Connect module API</Button></Stack></GlassCard></>;
}
