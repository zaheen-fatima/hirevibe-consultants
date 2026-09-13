import { useMutation } from '@tanstack/react-query';
import {
    useEffect,
    useState,
    type FormEvent,
    type ReactNode,
} from 'react';
import {
    Mail,
    MapPin,
    Menu as MenuIcon,
    Moon,
    Phone,
    Sun,
    X,
} from 'lucide-react';
import {
    Alert,
    Box,
    Button,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    Drawer,
    IconButton,
    Rating,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import {
    Link,
    useLocation,
    useNavigate,
} from 'react-router-dom';
import { useAppTheme } from '../../theme/ThemeProvider';
import { reviewsApi } from '../../services/backend';

const HIREVIBE_PHONE = '9205364608';

const SOCIAL_LINKS = {
    linkedin: 'https://www.linkedin.com/company/145020048/admin/dashboard/',
    twitter: 'https://x.com/CareerHireVibe ',
    facebook: 'https://www.facebook.com/share/19aDp74Wui/',
    instagram: 'https://www.instagram.com/hirevibeconsultants/',
    whatsapp: `https://whatsapp.com/channel/0029Vb8ypHUGE56kpCuh5y2Q`,
} as const;

const navItems = [
    {
        label: 'Home',
        path: '/',
    },
    {
        label: 'Services',
        path: '/services',
    },
    {
        label: 'Apply Now',
        path: '/apply',
    },
    {
        label: 'Insights',
        path: '/insights',
    },
    {
        label: 'About',
        path: '/about',
    },
    {
        label: 'Contact',
        path: '/contact',
    },
];

export function ThemeToggle() {
    const {
        mode,
        toggleMode,
    } = useAppTheme();

    return (
        <IconButton
            aria-label={
                mode === 'dark'
                    ? 'Switch to light mode'
                    : 'Switch to dark mode'
            }
            onClick={toggleMode}
            className="hv-icon-button"
        >
            {mode === 'dark' ? (
                <Sun
                    size={18}
                    strokeWidth={1.7}
                />
            ) : (
                <Moon
                    size={18}
                    strokeWidth={1.7}
                />
            )}
        </IconButton>
    );
}

export function PublicNav() {
    const location = useLocation();
    const navigate = useNavigate();

    const [
        mobileOpen,
        setMobileOpen,
    ] = useState(false);

    const [
        scrolled,
        setScrolled,
    ] = useState(false);

    useEffect(() => {
        const onScroll = () => {
            setScrolled(window.scrollY > 18);
        };

        onScroll();

        window.addEventListener(
            'scroll',
            onScroll,
            {
                passive: true,
            },
        );

        return () => {
            window.removeEventListener(
                'scroll',
                onScroll,
            );
        };
    }, []);

    const go = (path: string) => {
        setMobileOpen(false);
        navigate(path);
    };

    return (
        <Box
            component="header"
            className={`hv-public-nav ${
                scrolled
                    ? 'hv-public-nav-scrolled'
                    : ''
            }`}
        >
            <Container maxWidth="xl">
                <Stack
                    direction="row"
                    alignItems="center"
                    gap={2}
                    sx={{
                        minHeight: {
                            xs: 74,
                            md: 88,
                        },
                    }}
                >
                    <Box
                        component={Link}
                        to="/"
                        sx={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            mr: 'auto',
                            textDecoration: 'none',
                        }}
                    >
                        <Box
                            component="img"
                            src="/hirevibe-logo-transparent.png"
                            alt="HireVibe — Right People. Real Opportunities."
                            className="hv-logo"
                        />
                    </Box>

                    <Stack
                        direction="row"
                        alignItems="center"
                        gap={0.2}
                        sx={{
                            display: {
                                xs: 'none',
                                lg: 'flex',
                            },
                        }}
                    >
                        {navItems.map((item) => {
                            const active =
                                item.path === '/'
                                    ? location.pathname === '/'
                                    : location.pathname.startsWith(
                                        item.path,
                                    );

                            return (
                                <Button
                                    key={item.path}
                                    onClick={() => go(item.path)}
                                    className={`hv-nav-link ${
                                        active
                                            ? 'is-active'
                                            : ''
                                    }`}
                                    sx={{
                                        px: 1.35,
                                        minWidth: 'auto',
                                    }}
                                >
                                    {item.label}
                                </Button>
                            );
                        })}

                        <ThemeToggle />

                        <Button
                            component={Link}
                            to="/login"
                            variant="outlined"
                            sx={{
                                ml: 0.8,
                                px: 1.8,
                            }}
                        >
                            Team login
                        </Button>
                    </Stack>

                    <Stack
                        direction="row"
                        alignItems="center"
                        gap={0.4}
                        sx={{
                            display: {
                                xs: 'flex',
                                lg: 'none',
                            },
                        }}
                    >
                        <ThemeToggle />

                        <IconButton
                            aria-label="Open navigation"
                            onClick={() =>
                                setMobileOpen(true)
                            }
                            className="hv-icon-button"
                        >
                            <MenuIcon
                                size={21}
                                strokeWidth={1.7}
                            />
                        </IconButton>
                    </Stack>
                </Stack>
            </Container>

            <Drawer
                anchor="right"
                open={mobileOpen}
                onClose={() =>
                    setMobileOpen(false)
                }
                PaperProps={{
                    className: 'hv-mobile-drawer',
                }}
            >
                <Stack
                    sx={{
                        p: 2.5,
                        height: '100%',
                    }}
                >
                    <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="space-between"
                    >
                        <Box
                            component={Link}
                            to="/"
                            onClick={() =>
                                setMobileOpen(false)
                            }
                            sx={{
                                display: 'inline-flex',
                            }}
                        >
                            <Box
                                component="img"
                                src="/hirevibe-logo-transparent.png"
                                alt="HireVibe"
                                className="hv-logo hv-logo-mobile"
                            />
                        </Box>

                        <IconButton
                            onClick={() =>
                                setMobileOpen(false)
                            }
                            className="hv-icon-button"
                        >
                            <X size={20} />
                        </IconButton>
                    </Stack>

                    <Divider
                        sx={{
                            my: 2,
                        }}
                    />

                    <Stack gap={0.35}>
                        {navItems.map((item) => (
                            <Button
                                key={item.path}
                                onClick={() =>
                                    go(item.path)
                                }
                                sx={{
                                    justifyContent:
                                        'flex-start',
                                    py: 1.35,
                                    px: 1.2,
                                    fontSize: '1rem',
                                }}
                            >
                                {item.label}
                            </Button>
                        ))}
                    </Stack>

                    <Box sx={{ flex: 1 }} />

                    <Button
                        component={Link}
                        to="/login"
                        onClick={() =>
                            setMobileOpen(false)
                        }
                        variant="outlined"
                        size="large"
                        sx={{
                            py: 1.3,
                        }}
                    >
                        Team login
                    </Button>
                </Stack>
            </Drawer>
        </Box>
    );
}

