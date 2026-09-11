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
    Rating,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import {
    MessageSquareQuote,
    Send,
} from 'lucide-react';
import { GlassCard } from '../../components/ui/GlassCard';
import { reviewsApi } from '../../services/backend';

type ReviewForm = {
    name: string;
    roleTitle: string;
    company: string;
    rating: number;
    reviewText: string;
};

const initialForm: ReviewForm = {
    name: '',
    roleTitle: '',
    company: '',
    rating: 5,
    reviewText: '',
};

export function TestimonialsSection() {
    const queryClient = useQueryClient();
    const [open, setOpen] = useState(false);
    const [form, setForm] = useState<ReviewForm>(initialForm);

    const query = useQuery({
        queryKey: ['public-reviews'],
        queryFn: () =>
            reviewsApi.publicList({
                page: 0,
                size: 6,
            }),
    });

    const mutation = useMutation({
        mutationFn: () =>
            reviewsApi.create({
                name: form.name.trim(),
                roleTitle: form.roleTitle.trim() || undefined,
                company: form.company.trim() || undefined,
                rating: form.rating,
                reviewText: form.reviewText.trim(),
            }),
        onSuccess: async () => {
            setForm(initialForm);
            setOpen(false);

            await queryClient.invalidateQueries({
                queryKey: ['public-reviews'],
            });
        },
    });

    const set = <K extends keyof ReviewForm>(
        field: K,
        value: ReviewForm[K],
    ) => {
        setForm((current) => ({
            ...current,
            [field]: value,
        }));
    };

    const canSubmit =
        form.name.trim().length > 0 &&
        form.reviewText.trim().length > 0 &&
        form.rating >= 1 &&
        form.rating <= 5;

    return (
        <section className="hv-section-tight">
            <Stack
                direction={{
                    xs: 'column',
                    sm: 'row',
                }}
                justifyContent="space-between"
                alignItems={{
                    xs: 'flex-start',
                    sm: 'flex-end',
                }}
                gap={2}
            >
                <Box>
                    <Typography className="hv-section-eyebrow">
                        CANDIDATE VOICE
                    </Typography>

                    <Typography className="hv-section-title">
                        Real feedback, shared by the people we work with.
                    </Typography>
                </Box>

                <Button
                    variant="outlined"
                    startIcon={<MessageSquareQuote size={17} />}
                    onClick={() => {
                        mutation.reset();
                        setOpen(true);
                    }}
                >
                    Share your experience
                </Button>
            </Stack>

            {query.isError ? (
                <Alert
                    severity="info"
                    sx={{
                        mt: 3,
                    }}
                >
                    Reviews will appear here as approved feedback is published.
                </Alert>
            ) : query.data?.content.length ? (
                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: {
                            xs: '1fr',
                            md: 'repeat(3, 1fr)',
                        },
                        gap: 1.5,
                        mt: 3,
                    }}
                >
                    {query.data.content.map((review) => (
                        <GlassCard
                            key={review.id}
                            sx={{
                                p: 2.5,
                                height: '100%',
                            }}
                        >
                            <Rating
                                value={review.rating}
                                readOnly
                                size="small"
                            />

                            <Typography
                                sx={{
                                    mt: 1.5,
                                    lineHeight: 1.75,
                                }}
                            >
                                “{review.reviewText}”
                            </Typography>

                            <Typography
                                sx={{
                                    mt: 2,
                                    fontWeight: 750,
                                }}
                            >
                                {review.name}
                            </Typography>

                            <Typography
                                variant="body2"
                                color="text.secondary"
                            >
                                {review.roleTitle || 'Candidate / customer'}
                                {review.company
                                    ? ` · ${review.company}`
                                    : ''}
                            </Typography>
                        </GlassCard>
                    ))}
                </Box>
            ) : (
                <GlassCard
                    sx={{
                        mt: 3,
                        p: 3,
                    }}
                >
                    <Typography color="text.secondary">
                        Approved reviews will appear here.
                    </Typography>
                </GlassCard>
            )}

            <Dialog
                open={open}
                onClose={() => {
                    if (!mutation.isPending) {
                        setOpen(false);
                    }
                }}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle>
                    Share your experience
                </DialogTitle>

                <DialogContent dividers>
                    <Stack
                        gap={1.5}
                        sx={{
                            pt: 0.5,
                        }}
                    >
                        {mutation.isError && (
                            <Alert severity="error">
                                We could not submit your review. Please try again.
                            </Alert>
                        )}

                        <TextField
                            label="Name"
                            value={form.name}
                            onChange={(event) =>
                                set('name', event.target.value)
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
                                value={form.roleTitle}
                                onChange={(event) =>
                                    set('roleTitle', event.target.value)
                                }
                                fullWidth
                            />

                            <TextField
                                label="Company"
                                value={form.company}
                                onChange={(event) =>
                                    set('company', event.target.value)
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
                                value={form.rating}
                                onChange={(_, value) =>
                                    set('rating', value ?? 5)
                                }
                            />
                        </Box>

                        <TextField
                            label="Your review"
                            multiline
                            minRows={5}
                            value={form.reviewText}
                            onChange={(event) =>
                                set('reviewText', event.target.value)
                            }
                            required
                            fullWidth
                            slotProps={{
                                htmlInput: {
                                    maxLength: 3000,
                                },
                            }}
                            helperText={`${form.reviewText.length}/3000`}
                        />

                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Your review is submitted for moderation before it
                            can appear publicly.
                        </Typography>
                    </Stack>
                </DialogContent>

                <DialogActions
                    sx={{
                        p: 2,
                    }}
                >
                    <Button
                        onClick={() => setOpen(false)}
                        disabled={mutation.isPending}
                    >
                        Cancel
                    </Button>

                    <Button
                        variant="contained"
                        endIcon={<Send size={16} />}
                        disabled={!canSubmit || mutation.isPending}
                        onClick={() => mutation.mutate()}
                    >
                        {mutation.isPending
                            ? 'Submitting…'
                            : 'Submit review'}
                    </Button>
                </DialogActions>
            </Dialog>
        </section>
    );
}