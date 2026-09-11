import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
    Activity,
    BriefcaseBusiness,
    ClipboardList,
    FileText,
    Gauge,
    Inbox,
    Menu as MenuIcon,
    MessageSquareQuote,
    Moon,
    Search,
    Settings2,
    ShieldCheck,
    Sun,
    Users,
    Video,
    X,
} from 'lucide-react';
import {
    Box,
    Divider,
    Drawer,
    IconButton,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Menu,
    MenuItem,
    Stack,
    Tooltip,
    Typography,
} from '@mui/material';
import {
    Outlet,
    useLocation,
    useNavigate,
} from 'react-router-dom';
import { useAppTheme } from '../../theme/ThemeProvider';
import { useAuth } from '../../features/auth/AuthContext';
import { CommandPalette } from '../ui/CommandPalette';

const MotionDiv = motion.create('div');

const nav = [
    {
        label: 'Overview',
        path: '/admin/dashboard',
        icon: Gauge,
    },
    {
        label: 'Jobs',
        path: '/admin/jobs',
        icon: BriefcaseBusiness,
    },
    {
        label: 'Applications',
        path: '/admin/applications',
        icon: ClipboardList,
    },
    {
        label: 'Inquiries',
        path: '/admin/inquiries',
        icon: Inbox,
    },
    {
        label: 'Contacts',
        path: '/admin/contacts',
        icon: Activity,
    },
    {
        label: 'Articles',
        path: '/admin/articles',
        icon: FileText,
    },
    {
        label: 'Videos',
        path: '/admin/videos',
        icon: Video,
    },
    {
        label: 'Reviews',
        path: '/admin/reviews',
        icon: MessageSquareQuote,
    },
    {
        label: 'Users & Roles',
        path: '/admin/users',
        icon: Users,
    },
    {
        label: 'Audit & Security',
        path: '/admin/security',
        icon: ShieldCheck,
    },
];

function Sidebar({
                     mobile = false,
                     onClose,
                 }: {
    mobile?: boolean;
    onClose?: () => void;
}) {
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [commandOpen, setCommandOpen] =
        useState(false);

    useEffect(() => {
        const handler = (event: KeyboardEvent) => {
            if (
                (event.ctrlKey || event.metaKey) &&
                event.key.toLowerCase() === 'k'
            ) {
                event.preventDefault();
                setCommandOpen(true);
            }
        };

        window.addEventListener(
            'keydown',
            handler,
        );

        return () => {
            window.removeEventListener(
                'keydown',
                handler,
            );
        };
    }, []);

    return (
        <Box
            sx={{
                width: mobile ? 292 : 258,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                p: 1.75,
            }}
        >
            <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{
                    px: 1,
                    py: 1,
                    mb: 2,
                }}
            >
                <Stack
                    direction="row"
                    alignItems="center"
                    gap={1.2}
                >
                    <Box
                        sx={{
                            width: 40,
                            height: 40,
                            borderRadius: 2.5,
                            display: 'grid',
                            placeItems: 'center',
                            bgcolor: 'primary.main',
                            color: 'primary.contrastText',
                            boxShadow:
                                '0 14px 34px rgba(16,42,67,.20)',
                        }}
                    >
                        <Typography fontWeight={900}>
                            HV
                        </Typography>
                    </Box>

                    <Box>
                        <Typography
                            fontWeight={900}
                            lineHeight={1}
                        >
                            HireVibe
                        </Typography>

                        <Typography
                            variant="caption"
                            color="text.secondary"
                            letterSpacing=".14em"
                        >
                            CONSULTANTS
                        </Typography>
                    </Box>
                </Stack>

                {mobile && (
                    <IconButton onClick={onClose}>
                        <X size={19} />
                    </IconButton>
                )}
            </Stack>

            <List
                sx={{
                    display: 'grid',
                    gap: 0.45,
                }}
            >
                {nav.map(
                    ({
                         label,
                         path,
                         icon: Icon,
                     }) => {
                        const active =
                            path === '/'
                                ? location.pathname ===
                                '/admin/dashboard'
                                : location.pathname.startsWith(
                                    path,
                                );

                        return (
                            <ListItemButton
                                key={path}
                                selected={active}
                                onClick={() => {
                                    navigate(path);
                                    onClose?.();
                                }}
                                sx={{
                                    position: 'relative',
                                    borderRadius: 2.75,
                                    py: 1.1,
                                    color: active
                                        ? 'primary.contrastText'
                                        : 'text.secondary',
                                    '&.Mui-selected': {
                                        bgcolor: 'primary.main',
                                        color:
                                            'primary.contrastText',
                                        '&:hover': {
                                            bgcolor:
                                                'primary.dark',
                                        },
                                    },
                                    '&:hover': {
                                        color: 'text.primary',
                                        bgcolor:
                                            'action.hover',
                                    },
                                }}
                            >
                                <ListItemIcon
                                    sx={{
                                        minWidth: 38,
                                        color: 'inherit',
                                    }}
                                >
                                    <Icon size={19} />
                                </ListItemIcon>

                                <ListItemText
                                    primary={label}
                                    primaryTypographyProps={{
                                        fontSize: 13.5,
                                        fontWeight: active
                                            ? 800
                                            : 600,
                                    }}
                                />
                            </ListItemButton>
                        );
                    },
                )}
            </List>

            <Box sx={{ flex: 1 }} />

            <Divider
                sx={{
                    mb: 1.2,
                }}
            />

            <ListItemButton
                onClick={() => {
                    navigate('/admin/settings');
                    onClose?.();
                }}
                sx={{
                    borderRadius: 2.5,
                }}
            >
                <ListItemIcon
                    sx={{
                        minWidth: 38,
                    }}
                >
                    <Settings2 size={19} />
                </ListItemIcon>

                <ListItemText
                    primary="Appearance"
                    primaryTypographyProps={{
                        fontSize: 13.5,
                        fontWeight: 650,
                    }}
                />
            </ListItemButton>

            {user && (
                <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{
                        px: 1.5,
                        pt: 1,
                    }}
                >
                    {user.name} · {user.role}
                </Typography>
            )}
        </Box>
    );
}

