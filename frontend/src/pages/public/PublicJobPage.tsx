import { useMemo, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Alert, Box, Button, Chip, CircularProgress, Container, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Grid, IconButton, Paper, Stack, TextField, Typography } from '@mui/material';
import { motion, useReducedMotion } from 'framer-motion';

const MotionDiv = motion.create('div');
import { ArrowLeft, ArrowRight, BriefcaseBusiness, CheckCircle2, FileUp, MapPin, Send, X } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { PublicLayout } from '../../components/public/PublicSite';
import { GlassCard } from '../../components/ui/GlassCard';
import { jobsApi, applicationsApi } from '../../services/backend';
import type { Job } from '../../types/api';
import { jobSummary } from '../../features/jobs/jobTypes';
import { Seo } from '../../components/seo/Seo';

export function PublicJobPage() {
  const { id } = useParams<{ id: string }>();
  const reduce = useReducedMotion();
  const [applyOpen, setApplyOpen] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', qualification: '', resume: null as File | null });
  const query = useQuery({
    queryKey: ['public-job-detail', id],
    queryFn: () => jobsApi.getPublicById(Number(id)),
    enabled: Boolean(id) && Number.isInteger(Number(id)),
    staleTime: 60_000,
  });
  const mutation = useMutation({ mutationFn: async () => { if (!query.data || !form.resume) throw new Error('Missing application data'); const data = new FormData(); data.append('jobId', String(query.data.id)); data.append('name', form.name.trim()); data.append('email', form.email.trim()); data.append('phone', form.phone.trim()); data.append('qualification', form.qualification.trim()); data.append('resume', form.resume); return applicationsApi.create(data); }, onSuccess: () => setForm({ name: '', email: '', phone: '', qualification: '', resume: null }) });
  const job = query.data;
  const summary = useMemo(() => job ? jobSummary(job) : '', [job]);

  if (query.isLoading) return <Box sx={{ minHeight: '70vh', display: 'grid', placeItems: 'center' }}><CircularProgress /></Box>;
  if (query.isError) return <Container maxWidth="md" sx={{ py: 10 }}><Alert severity="error">This opportunity could not be loaded right now. Please return to the careers page and try again.</Alert></Container>;
  if (!job) return <Container maxWidth="md" sx={{ py: 10 }}><GlassCard sx={{ p: 5, textAlign: 'center' }}><Typography variant="h4" fontWeight={650}>Opportunity not found</Typography><Typography color="text.secondary" sx={{ mt: 1 }}>This role may have closed or is no longer available.</Typography><Button component={Link} to="/#open-roles" variant="contained" startIcon={<ArrowLeft size={17} />} sx={{ mt: 3 }}>Back to careers</Button></GlassCard></Container>;
  const jobSeoTitle = `${job.title} | HireVibe Consultants`;

  const jobSeoDescription =
      job.description?.replace(/\s+/g, ' ').trim().slice(0, 160) ||
      `Explore the ${job.title} opportunity with HireVibe Consultants.`;

  const jobSeoCanonical = `/jobs/${job.id}`;

  return <PublicLayout active="careers">
    <Seo
        title={jobSeoTitle}
        description={jobSeoDescription}
        canonical={jobSeoCanonical}
    />
    <Container maxWidth="lg" sx={{ py: { xs: 4, md: 7 } }}>
      <Button component={Link} to="/#open-roles" startIcon={<ArrowLeft size={17} />} sx={{ mb: 3 }}>Back to opportunities</Button>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <MotionDiv initial={reduce ? false : { opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .5 }}>
            <GlassCard sx={{ p: { xs: 2.5, md: 4 }, overflow: 'hidden', position: 'relative' }}>
              <Box sx={{ position: 'absolute', width: 280, height: 280, right: -140, top: -160, borderRadius: '50%', background: 'radial-gradient(circle, rgba(200,155,60,.14), transparent 68%)', filter: 'blur(8px)' }} />
              <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" gap={2} position="relative">
                <Stack direction="row" gap={1.5} alignItems="center"><Box sx={{ width: 52, height: 52, borderRadius: 3, display: 'grid', placeItems: 'center', bgcolor: 'action.hover', color: 'primary.main' }}><BriefcaseBusiness size={24} /></Box><Box><Typography variant="overline" color="primary" fontWeight={650}>OPEN OPPORTUNITY</Typography><Typography variant="h3" fontWeight={650}>{job.title}</Typography></Box></Stack>
                <Chip label={job.type} sx={{ alignSelf: { xs: 'flex-start', sm: 'center' } }} />
              </Stack>
              <Stack direction="row" gap={1} alignItems="center" sx={{ mt: 2.5 }}><MapPin size={17} /><Typography color="text.secondary">{job.location}</Typography></Stack>
              <Divider sx={{ my: 3 }} />
              <Typography variant="h6" fontWeight={620}>About the role</Typography>
              <Typography color="text.secondary" sx={{ mt: 1.2, whiteSpace: 'pre-line', lineHeight: 1.85 }}>{job.description}</Typography>
              <Paper elevation={0} sx={{ mt: 3, p: 2.2, borderRadius: 3, bgcolor: 'action.hover' }}><Typography variant="caption" color="primary" fontWeight={650}>ROLE SNAPSHOT</Typography><Typography sx={{ mt: .7, lineHeight: 1.7 }}>{summary}</Typography></Paper>
            </GlassCard>
          </MotionDiv>
        </Grid>
        <Grid size={{ xs: 12, lg: 4 }}>
          <Stack gap={2.2} sx={{ position: { lg: 'sticky' }, top: { lg: 100 } }}>
            <GlassCard sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={650}>Ready to take the next step?</Typography>
              <Typography color="text.secondary" sx={{ mt: 1, lineHeight: 1.7 }}>Submit your details and resume directly to the HireVibe recruitment workflow.</Typography>
              <Button fullWidth size="large" variant="contained" endIcon={<ArrowRight size={17} />} onClick={() => { mutation.reset(); setApplyOpen(true); }} sx={{ mt: 2.5 }}>Apply for this role</Button>
            </GlassCard>
            {['Role-fit focused review', 'Clear recruitment communication', 'Direct candidate workflow'].map((item) => <Stack key={item} direction="row" gap={1.2} alignItems="center" sx={{ px: 1 }}><CheckCircle2 size={17} color="currentColor" /><Typography variant="body2" color="text.secondary">{item}</Typography></Stack>)}
          </Stack>
        </Grid>
      </Grid>
    </Container>
    <Dialog open={applyOpen} onClose={() => !mutation.isPending && setApplyOpen(false)} fullWidth maxWidth="sm">
      <DialogTitle>Apply for {job.title}<IconButton onClick={() => setApplyOpen(false)} sx={{ position: 'absolute', right: 10, top: 10 }}><X size={18} /></IconButton></DialogTitle>
      <DialogContent dividers><Stack gap={2} sx={{ pt: 1 }}><TextField label="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /><TextField label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required /><TextField label="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required /><TextField label="Highest qualification" value={form.qualification} onChange={(e) => setForm({ ...form, qualification: e.target.value })} required /><Button component="label" variant="outlined" startIcon={<FileUp size={17} />} sx={{ justifyContent: 'flex-start', py: 1.4 }}>{form.resume ? form.resume.name : 'Upload resume'}<input hidden type="file" accept=".pdf,.doc,.docx" onChange={(e) => setForm({ ...form, resume: e.target.files?.[0] ?? null })} /></Button>{mutation.isError && <Alert severity="error">We couldn't submit your application. Please check your details and try again.</Alert>}{mutation.isSuccess && <Alert severity="success">Application submitted successfully.</Alert>}</Stack></DialogContent>
      <DialogActions sx={{ p: 2 }}><Button variant="outlined" onClick={() => setApplyOpen(false)}>Close</Button><Button variant="contained" startIcon={<Send size={16} />} onClick={() => mutation.mutate()} disabled={mutation.isPending || !form.name || !form.email || !form.phone || !form.qualification || !form.resume}>{mutation.isPending ? 'Submitting…' : 'Submit application'}</Button></DialogActions>
    </Dialog>
  </PublicLayout>;
}
