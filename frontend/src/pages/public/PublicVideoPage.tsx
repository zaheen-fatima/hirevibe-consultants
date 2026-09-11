import { useQuery } from '@tanstack/react-query';
import { Alert, Box, Button, Chip, Container, Divider, Stack, Typography } from '@mui/material';
import { ArrowLeft, ArrowRight, PlayCircle } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';

const MotionDiv = motion.create('div');
import { Link, useParams } from 'react-router-dom';
import { videosApi } from '../../services/backend';
import { PublicLayout } from '../../components/public/PublicSite';
import { GlassCard } from '../../components/ui/GlassCard';
import {Seo} from "../../components/seo/Seo";

export function PublicVideoPage() {
  const { slug = '' } = useParams<{ slug: string }>();
  const reduce = useReducedMotion();
  const query = useQuery({ queryKey: ['public-video', slug], queryFn: () => videosApi.getPublicBySlug(slug), enabled: Boolean(slug), staleTime: 300_000 });
  if (query.isLoading) return <Container maxWidth="md" sx={{ py: 8 }}><Box sx={{ height: 460, borderRadius: 4, bgcolor: 'action.hover' }} /><Box sx={{ height: 45, mt: 3, bgcolor: 'action.hover', borderRadius: 2 }} /></Container>;
  if (query.isError || !query.data) return <Container maxWidth="md" sx={{ py: 10 }}><Alert severity="warning" sx={{ mb: 2 }}>This video is unavailable.</Alert><Button component={Link} to="/insights" startIcon={<ArrowLeft size={17} />}>Back to insights</Button></Container>;
  const video = query.data;
  const videoSeoTitle =
      `${video.title} | HireVibe Consultants`;

  const videoSeoDescription =
      video.description?.replace(/\s+/g, ' ').trim().slice(0, 160) ||
      `Watch ${video.title} from HireVibe Consultants.`;

  const videoSeoCanonical =
      `/videos/${video.id}`;

  return <PublicLayout active="insights">
    <Seo
        title={videoSeoTitle}
        description={videoSeoDescription}
        canonical={videoSeoCanonical}
        type="video.other"
    />
    <Container maxWidth="md" sx={{ py: { xs: 4, md: 7 } }}><Button component={Link} to="/insights" startIcon={<ArrowLeft size={17} />} sx={{ mb: 4 }}>Back to insights</Button><MotionDiv initial={reduce ? false : { opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .55 }}><Stack gap={2}><Chip icon={<PlayCircle size={15} />} label={video.category} color="primary" variant="outlined" sx={{ width: 'fit-content', fontWeight: 800 }} /><Typography variant="h1" sx={{ fontSize: { xs: '2.6rem', md: '4.6rem' }, lineHeight: 1.02 }}>{video.title}</Typography><Typography variant="h6" color="text.secondary" sx={{ lineHeight: 1.6 }}>{video.description}</Typography><GlassCard sx={{ overflow: 'hidden', p: 0, borderRadius: 4, mt: 2 }}><Box sx={{ position: 'relative', aspectRatio: '16 / 9', bgcolor: '#080b12' }}><video controls preload="metadata" poster={video.thumbnailUrl ?? undefined} src={video.videoUrl} style={{ width: '100%', height: '100%', display: 'block' }} /></Box></GlassCard><Divider sx={{ my: 2 }} /><Button component={Link} to="/#open-roles" variant="contained" endIcon={<ArrowRight size={17} />} sx={{ alignSelf: 'flex-start' }}>Explore opportunities</Button></Stack></MotionDiv></Container></PublicLayout>;
}
