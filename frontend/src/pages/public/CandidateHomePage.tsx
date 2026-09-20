import { useEffect, useMemo, useRef, useState, type MouseEvent as ReactMouseEvent, type ReactNode } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Alert, Box, Button, Container, Grid, InputAdornment, MenuItem, Stack, TextField, Typography } from '@mui/material';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, BriefcaseBusiness, Check, Mail, MapPin, MessageCircle, Send, Target, UsersRound } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { articlesApi, contactsApi, jobsApi, videosApi } from '../../services/backend';
import type { Job } from '../../types/api';
import { GlassCard } from '../../components/ui/GlassCard';
import { PublicLayout } from '../../components/public/PublicSite';

const MotionDiv = motion.create('div');

const heroLines = [
  'BUILDING TEAMS, SHAPING FUTURE',
  'RIGHT PEOPLE, REAL OPPORTUNITIES',
  'TALENT THAT MOVES BUSINESS FORWARD',
];

const candidateJourney = [
  { number: '01', icon: Target, title: 'Discover the right fit', text: 'Search active opportunities by role, location and work type without fighting through clutter.', action: 'Discover opportunities', to: '/#open-roles' },
  { number: '02', icon: BriefcaseBusiness, title: 'Apply with confidence', text: 'A focused application flow captures the information recruiters actually need, including your resume.', action: 'Apply now', to: '/apply' },
  { number: '03', icon: MessageCircle, title: 'Stay connected', text: 'If the right role is not live yet, tell the recruitment team what you are looking for.', action: 'Get in touch', to: '/contact' },
];

