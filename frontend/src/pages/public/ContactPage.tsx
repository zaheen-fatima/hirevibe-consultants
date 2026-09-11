import { useState, type ReactNode } from 'react';
import { useMutation } from '@tanstack/react-query';
import {
    Alert,
    Box,
    Button,
    Container,
    Grid,
    MenuItem,
    Stack,
    TextField,
    ToggleButton,
    ToggleButtonGroup,
    Typography,
} from '@mui/material';
import {
    ArrowLeft,
    ArrowRight,
    BriefcaseBusiness,
    Building2,
    Mail,
    MapPin,
    MessageCircle,
    Phone,
    Send,
} from 'lucide-react';
import { Link } from 'react-router-dom';

import {
    contactsApi,
    inquiriesApi,
} from '../../services/backend';

import { GlassCard } from '../../components/ui/GlassCard';
import { PublicLayout } from '../../components/public/PublicSite';

type CommunicationMode = 'contact' | 'inquiry';

type CommunicationForm = {
    name: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
    company: string;
    serviceType: string;
    hiringRequirement: string;
    location: string;
};

const initialForm: CommunicationForm = {
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    company: '',
    serviceType: '',
    hiringRequirement: '',
    location: '',
};

export function ContactPage() {
    const [mode, setMode] =
        useState<CommunicationMode>('contact');

    const [form, setForm] =
        useState<CommunicationForm>(initialForm);

    const mutation = useMutation({
        mutationFn: async () => {
            /*
             * General enquiries belong to Contacts.
             * Recruitment/business enquiries belong to Inquiries.
             *
             * This preserves the distinction already implemented
             * by the backend.
             */
            if (mode === 'inquiry') {
                return inquiriesApi.create({
                    name: form.name.trim(),
                    email: form.email.trim(),
                    phone: form.phone.trim(),
                    company: form.company.trim(),
                    serviceType: form.serviceType.trim(),
                    hiringRequirement:
                        form.hiringRequirement.trim(),
                    location: form.location.trim(),
                    subject: form.subject.trim(),
                    message: form.message.trim(),
                });
            }

            return contactsApi.create({
                name: form.name.trim(),
                email: form.email.trim(),
                phone: form.phone.trim(),
                subject: form.subject.trim(),
                message: form.message.trim(),
            });
        },

        onSuccess: () => {
            setForm(initialForm);
        },
    });

    const isInquiry =
        mode === 'inquiry';

    const canSubmit =
        Boolean(
            form.name.trim() &&
            form.email.trim() &&
            form.phone.trim() &&
            form.subject.trim() &&
            form.message.trim() &&
            (!isInquiry ||
                (
                    form.serviceType.trim() &&
                    form.hiringRequirement.trim()
                )),
        );

    function updateField(
        field: keyof CommunicationForm,
        value: string,
    ) {
        setForm((current) => ({
            ...current,
            [field]: value,
        }));

        if (
            mutation.isError ||
            mutation.isSuccess
        ) {
            mutation.reset();
        }
    }

    function handleModeChange(
        _event: React.MouseEvent<HTMLElement>,
        value: CommunicationMode | null,
    ) {
        if (!value || value === mode) {
            return;
        }

        setMode(value);
        mutation.reset();
    }

    return (
        <PublicLayout>
            <section className="hv-page-hero">
                <Container maxWidth="xl">
                    <Button
                        component={Link}
                        to="/"
                        startIcon={<ArrowLeft size={16} />}
                        sx={{ mb: 2 }}
                    >
                        Back home
                    </Button>

                    <Typography className="hv-section-eyebrow">
                        CONTACT HIREVIBE
                    </Typography>

                    <Typography className="hv-page-title">
                        A conversation can clarify the next move.
                    </Typography>

                    <Typography
                        sx={{
                            maxWidth: 700,
                            color: 'text.secondary',
                            mt: 2,
                            fontSize: '1.05rem',
                        }}
                    >
                        Whether you are exploring an opportunity,
                        need recruitment support, or simply want to
                        ask a question, choose the route that best
                        describes what you need.
                    </Typography>
                </Container>
            </section>

            <Container
                maxWidth="xl"
                sx={{
                    py: {
                        xs: 6,
                        md: 9,
                    },
                }}
            >
                <Grid
                    container
                    spacing={2.5}
                >
                    <Grid
                        size={{
                            xs: 12,
                            md: 5,
                        }}
                    >
                        <GlassCard
                            sx={{
                                height: '100%',
                                p: 0,
                                overflow: 'hidden',
                                background:
                                    'linear-gradient(145deg,#102a43,#173b59)',
                                color: '#fff',
                            }}
                        >
                            <Box className="hv-contact-page-image">
                                <Box
                                    component="img"
                                    src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1200&q=82"
                                    alt="HireVibe recruitment conversation"
                                />
                            </Box>

                            <Box
                                sx={{
                                    p: {
                                        xs: 2.5,
                                        md: 4,
                                    },
                                }}
                            >
                                <Typography
                                    className="hv-kicker"
                                    sx={{
                                        color:
                                            'var(--hv-gold-soft) !important',
                                    }}
                                >
                                    LET'S CONNECT
                                </Typography>

                                <Typography
                                    sx={{
                                        mt: 1.2,
                                        fontSize:
                                            'clamp(2.2rem, 4.5vw, 4rem)',
                                        lineHeight: 1,
                                        letterSpacing: '-.05em',
                                        fontWeight: 560,
                                    }}
                                >
                                    Good recruitment starts with a
                                    useful conversation.
                                </Typography>

                                <Typography
                                    sx={{
                                        mt: 2,
                                        color: 'rgba(255,255,255,.7)',
                                    }}
                                >
                                    HireVibe is focused on responsive
                                    sourcing, structured screening and
                                    consistent candidate coordination
                                    across practical hiring needs.
                                </Typography>

                                <Stack
                                    gap={1.8}
                                    sx={{ mt: 4 }}
                                >
                                    <Info
                                        icon={
                                            <MapPin size={17} />
                                        }
                                        label="Location"
                                        value="Delhi, India"
                                    />

                                    <ContactInfoLink
                                        icon={<Mail size={17} />}
                                        label="Email"
                                        value="hr@hirevibe.in"
                                        href="mailto:hr@hirevibe.in"
                                    />

                                    <ContactInfoLink
                                        icon={<Phone size={17} />}
                                        label="Phone"
                                        value="+91 9205364608"
                                        href="tel:+919205364608"
                                    />

                                    <Info
                                        icon={
                                            <MessageCircle size={17} />
                                        }
                                        label="Candidate support"
                                        value="Tell us the role, location or profile you have in mind"
                                    />
                                </Stack>
                            </Box>
                        </GlassCard>
                    </Grid>

                    <Grid
                        size={{
                            xs: 12,
                            md: 7,
                        }}
                    >
                        <GlassCard
                            sx={{
                                p: {
                                    xs: 2.5,
                                    md: 4,
                                },
                            }}
                        >
                            <Typography variant="h4">
                                Get in touch
                            </Typography>

                            <Typography
                                color="text.secondary"
                                sx={{
                                    mt: 0.6,
                                    mb: 2.5,
                                }}
                            >
                                Tell us what you need and we will
                                route your message to the right
                                communication channel.
                            </Typography>

                            <Stack gap={2.2}>
                                <Box>
                                    <Typography
                                        variant="subtitle2"
                                        sx={{
                                            mb: 1,
                                            fontWeight: 650,
                                        }}
                                    >
                                        What are you contacting HireVibe about?
                                    </Typography>

                                    <ToggleButtonGroup
                                        value={mode}
                                        exclusive
                                        fullWidth
                                        onChange={handleModeChange}
                                        aria-label="communication type"
                                        sx={{
                                            display: 'grid',
                                            gridTemplateColumns: {
                                                xs: '1fr',
                                                sm: '1fr 1fr',
                                            },
                                            '& .MuiToggleButton-root':
                                                {
                                                    minHeight: 76,
                                                    px: 2,
                                                    textTransform: 'none',
                                                    justifyContent:
                                                        'flex-start',
                                                    borderColor:
                                                        'divider',
                                                    transition:
                                                        'transform .2s ease, background-color .2s ease, border-color .2s ease',
                                                    '&:hover': {
                                                        transform:
                                                            'translateY(-1px)',
                                                        bgcolor:
                                                            'action.hover',
                                                    },
                                                    '&.Mui-selected': {
                                                        bgcolor:
                                                            'action.selected',
                                                    },
                                                },
                                        }}
                                    >
                                        <ToggleButton
                                            value="contact"
                                            aria-label="general enquiry"
                                        >
                                            <Stack
                                                direction="row"
                                                spacing={1.5}
                                                alignItems="center"
                                                sx={{
                                                    width: '100%',
                                                    textAlign: 'left',
                                                }}
                                            >
                                                <Box
                                                    sx={{
                                                        width: 38,
                                                        height: 38,
                                                        borderRadius: 2,
                                                        display: 'grid',
                                                        placeItems: 'center',
                                                        flexShrink: 0,
                                                        bgcolor:
                                                            'action.hover',
                                                    }}
                                                >
                                                    <MessageCircle
                                                        size={18}
                                                    />
                                                </Box>

                                                <Box>
                                                    <Typography
                                                        variant="body2"
                                                        sx={{
                                                            fontWeight: 650,
                                                        }}
                                                    >
                                                        General enquiry
                                                    </Typography>

                                                    <Typography
                                                        variant="caption"
                                                        color="text.secondary"
                                                    >
                                                        Questions or candidate support
                                                    </Typography>
                                                </Box>
                                            </Stack>
                                        </ToggleButton>

                                        <ToggleButton
                                            value="inquiry"
                                            aria-label="recruitment enquiry"
                                        >
                                            <Stack
                                                direction="row"
                                                spacing={1.5}
                                                alignItems="center"
                                                sx={{
                                                    width: '100%',
                                                    textAlign: 'left',
                                                }}
                                            >
                                                <Box
                                                    sx={{
                                                        width: 38,
                                                        height: 38,
                                                        borderRadius: 2,
                                                        display: 'grid',
                                                        placeItems: 'center',
                                                        flexShrink: 0,
                                                        bgcolor:
                                                            'action.hover',
                                                    }}
                                                >
                                                    <BriefcaseBusiness
                                                        size={18}
                                                    />
                                                </Box>

                                                <Box>
                                                    <Typography
                                                        variant="body2"
                                                        sx={{
                                                            fontWeight: 650,
                                                        }}
                                                    >
                                                        Recruitment enquiry
                                                    </Typography>

                                                    <Typography
                                                        variant="caption"
                                                        color="text.secondary"
                                                    >
                                                        Hiring or recruitment support
                                                    </Typography>
                                                </Box>
                                            </Stack>
                                        </ToggleButton>
                                    </ToggleButtonGroup>
                                </Box>

                                <Alert
                                    severity="info"
                                    icon={
                                        isInquiry
                                            ? <BriefcaseBusiness size={18} />
                                            : <MessageCircle size={18} />
                                    }
                                >
                                    {isInquiry
                                        ? 'This message will be sent as a recruitment or business enquiry for the HireVibe team to review.'
                                        : 'This message will be sent as a general contact request.'}
                                </Alert>

                                {isInquiry && (
                                    <Box
                                        sx={{
                                            p: {
                                                xs: 2,
                                                sm: 2.5,
                                            },
                                            borderRadius: 3,
                                            border: '1px solid',
                                            borderColor: 'divider',
                                            bgcolor: 'action.hover',
                                        }}
                                    >
                                        <Stack gap={1.8}>
                                            <Box>
                                                <Typography
                                                    variant="subtitle2"
                                                    sx={{
                                                        fontWeight: 750,
                                                    }}
                                                >
                                                    Recruitment details
                                                </Typography>

                                                <Typography
                                                    variant="body2"
                                                    color="text.secondary"
                                                    sx={{ mt: 0.35 }}
                                                >
                                                    A few additional details help the HireVibe team route your request to the right recruitment workflow.
                                                </Typography>
                                            </Box>

                                            <Grid
                                                container
                                                spacing={1.6}
                                            >
                                                <Grid
                                                    size={{
                                                        xs: 12,
                                                        sm: 6,
                                                    }}
                                                >
                                                    <TextField
                                                        fullWidth
                                                        label="Company"
                                                        value={
                                                            form.company
                                                        }
                                                        onChange={(
                                                            event,
                                                        ) =>
                                                            updateField(
                                                                'company',
                                                                event.target
                                                                    .value,
                                                            )
                                                        }
                                                        slotProps={{
                                                            input: {
                                                                startAdornment:
                                                                    (
                                                                        <Building2
                                                                            size={
                                                                                16
                                                                            }
                                                                            style={{
                                                                                marginRight:
                                                                                    8,
                                                                            }}
                                                                        />
                                                                    ),
                                                            },
                                                        }}
                                                    />
                                                </Grid>

                                                <Grid
                                                    size={{
                                                        xs: 12,
                                                        sm: 6,
                                                    }}
                                                >
                                                    <TextField
                                                        select
                                                        fullWidth
                                                        required
                                                        label="Service type"
                                                        value={
                                                            form.serviceType
                                                        }
                                                        onChange={(
                                                            event,
                                                        ) =>
                                                            updateField(
                                                                'serviceType',
                                                                event.target
                                                                    .value,
                                                            )
                                                        }
                                                    >
                                                        <MenuItem
                                                            value=""
                                                            disabled
                                                        >
                                                            Select a service
                                                        </MenuItem>

                                                        <MenuItem value="Permanent hiring">
                                                            Permanent hiring
                                                        </MenuItem>

                                                        <MenuItem value="Contract staffing">
                                                            Contract staffing
                                                        </MenuItem>

                                                        <MenuItem value="Candidate sourcing">
                                                            Candidate sourcing
                                                        </MenuItem>

                                                        <MenuItem value="Recruitment support">
                                                            Recruitment support
                                                        </MenuItem>

                                                        <MenuItem value="Other">
                                                            Other
                                                        </MenuItem>
                                                    </TextField>
                                                </Grid>

                                                <Grid
                                                    size={{
                                                        xs: 12,
                                                        sm: 6,
                                                    }}
                                                >
                                                    <TextField
                                                        fullWidth
                                                        label="Hiring location"
                                                        value={
                                                            form.location
                                                        }
                                                        onChange={(
                                                            event,
                                                        ) =>
                                                            updateField(
                                                                'location',
                                                                event.target
                                                                    .value,
                                                            )
                                                        }
                                                        slotProps={{
                                                            input: {
                                                                startAdornment:
                                                                    (
                                                                        <MapPin
                                                                            size={
                                                                                16
                                                                            }
                                                                            style={{
                                                                                marginRight:
                                                                                    8,
                                                                            }}
                                                                        />
                                                                    ),
                                                            },
                                                        }}
                                                    />
                                                </Grid>

                                                <Grid
                                                    size={{
                                                        xs: 12,
                                                    }}
                                                >
                                                    <TextField
                                                        fullWidth
                                                        required
                                                        label="Hiring requirement"
                                                        multiline
                                                        minRows={3}
                                                        value={
                                                            form.hiringRequirement
                                                        }
                                                        onChange={(
                                                            event,
                                                        ) =>
                                                            updateField(
                                                                'hiringRequirement',
                                                                event.target
                                                                    .value,
                                                            )
                                                        }
                                                        placeholder="Tell us about the role, number of hires, experience level or timeline."
                                                    />
                                                </Grid>
                                            </Grid>
                                        </Stack>
                                    </Box>
                                )}

                                <Grid
                                    container
                                    spacing={1.6}
                                >
                                    <Grid
                                        size={{
                                            xs: 12,
                                            sm: 6,
                                        }}
                                    >
                                        <TextField
                                            fullWidth
                                            label="Name"
                                            value={form.name}
                                            onChange={(event) =>
                                                updateField(
                                                    'name',
                                                    event.target.value,
                                                )
                                            }
                                            required
                                        />
                                    </Grid>

                                    <Grid
                                        size={{
                                            xs: 12,
                                            sm: 6,
                                        }}
                                    >
                                        <TextField
                                            fullWidth
                                            label="Email"
                                            type="email"
                                            value={form.email}
                                            onChange={(event) =>
                                                updateField(
                                                    'email',
                                                    event.target.value,
                                                )
                                            }
                                            required
                                        />
                                    </Grid>

                                    <Grid
                                        size={{
                                            xs: 12,
                                            sm: 6,
                                        }}
                                    >
                                        <TextField
                                            fullWidth
                                            label="Phone"
                                            value={form.phone}
                                            onChange={(event) =>
                                                updateField(
                                                    'phone',
                                                    event.target.value,
                                                )
                                            }
                                            required
                                            slotProps={{
                                                input: {
                                                    startAdornment: (
                                                        <Phone
                                                            size={16}
                                                            style={{
                                                                marginRight: 8,
                                                            }}
                                                        />
                                                    ),
                                                },
                                            }}
                                        />
                                    </Grid>

                                    <Grid
                                        size={{
                                            xs: 12,
                                            sm: 6,
                                        }}
                                    >
                                        <TextField
                                            fullWidth
                                            label="Subject"
                                            value={form.subject}
                                            onChange={(event) =>
                                                updateField(
                                                    'subject',
                                                    event.target.value,
                                                )
                                            }
                                            required
                                        />
                                    </Grid>
                                </Grid>

                                <TextField
                                    fullWidth
                                    label={
                                        isInquiry
                                            ? 'Additional message'
                                            : 'Message'
                                    }
                                    multiline
                                    minRows={6}
                                    value={form.message}
                                    onChange={(event) =>
                                        updateField(
                                            'message',
                                            event.target.value,
                                        )
                                    }
                                    required
                                />

                                {mutation.isError && (
                                    <Alert severity="error">
                                        We could not send your message.
                                        Please verify the details and
                                        try again.
                                    </Alert>
                                )}

                                {mutation.isSuccess && (
                                    <Alert severity="success">
                                        Thank you. Your{' '}
                                        {isInquiry
                                            ? 'recruitment enquiry'
                                            : 'message'}{' '}
                                        has been sent to HireVibe.
                                    </Alert>
                                )}

                                <Button
                                    variant="contained"
                                    size="large"
                                    endIcon={
                                        <Send size={16} />
                                    }
                                    disabled={
                                        mutation.isPending ||
                                        !canSubmit
                                    }
                                    onClick={() =>
                                        mutation.mutate()
                                    }
                                    sx={{
                                        alignSelf: 'flex-start',
                                        px: 2.6,
                                    }}
                                >
                                    {mutation.isPending
                                        ? 'Sending…'
                                        : isInquiry
                                            ? 'Send recruitment enquiry'
                                            : 'Send message'}
                                </Button>
                            </Stack>
                        </GlassCard>
                    </Grid>
                </Grid>

                <Box
                    sx={{
                        mt: 3,
                        textAlign: 'center',
                    }}
                >
                    <Button
                        component={Link}
                        to="/#open-roles"
                        endIcon={
                            <ArrowRight size={16} />
                        }
                    >
                        Browse current opportunities
                    </Button>
                </Box>
            </Container>
        </PublicLayout>
    );
}