export function PublicFooter() {
    const year = new Date().getFullYear();

    const [reviewOpen, setReviewOpen] = useState(false);

    const [reviewForm, setReviewForm] = useState({
        name: '',
        roleTitle: '',
        company: '',
        rating: 5,
        reviewText: '',
    });

    const reviewMutation = useMutation({
        mutationFn: () =>
            reviewsApi.create({
                name: reviewForm.name.trim(),
                roleTitle:
                    reviewForm.roleTitle.trim() ||
                    undefined,
                company:
                    reviewForm.company.trim() ||
                    undefined,
                rating: reviewForm.rating,
                reviewText:
                    reviewForm.reviewText.trim(),
            }),

        onSuccess: () => {
            setReviewForm({
                name: '',
                roleTitle: '',
                company: '',
                rating: 5,
                reviewText: '',
            });

            setReviewOpen(false);
        },
    });

    const canSubmitReview =
        reviewForm.name.trim().length > 0 &&
        reviewForm.reviewText.trim().length > 0 &&
        reviewForm.rating >= 1 &&
        reviewForm.rating <= 5;

    const openReview = () => {
        reviewMutation.reset();
        setReviewOpen(true);
    };

    const closeReview = () => {
        if (!reviewMutation.isPending) {
            setReviewOpen(false);
        }
    };

    const handleReviewSubmit = (
        event: FormEvent<HTMLFormElement>,
    ) => {
        event.preventDefault();

        if (
            canSubmitReview &&
            !reviewMutation.isPending
        ) {
            reviewMutation.mutate();
        }
    };

    return (
        <Box
            component="footer"
            className="hv-footer"
        >
            <Container maxWidth="xl">
                <Box className="hv-footer-grid">
                    <Box>
                        <Box
                            component="img"
                            src="/hirevibe-logo-transparent.png"
                            alt="HireVibe Consultants"
                            className="hv-footer-logo"
                        />

                        <Typography className="hv-footer-brandline">
                            Right People. Real Opportunities.
                        </Typography>

                        <Typography
                            color="text.secondary"
                            sx={{
                                mt: 1.3,
                                maxWidth: 430,
                                lineHeight: 1.75,
                            }}
                        >
                            Connecting ambitious businesses with exceptional people
                            through thoughtful recruitment and talent solutions.
                        </Typography>

                        <Stack
                            direction="row"
                            gap={1}
                            sx={{
                                mt: 2.5,
                                flexWrap: 'wrap',
                            }}
                            aria-label="HireVibe social channels"
                        >
                            <SocialLink
                                href={SOCIAL_LINKS.linkedin}
                                label="LinkedIn"
                            >
                                <LinkedInIcon />
                            </SocialLink>

                            <SocialLink
                                href={SOCIAL_LINKS.twitter}
                                label="X / Twitter"
                            >
                                <XSocialIcon />
                            </SocialLink>

                            <SocialLink
                                href={SOCIAL_LINKS.facebook}
                                label="Facebook"
                            >
                                <FacebookIcon />
                            </SocialLink>

                            <SocialLink
                                href={SOCIAL_LINKS.instagram}
                                label="Instagram"
                            >
                                <InstagramIcon />
                            </SocialLink>

                            <SocialLink
                                href={SOCIAL_LINKS.whatsapp}
                                label="WhatsApp"
                            >
                                <WhatsAppIcon />
                            </SocialLink>
                        </Stack>
                    </Box>

                    <FooterColumn
                        title="QUICK LINKS"
                        links={[
                            ['Home', '/'],
                            ['Jobs', '/#open-roles'],
                            ['Articles', '/insights'],
                            ['Videos', '/insights'],
                            ['About HireVibe', '/about'],
                            ['Contact', '/contact'],
                        ]}
                    />

                    <FooterColumn
                        title="FOR CANDIDATES"
                        links={[
                            ['Find Jobs', '/#open-roles'],
                            ['Apply Now', '/apply'],
                            ['Career Resources', '/insights'],
                            ['Success Stories', '/about'],
                        ]}
                    />

                    <FooterColumn
                        title="FOR EMPLOYERS"
                        links={[
                            ['Hire Talent', '/contact'],
                            ['Our Services', '/services'],
                            ['Why HireVibe', '/about'],
                            ['Get Started', '/contact'],
                        ]}
                    />

                    <Box>
                        <Typography className="hv-footer-label">
                            GET IN TOUCH
                        </Typography>

                        <Stack
                            gap={1.25}
                            sx={{
                                mt: 1.6,
                            }}
                        >
                            <Box
                                component="a"
                                href="mailto:hr@hirevibe.in"
                                className="hv-footer-contact-link"
                                aria-label="Email HireVibe at hr@hirevibe.in"
                            >
                                <Mail size={16} />
                                <span>hr@hirevibe.in</span>
                            </Box>

                            <Box
                                component="a"
                                href={`tel:+91${HIREVIBE_PHONE}`}
                                className="hv-footer-contact-link"
                                aria-label={`Call HireVibe at +91 ${HIREVIBE_PHONE}`}
                            >
                                <Phone size={16} />
                                <span>+91 {HIREVIBE_PHONE}</span>
                            </Box>

                            <Box className="hv-footer-contact-link">
                                <MapPin size={16} />
                                <span>Delhi, India</span>
                            </Box>
                        </Stack>

                        <Box className="hv-footer-review-card">
                            <Typography className="hv-footer-review-title">
                                Share your experience
                            </Typography>

                            <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{
                                    mt: 0.6,
                                    lineHeight: 1.65,
                                }}
                            >
                                Tell us how HireVibe helped you move forward.
                            </Typography>

                            <Button
                                variant="outlined"
                                size="small"
                                onClick={openReview}
                                sx={{
                                    mt: 1.5,
                                    borderRadius: 999,
                                }}
                            >
                                Leave a review
                            </Button>
                        </Box>
                    </Box>
                </Box>

                <Box className="hv-footer-bottom">
                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        © {year} HireVibe Consultants. All rights reserved.
                    </Typography>

                    <Stack
                        direction={{
                            xs: 'column',
                            sm: 'row',
                        }}
                        gap={{
                            xs: 1,
                            sm: 2,
                        }}
                        alignItems={{
                            xs: 'flex-start',
                            sm: 'center',
                        }}
                    >
                        <PublicFooterLink
                            className="hv-footer-small-link"
                            to="/contact"
                        >
                            Get in touch
                        </PublicFooterLink>

                        <PublicFooterLink
                            className="hv-footer-small-link"
                            to="/about"
                        >
                            About HireVibe
                        </PublicFooterLink>

                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Privacy Policy
                        </Typography>

                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Terms &amp; Conditions
                        </Typography>

                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Designed &amp; crafted by Zaheen Fatima
                        </Typography>
                    </Stack>
                </Box>
            </Container>

            <Dialog
                open={reviewOpen}
                onClose={closeReview}
                fullWidth
                maxWidth="sm"
            >
                <Box
                    component="form"
                    onSubmit={handleReviewSubmit}
                >
                    <DialogTitle>
                        Share your experience
                    </DialogTitle>

                    <DialogContent dividers>
                        <Stack gap={1.6}>
                            {reviewMutation.isError && (
                                <Alert severity="error">
                                    We could not submit your review. Please try again.
                                </Alert>
                            )}

                            <TextField
                                label="Name"
                                value={reviewForm.name}
                                onChange={(event) =>
                                    setReviewForm((current) => ({
                                        ...current,
                                        name: event.target.value,
                                    }))
                                }
                                required
                                fullWidth
                                autoFocus
                            />

                            <Stack
                                direction={{
                                    xs: 'column',
                                    sm: 'row',
                                }}
                                gap={1.5}
                            >
                                <TextField
                                    label="Role / title"
                                    value={reviewForm.roleTitle}
                                    onChange={(event) =>
                                        setReviewForm((current) => ({
                                            ...current,
                                            roleTitle: event.target.value,
                                        }))
                                    }
                                    fullWidth
                                />

                                <TextField
                                    label="Company"
                                    value={reviewForm.company}
                                    onChange={(event) =>
                                        setReviewForm((current) => ({
                                            ...current,
                                            company: event.target.value,
                                        }))
                                    }
                                    fullWidth
                                />
                            </Stack>

                            <Box>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        mb: 0.4,
                                    }}
                                >
                                    Rating
                                </Typography>

                                <Rating
                                    value={reviewForm.rating}
                                    onChange={(_, value) =>
                                        setReviewForm((current) => ({
                                            ...current,
                                            rating: value ?? 5,
                                        }))
                                    }
                                />
                            </Box>

                            <TextField
                                label="Your review"
                                multiline
                                minRows={5}
                                value={reviewForm.reviewText}
                                onChange={(event) =>
                                    setReviewForm((current) => ({
                                        ...current,
                                        reviewText: event.target.value,
                                    }))
                                }
                                required
                                fullWidth
                                slotProps={{
                                    htmlInput: {
                                        maxLength: 3000,
                                    },
                                }}
                                helperText={`${reviewForm.reviewText.length}/3000`}
                            />

                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                Your review is submitted for moderation before it can appear
                                publicly.
                            </Typography>
                        </Stack>
                    </DialogContent>

                    <DialogActions
                        sx={{
                            p: 2,
                        }}
                    >
                        <Button
                            type="button"
                            onClick={closeReview}
                            disabled={reviewMutation.isPending}
                        >
                            Cancel
                        </Button>

                        <Button
                            type="submit"
                            variant="contained"
                            disabled={
                                !canSubmitReview ||
                                reviewMutation.isPending
                            }
                        >
                            {reviewMutation.isPending
                                ? 'Submitting…'
                                : 'Submit review'}
                        </Button>
                    </DialogActions>
                </Box>
            </Dialog>
        </Box>
    );
}

