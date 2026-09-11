import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, Grid, IconButton, InputLabel, MenuItem, Pagination, Select, Stack, TextField, Tooltip, Typography } from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';

const MotionDiv = motion.create('div');
import { Clock3, Mail, MessageCircle, Phone, Search, Send, Trash2, X } from 'lucide-react';
import { inquiriesApi } from '../../services/backend';
import type { Inquiry, InquiryStatus } from '../../types/api';
import { GlassCard } from '../../components/ui/GlassCard';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { StatusPill, type StatusPillTone } from '../../components/ui/StatusPill';

const statuses: InquiryStatus[] = ['NEW', 'IN_PROGRESS', 'REPLIED', 'CLOSED'];
const statusTone: Record<InquiryStatus, StatusPillTone> = { NEW: 'info', IN_PROGRESS: 'warning', REPLIED: 'success', CLOSED: 'neutral' };
const statusLabel = (value: InquiryStatus) => value.replaceAll('_', ' ');

export function InquiriesPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(0);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [status, setStatus] = useState('');
  const [selected, setSelected] = useState<Inquiry | null>(null);
  const [reply, setReply] = useState('');
  const [confirmDelete, setConfirmDelete] = useState<Inquiry | null>(null);
  const params = useMemo(() => ({ name: name.trim() || undefined, email: email.trim() || undefined, subject: subject.trim() || undefined, status: status || undefined, page, size: 10 }), [name, email, subject, status, page]);
  const query = useQuery({ queryKey: ['inquiries', params], queryFn: () => inquiriesApi.list(params) });
  const refresh = () => queryClient.invalidateQueries({ queryKey: ['inquiries'] });
  const statusMutation = useMutation({ mutationFn: ({ id, value }: { id: number; value: InquiryStatus }) => inquiriesApi.updateStatus(id, value), onSuccess: async (updated) => { setSelected(updated); await refresh(); } });
  const replyMutation = useMutation({ mutationFn: ({ id, value }: { id: number; value: string }) => inquiriesApi.reply(id, value), onSuccess: async (updated) => { setSelected(updated); setReply(''); await refresh(); } });
  const deleteMutation = useMutation({ mutationFn: (item: Inquiry) => inquiriesApi.remove(item.id), onSuccess: async () => { setConfirmDelete(null); setSelected(null); await refresh(); } });

  const openInquiry = (item: Inquiry) => { setSelected(item); setReply(item.adminReply ?? ''); };
  const clearFilters = () => { setName(''); setEmail(''); setSubject(''); setStatus(''); setPage(0); };

  return <Stack gap={3}>
    <SectionHeader eyebrow="INBOUND RELATIONSHIPS" title="Inquiries" description="Turn inbound questions into structured conversations with clear ownership, status and reply history." action={<StatusPill label={query.isFetching ? 'Syncing' : `${query.data?.totalElements ?? 0} total`} tone="info" />} />
    <GlassCard sx={{ p: { xs: 1.5, md: 2 } }}>
      <Grid container spacing={1.5}>
        <Grid size={{ xs: 12, md: 3 }}><TextField fullWidth placeholder="Name" value={name} onChange={(e) => { setName(e.target.value); setPage(0); }} slotProps={{ input: { startAdornment: <Search size={17} style={{ marginRight: 8 }} /> } }} /></Grid>
        <Grid size={{ xs: 12, md: 3 }}><TextField fullWidth placeholder="Email" value={email} onChange={(e) => { setEmail(e.target.value); setPage(0); }} /></Grid>
        <Grid size={{ xs: 12, md: 3 }}><TextField fullWidth placeholder="Subject" value={subject} onChange={(e) => { setSubject(e.target.value); setPage(0); }} /></Grid>
        <Grid size={{ xs: 10, md: 2.5 }}><FormControl fullWidth><InputLabel>Status</InputLabel><Select label="Status" value={status} onChange={(e) => { setStatus(e.target.value); setPage(0); }}><MenuItem value="">All statuses</MenuItem>{statuses.map((item) => <MenuItem key={item} value={item}>{statusLabel(item)}</MenuItem>)}</Select></FormControl></Grid>
        <Grid size={{ xs: 2, md: 0.5 }} sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center', justifyContent: 'flex-end' }}><Tooltip title="Clear filters"><IconButton onClick={clearFilters}><X size={18} /></IconButton></Tooltip></Grid>
        <Grid size={{ xs: 12, md: 3 }} sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}><Button variant="text" onClick={clearFilters}>Clear filters</Button></Grid>
      </Grid>
    </GlassCard>
    {query.isError && <Alert severity="error">Unable to load inquiries. Verify your authentication and backend connection.</Alert>}
    {query.isLoading ? <InquirySkeletons /> : query.data?.content.length ? <>
      <Stack gap={1.25}>
        <AnimatePresence initial={false} mode="popLayout">
          {query.data.content.map((item, index) => <MotionDiv key={item.id} layout initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ delay: index * 0.025 }}>
            <GlassCard sx={{ p: { xs: 1.7, md: 2 }, '&:hover': { borderColor: 'primary.main' } }}>
              <Stack direction={{ xs: 'column', lg: 'row' }} gap={2} alignItems={{ lg: 'center' }}>
                <Box sx={{ width: 46, height: 46, flexShrink: 0, borderRadius: '50%', bgcolor: 'primary.main', color: 'primary.contrastText', display: 'grid', placeItems: 'center', fontWeight: 900 }}>{item.name.slice(0, 1).toUpperCase()}</Box>
                <Box sx={{ flex: 1, minWidth: 0 }}><Typography fontWeight={800}>{item.subject}</Typography><Typography variant="body2" color="text.secondary">{item.name} · {item.email}</Typography><Stack direction="row" gap={1.5} flexWrap="wrap" sx={{ mt: .7 }}><Typography variant="caption" color="text.secondary"><Phone size={12} style={{ verticalAlign: 'middle', marginRight: 4 }} />{item.phone}</Typography><Typography variant="caption" color="text.secondary"><Clock3 size={12} style={{ verticalAlign: 'middle', marginRight: 4 }} />{new Date(item.createdAt).toLocaleDateString()}</Typography></Stack></Box>
                <StatusPill label={statusLabel(item.status)} tone={statusTone[item.status]} />
                <Stack direction="row" gap={.5}><Tooltip title="Open inquiry"><IconButton onClick={() => openInquiry(item)}><MessageCircle size={18} /></IconButton></Tooltip><Tooltip title="Delete"><IconButton color="error" onClick={() => setConfirmDelete(item)}><Trash2 size={18} /></IconButton></Tooltip></Stack>
              </Stack>
            </GlassCard>
          </MotionDiv>)}
        </AnimatePresence>
      </Stack>
      <Stack alignItems="center"><Pagination page={page + 1} count={query.data.totalPages || 1} onChange={(_, value) => setPage(value - 1)} /></Stack>
    </> : <GlassCard sx={{ p: 6, textAlign: 'center' }}><MessageCircle size={34} /><Typography variant="h6" sx={{ mt: 1.5 }}>No inquiries found</Typography><Typography color="text.secondary">Public inquiries will appear here when candidates or prospects reach out.</Typography></GlassCard>}

    <Dialog open={Boolean(selected)} onClose={() => setSelected(null)} fullWidth maxWidth="md">
      <DialogTitle>Inquiry conversation<IconButton onClick={() => setSelected(null)} sx={{ position: 'absolute', right: 10, top: 10 }}><X size={18} /></IconButton></DialogTitle>
      <DialogContent dividers>{selected && <Stack gap={2.5} sx={{ pt: 1 }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} gap={2} alignItems={{ sm: 'center' }}><Box sx={{ flex: 1 }}><Typography variant="h5" fontWeight={850}>{selected.subject}</Typography><Typography color="text.secondary">{selected.name} · {selected.email} · {selected.phone}</Typography></Box><StatusPill label={statusLabel(selected.status)} tone={statusTone[selected.status]} /></Stack>
        <GlassCard interactive={false} sx={{ p: 2.2, background: 'background.default' }}><Typography variant="caption" color="text.secondary" fontWeight={800}>ORIGINAL MESSAGE</Typography><Typography sx={{ mt: 1, whiteSpace: 'pre-wrap', lineHeight: 1.75 }}>{selected.message}</Typography></GlassCard>
        {selected.adminReply && <GlassCard interactive={false} sx={{ p: 2.2 }}><Typography variant="caption" color="primary" fontWeight={800}>ADMIN REPLY</Typography><Typography sx={{ mt: 1, whiteSpace: 'pre-wrap', lineHeight: 1.75 }}>{selected.adminReply}</Typography></GlassCard>}
        <FormControl fullWidth><InputLabel>Status</InputLabel><Select label="Status" value={selected.status} onChange={(e) => statusMutation.mutate({ id: selected.id, value: e.target.value as InquiryStatus })} disabled={statusMutation.isPending}>{statuses.map((item) => <MenuItem key={item} value={item}>{statusLabel(item)}</MenuItem>)}</Select></FormControl>
        <TextField label="Reply" value={reply} onChange={(e) => setReply(e.target.value)} multiline minRows={5} inputProps={{ maxLength: 5000 }} helperText={`${reply.length}/5000`} placeholder="Write a concise, professional response…" />
      </Stack>}</DialogContent>
      <DialogActions sx={{ p: 2 }}><Button variant="outlined" onClick={() => setSelected(null)}>Close</Button><Button variant="contained" startIcon={<Send size={16} />} onClick={() => selected && reply.trim() && replyMutation.mutate({ id: selected.id, value: reply.trim() })} disabled={!selected || !reply.trim() || replyMutation.isPending}>{replyMutation.isPending ? 'Sending…' : 'Send reply'}</Button></DialogActions>
    </Dialog>
    <Dialog open={Boolean(confirmDelete)} onClose={() => setConfirmDelete(null)} maxWidth="xs" fullWidth><DialogTitle>Delete inquiry?</DialogTitle><DialogContent><Typography color="text.secondary">This permanently removes the inquiry and its stored reply.</Typography></DialogContent><DialogActions><Button variant="outlined" onClick={() => setConfirmDelete(null)}>Cancel</Button><Button color="error" variant="contained" onClick={() => confirmDelete && deleteMutation.mutate(confirmDelete)} disabled={deleteMutation.isPending}>{deleteMutation.isPending ? 'Deleting…' : 'Delete'}</Button></DialogActions></Dialog>
  </Stack>;
}

function InquirySkeletons() { return <Stack gap={1.25}>{Array.from({ length: 5 }, (_, i) => <GlassCard key={i} sx={{ height: 92, animation: 'pulse 1.5s ease-in-out infinite' }} />)}</Stack>; }
