import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Alert, Avatar, Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, Divider, FormControl, Grid, IconButton, InputLabel, List, ListItem, ListItemText, MenuItem, Select, Stack, Switch, Tab, Tabs, TextField, Tooltip, Typography } from '@mui/material';
import { motion } from 'framer-motion';

const MotionDiv = motion.create('div');
import { KeyRound, Pencil, Plus, Shield, Trash2, UserCog, X } from 'lucide-react';
import { usersApi, rolesApi, permissionsApi, rolePermissionsApi } from '../../services/backend';
import { GlassCard } from '../../components/ui/GlassCard';
import { SectionHeader } from '../../components/ui/SectionHeader';
import type { Permission, Role, User } from '../../types/api';

type Editor = { type: 'user' | 'role' | 'permission'; id?: number } | null;

export function AdminPage() {
  const [tab, setTab] = useState(0);
  const [editor, setEditor] = useState<Editor>(null);
  const [roleForPermissions, setRoleForPermissions] = useState<Role | null>(null);
  const qc = useQueryClient();
  const users = useQuery({ queryKey: ['users'], queryFn: () => usersApi.list({ size: 50, sort: 'name,asc' }) });
  const roles = useQuery({ queryKey: ['roles'], queryFn: () => rolesApi.list({ size: 50, sort: 'name,asc' }) });
  const permissions = useQuery({ queryKey: ['permissions'], queryFn: () => permissionsApi.list({ size: 100, sort: 'name,asc' }) });
  const refresh = () => { void qc.invalidateQueries({ queryKey: ['users'] }); void qc.invalidateQueries({ queryKey: ['roles'] }); void qc.invalidateQueries({ queryKey: ['permissions'] }); };

  const nav = [{ label: 'Users', icon: UserCog }, { label: 'Roles', icon: Shield }, { label: 'Permissions', icon: KeyRound }];
  return <Stack gap={3}><SectionHeader eyebrow="ACCESS CONTROL" title="Users & roles" description="Manage workspace identities, role boundaries and fine-grained permissions from one controlled surface." /><GlassCard sx={{ p: 1 }}><Tabs value={tab} onChange={(_, value: number) => setTab(value)} variant="scrollable" scrollButtons={false}>{nav.map(({ label, icon: Icon }) => <Tab key={label} icon={<Icon size={17} />} iconPosition="start" label={label} />)}</Tabs></GlassCard>{tab === 0 && <UsersPanel data={users.data?.content ?? []} roles={roles.data?.content ?? []} onEdit={(id) => setEditor({ type: 'user', id })} onCreate={() => setEditor({ type: 'user' })} onRefresh={refresh} />}{tab === 1 && <RolesPanel data={roles.data?.content ?? []} onEdit={(id) => setEditor({ type: 'role', id })} onCreate={() => setEditor({ type: 'role' })} onPermissions={setRoleForPermissions} onRefresh={refresh} />}{tab === 2 && <PermissionsPanel data={permissions.data?.content ?? []} onEdit={(id) => setEditor({ type: 'permission', id })} onCreate={() => setEditor({ type: 'permission' })} onRefresh={refresh} />}{editor && <AdminEditor editor={editor} roles={roles.data?.content ?? []} onClose={() => setEditor(null)} onSaved={refresh} />}{roleForPermissions && <PermissionMatrix role={roleForPermissions} permissions={permissions.data?.content ?? []} onClose={() => setRoleForPermissions(null)} />}</Stack>;
}

function UsersPanel({ data, roles, onEdit, onCreate, onRefresh }: { data: User[]; roles: Role[]; onEdit: (id: number) => void; onCreate: () => void; onRefresh: () => void }) {
  const mutation = useMutation({ mutationFn: ({ id, enabled }: { id: number; enabled: boolean }) => enabled ? usersApi.enable(id) : usersApi.disable(id), onSuccess: onRefresh });
  return <PanelCard title="Workspace users" subtitle="Identity, role and account state" action={<Button variant="contained" startIcon={<Plus size={16} />} onClick={onCreate}>New user</Button>}><Stack gap={1}>{data.map((user, index) => <MotionDiv key={user.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * .03 }}><GlassCard sx={{ p: 1.6 }}><Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ sm: 'center' }} gap={1.5}><Avatar sx={{ bgcolor: 'primary.main' }}>{user.name.slice(0, 1).toUpperCase()}</Avatar><Box sx={{ flex: 1 }}><Typography fontWeight={800}>{user.name}</Typography><Typography variant="body2" color="text.secondary">{user.email}</Typography></Box><Chip size="small" label={user.role} /><Stack direction="row" alignItems="center"><Typography variant="caption" color="text.secondary">{user.enabled ? 'Active' : 'Disabled'}</Typography><Switch checked={user.enabled} onChange={(e) => mutation.mutate({ id: user.id, enabled: e.target.checked })} /></Stack><Tooltip title="Edit user"><IconButton onClick={() => onEdit(user.id)}><Pencil size={17} /></IconButton></Tooltip></Stack></GlassCard></MotionDiv>)}</Stack>{!data.length && <Typography color="text.secondary">No users available.</Typography>}</PanelCard>;
}