function SocialLink({
                        href,
                        label,
                        children,
                    }: {
    href: string;
    label: string;
    children: ReactNode;
}) {
    return (
        <Box
            component="a"
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className="hv-footer-social"
        >
            {children}
        </Box>
    );
}

function LinkedInIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            focusable="false"
        >
            <path d="M6.25 8.1H3.4V20h2.85V8.1Zm.2-3.7c0-.9-.72-1.6-1.65-1.6s-1.65.7-1.65 1.6S3.87 6 4.8 6s1.65-.7 1.65-1.6ZM20.6 13.18c0-3.58-1.9-5.25-4.43-5.25-2.05 0-2.96 1.13-3.47 1.92V8.1H9.85V20h2.85v-6.47c0-1.7.32-3.35 2.43-3.35 2.08 0 2.1 1.95 2.1 3.46V20h2.85l.52-6.82Z" />
        </svg>
    );
}

function XSocialIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            focusable="false"
        >
            <path d="M5.2 4h4.28l3.33 4.65L16.8 4H19l-5.2 5.86L19.35 20h-4.28l-3.62-5.05L6.4 20H4.2l5.27-5.94L5.2 4Zm3.1 1.75H8L15.92 18.3h.3L8.3 5.75Z" />
        </svg>
    );
}

function FacebookIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            focusable="false"
        >
            <path d="M13.55 21v-8h2.68l.4-3.12h-3.08V7.9c0-.9.25-1.5 1.54-1.5h1.65V3.61c-.29-.04-1.3-.11-2.48-.11-2.45 0-4.13 1.5-4.13 4.25v2.13H7.35V13h2.7v8h3.5Z" />
        </svg>
    );
}

function InstagramIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            focusable="false"
        >
            <rect
                x="4"
                y="4"
                width="16"
                height="16"
                rx="4"
            />
            <circle
                cx="12"
                cy="12"
                r="3.6"
            />
            <circle
                cx="17.2"
                cy="6.8"
                r="1"
            />
        </svg>
    );
}

function WhatsAppIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            focusable="false"
        >
            <path d="M12 3.2a8.8 8.8 0 0 0-7.58 13.27L3.2 20.8l4.47-1.17A8.8 8.8 0 1 0 12 3.2Zm0 15.9c-1.33 0-2.64-.36-3.78-1.04l-.27-.16-2.65.69.71-2.58-.18-.28A7.3 7.3 0 1 1 12 19.1Zm4.02-5.43c-.22-.11-1.3-.64-1.5-.71-.2-.08-.35-.11-.5.11-.15.22-.57.71-.7.86-.13.15-.26.17-.48.06-.22-.11-.93-.34-1.77-1.08-.65-.58-1.08-1.29-1.2-1.51-.13-.22-.01-.34.1-.45.1-.1.22-.26.33-.39.11-.13.15-.22.22-.37.07-.15.04-.28-.02-.39-.06-.11-.5-1.2-.69-1.64-.18-.43-.37-.37-.5-.38h-.43c-.15 0-.39.06-.59.28-.2.22-.77.75-.77 1.83s.79 2.12.9 2.27c.11.15 1.55 2.36 3.75 3.31.52.22.93.35 1.25.45.53.17 1.02.15 1.4.09.43-.06 1.3-.53 1.48-1.05.18-.52.18-.96.13-1.05-.06-.09-.2-.14-.42-.25Z" />
        </svg>
    );
}

