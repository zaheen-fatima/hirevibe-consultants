import type { ReactNode } from 'react';
import {
  Box,
  Button,
  Container,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Target,
  UsersRound,
  Zap,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { GlassCard } from '../../components/ui/GlassCard';
import {
  PublicLayout,
} from '../../components/public/PublicSite';
import { TestimonialsSection } from '../../components/public/TestimonialsSection';

const capabilities = [
  'BPO & customer support',
  'Sales & telecalling',
  'Technical support',
  'Collections',
  'Back office & operations',
  'Bulk hiring',
];

export function AboutPage() {
  return (
      <PublicLayout>
        <section className="hv-page-hero">
          <Container maxWidth="xl">
            <Button
                component={Link}
                to="/"
                startIcon={<ArrowLeft size={16} />}
                sx={{
                  mb: 2,
                }}
            >
              Back home
            </Button>

            <Typography className="hv-section-eyebrow">
              ABOUT HIREVIBE
            </Typography>

            <Typography className="hv-page-title">
              A focused recruitment partner built around fit,
              responsiveness and follow-through.
            </Typography>

            <Typography
                sx={{
                  maxWidth: 760,
                  color: 'text.secondary',
                  mt: 2,
                  fontSize: '1.06rem',
                }}
            >
              The company profile describes HireVibe as a recruitment
              and talent acquisition consultancy helping organizations
              identify, engage and hire relevant talent efficiently —
              with attention to role fit, candidate communication and
              timely coordination.
            </Typography>
          </Container>
        </section>

        <Container maxWidth="xl">
          <section className="hv-section">
            <Grid
                container
                spacing={3}
                alignItems="center"
            >
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography className="hv-section-eyebrow">
                  OUR PURPOSE
                </Typography>

                <Typography className="hv-section-title">
                  Connecting capable people with the right
                  opportunities.
                </Typography>

                <Typography className="hv-section-copy">
                  The aim is not simply to collect applications. It is
                  to understand the requirement, source relevant
                  profiles, assess fit and keep communication moving
                  through the stages that matter.
                </Typography>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <GlassCard
                    sx={{
                      p: {
                        xs: 3,
                        md: 4,
                      },
                      background:
                          'linear-gradient(145deg, rgba(16,42,67,.98), rgba(22,59,89,.98))',
                      color: '#fff',
                    }}
                >
                  <Typography
                      className="hv-kicker"
                      sx={{
                        color:
                            'var(--hv-accent-soft) !important',
                      }}
                  >
                    THE HIREVIBE APPROACH
                  </Typography>

                  <Stack
                      gap={2.2}
                      sx={{
                        mt: 2.4,
                      }}
                  >
                    <Approach
                        icon={<Target size={19} />}
                        title="Requirement-focused"
                        text="Hiring activity stays aligned to the actual role, eligibility, experience and location requirements."
                    />

                    <Approach
                        icon={<UsersRound size={19} />}
                        title="Responsive coordination"
                        text="Candidate communication, interviews and reasonable follow-ups are kept organized."
                    />

                    <Approach
                        icon={<Zap size={19} />}
                        title="Flexible engagement"
                        text="The model can support single vacancies, recurring recruitment and high-volume requirements."
                    />
                  </Stack>
                </GlassCard>
              </Grid>
            </Grid>
          </section>

          {/* Founder */}
          <section className="hv-section-tight">
            <GlassCard
                sx={{
                  p: {
                    xs: 3,
                    md: 4,
                  },
                  position: 'relative',
                  overflow: 'hidden',
                }}
            >
              <Box
                  sx={{
                    position: 'absolute',
                    width: 220,
                    height: 220,
                    borderRadius: '50%',
                    right: -90,
                    top: -110,
                    background:
                        'radial-gradient(circle, rgba(200,155,60,.13), transparent 70%)',
                    pointerEvents: 'none',
                  }}
              />

              <Typography className="hv-section-eyebrow">
                FOUNDER
              </Typography>

              <Typography
                  className="hv-section-title"
                  sx={{
                    mt: 0.5,
                  }}
              >
                Junaid Abbas
              </Typography>

              <Typography
                  color="text.secondary"
                  sx={{
                    mt: 0.8,
                  }}
              >
                Founder, HireVibe Consultants
              </Typography>
            </GlassCard>
          </section>

          {/* Capabilities */}
          <section
              className="hv-section-tight"
              id="capabilities"
          >
            <Typography className="hv-section-eyebrow">
              CORE CAPABILITIES
            </Typography>

            <Typography className="hv-section-title">
              Where the recruitment model can create the most
              signal.
            </Typography>

            <Grid
                container
                spacing={1.5}
                sx={{
                  mt: 3,
                }}
            >
              {capabilities.map((item) => (
                  <Grid
                      key={item}
                      size={{
                        xs: 12,
                        sm: 6,
                        md: 4,
                      }}
                  >
                    <GlassCard
                        sx={{
                          p: 2.4,
                          height: '100%',
                        }}
                    >
                      <Stack
                          direction="row"
                          gap={1.2}
                          alignItems="center"
                      >
                        <Box
                            sx={{
                              width: 34,
                              height: 34,
                              display: 'grid',
                              placeItems: 'center',
                              borderRadius: 2,
                              bgcolor:
                                  'rgba(200,155,60,.11)',
                              color: 'var(--hv-accent)',
                            }}
                        >
                          <Check size={17} />
                        </Box>

                        <Typography>
                          {item}
                        </Typography>
                      </Stack>
                    </GlassCard>
                  </Grid>
              ))}
            </Grid>
          </section>

          <TestimonialsSection />

          <section className="hv-section-tight">
            <GlassCard
                sx={{
                  p: {
                    xs: 3,
                    md: 5,
                  },
                }}
            >
              <Typography className="hv-section-eyebrow">
                READY TO TALK?
              </Typography>

              <Typography
                  className="hv-section-title"
                  sx={{
                    maxWidth: 820,
                  }}
              >
                If the right opportunity is not obvious yet,
                start with a conversation.
              </Typography>

              <Stack
                  direction={{
                    xs: 'column',
                    sm: 'row',
                  }}
                  gap={1}
                  sx={{
                    mt: 2.5,
                  }}
              >
                <Button
                    component={Link}
                    to="/#open-roles"
                    variant="contained"
                    endIcon={<ArrowRight size={16} />}
                >
                  Explore opportunities
                </Button>

                <Button
                    component={Link}
                    to="/contact"
                    variant="outlined"
                >
                  Get in touch
                </Button>
              </Stack>
            </GlassCard>
          </section>
        </Container>
      </PublicLayout>
  );
}

function Approach({
                    icon,
                    title,
                    text,
                  }: {
  icon: ReactNode;
  title: string;
  text: string;
}) {
  return (
      <Stack
          direction="row"
          gap={1.4}
      >
        <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 2,
              display: 'grid',
              placeItems: 'center',
              bgcolor: 'rgba(224,184,90,.11)',
              color: 'var(--hv-accent-soft)',
              flexShrink: 0,
            }}
        >
          {icon}
        </Box>

        <Box>
          <Typography>
            {title}
          </Typography>

          <Typography
              variant="body2"
              sx={{
                mt: 0.25,
                color: 'rgba(255,255,255,.68)',
                lineHeight: 1.7,
              }}
          >
            {text}
          </Typography>
        </Box>
      </Stack>
  );
}