function RolesPanel({ data, onEdit, onCreate, onPermissions, onRefresh }: { data: Role[]; onEdit: (id: number) => void; onCreate: () => void; onPermissions: (role: Role) => void; onRefresh: () => void }) {
  const remove = useMutation({ mutationFn: rolesApi.remove, onSuccess: onRefresh });
  return <PanelCard title="Application roles" subtitle="Role definitions and permission boundaries" action={<Button variant="contained" startIcon={<Plus size={16} />} onClick={onCreate}>New role</Button>}><Grid container spacing={1.5}>{data.map((role, index) => <Grid key={role.id} size={{ xs: 12, md: 6 }}><MotionDiv initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * .04 }}><GlassCard sx={{ p: 2, height: '100%' }}><Stack gap={1.5}><Stack direction="row" justifyContent="space-between"><Box><Typography fontWeight={850}>{role.name}</Typography><Typography variant="caption" color="text.secondary">{role.permissions.length} assigned permissions</Typography></Box><Shield size={20} /></Stack><Stack direction="row" gap={.7} flexWrap="wrap">{role.permissions.slice(0, 6).map((permission) => <Chip key={permission} size="small" label={permission} variant="outlined" />)}{role.permissions.length > 6 && <Chip size="small" label={`+${role.permissions.length - 6}`} />}</Stack><Stack direction="row" justifyContent="flex-end" gap={.5}><Button size="small" onClick={() => onPermissions(role)}>Permissions</Button><IconButton onClick={() => onEdit(role.id)}><Pencil size={17} /></IconButton><IconButton color="error" onClick={() => { if (window.confirm(`Delete role “${role.name}”?`)) remove.mutate(role.id); }}><Trash2 size={17} /></IconButton></Stack></Stack></GlassCard></MotionDiv></Grid>)}</Grid></PanelCard>;
}

function PermissionsPanel({ data, onEdit, onCreate, onRefresh }: { data: Permission[]; onEdit: (id: number) => void; onCreate: () => void; onRefresh: () => void }) {
  const remove = useMutation({ mutationFn: permissionsApi.remove, onSuccess: onRefresh });
  const groups = useMemo(() => { const map = new Map<string, Permission[]>(); data.forEach((permission) => { const group = permission.name.split(':')[0] || 'general'; map.set(group, [...(map.get(group) ?? []), permission]); }); return [...map.entries()]; }, [data]);
  return <PanelCard title="Permissions" subtitle="Fine-grained authorization capabilities" action={<Button variant="contained" startIcon={<Plus size={16} />} onClick={onCreate}>New permission</Button>}><Stack gap={1.5}>{groups.map(([group, items]) => <GlassCard key={group} sx={{ p: 2 }}><Typography variant="overline" fontWeight={900} color="primary">{group}</Typography><List disablePadding>{items.map((permission) => <ListItem key={permission.id} divider secondaryAction={<Stack direction="row"><IconButton onClick={() => onEdit(permission.id)}><Pencil size={16} /></IconButton><IconButton color="error" onClick={() => { if (window.confirm(`Delete permission “${permission.name}”?`)) remove.mutate(permission.id); }}><Trash2 size={16} /></IconButton></Stack>}><ListItemText primary={permission.name} /></ListItem>)}</List></GlassCard>)}</Stack></PanelCard>;
}

