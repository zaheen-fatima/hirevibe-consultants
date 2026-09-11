import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
    Alert,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    Typography,
} from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, Trash2, X } from 'lucide-react';

import { reviewsApi } from '../../services/backend';
import type { Review, ReviewStatus } from '../../types/api';
import { GlassCard } from '../../components/ui/GlassCard';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { StatusPill, type StatusPillTone } from '../../components/ui/StatusPill';

const MotionDiv = motion.create('div');

const statuses: ReviewStatus[] = [
    'PENDING',
    'APPROVED',
    'REJECTED',
];

const statusTone: Record<ReviewStatus, StatusPillTone> = {
    PENDING: 'warning',
    APPROVED: 'success',
    REJECTED: 'neutral',
};

export function ReviewsPage() {
    const queryClient = useQueryClient();

    const [page, setPage] = useState(0);
    const [status, setStatus] = useState<ReviewStatus | ''>('PENDING');
    const [selected, setSelected] = useState<Review | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<Review | null>(null);

    const query = useQuery({
        queryKey: ['reviews', page, status],
        queryFn: () =>
            reviewsApi.list({
                page,
                size: 10,
                status: status || undefined,
            }),
    });

    const refresh = () =>
        queryClient.invalidateQueries({
            queryKey: ['reviews'],
        });

    const updateStatus = useMutation({
        mutationFn: ({
                         id,
                         value,
                     }: {
            id: number;
            value: ReviewStatus;
        }) => reviewsApi.updateStatus(id, value),

        onSuccess: async () => {
            setSelected(null);
            await refresh();
        },
    });

    const remove = useMutation({
        mutationFn: (item: Review) => reviewsApi.remove(item.id),

        onSuccess: async () => {
            setDeleteTarget(null);
            setSelected(null);
            await refresh();
        },
    });

    return (
        <Stack gap={3}>
            <SectionHeader
                eyebrow="PUBLIC FEEDBACK"
                title="Reviews"
                description="Moderate candidate and customer feedback before approved reviews appear publicly."
                action={
                    <StatusPill
                        label={`${query.data?.totalElements ?? 0} total`}
                        tone="info"
                    />
                }
            />

            <GlassCard sx={{ p: { xs: 1.5, md: 2 } }}>
                <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    gap={1.5}
                    alignItems={{ xs: 'stretch', sm: 'center' }}
                >
                    <FormControl size="small" sx={{ minWidth: 210 }}>
                        <InputLabel>Status</InputLabel>

                        <Select
                            label="Status"
                            value={status}
                            onChange={(event) => {
                                setStatus(
                                    event.target.value as ReviewStatus | '',
                                );
                                setPage(0);
                            }}
                        >
                            <MenuItem value="">All statuses</MenuItem>

                            {statuses.map((item) => (
                                <MenuItem key={item} value={item}>
                                    {item.replaceAll('_', ' ')}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Stack>
            </GlassCard>

            {query.isError && (
                <Alert severity="error">
                    Unable to load reviews. Verify your authentication and backend
                    connection.
                </Alert>
            )}

            {updateStatus.isError && (
                <Alert severity="error">
                    The review status could not be updated.
                </Alert>
            )}

            {remove.isError && (
                <Alert severity="error">
                    The review could not be deleted.
                </Alert>
            )}

            {query.isLoading ? (
                <ReviewSkeletons />
            ) : query.data?.content.length ? (
                <>
                    <Grid container spacing={1.5}>
                        <AnimatePresence initial={false}>
                            {query.data.content.map((review, index) => (
                                <Grid
                                    key={review.id}
                                    size={{ xs: 12, md: 6, xl: 4 }}
                                >
                                    <MotionDiv
                                        initial={{
                                            opacity: 0,
                                            y: 12,
                                        }}
                                        animate={{
                                            opacity: 1,
                                            y: 0,
                                        }}
                                        transition={{
                                            delay: index * 0.025,
                                        }}
                                    >
                                        <GlassCard
                                            sx={{
                                                height: '100%',
                                                p: 2.4,
                                                display: 'flex',
                                                flexDirection: 'column',
                                            }}
                                        >
                                            <Stack
                                                direction="row"
                                                justifyContent="space-between"
                                                gap={1}
                                                alignItems="flex-start"
                                            >
                                                <Box>
                                                    <Typography fontWeight={750}>
                                                        {review.name}
                                                    </Typography>

                                                    <Typography
                                                        variant="body2"
                                                        color="text.secondary"
                                                    >
                                                        {review.roleTitle ||
                                                            'Candidate / customer'}
                                                    </Typography>

                                                    {review.company && (
                                                        <Typography
                                                            variant="caption"
                                                            color="text.secondary"
                                                        >
                                                            {review.company}
                                                        </Typography>
                                                    )}
                                                </Box>

                                                <StatusPill
                                                    label={review.status}
                                                    tone={statusTone[review.status]}
                                                />
                                            </Stack>

                                            <Typography
                                                sx={{
                                                    mt: 2,
                                                    lineHeight: 1.75,
                                                    flex: 1,
                                                }}
                                            >
                                                “{review.reviewText}”
                                            </Typography>

                                            <Stack
                                                direction="row"
                                                justifyContent="space-between"
                                                alignItems="center"
                                                sx={{ mt: 2 }}
                                            >
                                                <Typography
                                                    variant="body2"
                                                    fontWeight={700}
                                                >
                                                    {'★'.repeat(review.rating)}

                                                    <Box
                                                        component="span"
                                                        sx={{
                                                            color: 'text.disabled',
                                                        }}
                                                    >
                                                        {'★'.repeat(5 - review.rating)}
                                                    </Box>
                                                </Typography>

                                                <Stack direction="row" gap={0.5}>
                                                    <Button
                                                        size="small"
                                                        onClick={() =>
                                                            setSelected(review)
                                                        }
                                                    >
                                                        Open
                                                    </Button>

                                                    <Button
                                                        size="small"
                                                        color="error"
                                                        startIcon={<Trash2 size={15} />}
                                                        onClick={() =>
                                                            setDeleteTarget(review)
                                                        }
                                                    >
                                                        Delete
                                                    </Button>
                                                </Stack>
                                            </Stack>
                                        </GlassCard>
                                    </MotionDiv>
                                </Grid>
                            ))}
                        </AnimatePresence>
                    </Grid>

                    <Stack
                        direction="row"
                        justifyContent="center"
                        gap={1}
                    >
                        <Button
                            disabled={page === 0}
                            onClick={() =>
                                setPage((value) =>
                                    Math.max(0, value - 1),
                                )
                            }
                        >
                            Previous
                        </Button>

                        <Typography
                            sx={{
                                px: 1.5,
                                py: 0.8,
                                alignSelf: 'center',
                            }}
                        >
                            Page {page + 1} of{' '}
                            {Math.max(1, query.data.totalPages)}
                        </Typography>

                        <Button
                            disabled={
                                page + 1 >= query.data.totalPages
                            }
                            onClick={() =>
                                setPage((value) => value + 1)
                            }
                        >
                            Next
                        </Button>
                    </Stack>
                </>
            ) : (
                <GlassCard
                    sx={{
                        p: 5,
                        textAlign: 'center',
                    }}
                >
                    <Typography variant="h6">
                        No reviews
                    </Typography>

                    <Typography
                        color="text.secondary"
                        sx={{ mt: 0.5 }}
                    >
                        Submitted feedback will appear here for
                        moderation.
                    </Typography>
                </GlassCard>
            )}

            <Dialog
                open={Boolean(selected)}
                onClose={() => setSelected(null)}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle>
                    Review moderation
                </DialogTitle>

                <DialogContent dividers>
                    {selected && (
                        <Stack gap={1.6}>
                            <Box>
                                <Typography fontWeight={800}>
                                    {selected.name}
                                </Typography>

                                <Typography color="text.secondary">
                                    {selected.roleTitle ||
                                        'Candidate / customer'}

                                    {selected.company
                                        ? ` · ${selected.company}`
                                        : ''}
                                </Typography>
                            </Box>

                            <Typography
                                sx={{
                                    lineHeight: 1.8,
                                }}
                            >
                                “{selected.reviewText}”
                            </Typography>

                            <Typography fontWeight={750}>
                                Rating:{' '}
                                {'★'.repeat(selected.rating)}
                                {'☆'.repeat(5 - selected.rating)}
                            </Typography>

                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                Submitted{' '}
                                {new Date(
                                    selected.createdAt,
                                ).toLocaleString()}
                            </Typography>
                        </Stack>
                    )}
                </DialogContent>

                <DialogActions sx={{ p: 2 }}>
                    <Button
                        startIcon={<X size={16} />}
                        onClick={() => setSelected(null)}
                    >
                        Close
                    </Button>

                    {selected?.status !== 'REJECTED' && (
                        <Button
                            color="error"
                            onClick={() =>
                                selected &&
                                updateStatus.mutate({
                                    id: selected.id,
                                    value: 'REJECTED',
                                })
                            }
                        >
                            Reject
                        </Button>
                    )}

                    {selected?.status !== 'APPROVED' && (
                        <Button
                            variant="contained"
                            startIcon={<Check size={16} />}
                            onClick={() =>
                                selected &&
                                updateStatus.mutate({
                                    id: selected.id,
                                    value: 'APPROVED',
                                })
                            }
                            disabled={updateStatus.isPending}
                        >
                            Approve
                        </Button>
                    )}
                </DialogActions>
            </Dialog>

            <Dialog
                open={Boolean(deleteTarget)}
                onClose={() => setDeleteTarget(null)}
                maxWidth="xs"
                fullWidth
            >
                <DialogTitle>
                    Delete review?
                </DialogTitle>

                <DialogContent>
                    <Typography color="text.secondary">
                        This permanently removes the selected review
                        from the moderation queue.
                    </Typography>
                </DialogContent>

                <DialogActions sx={{ p: 2 }}>
                    <Button
                        onClick={() => setDeleteTarget(null)}
                    >
                        Cancel
                    </Button>

                    <Button
                        color="error"
                        variant="contained"
                        onClick={() =>
                            deleteTarget &&
                            remove.mutate(deleteTarget)
                        }
                        disabled={remove.isPending}
                    >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Stack>
    );
}

function ReviewSkeletons() {
    return (
        <Grid container spacing={1.5}>
            {Array.from(
                { length: 6 },
                (_, index) => (
                    <Grid
                        key={index}
                        size={{ xs: 12, md: 6, xl: 4 }}
                    >
                        <GlassCard
                            sx={{
                                p: 2.4,
                                minHeight: 210,
                            }}
                        >
                            <Box
                                sx={{
                                    width: '42%',
                                    height: 18,
                                    bgcolor: 'action.hover',
                                    borderRadius: 1,
                                }}
                            />

                            <Box
                                sx={{
                                    width: '70%',
                                    height: 12,
                                    bgcolor: 'action.hover',
                                    borderRadius: 1,
                                    mt: 1,
                                }}
                            />

                            <Box
                                sx={{
                                    width: '100%',
                                    height: 70,
                                    bgcolor: 'action.hover',
                                    borderRadius: 2,
                                    mt: 2,
                                    animation:
                                        'hv-pulse 1.6s ease-in-out infinite',
                                }}
                            />
                        </GlassCard>
                    </Grid>
                ),
            )}
        </Grid>
    );
}