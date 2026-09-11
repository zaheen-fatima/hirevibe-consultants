import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Alert, Box, CircularProgress, Grid, Stack, Typography } from '@mui/material';
import { motion } from 'framer-motion';

const MotionDiv = motion.create('div');
import { Area, AreaChart, ResponsiveContainer, Tooltip as ChartTooltip, XAxis, YAxis } from 'recharts';
import { Activity, ArrowUpRight, BriefcaseBusiness, ClipboardList, FileText, Inbox, Users, Video } from 'lucide-react';
import { GlassCard } from '../components/ui/GlassCard';
import { SectionHeader } from '../components/ui/SectionHeader';
import { StatusPill } from '../components/ui/StatusPill';
import { dashboardApi } from '../services/backend';
import type { ApplicationStatus } from '../types/api';

const statusOrder: ApplicationStatus[] = ['APPLIED', 'UNDER_REVIEW', 'SHORTLISTED', 'INTERVIEW', 'SELECTED', 'REJECTED'];

export function DashboardPage() {
  const query = useQuery({ queryKey: ['dashboard'], queryFn: dashboardApi.get, refetchInterval: 60_000 });
  const data = query.data;

  const metrics = useMemo(() => data ? [
    { label: 'Active jobs', value: data.activeJobs, delta: `${data.totalJobs} total`, icon: BriefcaseBusiness },
    { label: 'Applications', value: data.totalApplications, delta: 'live pipeline', icon: ClipboardList },
    { label: 'Inquiries', value: data.totalInquiries, delta: `${data.totalContacts} contacts`, icon: Inbox },
    { label: 'Team members', value: data.totalUsers, delta: 'managed users', icon: Users },
  ] : [], [data]);

  return (
    <Stack gap={2.5}>
      <SectionHeader eyebrow="COMMAND CENTER" title="Executive overview" description="Live operational visibility across recruitment, content and inbound business workflows." action={<StatusPill label={query.isFetching ? 'Syncing' : 'Live data'} tone="success" />} />
      {query.isLoading && <GlassCard interactive={false}><Stack alignItems="center" gap={1.5} py={5}><CircularProgress size={28} /><Typography color="text.secondary">Loading command center…</Typography></Stack></GlassCard>}
      {query.isError && <Alert severity="error">Dashboard data could not be loaded. Verify that the backend is running and the API URL is correct.</Alert>}

      {data && <>
        <Grid container spacing={2.2}>
          {metrics.map(({ label, value, delta, icon: Icon }, index) => (
            <Grid key={label} size={{ xs: 12, sm: 6, xl: 3 }}>
              <GlassCard initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.06 }} sx={{ minHeight: 154 }}>
                <Stack direction="row" justifyContent="space-between">
                  <Box sx={{ width: 44, height: 44, borderRadius: 2.5, bgcolor: 'primary.main', color: 'primary.contrastText', display: 'grid', placeItems: 'center', boxShadow: '0 12px 28px rgba(16,42,67,.18)' }}><Icon size={20} /></Box>
                  <Stack direction="row" alignItems="center" gap={0.4} color="success.main"><ArrowUpRight size={16} /><Typography variant="caption" fontWeight={800}>{delta}</Typography></Stack>
                </Stack>
                <Typography color="text.secondary" sx={{ mt: 3 }}>{label}</Typography>
                <Typography variant="h3" sx={{ mt: 0.4 }}>{value}</Typography>
              </GlassCard>
            </Grid>
          ))}
        </Grid>

        <GlassCard sx={{ minHeight: 300 }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" gap={1} mb={2.5}><Box><Typography variant="h6" fontWeight={850}>Pipeline signal</Typography><Typography variant="body2" color="text.secondary">Application volume by current recruitment stage</Typography></Box><StatusPill label="Live" tone="success" /></Stack>
          <Box sx={{ height: 210, width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={statusOrder.map((status) => ({ stage: status.replace('_', ' '), applications: data.applicationStatuses[status] ?? 0 }))} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
                <defs><linearGradient id="pipelineFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="var(--hv-primary)" stopOpacity={0.32} /><stop offset="100%" stopColor="var(--hv-primary)" stopOpacity={0.02} /></linearGradient></defs>
                <XAxis dataKey="stage" axisLine={false} tickLine={false} tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} axisLine={false} tickLine={false} width={30} />
                <ChartTooltip />
                <Area type="monotone" dataKey="applications" stroke="var(--hv-primary)" fill="url(#pipelineFill)" strokeWidth={2.5} />
              </AreaChart>
            </ResponsiveContainer>
          </Box>
        </GlassCard>

        <Grid container spacing={2.2}>
          <Grid size={{ xs: 12, lg: 8 }}>
            <GlassCard sx={{ minHeight: 390 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}><Box><Typography variant="h6" fontWeight={800}>Application pipeline</Typography><Typography variant="body2" color="text.secondary">Current distribution by recruitment stage</Typography></Box><Activity size={19} /></Stack>
              <Stack gap={2}>
                {statusOrder.map((status, index) => {
                  const count = data.applicationStatuses[status] ?? 0;
                  const max = Math.max(...statusOrder.map((item) => data.applicationStatuses[item] ?? 0), 1);
                  return <Box key={status}><Stack direction="row" justifyContent="space-between" mb={0.8}><Typography variant="body2" fontWeight={700}>{status.replace('_', ' ')}</Typography><Typography variant="body2" color="text.secondary">{count}</Typography></Stack><Box sx={{ height: 9, borderRadius: 99, bgcolor: 'action.hover', overflow: 'hidden' }}><MotionDiv initial={{ width: 0 }} animate={{ width: `${(count / max) * 100}%` }} transition={{ delay: index * 0.08, duration: 0.7 }} style={{ height: '100%', borderRadius: 99, background: 'linear-gradient(90deg, rgba(16,42,67,1), rgba(200,155,60,.75))' }} /></Box></Box>;
                })}
              </Stack>
            </GlassCard>
          </Grid>
          <Grid size={{ xs: 12, lg: 4 }}>
            <GlassCard sx={{ minHeight: 390 }}>
              <Typography variant="h6" fontWeight={800}>Recent activity</Typography>
              <Typography variant="body2" color="text.secondary" mb={2}>Audit events from the backend.</Typography>
              <Stack gap={1.2}>
                {data.recentActivity.length === 0 && <Typography variant="body2" color="text.secondary">No recent activity.</Typography>}
                {data.recentActivity.slice(0, 6).map((item, index) => <Box key={item.id} sx={{ p: 1.5, borderRadius: 2.5, border: '1px solid', borderColor: 'divider' }}><Stack direction="row" gap={1.2}><Box sx={{ mt: 0.65, width: 8, height: 8, borderRadius: '50%', bgcolor: index === 0 ? 'success.main' : 'primary.main' }} /><Box><Typography variant="body2" fontWeight={700}>{item.description}</Typography><Typography variant="caption" color="text.secondary">{item.action} · {item.entityType}</Typography></Box></Stack></Box>)}
              </Stack>
            </GlassCard>
          </Grid>
        </Grid>

        <Grid container spacing={2.2}>
          <Grid size={{ xs: 12, md: 4 }}><GlassCard><Stack direction="row" alignItems="center" gap={1.5}><FileText size={20} /><Box><Typography fontWeight={800}>Articles</Typography><Typography variant="body2" color="text.secondary">{data.publishedArticles} published of {data.totalArticles}</Typography></Box></Stack></GlassCard></Grid>
          <Grid size={{ xs: 12, md: 4 }}><GlassCard><Stack direction="row" alignItems="center" gap={1.5}><Video size={20} /><Box><Typography fontWeight={800}>Videos</Typography><Typography variant="body2" color="text.secondary">{data.publishedVideos} published of {data.totalVideos}</Typography></Box></Stack></GlassCard></Grid>
          <Grid size={{ xs: 12, md: 4 }}><GlassCard><Stack direction="row" alignItems="center" gap={1.5}><BriefcaseBusiness size={20} /><Box><Typography fontWeight={800}>Recruitment</Typography><Typography variant="body2" color="text.secondary">{data.activeJobs} active roles across {data.totalJobs} jobs</Typography></Box></Stack></GlassCard></Grid>
        </Grid>
      </>}
    </Stack>
  );
}