export function AppShell() {
    const [
        mobileOpen,
        setMobileOpen,
    ] = useState(false);

    const {
        mode,
        toggleMode,
    } = useAppTheme();

    const location = useLocation();
    const navigate = useNavigate();

    const {
        user,
        logout,
    } = useAuth();

    const [
        commandOpen,
        setCommandOpen,
    ] = useState(false);

    const [
        accountAnchor,
        setAccountAnchor,
    ] = useState<HTMLElement | null>(
        null,
    );

    useEffect(() => {
        const handler = (event: KeyboardEvent) => {
            if (
                (event.ctrlKey || event.metaKey) &&
                event.key.toLowerCase() === 'k'
            ) {
                event.preventDefault();
                setCommandOpen(true);
            }
        };

        window.addEventListener(
            'keydown',
            handler,
        );

        return () => {
            window.removeEventListener(
                'keydown',
                handler,
            );
        };
    }, []);

    const closeAccountMenu = () => {
        setAccountAnchor(null);
    };

    return (
        <Box
            sx={{
                display: 'flex',
                minHeight: '100vh',
                position: 'relative',
            }}
        >
            <Box
                component="aside"
                sx={{
                    display: {
                        xs: 'none',
                        lg: 'block',
                    },
                    width: 258,
                    flexShrink: 0,
                    position: 'fixed',
                    inset: '0 auto 0 0',
                    zIndex: 20,
                    borderRight: '1px solid',
                    borderColor: 'divider',
                    bgcolor: 'background.paper',
                }}
            >
                <Sidebar />
            </Box>

            <Drawer
                open={mobileOpen}
                onClose={() =>
                    setMobileOpen(false)
                }
                sx={{
                    display: {
                        lg: 'none',
                    },
                }}
                PaperProps={{
                    sx: {
                        bgcolor: 'background.paper',
                    },
                }}
            >
                <Sidebar
                    mobile
                    onClose={() =>
                        setMobileOpen(false)
                    }
                />
            </Drawer>

            <Box
                component="main"
                sx={{
                    flex: 1,
                    ml: {
                        lg: '258px',
                    },
                    minWidth: 0,
                }}
            >
                <Box
                    component="header"
                    sx={{
                        height: 72,
                        px: {
                            xs: 2,
                            md: 3.5,
                        },
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent:
                            'space-between',
                        position: 'sticky',
                        top: 0,
                        zIndex: 10,
                        borderBottom: '1px solid',
                        borderColor: 'divider',
                        bgcolor:
                            'background.default',
                        backdropFilter:
                            'blur(18px)',
                    }}
                >
                    <Stack
                        direction="row"
                        alignItems="center"
                        gap={1.25}
                    >
                        <IconButton
                            onClick={() =>
                                setMobileOpen(true)
                            }
                            sx={{
                                display: {
                                    lg: 'none',
                                },
                            }}
                        >
                            <MenuIcon size={21} />
                        </IconButton>

                        <Box>
                            <Typography
                                variant="caption"
                                color="text.secondary"
                                fontWeight={700}
                            >
                                ENTERPRISE WORKSPACE
                            </Typography>

                            <Typography
                                variant="body2"
                                fontWeight={750}
                                sx={{
                                    textTransform:
                                        'capitalize',
                                }}
                            >
                                {location.pathname ===
                                '/admin/dashboard'
                                    ? 'Command Center'
                                    : location.pathname
                                        .split('/')
                                        .filter(Boolean)
                                        .join(' / ')
                                        .replaceAll(
                                            '-',
                                            ' ',
                                        )}
                            </Typography>
                        </Box>
                    </Stack>

                    <Stack
                        direction="row"
                        alignItems="center"
                        gap={1}
                    >
                        <Tooltip title="Search workspace">
                            <Box
                                component="button"
                                className="hv-focus-ring"
                                onClick={() =>
                                    setCommandOpen(true)
                                }
                                sx={{
                                    display: {
                                        xs: 'none',
                                        sm: 'flex',
                                    },
                                    alignItems:
                                        'center',
                                    gap: 0.8,
                                    border:
                                        '1px solid',
                                    borderColor:
                                        'divider',
                                    borderRadius: 2.5,
                                    bgcolor:
                                        'background.paper',
                                    color:
                                        'text.secondary',
                                    px: 1.25,
                                    py: 0.7,
                                    cursor: 'pointer',
                                }}
                            >
                                <Search size={16} />

                                <Typography
                                    variant="caption"
                                    fontWeight={700}
                                >
                                    Search
                                </Typography>

                                <Typography
                                    variant="caption"
                                    sx={{
                                        ml: 0.6,
                                        px: 0.55,
                                        py: 0.15,
                                        border:
                                            '1px solid',
                                        borderColor:
                                            'divider',
                                        borderRadius: 1,
                                    }}
                                >
                                    ⌘K
                                </Typography>
                            </Box>
                        </Tooltip>

                        <Tooltip
                            title={
                                mode === 'dark'
                                    ? 'Switch to light mode'
                                    : 'Switch to dark mode'
                            }
                        >
                            <IconButton
                                onClick={toggleMode}
                            >
                                {mode === 'dark' ? (
                                    <Sun size={19} />
                                ) : (
                                    <Moon size={19} />
                                )}
                            </IconButton>
                        </Tooltip>

                        <Tooltip title="Account">
                            <IconButton
                                aria-label="Open account menu"
                                onClick={(event) =>
                                    setAccountAnchor(
                                        event.currentTarget,
                                    )
                                }
                                sx={{
                                    p: 0.25,
                                }}
                            >
                                <Box
                                    sx={{
                                        width: 38,
                                        height: 38,
                                        borderRadius: '50%',
                                        bgcolor:
                                            'primary.main',
                                        color:
                                            'primary.contrastText',
                                        display: 'grid',
                                        placeItems:
                                            'center',
                                        fontWeight: 900,
                                        boxShadow:
                                            '0 8px 22px rgba(16,42,67,.16)',
                                        transition:
                                            'transform .2s ease, box-shadow .2s ease',
                                        '&:hover': {
                                            transform:
                                                'translateY(-1px)',
                                            boxShadow:
                                                '0 12px 28px rgba(16,42,67,.22)',
                                        },
                                    }}
                                >
                                    {(
                                        user?.name?.[0] ??
                                        'H'
                                    ).toUpperCase()}
                                </Box>
                            </IconButton>
                        </Tooltip>

                        <Menu
                            anchorEl={accountAnchor}
                            open={Boolean(
                                accountAnchor,
                            )}
                            onClose={
                                closeAccountMenu
                            }
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'right',
                            }}
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                        >
                            <MenuItem disabled>
                                {user?.name ??
                                    'HireVibe Admin'}
                            </MenuItem>

                            <Divider />

                            <MenuItem
                                onClick={() => {
                                    closeAccountMenu();
                                    navigate(
                                        '/admin/settings',
                                    );
                                }}
                            >
                                Change password
                            </MenuItem>

                            <MenuItem
                                onClick={() => {
                                    closeAccountMenu();
                                    navigate('/');
                                }}
                            >
                                Go to website
                            </MenuItem>

                            <MenuItem
                                onClick={() => {
                                    closeAccountMenu();
                                    void logout();
                                }}
                            >
                                Logout
                            </MenuItem>
                        </Menu>
                    </Stack>
                </Box>

                <AnimatePresence
                    mode="wait"
                    initial={false}
                >
                    <MotionDiv
                        key={location.pathname}
                        initial={{
                            opacity: 0,
                            y: 10,
                        }}
                        animate={{
                            opacity: 1,
                            y: 0,
                        }}
                        exit={{
                            opacity: 0,
                            y: -6,
                        }}
                        transition={{
                            duration: 0.25,
                            ease: 'easeOut',
                        }}
                    >
                        <Box
                            sx={{
                                p: {
                                    xs: 2,
                                    md: 3.5,
                                    xl: 5,
                                },
                                maxWidth: 1800,
                                mx: 'auto',
                            }}
                        >
                            <Outlet />
                        </Box>
                    </MotionDiv>
                </AnimatePresence>
            </Box>

            <CommandPalette
                open={commandOpen}
                onClose={() =>
                    setCommandOpen(false)
                }
            />
        </Box>
    );
}