function Info({
                  icon,
                  label,
                  value,
              }: {
    icon: ReactNode;
    label: string;
    value: string;
}) {
    return (
        <Stack
            direction="row"
            gap={1.3}
        >
            <Box
                sx={{
                    width: 38,
                    height: 38,
                    display: 'grid',
                    placeItems: 'center',
                    borderRadius: 2,
                    bgcolor:
                        'rgba(224,184,90,.12)',
                    color:
                        'var(--hv-gold-soft)',
                    flexShrink: 0,
                }}
            >
                {icon}
            </Box>

            <Box>
                <Typography
                    variant="caption"
                    sx={{
                        color:
                            'rgba(255,255,255,.52)',
                    }}
                >
                    {label}
                </Typography>

                <Typography
                    variant="body2"
                    sx={{
                        mt: 0.15,
                        color:
                            'rgba(255,255,255,.82)',
                    }}
                >
                    {value}
                </Typography>
            </Box>
        </Stack>
    );
}

function ContactInfoLink({
                             icon,
                             label,
                             value,
                             href,
                         }: {
    icon: ReactNode;
    label: string;
    value: string;
    href: string;
}) {
    return (
        <Box
            component="a"
            href={href}
            sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.3,
                color: 'inherit',
                textDecoration: 'none',
                borderRadius: 2,
                transition:
                    'transform .2s ease, opacity .2s ease',
                '&:hover': {
                    transform: 'translateX(3px)',
                    opacity: 0.92,
                },
                '&:focus-visible': {
                    outline: '2px solid',
                    outlineColor: 'var(--hv-gold-soft)',
                    outlineOffset: 3,
                },
            }}
        >
            <Box
                sx={{
                    width: 38,
                    height: 38,
                    display: 'grid',
                    placeItems: 'center',
                    borderRadius: 2,
                    bgcolor:
                        'rgba(224,184,90,.12)',
                    color:
                        'var(--hv-gold-soft)',
                    flexShrink: 0,
                }}
            >
                {icon}
            </Box>

            <Box>
                <Typography
                    variant="caption"
                    sx={{
                        color:
                            'rgba(255,255,255,.52)',
                    }}
                >
                    {label}
                </Typography>

                <Typography
                    variant="body2"
                    sx={{
                        mt: 0.15,
                        color:
                            'rgba(255,255,255,.82)',
                    }}
                >
                    {value}
                </Typography>
            </Box>
        </Box>
    );
}