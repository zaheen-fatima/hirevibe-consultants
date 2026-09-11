import { useEffect, useMemo, useState } from 'react';
import { Dialog, DialogContent, InputAdornment, List, ListItemButton, ListItemIcon, ListItemText, TextField, Typography } from '@mui/material';
import { ArrowRight, BriefcaseBusiness, ClipboardList, FileText, Gauge, Inbox, Search, Settings2, ShieldCheck, Users, Video } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

type Command = { label: string; description: string; path: string; icon: typeof Gauge };
const commands: Command[] = [
  { label: 'Command Center', description: 'Overview and hiring activity', path: '/admin/dashboard', icon: Gauge },
  { label: 'Jobs', description: 'Manage active opportunities', path: '/admin/jobs', icon: BriefcaseBusiness },
  { label: 'Applications', description: 'Review candidate pipeline', path: '/admin/applications', icon: ClipboardList },
  { label: 'Inquiries', description: 'Candidate and business inquiries', path: '/admin/inquiries', icon: Inbox },
  { label: 'Contacts', description: 'Contact submissions', path: '/admin/contacts', icon: Users },
  { label: 'Articles', description: 'Manage published content', path: '/admin/articles', icon: FileText },
  { label: 'Videos', description: 'Manage video content', path: '/admin/videos', icon: Video },
  { label: 'Users & Roles', description: 'Access administration', path: '/admin/users', icon: Users },
  { label: 'Audit & Security', description: 'Review security activity', path: '/admin/security', icon: ShieldCheck },
  { label: 'Appearance', description: 'Themes and accessibility', path: '/admin/settings', icon: Settings2 },
];

export function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [value, setValue] = useState('');
  useEffect(() => { if (!open) setValue(''); }, [open]);
  const filtered = useMemo(() => {
    const q = value.trim().toLowerCase();
    return commands.filter((item) => !q || `${item.label} ${item.description}`.toLowerCase().includes(q));
  }, [value]);
  const go = (path: string) => { navigate(path); onClose(); };
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" PaperProps={{ sx: { borderRadius: 4, overflow: 'hidden' } }}>
      <DialogContent sx={{ p: 0 }}>
        <TextField autoFocus fullWidth variant="outlined" value={value} onChange={(event) => setValue(event.target.value)} placeholder="Search workspace…" slotProps={{ input: { startAdornment: <InputAdornment position="start"><Search size={18} /></InputAdornment>, endAdornment: <Typography variant="caption" color="text.secondary">Ctrl K</Typography> } }} sx={{ '& .MuiOutlinedInput-root': { border: 0, borderRadius: 0 }, '& fieldset': { border: 0, borderBottom: '1px solid', borderColor: 'divider' } }} />
        <List sx={{ p: 1 }}>
          {filtered.map(({ label, description, path, icon: Icon }) => (
            <ListItemButton key={path} selected={location.pathname === path} onClick={() => go(path)} sx={{ borderRadius: 2.5, py: 1.1 }}>
              <ListItemIcon sx={{ minWidth: 40 }}><Icon size={18} /></ListItemIcon>
              <ListItemText primary={label} secondary={description} primaryTypographyProps={{ fontWeight: 750 }} secondaryTypographyProps={{ fontSize: 12 }} />
              <ArrowRight size={16} />
            </ListItemButton>
          ))}
          {!filtered.length && <Typography sx={{ p: 3 }} color="text.secondary">No workspace destinations match that search.</Typography>}
        </List>
      </DialogContent>
    </Dialog>
  );
}