function PanelCard({ title, subtitle, action, children }: { title: string; subtitle: string; action?: ReactNode; children: ReactNode }) { return <GlassCard sx={{ p: { xs: 2, md: 2.5 } }}><Stack gap={2}><Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" gap={1}><Box><Typography variant="h6" fontWeight={850}>{title}</Typography><Typography variant="body2" color="text.secondary">{subtitle}</Typography></Box>{action}</Stack><Divider />{children}</Stack></GlassCard>; }

function AdminEditor({ editor, roles, onClose, onSaved }: { editor: NonNullable<Editor>; roles: Role[]; onClose: () => void; onSaved: () => void }) {
  const existingUser = useQuery({ queryKey: ['user', editor.id], queryFn: () => usersApi.get(editor.id!), enabled: editor.type === 'user' && Boolean(editor.id) });
  const existingRole = useQuery({ queryKey: ['role', editor.id], queryFn: () => rolesApi.get(editor.id!), enabled: editor.type === 'role' && Boolean(editor.id) });
  const existingPermission = useQuery({ queryKey: ['permission', editor.id], queryFn: () => permissionsApi.get(editor.id!), enabled: editor.type === 'permission' && Boolean(editor.id) });
  const [name, setName] = useState(''); const [email, setEmail] = useState(''); const [password, setPassword] = useState(''); const [roleId, setRoleId] = useState('');
  useEffect(() => {
    const u = existingUser.data; const r = existingRole.data; const p = existingPermission.data;
    if (!u && !r && !p) return;
    setName(u?.name ?? r?.name ?? p?.name ?? '');
    setEmail(u?.email ?? '');
    setRoleId(u ? String(roles.find((item) => item.name === u.role)?.id ?? '') : '');
  }, [existingUser.data, existingRole.data, existingPermission.data, roles]);
  const save = useMutation({ mutationFn: async () => { if (editor.type === 'user') return editor.id ? usersApi.update(editor.id, { name, email, roleId: roleId ? Number(roleId) : undefined }) : usersApi.create({ name, email, password, roleId: Number(roleId) }); if (editor.type === 'role') return editor.id ? rolesApi.update(editor.id, { name }) : rolesApi.create({ name }); return editor.id ? permissionsApi.update(editor.id, { name }) : permissionsApi.create({ name }); }, onSuccess: () => { onSaved(); onClose(); }, onError: () => undefined });
  const title = `${editor.id ? 'Edit' : 'Create'} ${editor.type}`;
  return <Dialog open onClose={onClose} fullWidth maxWidth="sm"><DialogTitle>{title}<IconButton onClick={onClose} sx={{ position: 'absolute', right: 10, top: 10 }}><X size={18} /></IconButton></DialogTitle><DialogContent dividers><Stack gap={2} sx={{ pt: 1 }}><TextField label={editor.type === 'permission' ? 'Permission name' : 'Name'} value={name} onChange={(e) => setName(e.target.value)} required />{editor.type === 'user' && <><TextField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />{!editor.id && <TextField label="Temporary password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required helperText="Minimum 8 characters." />}<FormControl fullWidth required><InputLabel>Role</InputLabel><Select label="Role" value={roleId} onChange={(e) => setRoleId(e.target.value)}>{roles.map((role) => <MenuItem key={role.id} value={role.id}>{role.name}</MenuItem>)}</Select></FormControl></>}{save.isError && <Alert severity="error">Unable to save this record. Check the values and your permissions.</Alert>}</Stack></DialogContent><DialogActions sx={{ p: 2 }}><Button variant="outlined" onClick={onClose}>Cancel</Button><Button variant="contained" onClick={() => save.mutate()} disabled={save.isPending || !name.trim() || (editor.type === 'user' && (!email.trim() || (!editor.id && password.length < 8) || !roleId))}>{save.isPending ? 'Saving…' : 'Save'}</Button></DialogActions></Dialog>;
}

function PermissionMatrix({ role, permissions, onClose }: { role: Role; permissions: Permission[]; onClose: () => void }) {
  const current = useQuery({ queryKey: ['role-permissions', role.id], queryFn: () => rolePermissionsApi.list(role.id) });
  const [selected, setSelected] = useState<number[]>([]);
  useEffect(() => { if (current.data) setSelected(current.data.map((permission) => permission.id)); }, [current.data]);
  const save = useMutation({ mutationFn: () => rolePermissionsApi.update(role.id, selected), onSuccess: onClose });
  const toggle = (id: number) => setSelected((items) => items.includes(id) ? items.filter((item) => item !== id) : [...items, id]);
  return <Dialog open onClose={onClose} fullWidth maxWidth="md"><DialogTitle>Permissions · {role.name}<IconButton onClick={onClose} sx={{ position: 'absolute', right: 10, top: 10 }}><X size={18} /></IconButton></DialogTitle><DialogContent dividers><Stack gap={1}>{permissions.map((permission) => <GlassCard key={permission.id} sx={{ p: 1.25 }}><Stack direction="row" justifyContent="space-between" alignItems="center"><Box><Typography fontWeight={700}>{permission.name}</Typography><Typography variant="caption" color="text.secondary">Grant this capability to {role.name}</Typography></Box><Switch checked={selected.includes(permission.id)} onChange={() => toggle(permission.id)} /></Stack></GlassCard>)}</Stack></DialogContent><DialogActions sx={{ p: 2 }}><Typography variant="caption" color="text.secondary" sx={{ mr: 'auto' }}>{selected.length} selected</Typography><Button variant="outlined" onClick={onClose}>Cancel</Button><Button variant="contained" onClick={() => save.mutate()} disabled={save.isPending}>{save.isPending ? 'Applying…' : 'Apply permissions'}</Button></DialogActions></Dialog>;
}
