import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
    Alert,
    Box,
    Button,
    Chip,
    Container,
    Grid,
    MenuItem,
    Pagination,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import {
    ArrowRight,
    BriefcaseBusiness,
    MapPin,
    Search,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';

import { jobsApi } from '../../services/backend';
import type { Job } from '../../types/api';
import { GlassCard } from '../../components/ui/GlassCard';
import { PublicLayout } from '../../components/public/PublicSite';
import { Seo } from '../../components/seo/Seo';

const MotionDiv = motion.create('div');

const PAGE_SIZE = 9;

export function PublicJobsPage() {
    const reduce = Boolean(useReducedMotion());

    const [search, setSearch] = useState('');
    const [location, setLocation] = useState('');
    const [type, setType] = useState('');
    const [page, setPage] = useState(0);

    const query = useQuery({
        queryKey: [
            'public-jobs-page',
            search,
            location,
            type,
            page,
        ],
        queryFn: () =>
            jobsApi.publicList({
                title: search.trim() || undefined,
                location: location.trim() || undefined,
                type: type || undefined,
                page,
                size: PAGE_SIZE,
            }),
        staleTime: 45_000,
        retry: false,
    });

    const jobs = query.data?.content ?? [];

    const types = useMemo(
        () =>
            Array.from(
                new Set(
                    jobs
                        .map((job) => job.type)
                        .filter(Boolean),
                ),
            ),
        [jobs],
    );

    const clearFilters = () => {
        setSearch('');
        setLocation('');
        setType('');
        setPage(0);
    };

    const handleSearchChange = (
        value: string,
    ) => {
        setSearch(value);
        setPage(0);
    };

    const handleLocationChange = (
        value: string,
    ) => {
        setLocation(value);
        setPage(0);
    };

    const handleTypeChange = (
        value: string,
    ) => {
        setType(value);
        setPage(0);
    };

    return (
        <PublicLayout active="careers">
            <Seo
                title="Careers | HireVibe Consultants"
                description="Explore current career opportunities with HireVibe Consultants. Search active roles by position, location and work type."
                canonical="/careers"
            />

            <Box className="hv-page-hero">
                <Container
                    maxWidth="xl"
                    sx={{
                        py: {
                            xs: 6,
                            md: 9,
                        },
                    }}
                >
                    <MotionDiv
                        initial={
                            reduce
                                ? false
                                : {
                                    opacity: 0,
                                    y: 24,
                                }
                        }
                        animate={{
                            opacity: 1,
                            y: 0,
                        }}
                        transition={{
                            duration: 0.65,
                        }}
                    >
                        <Typography
                            className="hv-section-eyebrow"
                        >
                            CAREER OPPORTUNITIES
                        </Typography>

                        <Typography
                            component="h1"
                            sx={{
                                mt: 1,
                                fontSize: {
                                    xs: '2.6rem',
                                    md: '4.8rem',
                                },
                                lineHeight: 1.02,
                                fontWeight: 800,
                                letterSpacing: '-0.04em',
                                maxWidth: 900,
                            }}
                        >
                            Find work worth moving for
                        </Typography>

                        <Typography
                            color="text.secondary"
                            sx={{
                                mt: 2,
                                maxWidth: 720,
                                fontSize: {
                                    xs: '1rem',
                                    md: '1.15rem',
                                },
                                lineHeight: 1.8,
                            }}
                        >
                            Explore active opportunities by role,
                            location and work type. Find a position
                            where your experience and ambitions can
                            move forward together.
                        </Typography>
                    </MotionDiv>
                </Container>
            </Box>

            <main>
                <section className="hv-section">
                    <Container maxWidth="xl">
                        <GlassCard
                            sx={{
                                p: {
                                    xs: 2,
                                    md: 2.2,
                                },
                            }}
                        >
                            <Grid
                                container
                                spacing={1.4}
                                alignItems="center"
                            >
                                <Grid
                                    size={{
                                        xs: 12,
                                        md: 4,
                                    }}
                                >
                                    <TextField
                                        fullWidth
                                        label="Search roles"
                                        value={search}
                                        onChange={(event) =>
                                            handleSearchChange(
                                                event.target.value,
                                            )
                                        }
                                        slotProps={{
                                            input: {
                                                startAdornment: (
                                                    <Search
                                                        size={17}
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
                                        md: 3,
                                    }}
                                >
                                    <TextField
                                        fullWidth
                                        label="Location"
                                        value={location}
                                        onChange={(event) =>
                                            handleLocationChange(
                                                event.target.value,
                                            )
                                        }
                                        slotProps={{
                                            input: {
                                                startAdornment: (
                                                    <MapPin
                                                        size={17}
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
                                        md: 3,
                                    }}
                                >
                                    <TextField
                                        select
                                        fullWidth
                                        label="Work type"
                                        value={type}
                                        onChange={(event) =>
                                            handleTypeChange(
                                                event.target.value,
                                            )
                                        }
                                    >
                                        <MenuItem value="">
                                            All types
                                        </MenuItem>

                                        {types.map(
                                            (value) => (
                                                <MenuItem
                                                    key={value}
                                                    value={value}
                                                >
                                                    {value}
                                                </MenuItem>
                                            ),
                                        )}
                                    </TextField>
                                </Grid>

                                <Grid
                                    size={{
                                        xs: 12,
                                        md: 2,
                                    }}
                                >
                                    <Button
                                        fullWidth
                                        variant="outlined"
                                        onClick={clearFilters}
                                        sx={{
                                            minHeight: 40,
                                        }}
                                        disabled={
                                            !search &&
                                            !location &&
                                            !type
                                        }
                                    >
                                        Reset
                                    </Button>
                                </Grid>
                            </Grid>
                        </GlassCard>

                        <Stack
                            direction={{
                                xs: 'column',
                                sm: 'row',
                            }}
                            justifyContent="space-between"
                            alignItems={{
                                xs: 'flex-start',
                                sm: 'center',
                            }}
                            gap={1.5}
                            sx={{
                                mt: 5,
                                mb: 3,
                            }}
                        >
                            <Box>
                                <Typography
                                    className="hv-section-eyebrow"
                                >
                                    OPEN OPPORTUNITIES
                                </Typography>

                                <Typography
                                    variant="h4"
                                    sx={{
                                        mt: 0.5,
                                        fontWeight: 800,
                                    }}
                                >
                                    Current roles
                                </Typography>
                            </Box>

                            {query.data && (
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    {query.data.totalElements}{' '}
                                    {query.data.totalElements === 1
                                        ? 'opportunity'
                                        : 'opportunities'}
                                </Typography>
                            )}
                        </Stack>

                        {query.isLoading ? (
                            <Grid
                                container
                                spacing={1.8}
                            >
                                {Array.from({
                                    length: 6,
                                }).map((_, index) => (
                                    <Grid
                                        key={index}
                                        size={{
                                            xs: 12,
                                            md: 4,
                                        }}
                                    >
                                        <GlassCard
                                            sx={{
                                                minHeight: 310,
                                                p: 2.7,
                                            }}
                                        >
                                            <Box
                                                className="hv-skeleton"
                                                sx={{
                                                    height: 16,
                                                    width: '30%',
                                                }}
                                            />

                                            <Box
                                                className="hv-skeleton"
                                                sx={{
                                                    mt: 3,
                                                    height: 30,
                                                    width: '80%',
                                                }}
                                            />

                                            <Box
                                                className="hv-skeleton"
                                                sx={{
                                                    mt: 2,
                                                    height: 18,
                                                    width: '60%',
                                                }}
                                            />

                                            <Box
                                                className="hv-skeleton"
                                                sx={{
                                                    mt: 3,
                                                    height: 70,
                                                    width: '100%',
                                                }}
                                            />
                                        </GlassCard>
                                    </Grid>
                                ))}
                            </Grid>
                        ) : query.isError ? (
                            <GlassCard
                                sx={{
                                    p: 3,
                                }}
                            >
                                <Alert severity="error">
                                    We could not load the current
                                    opportunities. Please try again
                                    shortly.
                                </Alert>
                            </GlassCard>
                        ) : jobs.length > 0 ? (
                            <>
                                <Grid
                                    container
                                    spacing={1.8}
                                >
                                    {jobs.map(
                                        (
                                            job: Job,
                                            index: number,
                                        ) => (
                                            <Grid
                                                key={job.id}
                                                size={{
                                                    xs: 12,
                                                    md: 4,
                                                }}
                                            >
                                                <MotionDiv
                                                    initial={
                                                        reduce
                                                            ? false
                                                            : {
                                                                opacity: 0,
                                                                y: 20,
                                                            }
                                                    }
                                                    animate={{
                                                        opacity: 1,
                                                        y: 0,
                                                    }}
                                                    transition={{
                                                        duration: 0.55,
                                                        delay:
                                                            index * 0.05,
                                                    }}
                                                    style={{
                                                        height: '100%',
                                                    }}
                                                >
                                                    <GlassCard
                                                        sx={{
                                                            p: 2.7,
                                                            height: '100%',
                                                            minHeight: 310,
                                                            display: 'flex',
                                                            flexDirection:
                                                                'column',
                                                        }}
                                                    >
                                                        <Stack
                                                            direction="row"
                                                            justifyContent="space-between"
                                                            alignItems="center"
                                                            gap={1}
                                                        >
                                                            <Typography
                                                                variant="caption"
                                                                color="text.secondary"
                                                            >
                                                                #
                                                                {String(
                                                                    job.id,
                                                                ).padStart(
                                                                    3,
                                                                    '0',
                                                                )}
                                                            </Typography>

                                                            <Chip
                                                                size="small"
                                                                label={
                                                                    job.type
                                                                }
                                                                variant="outlined"
                                                            />
                                                        </Stack>

                                                        <Typography
                                                            variant="h5"
                                                            sx={{
                                                                mt: 2,
                                                                fontWeight: 800,
                                                                lineHeight: 1.2,
                                                            }}
                                                        >
                                                            {job.title}
                                                        </Typography>

                                                        <Stack
                                                            gap={0.8}
                                                            sx={{
                                                                mt: 1.5,
                                                            }}
                                                        >
                                                            <Stack
                                                                direction="row"
                                                                gap={0.8}
                                                                alignItems="center"
                                                            >
                                                                <MapPin
                                                                    size={15}
                                                                />

                                                                <Typography
                                                                    variant="body2"
                                                                    color="text.secondary"
                                                                >
                                                                    {
                                                                        job.location
                                                                    }
                                                                </Typography>
                                                            </Stack>

                                                            <Stack
                                                                direction="row"
                                                                gap={0.8}
                                                                alignItems="center"
                                                            >
                                                                <BriefcaseBusiness
                                                                    size={15}
                                                                />

                                                                <Typography
                                                                    variant="body2"
                                                                    color="text.secondary"
                                                                >
                                                                    {job.type}
                                                                </Typography>
                                                            </Stack>
                                                        </Stack>

                                                        <Typography
                                                            variant="body2"
                                                            color="text.secondary"
                                                            sx={{
                                                                mt: 2,
                                                                lineHeight: 1.75,
                                                                flex: 1,
                                                                display:
                                                                    '-webkit-box',
                                                                WebkitLineClamp: 4,
                                                                WebkitBoxOrient:
                                                                    'vertical',
                                                                overflow:
                                                                    'hidden',
                                                            }}
                                                        >
                                                            {
                                                                job.description
                                                            }
                                                        </Typography>

                                                        <Stack
                                                            direction="row"
                                                            gap={1}
                                                            sx={{
                                                                mt: 2.5,
                                                            }}
                                                        >
                                                            <Button
                                                                component={Link}
                                                                to={`/careers/job/${job.id}`}
                                                                endIcon={
                                                                    <ArrowRight
                                                                        size={
                                                                            15
                                                                        }
                                                                    />
                                                                }
                                                                sx={{
                                                                    px: 0,
                                                                }}
                                                            >
                                                                View role
                                                            </Button>

                                                            <Button
                                                                component={Link}
                                                                to={`/apply?jobId=${job.id}`}
                                                                variant="contained"
                                                                size="small"
                                                                sx={{
                                                                    ml: 'auto',
                                                                }}
                                                            >
                                                                Apply
                                                            </Button>
                                                        </Stack>
                                                    </GlassCard>
                                                </MotionDiv>
                                            </Grid>
                                        ),
                                    )}
                                </Grid>

                                {query.data &&
                                    query.data.totalPages > 1 && (
                                        <Stack
                                            alignItems="center"
                                            sx={{
                                                mt: 6,
                                            }}
                                        >
                                            <Pagination
                                                count={
                                                    query.data
                                                        .totalPages
                                                }
                                                page={page + 1}
                                                onChange={(
                                                    _event,
                                                    value,
                                                ) => {
                                                    setPage(
                                                        value - 1,
                                                    );

                                                    window.scrollTo({
                                                        top: 0,
                                                        behavior:
                                                            'smooth',
                                                    });
                                                }}
                                                size="large"
                                                showFirstButton
                                                showLastButton
                                            />
                                        </Stack>
                                    )}
                            </>
                        ) : (
                            <GlassCard
                                sx={{
                                    p: {
                                        xs: 3,
                                        md: 5,
                                    },
                                    textAlign: 'center',
                                }}
                            >
                                <Typography
                                    variant="h5"
                                    sx={{
                                        fontWeight: 800,
                                    }}
                                >
                                    No opportunities found
                                </Typography>

                                <Typography
                                    color="text.secondary"
                                    sx={{
                                        mt: 1,
                                    }}
                                >
                                    No current roles match your
                                    search. Try adjusting the
                                    filters or check again later.
                                </Typography>

                                <Button
                                    onClick={clearFilters}
                                    variant="contained"
                                    sx={{
                                        mt: 2.5,
                                    }}
                                >
                                    Reset filters
                                </Button>
                            </GlassCard>
                        )}
                    </Container>
                </section>
            </main>
        </PublicLayout>
    );
}