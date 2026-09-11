import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Alert, Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, Grid, IconButton, InputLabel, MenuItem, Pagination, Select, Stack, TextField, Tooltip, Typography } from '@mui/material';
import { motion } from 'framer-motion';

const MotionDiv = motion.create('div');
import { BriefcaseBusiness, CheckCircle2, Edit3, MapPin, Plus, Power, Search, Trash2, X, XCircle } from 'lucide-react';
import { jobsApi } from '../../services/backend';
import type { Job } from '../../types/api';
import { GlassCard } from '../../components/ui/GlassCard';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { StatusPill } from '../../components/ui/StatusPill';
import { jobSummary, jobTypes } from './jobTypes';

const emptyForm = { title: '', location: '', description: '', type: '' };

type JobForm = typeof emptyForm;

export function JobsPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [type, setType] = useState('');
  const [active, setActive] = useState<'all' | 'active' | 'inactive'>('all');
  const [editing, setEditing] = useState<Job | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<JobForm>(emptyForm);
  const [confirmDelete, setConfirmDelete] = useState<Job | null>(null);

  const params = useMemo(() => ({
    title: search.trim() || undefined,
    location: location.trim() || undefined,
    type: type || undefined,
    active: active === 'all' ? undefined : active === 'active',
    page,
    size: 9,
  }), [search, location, type, active, page]);

  const query = useQuery({ queryKey: ['jobs', params], queryFn: () => jobsApi.list(params) });

  const refresh = async () => queryClient.invalidateQueries({ queryKey: ['jobs'] });
  const createMutation = useMutation({ mutationFn: () => jobsApi.create(form), onSuccess: async () => { setCreating(false); setForm(emptyForm); await refresh(); } });
  const updateMutation = useMutation({ mutationFn: () => jobsApi.update(editing!.id, form), onSuccess: async () => { setEditing(null); await refresh(); } });
  const toggleMutation = useMutation({ mutationFn: (job: Job) => job.active ? jobsApi.deactivate(job.id) : jobsApi.activate(job.id), onSuccess: refresh });
  const deleteMutation = useMutation({ mutationFn: (job: Job) => jobsApi.remove(job.id), onSuccess: async () => { setConfirmDelete(null); await refresh(); } });

  const openCreate = () => { setForm(emptyForm); setCreating(true); };
  const openEdit = (job: Job) => { setForm({ title: job.title, location: job.location, description: job.description, type: job.type }); setEditing(job); };
  const closeForm = () => { if (!createMutation.isPending && !updateMutation.isPending) { setCreating(false); setEditing(null); } };
  const save = () => creating ? createMutation.mutate() : updateMutation.mutate();
  const saving = createMutation.isPending || updateMutation.isPending;

  return <Stack gap={3}>
    <SectionHeader
      eyebrow="RECRUITMENT PIPELINE"
      title="Jobs"
      description="Create, publish and maintain the roles candidates discover through HireVibe."
      action={<Button variant="contained" startIcon={<Plus size={17} />} onClick={openCreate}>Create job</Button>}
    />

    <GlassCard sx={{ p: { xs: 1.5, md: 2 }, borderRadius: 3 }}>
      <Grid container spacing={1.5} alignItems="center">
        <Grid size={{ xs: 12, md: 4 }}><TextField fullWidth placeholder="Search job title" value={search} onChange={(e) => { setSearch(e.target.value); setPage(0); }} slotProps={{ input: { startAdornment: <Search size={17} style={{ marginRight: 8 }} /> } }} /></Grid>
        <Grid size={{ xs: 12, sm: 6, md: 2.5 }}><TextField fullWidth placeholder="Location" value={location} onChange={(e) => { setLocation(e.target.value); setPage(0); }} slotProps={{ input: { startAdornment: <MapPin size={16} style={{ marginRight: 8 }} /> } }} /></Grid>
        <Grid size={{ xs: 12, sm: 6, md: 2.5 }}><FormControl fullWidth size="small"><InputLabel>Type</InputLabel><Select label="Type" value={type} onChange={(e) => { setType(e.target.value); setPage(0); }}><MenuItem value="">All types</MenuItem>{jobTypes.map((item) => <MenuItem key={item} value={item}>{item}</MenuItem>)}</Select></FormControl></Grid>
        <Grid size={{ xs: 12, md: 3 }}><Stack direction="row" gap={.8} flexWrap="wrap"><Chip label="All" clickable color={active === 'all' ? 'primary' : 'default'} variant={active === 'all' ? 'filled' : 'outlined'} onClick={() => { setActive('all'); setPage(0); }} /><Chip label="Active" clickable color={active === 'active' ? 'success' : 'default'} variant={active === 'active' ? 'filled' : 'outlined'} onClick={() => { setActive('active'); setPage(0); }} /><Chip label="Inactive" clickable color={active === 'inactive' ? 'warning' : 'default'} variant={active === 'inactive' ? 'filled' : 'outlined'} onClick={() => { setActive('inactive'); setPage(0); }} /></Stack></Grid>
      </Grid>
    </GlassCard>

    {query.isError && <Alert severity="error">Unable to load jobs. Check the backend connection and your permissions.</Alert>}
    {query.isLoading ? <JobSkeletons /> : query.data?.content.length ? <>
      <Grid container spacing={2}>
        {query.data.content.map((job, index) => <Grid key={job.id} size={{ xs: 12, md: 6, xl: 4 }}>
          <MotionDiv initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * .045 }} style={{ height: '100%' }}>
            <GlassCard sx={{ p: 2.4, height: '100%', display: 'flex', flexDirection: 'column', transition: 'transform .25s ease, box-shadow .25s ease', '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 22px 60px rgba(15,23,42,.13)' } }}>
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start" gap={1}><Box sx={{ width: 44, height: 44, borderRadius: 2.2, display: 'grid', placeItems: 'center', bgcolor: 'action.hover', color: 'primary.main' }}><BriefcaseBusiness size={21} /></Box><StatusPill label={job.active ? 'Active' : 'Inactive'} tone={job.active ? 'success' : 'neutral'} /></Stack>
              <Typography variant="h6" fontWeight={850} sx={{ mt: 2 }}>{job.title}</Typography>
              <Stack direction="row" gap={1} flexWrap="wrap" sx={{ mt: 1 }}><Chip size="small" icon={<MapPin size={14} />} label={job.location} variant="outlined" /><Chip size="small" label={job.type} variant="outlined" /></Stack>
              <Typography color="text.secondary" variant="body2" sx={{ mt: 1.7, lineHeight: 1.7 }}>{jobSummary(job)}</Typography>
              <Box sx={{ flex: 1 }} />
              <Stack direction="row" justifyContent="flex-end" gap={.5} sx={{ mt: 2 }}>
                <Tooltip title={job.active ? 'Deactivate' : 'Activate'}><IconButton onClick={() => toggleMutation.mutate(job)} disabled={toggleMutation.isPending}>{job.active ? <XCircle size={18} /> : <CheckCircle2 size={18} />}</IconButton></Tooltip>
                <Tooltip title="Edit"><IconButton onClick={() => openEdit(job)}><Edit3 size={18} /></IconButton></Tooltip>
                <Tooltip title="Delete"><IconButton color="error" onClick={() => setConfirmDelete(job)}><Trash2 size={18} /></IconButton></Tooltip>
              </Stack>
            </GlassCard>
          </MotionDiv>
        </Grid>)}
      </Grid>
      <Stack alignItems="center"><Pagination page={page + 1} count={query.data.totalPages || 1} onChange={(_, value) => setPage(value - 1)} color="primary" /></Stack>
    </> : <GlassCard sx={{ p: 6, textAlign: 'center' }}><BriefcaseBusiness size={34} /><Typography variant="h6" sx={{ mt: 1.5 }}>No roles match these filters</Typography><Typography color="text.secondary">Try a broader search or create a new opportunity.</Typography></GlassCard>}

    <Dialog open={creating || Boolean(editing)} onClose={closeForm} fullWidth maxWidth="sm"><DialogTitle>{creating ? 'Create a new role' : 'Edit role'}<IconButton onClick={closeForm} sx={{ position: 'absolute', right: 10, top: 10 }}><X size={18} /></IconButton></DialogTitle><DialogContent dividers><Stack gap={2} sx={{ pt: 1 }}><TextField label="Job title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required /><TextField label="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} required /><TextField label="Type" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} placeholder="BPO, Sales, Technical Support…" required /><TextField label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required multiline minRows={6} /></Stack></DialogContent><DialogActions sx={{ p: 2 }}><Button variant="outlined" onClick={closeForm}>Cancel</Button><Button variant="contained" onClick={save} disabled={saving || !form.title.trim() || !form.location.trim() || !form.description.trim() || !form.type.trim()}>{saving ? 'Saving…' : 'Save role'}</Button></DialogActions></Dialog>
    <Dialog open={Boolean(confirmDelete)} onClose={() => setConfirmDelete(null)} maxWidth="xs" fullWidth><DialogTitle>Delete this job?</DialogTitle><DialogContent><Typography color="text.secondary">This permanently removes <strong>{confirmDelete?.title}</strong>. Candidate applications are managed separately.</Typography></DialogContent><DialogActions><Button variant="outlined" onClick={() => setConfirmDelete(null)}>Cancel</Button><Button color="error" variant="contained" onClick={() => confirmDelete && deleteMutation.mutate(confirmDelete)} disabled={deleteMutation.isPending}>{deleteMutation.isPending ? 'Deleting…' : 'Delete'}</Button></DialogActions></Dialog>
  </Stack>;
}

function JobSkeletons() { return <Grid container spacing={2}>{Array.from({ length: 6 }, (_, i) => <Grid key={i} size={{ xs: 12, md: 6, xl: 4 }}><GlassCard sx={{ height: 270, p: 3 }}><Box sx={{ height: 48, width: 48, borderRadius: 2, bgcolor: 'action.hover', animation: 'pulse 1.5s ease-in-out infinite' }} /><Box sx={{ height: 20, width: '70%', mt: 2, bgcolor: 'action.hover', borderRadius: 1 }} /><Box sx={{ height: 70, mt: 2, bgcolor: 'action.hover', borderRadius: 2 }} /></GlassCard></Grid>)}</Grid>; }
