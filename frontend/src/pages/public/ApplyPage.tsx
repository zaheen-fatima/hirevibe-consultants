import { useMemo, useState, type ReactNode } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Alert, Box, Button, Chip, Container, Grid, MenuItem, Stack, TextField, Typography } from '@mui/material';
import { ArrowLeft, ArrowRight, CheckCircle2, FileUp, MapPin, Send, ShieldCheck, UsersRound } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { applicationsApi, jobsApi } from '../../services/backend';
import type { Job } from '../../types/api';
import { GlassCard } from '../../components/ui/GlassCard';
import { PublicLayout } from '../../components/public/PublicSite';

export function ApplyPage() {
  const [params] = useSearchParams();
  const requestedJobId = Number(params.get('jobId')) || 0;
  const [jobId, setJobId] = useState(requestedJobId);
  const [form, setForm] = useState({ name: '', email: '', phone: '', qualification: '', resume: null as File | null });

  const jobs = useQuery({ queryKey: ['public-jobs-apply'], queryFn: () => jobsApi.publicList({ page: 0, size: 50 }), staleTime: 60_000, retry: false });
  const selectedJob = jobs.data?.content.find((job) => job.id === jobId);

  const mutation = useMutation({
    mutationFn: async () => {
      if (!jobId || !form.resume) throw new Error('Please select a role and attach your resume.');
      const data = new FormData();
      data.append('jobId', String(jobId));
      data.append('name', form.name.trim());
      data.append('email', form.email.trim());
      data.append('phone', form.phone.trim());
      data.append('qualification', form.qualification.trim());
      data.append('resume', form.resume);
      return applicationsApi.create(data);
    },
    onSuccess: () => setForm({ name: '', email: '', phone: '', qualification: '', resume: null }),
  });

  const roleOptions = useMemo(() => jobs.data?.content ?? [], [jobs.data]);

  return (
    <PublicLayout>
      <section className="hv-apply-hero">
        <Container maxWidth="xl">
          <Button component={Link} to="/#open-roles" startIcon={<ArrowLeft size={16} />} sx={{ position: 'relative', zIndex: 2, color: '#fff', mb: 3 }}>Back to opportunities</Button>
          <Typography className="hv-apply-hero-title">BUILDING TEAMS,<br />SHAPING <em>FUTURE.</em></Typography>
          <Typography className="hv-apply-hero-copy">A focused application built around the information recruiters actually need. Choose a live role, tell us about yourself and attach your resume.</Typography>
          <Stack direction="row" flexWrap="wrap" gap={1} sx={{ position: 'relative', zIndex: 2, mt: 3 }}>
            <Chip label="Clear role requirements" sx={{ color: '#fff', borderColor: 'rgba(255,255,255,.22)', background: 'rgba(255,255,255,.06)' }} variant="outlined" />
            <Chip label="Secure resume submission" sx={{ color: '#fff', borderColor: 'rgba(255,255,255,.22)', background: 'rgba(255,255,255,.06)' }} variant="outlined" />
          </Stack>
        </Container>
        <Box className="hv-apply-hero-art" aria-hidden="true">
          <Box className="hv-apply-grid-card hv-apply-card-a"><UsersRound size={28} /></Box>
          <Box className="hv-apply-grid-card hv-apply-card-b"><MapPin size={28} /></Box>
          <Box className="hv-apply-grid-card hv-apply-card-c"><CheckCircle2 size={28} /></Box>
          <Box className="hv-apply-grid-card hv-apply-card-d"><ArrowRight size={28} /></Box>
        </Box>
      </section>

      <Container maxWidth="xl" className="hv-apply-stage">
        <Grid container spacing={2.5}>
          <Grid size={{ xs: 12, lg: 8 }}>
            <GlassCard sx={{ p: { xs: 2.5, md: 4 }, borderRadius: 4 }}>
              <Typography variant="h4">Application details</Typography>
              <Typography color="text.secondary" sx={{ mt: .7, mb: 3 }}>Use the same details you would be comfortable sharing with a recruiter.</Typography>
              <Stack gap={1.7}>
                <TextField select fullWidth label="Role you are applying for" value={jobId || ''} onChange={(e) => setJobId(Number(e.target.value))} required>
                  <MenuItem value="">Select a current opening</MenuItem>
                  {roleOptions.map((job) => <MenuItem key={job.id} value={job.id}>{job.title} · {job.location}</MenuItem>)}
                </TextField>
                {selectedJob && <Box sx={{ p: 2, borderRadius: 2.5, bgcolor: 'action.hover', border: '1px solid', borderColor: 'divider' }}><Stack direction="row" gap={1} alignItems="center"><MapPin size={15} /><Typography variant="body2">{selectedJob.location}</Typography><Typography variant="body2" color="text.secondary">· {selectedJob.type}</Typography></Stack><Typography variant="body2" color="text.secondary" sx={{ mt: .7 }}>{selectedJob.description}</Typography></Box>}
                <Grid container spacing={1.7}>
                  <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth label="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></Grid>
                  <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required /></Grid>
                  <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth label="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required /></Grid>
                  <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth label="Highest qualification" value={form.qualification} onChange={(e) => setForm({ ...form, qualification: e.target.value })} required /></Grid>
                </Grid>
                <Button component="label" variant="outlined" startIcon={<FileUp size={17} />} sx={{ justifyContent: 'flex-start', py: 1.35, borderStyle: 'dashed' }}>
                  {form.resume ? form.resume.name : 'Attach resume — PDF, DOC or DOCX'}
                  <input hidden type="file" accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" onChange={(e) => {
                    const file = e.target.files?.[0] ?? null;
                    if (!file) { setForm({ ...form, resume: null }); return; }
                    const allowed = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
                    if (!allowed.includes(file.type) || file.size > 5 * 1024 * 1024) {
                      mutation.reset();
                      setForm({ ...form, resume: null });
                      return;
                    }
                    setForm({ ...form, resume: file });
                  }} />
                </Button>
                {mutation.isError && <Alert severity="error">Application could not be submitted. Please verify the fields, role selection and backend connection.</Alert>}
                {mutation.isSuccess && <Alert severity="success">Application submitted successfully. Please keep the reference returned by the backend for your records.</Alert>}
                <Button variant="contained" size="large" endIcon={<Send size={16} />} disabled={mutation.isPending || !jobId || !form.name || !form.email || !form.phone || !form.qualification || !form.resume} onClick={() => mutation.mutate()} sx={{ alignSelf: 'flex-start', px: 2.8, py: 1.35 }}>{mutation.isPending ? 'Submitting…' : 'Submit application'}</Button>
              </Stack>
            </GlassCard>
          </Grid>
          <Grid size={{ xs: 12, lg: 4 }}>
            <Stack gap={2}>
              <GlassCard className="hv-apply-side-card hv-apply-next-card" sx={{ p: 3 }}>
                <Typography className="hv-kicker">WHAT HAPPENS NEXT</Typography>
                <Stack gap={2.2} sx={{ mt: 2.2 }}>
                  <Step icon={<CheckCircle2 size={18} />} title="Profile review" text="The team reviews your details against the role requirements." />
                  <Step icon={<ArrowRight size={18} />} title="Coordination" text="If there is a fit, the next step and availability are coordinated with you." />
                  <Step icon={<ShieldCheck size={18} />} title="Follow-through" text="Communication stays organized through the relevant selection stages." />
                </Stack>
              </GlassCard>
              <GlassCard className="hv-apply-side-card hv-apply-talk-card" sx={{ p: 3 }}>
                <Typography variant="h6">Need to talk first?</Typography>
                <Typography color="text.secondary" sx={{ mt: .6 }}>If the current openings are not the right fit, send a message and describe the opportunity you want.</Typography>
                <Button component={Link} to="/contact" sx={{ mt: 1.5, px: 0 }} endIcon={<ArrowRight size={15} />}>Get in touch</Button>
              </GlassCard>
              {jobs.isError && <Alert severity="info">Live roles could not be loaded. Start the backend to populate the role selector.</Alert>}
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </PublicLayout>
  );
}

function Step({ icon, title, text }: { icon: ReactNode; title: string; text: string }) {
  return <Stack direction="row" gap={1.4}><Box sx={{ width: 38, height: 38, borderRadius: 2, display: 'grid', placeItems: 'center', flexShrink: 0, color: 'var(--hv-accent)', bgcolor: 'rgba(200,155,60,.11)' }}>{icon}</Box><Box><Typography sx={{ fontWeight: 650 }}>{title}</Typography><Typography variant="body2" color="text.secondary" sx={{ mt: .25 }}>{text}</Typography></Box></Stack>;
}
