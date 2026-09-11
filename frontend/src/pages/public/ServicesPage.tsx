import type { ReactNode } from 'react';
import { Box, Button, Container, Grid, Stack, Typography } from '@mui/material';
import { ArrowLeft, ArrowRight, CheckCircle2, Compass, Search, UsersRound } from 'lucide-react';
import { Link } from 'react-router-dom';
import { GlassCard } from '../../components/ui/GlassCard';
import { PublicLayout } from '../../components/public/PublicSite';

const services = [
  ['Talent sourcing', 'Targeted sourcing through relevant channels and direct candidate outreach.', Search],
  ['Screening & shortlisting', 'Initial suitability checks against the agreed profile before submission.', CheckCircle2],
  ['Interview coordination', 'Availability, schedules, reminders and candidate communication are coordinated.', Compass],
  ['Joining support', 'Candidate engagement continues through selection, documentation and the agreed joining stage.', UsersRound],
] as const;

export function ServicesPage() {
  return <PublicLayout>
    <section className="hv-page-hero"><Container maxWidth="xl"><Button component={Link} to="/" startIcon={<ArrowLeft size={16} />} sx={{ mb: 2 }}>Back home</Button><Typography className="hv-section-eyebrow">RECRUITMENT DELIVERY</Typography><Typography className="hv-page-title">Structured enough for business. Human enough for candidates.</Typography><Typography sx={{ maxWidth: 760, color: 'text.secondary', mt: 2, fontSize: '1.06rem' }}>HireVibe's documented delivery model moves from requirement understanding to sourcing, assessment, profile submission, interview coordination and joining support.</Typography></Container></section>
    <Container maxWidth="xl"><section className="hv-section"><Grid container spacing={2}>{services.map(([title, text, Icon], index) => <Grid key={title} size={{ xs: 12, sm: 6 }}><GlassCard sx={{ minHeight: 250, p: { xs: 2.5, md: 3.5 } }}><Typography className="hv-process-number">0{index + 1}</Typography><Box className="hv-capability-icon" sx={{ mt: 2 }}><Icon size={20} /></Box><Typography variant="h5" sx={{ mt: 2 }}>{title}</Typography><Typography color="text.secondary" sx={{ mt: .7, maxWidth: 540 }}>{text}</Typography></GlassCard></Grid>)}</Grid></section><section className="hv-section-tight"><GlassCard sx={{ p: { xs: 3, md: 5 }, background: 'linear-gradient(135deg, rgba(16,42,67,.98), rgba(22,59,89,.98))', color: '#fff' }}><Typography className="hv-kicker" sx={{ color: 'var(--hv-accent-soft) !important' }}>CANDIDATE EXPERIENCE</Typography><Typography className="hv-section-title" sx={{ maxWidth: 860 }}>The objective is a dependable path from first conversation to meaningful career movement.</Typography><Typography sx={{ mt: 1.5, maxWidth: 760, color: 'rgba(255,255,255,.7)' }}>Whether you are looking for BPO and customer support, sales, technical support, collections, back-office operations or volume hiring, the same principle applies: understand the need, keep the signal clear and coordinate professionally.</Typography><Stack direction={{ xs: 'column', sm: 'row' }} gap={1} sx={{ mt: 2.5 }}><Button component={Link} to="/#open-roles" variant="contained" endIcon={<ArrowRight size={16} />}>Explore opportunities</Button><Button component={Link} to="/contact" variant="outlined" sx={{ color: '#fff', borderColor: 'rgba(255,255,255,.3)' }}>Start a conversation</Button></Stack></GlassCard></section></Container>
  </PublicLayout>;
}