const services = [
  { title: 'Talent Assessment Solutions', text: 'Our experienced team identifies hiring needs, sources candidates and screens them.', action: 'Learn More', to: '/services', image: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1400&q=84' },
  { title: 'Executive Search Services', text: 'We specialize in identifying and placing top executives for leadership roles.', action: 'Apply Now', to: '/apply', image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1400&q=84' },
];

const process = [
  ['01', 'Understand', 'We start with the role, the expectations and what a successful match needs to look like.'],
  ['02', 'Source & assess', 'Relevant profiles are sourced and screened against the agreed criteria before moving forward.'],
  ['03', 'Coordinate', 'Interview availability, communication and follow-ups stay organized so momentum is not lost.'],
  ['04', 'Support the move', 'Candidate engagement continues through selection, documentation and the joining stage.'],
] as const;



export function CandidateHomePage() {
  const reduce = Boolean(useReducedMotion());
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [type, setType] = useState('');
  const [heroText, setHeroText] = useState('');
  const phraseIndexRef = useRef(0);
  const contact = useContactForm();

  const routeLocation = useLocation();

  const handleHomeHashNavigation = (
      event: ReactMouseEvent<HTMLAnchorElement>,
  ) => {
    const targetPath = '/';
    const targetHash = '#open-roles';

    const currentPath = routeLocation.pathname;
    const currentHash = routeLocation.hash;


    if (currentPath !== targetPath || currentHash !== targetHash) {
      return;
    }


    event.preventDefault();

    const targetElement = document.getElementById('open-roles');

    if (!targetElement) {
      return;
    }

    const header = document.querySelector('.hv-public-nav');

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
  };



  useEffect(() => {
    if (reduce) { setHeroText(heroLines[0]); return; }
    let character = 0; let deleting = false; let timer = 0;
    const tick = () => {
      const phrase = heroLines[phraseIndexRef.current];
      character = deleting ? Math.max(0, character - 1) : Math.min(phrase.length, character + 1);
      setHeroText(phrase.slice(0, character));
      if (!deleting && character === phrase.length) { deleting = true; timer = window.setTimeout(tick, 1800); }
      else if (deleting && character === 0) { deleting = false; phraseIndexRef.current = (phraseIndexRef.current + 1) % heroLines.length; timer = window.setTimeout(tick, 420); }
      else timer = window.setTimeout(tick, deleting ? 30 : 55);
    };
    timer = window.setTimeout(tick, 650);
    return () => window.clearTimeout(timer);
  }, [reduce]);

  const jobs = useQuery({ queryKey: ['public-jobs-home', search, location, type], queryFn: () => jobsApi.publicList({ title: search || undefined, location: location || undefined, type: type || undefined, page: 0, size: 6 }), staleTime: 45_000, retry: false });
  const articles = useQuery({ queryKey: ['public-articles-home'], queryFn: () => articlesApi.publicList({ page: 0, size: 4 }), staleTime: 120_000, retry: false });
  const videos = useQuery({ queryKey: ['public-videos-home'], queryFn: () => videosApi.publicList({ page: 0, size: 4 }), staleTime: 120_000, retry: false });
  const roles = jobs.data?.content ?? [];
  const types = useMemo(() => Array.from(new Set(roles.map((job) => job.type).filter(Boolean))).slice(0, 6), [roles]);

  return <PublicLayout>
    <HeroSection
        line={heroText}
        reduce={reduce}
        onHomeHashNavigation={handleHomeHashNavigation}
    />
    <main>
      <section className="hv-section hv-journey-section">
        <Container maxWidth="xl">
          <SectionIntro eyebrow="YOUR NEXT CHAPTER" title="A calmer way to move toward the next opportunity" description="The experience is designed around the candidate journey — discover, apply and stay connected." reduce={reduce} />
          <Grid container spacing={1.6} sx={{ mt: 3.2 }}>{candidateJourney.map((item, index) => { const Icon = item.icon; return <Grid key={item.number} size={{ xs: 12, md: 4 }}><Reveal reduce={reduce} delay={index * .07}><GlassCard className="hv-journey-card" sx={{ minHeight: { md: 300 }, p: { xs: 2.8, md: 3.2 } }}><Typography className="hv-card-number">{item.number}</Typography><Box className="hv-round-icon"><Icon size={21} strokeWidth={1.5} /></Box><Typography className="hv-card-title">{item.title}</Typography><Typography color="text.secondary" sx={{ mt: 1.1, lineHeight: 1.75 }}>{item.text}</Typography><Button component={Link} to={item.to} className="hv-card-link" endIcon={<ArrowRight size={15} />} sx={{ alignSelf: 'flex-start', mt: 'auto', pt: 1.8, px: 0 }}>{item.action}</Button></GlassCard></Reveal></Grid>; })}</Grid>
        </Container>
      </section>

      <section className="hv-statement-section"><Container maxWidth="xl"><Reveal reduce={reduce}><Box className="hv-statement-block"><Typography className="hv-section-eyebrow">AMBITION, WITH DIRECTION</Typography><SplitRevealText text="Don't just chase a job. Move your story forward." className="hv-statement-title" reduce={reduce} /><Typography className="hv-statement-copy">The strongest career moves are rarely accidental. They start with a clear sense of where you can contribute, what you want to learn and which opportunity deserves your energy.</Typography><Stack direction={{ xs: 'column', sm: 'row' }} gap={1.2} sx={{ mt: 3.5 }}><Button
          component={Link}
          to="/#open-roles"
          onClick={handleHomeHashNavigation}         variant="contained"
          endIcon={<ArrowRight size={17} />}
      >
        Explore the possibilities
      </Button><Button component={Link} to="/insights" variant="text">Sharpen your edge</Button></Stack></Box></Reveal></Container></section>

      <section className="hv-section hv-about-section"><Container maxWidth="xl"><Grid container spacing={{ xs: 4, md: 9 }} alignItems="center"><Grid size={{ xs: 12, md: 5 }}><Reveal reduce={reduce} y={30}><Typography className="hv-section-eyebrow">ABOUT HIREVIBE</Typography><SplitRevealText text="Connecting Talent with Opportunities" className="hv-section-title" reduce={reduce} /></Reveal></Grid><Grid size={{ xs: 12, md: 7 }}><Reveal reduce={reduce} delay={.06} y={30}><Typography className="hv-section-copy hv-about-copy">HireVibe Consultants provides tailored recruitment solutions, aligning the right talent with the right opportunities while keeping the experience clear, thoughtful and human for employers and professionals.</Typography><Button component={Link} to="/about" className="hv-inline-arrow" endIcon={<ArrowRight size={16} />} sx={{ mt: 2.5, px: 0 }}>Discover HireVibe</Button></Reveal></Grid></Grid><Box className="hv-about-visual" sx={{ mt: { xs: 5, md: 8 } }}><Box className="hv-about-visual-copy"><Typography className="hv-kicker">RIGHT PEOPLE. REAL OPPORTUNITIES.</Typography><Typography>Human judgement, structured process and a clear direction.</Typography></Box></Box></Container></section>

      <section className="hv-section hv-services-section"><Container maxWidth="xl"><SectionIntro eyebrow="WHAT WE DO" title="Tailored Recruitment Solutions" description="Looking for top-tier talent without the stress and guesswork? We deliver customized, efficient, and results-driven hiring solutions tailored to your unique business needs. From sourcing and screening to onboarding, we streamline the entire recruitment process—so you can focus on growth. We connect you with the right talent through customized strategies built around your unique hiring needs." reduce={reduce} /><Grid container spacing={2.2} sx={{ mt: 3.5 }}>{services.map((service, index) => <Grid key={service.title} size={{ xs: 12, md: 6 }}><Reveal reduce={reduce} delay={index * .08}><GlassCard className="hv-service-card" sx={{ p: 0, overflow: 'hidden' }}><Box className="hv-service-media" sx={{ backgroundImage: `linear-gradient(180deg, rgba(6,10,14,.02), rgba(6,10,14,.58)), url(${service.image})` }}><Box className="hv-service-media-label">0{index + 1}</Box></Box><Stack sx={{ p: { xs: 2.6, md: 3.2 } }} gap={1}><Typography className="hv-card-title">{service.title}</Typography><Typography color="text.secondary" sx={{ lineHeight: 1.75 }}>{service.text}</Typography><Button component={Link} to={service.to} sx={{ alignSelf: 'flex-start', px: 0, mt: .4 }} endIcon={<ArrowRight size={15} />}>{service.action}</Button></Stack></GlassCard></Reveal></Grid>)}</Grid></Container></section>

      <section className="hv-section hv-roles-section" id="open-roles"><Container maxWidth="xl"><Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ md: 'end' }} gap={2}><SectionIntro eyebrow="OPEN ROLES" title="Find work worth moving for" description="Search current opportunities by role, location and work type." reduce={reduce} /><Button
          component={Link}
          to="/careers"

          endIcon={<ArrowRight size={16} />}
      >
        View all roles
      </Button></Stack><GlassCard className="hv-search-panel" sx={{ mt: 3, p: { xs: 2, md: 2.2 } }}><Grid container spacing={1.3} alignItems="center"><Grid size={{ xs: 12, md: 4 }}><TextField fullWidth label="Search roles" value={search} onChange={(e) => setSearch(e.target.value)} slotProps={{ input: { startAdornment: <InputAdornment position="start"><BriefcaseBusiness size={16} /></InputAdornment> } }} /></Grid><Grid size={{ xs: 12, sm: 6, md: 3 }}><TextField fullWidth label="Location" value={location} onChange={(e) => setLocation(e.target.value)} slotProps={{ input: { startAdornment: <InputAdornment position="start"><MapPin size={16} /></InputAdornment> } }} /></Grid><Grid size={{ xs: 12, sm: 6, md: 3 }}><TextField select fullWidth label="Work type" value={type} onChange={(e) => setType(e.target.value)}>{types.map((value) => <MenuItem key={value} value={value}>{value}</MenuItem>)}<MenuItem value="">All types</MenuItem></TextField></Grid><Grid size={{ xs: 12, md: 2 }}><Button
          component={Link}
          to="/careers"
          fullWidth variant="contained"
          endIcon={<ArrowRight size={16} />}
          sx={{ minHeight: 40 }}
      >
        Explore roles
      </Button></Grid></Grid></GlassCard><Grid container spacing={1.7} sx={{ mt: 2.2 }}>{roles.slice(0, 3).map((job, index) => <Grid key={job.id} size={{ xs: 12, md: 4 }}><RoleCard job={job} index={index} reduce={reduce} /></Grid>)}{!jobs.isLoading && roles.length === 0 && <Grid size={{ xs: 12 }}><GlassCard sx={{ p: 3 }}><Typography color="text.secondary">Current roles will appear here automatically when published by the recruitment team.</Typography></GlassCard></Grid>}</Grid></Container></section>

      <section className="hv-section hv-process-section"><Container maxWidth="xl"><SectionIntro eyebrow="HOW IT WORKS" title="A clear process from first conversation to next move" description="Structured enough to stay efficient. Human enough to stay useful." reduce={reduce} /><Grid container spacing={1.6} sx={{ mt: 3 }}>{process.map(([number, title, text], index) => <Grid key={number} size={{ xs: 12, sm: 6, md: 3 }}><Reveal reduce={reduce} delay={index * .06}><GlassCard className="hv-process-card" sx={{ minHeight: 250, p: 2.8 }}><Typography className="hv-process-number">{number}</Typography><Typography className="hv-card-title" sx={{ mt: 3 }}>{title}</Typography><Typography color="text.secondary" sx={{ mt: 1, lineHeight: 1.75 }}>{text}</Typography></GlassCard></Reveal></Grid>)}</Grid></Container></section>

      <section className="hv-section hv-contact-home"><Container maxWidth="xl"><Box className="hv-contact-panel"><Grid container><Grid size={{ xs: 12, md: 5 }}><Box className="hv-contact-visual"><Typography className="hv-kicker">NOT SEEING THE RIGHT ROLE?</Typography><Typography className="hv-contact-title">Keep the conversation open.</Typography><Typography sx={{ mt: 1.5, color: 'rgba(255,255,255,.70)', maxWidth: 500, lineHeight: 1.75 }}>Share the kind of opportunity you want and let the recruitment team understand where you fit best.</Typography><Stack gap={1.3} sx={{ mt: 3 }}><Stack direction="row" gap={1} alignItems="center"><Mail size={16} /><Typography variant="body2">Clear communication</Typography></Stack><Stack direction="row" gap={1} alignItems="center"><MessageCircle size={16} /><Typography variant="body2">Human follow-up</Typography></Stack></Stack></Box></Grid><Grid size={{ xs: 12, md: 7 }}><Box sx={{ p: { xs: 2.5, md: 4.5 } }}><Typography variant="h4">Get in touch</Typography><Typography color="text.secondary" sx={{ mt: .6, mb: 2.5 }}>A short message is enough. We can take it from there.</Typography><Stack gap={1.5}><Grid container spacing={1.5}><Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth label="Name" value={contact.form.name} onChange={(e) => contact.setForm({ ...contact.form, name: e.target.value })} /></Grid><Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth label="Email" type="email" value={contact.form.email} onChange={(e) => contact.setForm({ ...contact.form, email: e.target.value })} /></Grid><Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth label="Phone" value={contact.form.phone} onChange={(e) => contact.setForm({ ...contact.form, phone: e.target.value })} /></Grid><Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth label="Subject" value={contact.form.subject} onChange={(e) => contact.setForm({ ...contact.form, subject: e.target.value })} /></Grid></Grid><TextField fullWidth label="Message" multiline minRows={5} value={contact.form.message} onChange={(e) => contact.setForm({ ...contact.form, message: e.target.value })} />{contact.mutation.isError && <Alert severity="error">We could not send your message. Please check the backend connection and try again.</Alert>}{contact.mutation.isSuccess && <Alert severity="success">Message sent. Thank you — the HireVibe team has your request.</Alert>}<Button variant="contained" size="large" endIcon={<Send size={16} />} disabled={contact.mutation.isPending || !contact.form.name || !contact.form.email || !contact.form.phone || !contact.form.subject || !contact.form.message} onClick={() => contact.mutation.mutate()} sx={{ alignSelf: 'flex-start', px: 2.5 }}>{contact.mutation.isPending ? 'Sending…' : 'Send message'}</Button></Stack></Box></Grid></Grid></Box></Container></section>

      <section className="hv-section-tight hv-insights-section"><Container maxWidth="xl"><Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ sm: 'end' }} gap={2}><SectionIntro eyebrow="CAREER SIGNAL" title="Useful insight, not content noise" description="Practical guidance from the HireVibe content hub." reduce={reduce} /><Button component={Link} to="/insights" endIcon={<ArrowRight size={16} />}>Open insights</Button></Stack><Grid container spacing={2} sx={{ mt: 3 }}>{articles.data?.content.slice(0, 2).map((article, index) => <Grid key={`article-${article.id}`} size={{ xs: 12, md: 6 }}><ContentTile title={article.title} text={article.excerpt || article.content} meta={article.category} link={`/insights/article/${article.slug}`} image={article.featuredImage} label="Read article" reduce={reduce} index={index} /></Grid>)}{videos.data?.content.slice(0, 2).map((video, index) => <Grid key={`video-${video.id}`} size={{ xs: 12, md: 6 }}><ContentTile title={video.title} text={video.description} meta={video.category} link={`/insights/video/${video.slug}`} image={video.thumbnailUrl} label="Watch video" reduce={reduce} index={index + 2} /></Grid>)}</Grid>{(articles.isError || videos.isError) && <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2 }}>Insights will appear here automatically when published content is available from the backend.</Typography>}</Container></section>
    </main>
  </PublicLayout>;
}