function PublicFooterLink({
                              to,
                              className,
                              children,
                          }: {
    to: string;
    className: string;
    children: ReactNode;
}) {
    const location = useLocation();
    const navigate = useNavigate();

    const handleClick = (
        event: React.MouseEvent<HTMLAnchorElement>,
    ) => {
        const target = new URL(
            to,
            window.location.origin,
        );

        const currentPath =
            `${location.pathname}${location.search}${location.hash}`;

        const targetPath =
            `${target.pathname}${target.search}${target.hash}`;

        if (currentPath === targetPath) {
            event.preventDefault();

            if (target.hash) {
                const id = decodeURIComponent(
                    target.hash.slice(1),
                );

                const targetElement =
                    document.getElementById(id);

                if (targetElement) {
                    const header =
                        document.querySelector(
                            '.hv-public-nav',
                        );

                    const offset =
                        header instanceof HTMLElement
                            ? header.offsetHeight + 18
                            : 96;

                    const top =
                        targetElement.getBoundingClientRect().top +
                        window.scrollY -
                        offset;

                    window.scrollTo({
                        top: Math.max(0, top),
                        left: 0,
                        behavior: 'smooth',
                    });

                    return;
                }
            }

            window.scrollTo({
                top: 0,
                left: 0,
                behavior: 'smooth',
            });

            return;
        }

        navigate(to);
    };

    return (
        <Link
            className={className}
            to={to}
            onClick={handleClick}
        >
            {children}
        </Link>
    );
}

