import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Alert, Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, Grid, IconButton, InputLabel, MenuItem, Pagination, Select, Stack, TextField, Tooltip, Typography } from '@mui/material';
import { motion } from 'framer-motion';

const MotionDiv = motion.create('div');
import { CheckCircle2, Download, FileText, Mail, Phone, Search, Trash2, X } from 'lucide-react';
import { applicationsApi } from '../../services/backend';
import type { Application, ApplicationStatus } from '../../types/api';
import { GlassCard } from '../../components/ui/GlassCard';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { StatusPill, type StatusPillTone } from '../../components/ui/StatusPill';

const statuses: ApplicationStatus[] = ['APPLIED', 'UNDER_REVIEW', 'SHORTLISTED', 'INTERVIEW', 'SELECTED', 'REJECTED'];
const statusTone: Record<ApplicationStatus, StatusPillTone> = { APPLIED: 'info', UNDER_REVIEW: 'warning', SHORTLISTED: 'info', INTERVIEW: 'warning', SELECTED: 'success', REJECTED: 'danger' };
const statusLabel = (value: ApplicationStatus) => value.replaceAll('_', ' ');

export function ApplicationsPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(0);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');
  const [selected, setSelected] = useState<Application | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Application | null>(null);
  const params = { name: name.trim() || undefined, email: email.trim() || undefined, status: status || undefined, page, size: 10 };
  const query = useQuery({ queryKey: ['applications', params], queryFn: () => applicationsApi.list(params) });
  const refresh = () => queryClient.invalidateQueries({ queryKey: ['applications'] });
  const statusMutation = useMutation({ mutationFn: ({ id, value }: { id: number; value: ApplicationStatus }) => applicationsApi.updateStatus(id, value), onSuccess: async (updated) => { setSelected(updated); await refresh(); } });
  const deleteMutation = useMutation({ mutationFn: (item: Application) => applicationsApi.remove(item.id), onSuccess: async () => { setConfirmDelete(null); setSelected(null); await refresh(); } });

  const downloadResume = async (item: Application) => {
    const blob = await applicationsApi.downloadResume(item.id);
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a'); anchor.href = url; anchor.download = `${item.name.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}-resume`; anchor.click(); URL.revokeObjectURL(url);
  };

  return <Stack gap={3}>
    <SectionHeader eyebrow="CANDIDATE PIPELINE" title="Applications" description="Review candidate profiles, move applications through the recruitment lifecycle and access resumes." />
    <GlassCard sx={{ p: { xs: 1.5, md: 2 } }}><Grid container spacing={1.5}><Grid size={{ xs: 12, md: 4 }}><TextField fullWidth placeholder="Search candidate name" value={name} onChange={(e) => { setName(e.target.value); setPage(0); }} slotProps={{ input: { startAdornment: <Search size={17} style={{ marginRight: 8 }} /> } }} /></Grid><Grid size={{ xs: 12, md: 4 }}><TextField fullWidth placeholder="Email" value={email} onChange={(e) => { setEmail(e.target.value); setPage(0); }} /></Grid><Grid size={{ xs: 12, md: 4 }}><FormControl fullWidth><InputLabel>Status</InputLabel><Select label="Status" value={status} onChange={(e) => { setStatus(e.target.value); setPage(0); }}><MenuItem value="">All statuses</MenuItem>{statuses.map((item) => <MenuItem key={item} value={item}>{statusLabel(item)}</MenuItem>)}</Select></FormControl></Grid></Grid></GlassCard>
    {query.isError && <Alert severity="error">Unable to load applications. Check your authentication and backend connection.</Alert>}
    {query.isLoading ? <ApplicationSkeletons /> : query.data?.content.length ? <>
      <Stack gap={1.25}>{query.data.content.map((item, index) => <MotionDiv key={item.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * .035 }}><GlassCard sx={{ p: { xs: 1.7, md: 2 }, '&:hover': { borderColor: 'primary.main' } }}><Stack direction={{ xs: 'column', md: 'row' }} gap={2} alignItems={{ md: 'center' }}><Box sx={{ width: 46, height: 46, flexShrink: 0, borderRadius: '50%', bgcolor: 'primary.main', color: 'primary.contrastText', display: 'grid', placeItems: 'center', fontWeight: 900 }}>{item.name.slice(0, 1).toUpperCase()}</Box><Box sx={{ flex: 1, minWidth: 0 }}><Typography fontWeight={850}>{item.name}</Typography><Typography variant="body2" color="text.secondary">{item.jobTitle} · {item.jobLocation}</Typography><Stack direction="row" gap={1.5} flexWrap="wrap" sx={{ mt: .8 }}><Typography variant="caption" color="text.secondary"><Mail size={12} style={{ verticalAlign: 'middle', marginRight: 4 }} />{item.email}</Typography><Typography variant="caption" color="text.secondary"><Phone size={12} style={{ verticalAlign: 'middle', marginRight: 4 }} />{item.phone}</Typography></Stack></Box><StatusPill label={statusLabel(item.status)} tone={statusTone[item.status]} /><Stack direction="row" gap={.5}><Tooltip title="View application"><IconButton onClick={() => setSelected(item)}><FileText size={18} /></IconButton></Tooltip><Tooltip title={item.resumeAvailable ? 'Download resume' : 'Resume unavailable'}><span><IconButton disabled={!item.resumeAvailable} onClick={() => void downloadResume(item)}><Download size={18} /></IconButton></span></Tooltip><Tooltip title="Delete"><IconButton color="error" onClick={() => setConfirmDelete(item)}><Trash2 size={18} /></IconButton></Tooltip></Stack></Stack></GlassCard></MotionDiv>)}</Stack>
      <Stack alignItems="center"><Pagination page={page + 1} count={query.data.totalPages || 1} onChange={(_, value) => setPage(value - 1)} /></Stack>
    </> : <GlassCard sx={{ p: 6, textAlign: 'center' }}><FileText size={34} /><Typography variant="h6" sx={{ mt: 1.5 }}>No applications found</Typography><Typography color="text.secondary">Applications submitted through the candidate portal will appear here.</Typography></GlassCard>}

    <Dialog open={Boolean(selected)} onClose={() => setSelected(null)} fullWidth maxWidth="md"><DialogTitle>Candidate application<IconButton onClick={() => setSelected(null)} sx={{ position: 'absolute', right: 10, top: 10 }}><X size={18} /></IconButton></DialogTitle><DialogContent dividers>{selected && <Stack gap={2.5} sx={{ pt: 1 }}><Stack direction={{ xs: 'column', sm: 'row' }} gap={2} alignItems={{ sm: 'center' }}><Box sx={{ width: 58, height: 58, borderRadius: '50%', bgcolor: 'primary.main', color: 'primary.contrastText', display: 'grid', placeItems: 'center', fontSize: 22, fontWeight: 900 }}>{selected.name.slice(0, 1).toUpperCase()}</Box><Box sx={{ flex: 1 }}><Typography variant="h5" fontWeight={850}>{selected.name}</Typography><Typography color="text.secondary">{selected.jobTitle} · {selected.jobLocation}</Typography></Box><StatusPill label={statusLabel(selected.status)} tone={statusTone[selected.status]} /></Stack><Grid container spacing={2}><Grid size={{ xs: 12, md: 6 }}><Detail label="Email" value={selected.email} /></Grid><Grid size={{ xs: 12, md: 6 }}><Detail label="Phone" value={selected.phone} /></Grid><Grid size={{ xs: 12 }}><Detail label="Highest qualification" value={selected.qualification} /></Grid></Grid><FormControl fullWidth><InputLabel>Application status</InputLabel><Select label="Application status" value={selected.status} onChange={(e) => statusMutation.mutate({ id: selected.id, value: e.target.value as ApplicationStatus })} disabled={statusMutation.isPending}>{statuses.map((item) => <MenuItem key={item} value={item}>{statusLabel(item)}</MenuItem>)}</Select></FormControl></Stack>}</DialogContent><DialogActions sx={{ p: 2 }}><Button variant="outlined" onClick={() => setSelected(null)}>Close</Button>{selected?.resumeAvailable && <Button variant="contained" startIcon={<Download size={16} />} onClick={() => void downloadResume(selected)}>Download resume</Button>}</DialogActions></Dialog>
    <Dialog open={Boolean(confirmDelete)} onClose={() => setConfirmDelete(null)} maxWidth="xs" fullWidth><DialogTitle>Delete application?</DialogTitle><DialogContent><Typography color="text.secondary">This will remove the application and its associated resume storage record.</Typography></DialogContent><DialogActions><Button variant="outlined" onClick={() => setConfirmDelete(null)}>Cancel</Button><Button color="error" variant="contained" onClick={() => confirmDelete && deleteMutation.mutate(confirmDelete)} disabled={deleteMutation.isPending}>{deleteMutation.isPending ? 'Deleting…' : 'Delete'}</Button></DialogActions></Dialog>
  </Stack>;
}

function Detail({ label, value }: { label: string; value: string }) { return <Box><Typography variant="caption" color="text.secondary" fontWeight={700}>{label}</Typography><Typography sx={{ mt: .3 }}>{value}</Typography></Box>; }
function ApplicationSkeletons() { return <Stack gap={1.25}>{Array.from({ length: 7 }, (_, i) => <GlassCard key={i} sx={{ height: 104, p: 2 }}><Stack direction="row" gap={2}><Box sx={{ width: 46, height: 46, borderRadius: '50%', bgcolor: 'action.hover' }} /><Box sx={{ flex: 1 }}><Box sx={{ height: 18, width: '28%', bgcolor: 'action.hover', borderRadius: 1 }} /><Box sx={{ height: 14, width: '42%', bgcolor: 'action.hover', borderRadius: 1, mt: 1 }} /></Box></Stack></GlassCard>)}</Stack>; }