function useContactForm() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const mutation = useMutation({
    mutationFn: () =>
        contactsApi.create({
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          subject: form.subject.trim(),
          message: form.message.trim(),
        }),

    onSuccess: () =>
        setForm({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: '',
        }),
  });

  return {
    form,
    setForm,
    mutation,
  };
}

function HeroSection({
                       line,
                       reduce,
                       onHomeHashNavigation,
                     }: {
  line: string;
  reduce: boolean;
  onHomeHashNavigation: (
      event: ReactMouseEvent<HTMLAnchorElement>,
  ) => void;
}) {return <Box className="hv-hero"><Box className="hv-hero-photo" /><Box className="hv-hero-overlay" /><Box className="hv-hero-grid" /><Container maxWidth="xl" className="hv-hero-content"><Grid container spacing={{ xs: 4, md: 8 }} alignItems="end"><Grid size={{ xs: 12, md: 8 }}><Reveal reduce={reduce} y={32}><Box><Typography className="hv-hero-kicker">PEOPLE · OPPORTUNITY · GROWTH</Typography><HireVibeMark /><Typography component="h1" className="hv-hero-title"><span className="hv-hero-type">{line || '\u00a0'}</span><span className="hv-type-cursor" aria-hidden="true" /></Typography><Typography className="hv-hero-copy">Right people. Real opportunities. Better career moves.</Typography><Stack direction={{ xs: 'column', sm: 'row' }} gap={1.2} className="hv-hero-actions"><Button
    component={Link}
    to="/#open-roles"
    onClick={onHomeHashNavigation}    variant="contained"
    size="large"
    endIcon={<ArrowRight size={17} />}
>
  Explore
</Button><Button component={Link} to="/apply" variant="outlined" size="large">Apply now</Button></Stack><Box className="hv-hero-note"><span><Check size={15} /> Executive search</span><span><Check size={15} /> Talent assessment</span><span><Check size={15} /> Workforce planning</span></Box></Box></Reveal></Grid><Grid size={{ xs: 12, md: 4 }}><Reveal reduce={reduce} y={18}><HeroConstellation /></Reveal></Grid></Grid></Container></Box>; }