function FooterColumn({
                          title,
                          links,
                      }: {
    title: string;
    links: string[][];
}) {
    const location = useLocation();
    const navigate = useNavigate();

    const handleFooterNavigation = (
        event: React.MouseEvent<HTMLAnchorElement>,
        path: string,
    ) => {
        const target = new URL(
            path,
            window.location.origin,
        );

        const currentPath =
            `${location.pathname}${location.search}${location.hash}`;

        const targetPath =
            `${target.pathname}${target.search}${target.hash}`;

        if (currentPath === targetPath) {
            event.preventDefault();

            if (target.hash) {
                const id = decodeURIComponent(
                    target.hash.slice(1),
                );

                const targetElement =
                    document.getElementById(id);

                if (targetElement) {
                    const header =
                        document.querySelector(
                            '.hv-public-nav',
                        );

                    const offset =
                        header instanceof HTMLElement
                            ? header.offsetHeight + 18
                            : 96;

                    const top =
                        targetElement.getBoundingClientRect().top +
                        window.scrollY -
                        offset;

                    window.scrollTo({
                        top: Math.max(0, top),
                        left: 0,
                        behavior: 'smooth',
                    });

                    return;
                }
            }

            window.scrollTo({
                top: 0,
                left: 0,
                behavior: 'smooth',
            });

            return;
        }

        navigate(path);
    };

    return (
        <Box>
            <Typography className="hv-footer-label">
                {title}
            </Typography>

            <Stack
                gap={1.1}
                sx={{
                    mt: 1.6,
                }}
            >
                {links.map(([label, path]) => (
                    <Link
                        key={`${label}-${path}`}
                        className="hv-footer-link"
                        to={path}
                        onClick={(event) =>
                            handleFooterNavigation(
                                event,
                                path,
                            )
                        }
                    >
                        {label}
                    </Link>
                ))}
            </Stack>
        </Box>
    );
}

export function PublicLayout({
                                 children,
                                 active: _active,
                             }: {
    children?: ReactNode;
    active?: string;
}) {
    return (
        <Box className="hv-public-shell">
            <PublicNav />

            <Box
                component="main"
                id="main-content"
            >
                {children}
            </Box>

            <PublicFooter />
        </Box>
    );
}