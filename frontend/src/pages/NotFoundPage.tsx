import { Box, Button, Container, Stack, Typography } from '@mui/material';
import { ArrowLeft, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PublicLayout } from '../components/public/PublicSite';
import { Seo } from '../components/seo/Seo';

export function NotFoundPage() {
    return (
        <PublicLayout>
            <Seo
                title="Page not found"
                description="The page you requested could not be found."
                robots="noindex,nofollow"
            />

            <Container maxWidth="md">
                <Box
                    sx={{
                        minHeight: '65vh',
                        display: 'grid',
                        placeItems: 'center',
                        py: 8,
                    }}
                >
                    <Stack
                        spacing={2}
                        alignItems="center"
                        textAlign="center"
                    >
                        <Typography
                            variant="overline"
                            color="primary"
                            fontWeight={800}
                            letterSpacing=".16em"
                        >
                            404
                        </Typography>

                        <Typography
                            variant="h1"
                            sx={{
                                fontSize: {
                                    xs: '3.2rem',
                                    md: '5rem',
                                },
                                lineHeight: 1,
                            }}
                        >
                            This page moved on.
                        </Typography>

                        <Typography
                            color="text.secondary"
                            sx={{
                                maxWidth: 540,
                                lineHeight: 1.8,
                            }}
                        >
                            The page you're looking for may have moved,
                            closed, or no longer exist.
                        </Typography>

                        <Stack
                            direction={{
                                xs: 'column',
                                sm: 'row',
                            }}
                            spacing={1.5}
                            sx={{ pt: 1 }}
                        >
                            <Button
                                component={Link}
                                to="/"
                                variant="contained"
                                startIcon={<Home size={17} />}
                            >
                                Back to home
                            </Button>

                            <Button
                                component={Link}
                                to="/#open-roles"
                                variant="outlined"
                                startIcon={<ArrowLeft size={17} />}
                            >
                                Explore careers
                            </Button>
                        </Stack>
                    </Stack>
                </Box>
            </Container>
        </PublicLayout>
    );
}