function HireVibeMark() { return <Box className="hv-script-mark" aria-label="HireVibe"><span>Hire</span><b>Vibe</b><i className="hv-mark-plane">➤</i></Box>; }
function HeroConstellation() { return <Box className="hv-hero-art" aria-hidden="true"><Box className="hv-hero-art-ring hv-ring-one" /><Box className="hv-hero-art-ring hv-ring-two" /><Box className="hv-hero-art-line hv-line-one" /><Box className="hv-hero-art-line hv-line-two" /><Box className="hv-paper-plane">➤</Box><Box className="hv-hero-chip hv-chip-one"><UsersRound size={17} /><span>Talent</span></Box><Box className="hv-hero-chip hv-chip-two"><Target size={17} /><span>Fit</span></Box><Box className="hv-hero-chip hv-chip-three"><BriefcaseBusiness size={17} /><span>Opportunity</span></Box></Box>; }
function RoleCard({ job, index, reduce }: { job: Job; index: number; reduce: boolean }) { return <Reveal reduce={reduce} delay={index * .05}><GlassCard className="hv-role-card" sx={{ p: 2.7 }}><Stack gap={1.2} sx={{ height: '100%' }}><Stack direction="row" justifyContent="space-between" gap={1}><Typography variant="caption" color="text.secondary">#{String(job.id).padStart(3, '0')}</Typography></Stack><Typography className="hv-role-title">{job.title}</Typography><Stack className="hv-role-meta"><span><MapPin size={14} /> {job.location}</span><span><BriefcaseBusiness size={14} /> {job.type}</span></Stack><Typography variant="body2" color="text.secondary" sx={{ flex: 1, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{job.description}</Typography><Stack direction="row" gap={.8}><Button component={Link} to={`/careers/job/${job.id}`} sx={{ px: 0 }}>View role</Button><Button component={Link} to={`/apply?jobId=${job.id}`} variant="contained" size="small" sx={{ ml: 'auto' }}>Apply</Button></Stack></Stack></GlassCard></Reveal>; }
function ContentTile({ title, text, meta, link, image, label, reduce, index }: { title: string; text: string; meta: string; link: string; image: string | null; label: string; reduce: boolean; index: number }) { return <Reveal reduce={reduce} delay={index * .05}><GlassCard className="hv-content-tile" sx={{ p: 0, overflow: 'hidden', height: '100%' }}><Box className="hv-content-image" sx={{ backgroundImage: image ? `linear-gradient(180deg, rgba(7,24,39,.04), rgba(7,24,39,.72)), url(${image})` : 'linear-gradient(135deg, #102a43, #1b3b59)' }}><Box>{meta || 'HireVibe'}</Box></Box><Stack gap={1.1} sx={{ p: 2.6 }}><Typography variant="h6">{title}</Typography><Typography variant="body2" color="text.secondary" sx={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{text}</Typography><Button component={Link} to={link} sx={{ alignSelf: 'flex-start', px: 0 }} endIcon={<ArrowRight size={15} />}>{label}</Button></Stack></GlassCard></Reveal>; }
function SectionIntro({ eyebrow, title, description, reduce }: { eyebrow: string; title: string; description: string; reduce: boolean }) { return <Box className="hv-section-head"><Typography className="hv-section-eyebrow">{eyebrow}</Typography><SplitRevealText text={title} className="hv-section-title" reduce={reduce} /><Typography className="hv-section-copy">{description}</Typography></Box>; }
function SplitRevealText({ text, className, reduce }: { text: string; className: string; reduce: boolean }) { return <Typography component="h2" className={className}>{text.split(' ').map((word, index) => <motion.span key={`${word}-${index}`} initial={reduce ? false : { opacity: 0, y: 18, filter: 'blur(7px)' }} whileInView={reduce ? undefined : { opacity: 1, y: 0, filter: 'blur(0px)' }} viewport={{ once: true, amount: .7 }} transition={{ duration: .5, delay: index * .035, ease: [0.22, 1, 0.36, 1] }}>{word}{index < text.split(' ').length - 1 ? ' ' : ''}</motion.span>)}</Typography>; }
function Reveal({ children, reduce, delay = 0, y = 22 }: { children: ReactNode; reduce: boolean; delay?: number; y?: number }) { return <MotionDiv initial={reduce ? false : { opacity: 0, y }} whileInView={reduce ? undefined : { opacity: 1, y: 0 }} viewport={{ once: true, amount: .16 }} transition={{ duration: .7, delay, ease: [0.22, 1, 0.36, 1] }}>{children}</MotionDiv>; }
