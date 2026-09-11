import { useMemo, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Alert, Box, Button, Chip, Container, Grid, InputAdornment, Paper, Stack, TextField, Typography } from '@mui/material';
import { ArrowRight, BookOpen, Search, Video } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';

const MotionDiv = motion.create('div');
import { articlesApi, videosApi } from '../../services/backend';
import { PublicLayout } from '../../components/public/PublicSite';
import { GlassCard } from '../../components/ui/GlassCard';
import type { Article, Video as VideoModel } from '../../types/api';

export function ContentHubPage() {
  const reduce = useReducedMotion();
  const [search, setSearch] = useState('');
  const articles = useQuery({ queryKey: ['public-articles', search], queryFn: () => articlesApi.publicList({ title: search.trim() || undefined, size: 6 }), staleTime: 60_000 });
  const videos = useQuery({ queryKey: ['public-videos', search], queryFn: () => videosApi.publicList({ title: search.trim() || undefined, size: 6 }), staleTime: 60_000 });
  const articleItems = useMemo(() => articles.data?.content ?? [], [articles.data]);
  const videoItems = useMemo(() => videos.data?.content ?? [], [videos.data]);
  const error = articles.isError || videos.isError;
  return (
    <PublicLayout active="insights">
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 9 } }}>
        <Stack gap={2} sx={{ maxWidth: 760, mb: 5 }}><Chip label="CAREER INSIGHTS" color="primary" variant="outlined" sx={{ width: 'fit-content', fontWeight: 800 }} /><Typography variant="h1" sx={{ fontSize: { xs: '3rem', md: '5rem' }, lineHeight: .98 }}>Useful guidance for your next move.</Typography><Typography variant="h6" color="text.secondary" sx={{ lineHeight: 1.6, fontWeight: 500 }}>Practical content for candidates navigating applications, interviews, customer-facing careers and the changing world of work.</Typography><TextField value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search insights" sx={{ maxWidth: 560 }} slotProps={{ input: { startAdornment: <InputAdornment position="start"><Search size={18} /></InputAdornment> } }} /></Stack>
        {error && <Alert severity="warning" sx={{ mb: 3 }}>Some content is temporarily unavailable. You can still explore current openings.</Alert>}
        <Section title="Latest articles" icon={<BookOpen size={19} />}><Grid container spacing={2}>{articleItems.map((item, index) => <Grid key={item.id} size={{ xs: 12, md: 6, lg: 4 }}><ContentCard item={item} index={index} reduce={Boolean(reduce)} /></Grid>)}</Grid>{!articles.isLoading && !articleItems.length && <Empty label="No published articles match your search." />}</Section>
        <Section title="Featured videos" icon={<Video size={19} />}><Grid container spacing={2}>{videoItems.map((item, index) => <Grid key={item.id} size={{ xs: 12, md: 6, lg: 4 }}><VideoCard item={item} index={index} reduce={Boolean(reduce)} /></Grid>)}</Grid>{!videos.isLoading && !videoItems.length && <Empty label="No published videos match your search." />}</Section>
      </Container>
  </PublicLayout>
  );
}
function Section({ title, icon, children }: { title: string; icon: ReactNode; children: ReactNode }) { return <Box sx={{ mb: 8 }}><Stack direction="row" alignItems="center" gap={1} sx={{ mb: 2.5 }}><Box sx={{ color: 'primary.main', display: 'grid', placeItems: 'center' }}>{icon}</Box><Typography variant="h4" fontWeight={650}>{title}</Typography></Stack>{children}</Box>; }
function ContentCard({ item, index, reduce }: { item: Article; index: number; reduce: boolean }) { return <MotionDiv initial={reduce ? false : { opacity: 0, y: 16 }} whileInView={reduce ? undefined : { opacity: 1, y: 0 }} viewport={{ once: true, amount: .2 }} transition={{ delay: index * .05 }}><GlassCard sx={{ overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column' }}>{item.featuredImage ? <Box component="img" src={item.featuredImage} alt="" sx={{ width: '100%', height: 190, objectFit: 'cover' }} /> : <Box sx={{ height: 190, background: 'linear-gradient(135deg, rgba(200,155,60,.18), rgba(16,42,67,.08))' }} />}<Stack gap={1.2} sx={{ p: 2.5, flex: 1 }}><Chip size="small" label={item.category} sx={{ width: 'fit-content' }} /><Typography variant="h6" fontWeight={620}>{item.title}</Typography><Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>{item.excerpt}</Typography><Box sx={{ flex: 1 }} /><Button component={Link} to={`/insights/article/${item.slug}`} endIcon={<ArrowRight size={15} />} sx={{ alignSelf: 'flex-start' }}>Read insight</Button></Stack></GlassCard></MotionDiv>; }
function VideoCard({ item, index, reduce }: { item: VideoModel; index: number; reduce: boolean }) { return <MotionDiv initial={reduce ? false : { opacity: 0, y: 16 }} whileInView={reduce ? undefined : { opacity: 1, y: 0 }} viewport={{ once: true, amount: .2 }} transition={{ delay: index * .05 }}><GlassCard sx={{ overflow: 'hidden', height: '100%' }}>{item.thumbnailUrl ? <Box component="img" src={item.thumbnailUrl} alt="" sx={{ width: '100%', height: 190, objectFit: 'cover' }} /> : <Box sx={{ height: 190, display: 'grid', placeItems: 'center', background: 'linear-gradient(135deg, rgba(16,42,67,.14), rgba(200,155,60,.10))' }}><Video size={38} /></Box>}<Stack gap={1.2} sx={{ p: 2.5 }}><Chip size="small" label={item.category} sx={{ width: 'fit-content' }} /><Typography variant="h6" fontWeight={620}>{item.title}</Typography><Typography variant="body2" color="text.secondary">{item.description}</Typography><Button component={Link} to={`/insights/video/${item.slug}`} endIcon={<ArrowRight size={15} />} sx={{ alignSelf: 'flex-start' }}>Watch video</Button></Stack></GlassCard></MotionDiv>; }
function Empty({ label }: { label: string }) { return <Paper elevation={0} sx={{ p: 4, textAlign: 'center', border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>{label}</Paper>; }
