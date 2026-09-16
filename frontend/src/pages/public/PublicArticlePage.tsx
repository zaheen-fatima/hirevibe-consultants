import { useQuery } from '@tanstack/react-query';
import { Alert, Box, Button, Chip, Container, Divider, Skeleton, Stack, Typography } from '@mui/material';
import { ArrowLeft, ArrowRight, BookOpen, Clock3 } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';

const MotionDiv = motion.create('div');
import { Link, useParams } from 'react-router-dom';
import { articlesApi } from '../../services/backend';
import { PublicLayout } from '../../components/public/PublicSite';
import { GlassCard } from '../../components/ui/GlassCard';
import { Seo } from '../../components/seo/Seo';
import { ArticleContent } from "../../components/ArticleContent";

export function PublicArticlePage() {
  const { slug = '' } = useParams<{ slug: string }>();
  const reduce = useReducedMotion();
  const query = useQuery({ queryKey: ['public-article', slug], queryFn: () => articlesApi.getPublicBySlug(slug), enabled: Boolean(slug), staleTime: 300_000 });
  if (query.isLoading) return <ArticleSkeleton />;
  if (query.isError || !query.data) return <PublicError label="This insight is unavailable." />;
  const article = query.data;
  const articleSeoTitle =
      `${article.title} | HireVibe Consultants`;

  const articleSeoDescription =
      article.excerpt?.replace(/\s+/g, ' ').trim().slice(0, 160) ||
      article.content?.replace(/\s+/g, ' ').trim().slice(0, 160) ||
      `Read ${article.title} from HireVibe Consultants.`;

  const articleSeoCanonical =
      `/articles/${article.id}`;


  return (
      <PublicLayout active="insights">
        <Seo
            title={articleSeoTitle}
            description={articleSeoDescription}
            canonical={articleSeoCanonical}
            type="article"
        />
    <Container maxWidth="md" sx={{ py: { xs: 4, md: 7 } }}>
      <Button component={Link} to="/insights" startIcon={<ArrowLeft size={17} />} sx={{ mb: 4 }}>Back to insights</Button>
      <MotionDiv initial={reduce ? false : { opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .55 }}>
        <Stack gap={2.2}><Chip icon={<BookOpen size={15} />} label={article.category} color="primary" variant="outlined" sx={{ width: 'fit-content', fontWeight: 800 }} /><Typography variant="h1" sx={{ fontSize: { xs: '2.6rem', md: '4.6rem' }, lineHeight: 1.02 }}>{article.title}</Typography><Typography variant="h6" color="text.secondary" sx={{ lineHeight: 1.6 }}>{article.excerpt}</Typography><Stack direction="row" gap={1} alignItems="center" color="text.secondary"><Clock3 size={15} /><Typography variant="body2">Published {article.publishedAt ? new Date(article.publishedAt).toLocaleDateString() : 'recently'}</Typography></Stack></Stack>
        {article.featuredImage && <Box component="img" src={article.featuredImage} alt="" sx={{ width: '100%', maxHeight: 430, objectFit: 'cover', borderRadius: 4, mt: 4 }} />}
        <GlassCard
            sx={{
              mt: 4,
              p: { xs: 2.5, md: 4 },
              borderRadius: 4,
            }}
        >
          <ArticleContent content={article.content} />
        </GlassCard>
        <Divider sx={{ my: 5 }} />
        <Button component={Link} to="/#open-roles" variant="contained" endIcon={<ArrowRight size={17} />}>Explore opportunities</Button>
      </MotionDiv>
    </Container>
  </PublicLayout>);
}
function ArticleSkeleton() { return <Container maxWidth="md" sx={{ py: 8 }}><Skeleton width={150} height={35} /><Skeleton width="90%" height={90} sx={{ mt: 3 }} /><Skeleton width="70%" height={40} /><Skeleton variant="rounded" height={360} sx={{ mt: 4 }} /><Skeleton height={260} sx={{ mt: 3 }} /></Container>; }
function PublicError({ label }: { label: string }) { return <Container maxWidth="md" sx={{ py: 10 }}><Alert severity="warning" sx={{ mb: 2 }}>{label}</Alert><Button component={Link} to="/insights" startIcon={<ArrowLeft size={17} />}>Back to insights</Button></Container>; }
