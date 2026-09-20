import { lazy, Suspense, useEffect, useRef } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { AppShell } from '../components/layout/AppShell';
import { ProtectedRoute } from '../components/ui/ProtectedRoute';
import { AuthProvider } from '../features/auth/AuthContext';
import { DashboardPage } from '../pages/DashboardPage';
import { LoginPage } from '../pages/LoginPage';
import { PlaceholderPage } from '../pages/PlaceholderPage';
import { SettingsPage } from '../pages/SettingsPage';
import { Seo } from '../components/seo/Seo';
import { NotFoundPage } from '../pages/NotFoundPage';

const JobsPage = lazy(() => import('../features/jobs/JobsPage').then((module) => ({ default: module.JobsPage })));
const ApplicationsPage = lazy(() => import('../features/applications/ApplicationsPage').then((module) => ({ default: module.ApplicationsPage })));
const ContentHubPage = lazy(() => import('../pages/public/ContentHubPage').then((module) => ({ default: module.ContentHubPage })));
const PublicArticlePage = lazy(() => import('../pages/public/PublicArticlePage').then((module) => ({ default: module.PublicArticlePage })));
const PublicVideoPage = lazy(() => import('../pages/public/PublicVideoPage').then((module) => ({ default: module.PublicVideoPage })));
const CandidateHomePage = lazy(() => import('../pages/public/CandidateHomePage').then((module) => ({ default: module.CandidateHomePage })));
const PublicJobPage = lazy(() => import('../pages/public/PublicJobPage').then((module) => ({ default: module.PublicJobPage })));
const PublicJobsPage = lazy(
    () =>
        import('../pages/public/PublicJobsPage').then((module) => ({
          default: module.PublicJobsPage,
        })),
);
const InquiriesPage = lazy(() => import('../features/inquiries/InquiriesPage').then((module) => ({ default: module.InquiriesPage })));
const ContactsPage = lazy(() => import('../features/contacts/ContactsPage').then((module) => ({ default: module.ContactsPage })));
const ArticlesPage = lazy(() => import('../features/articles/ArticlesPage').then((module) => ({ default: module.ArticlesPage })));
const VideosPage = lazy(() => import('../features/videos/VideosPage').then((module) => ({ default: module.VideosPage })));
const AdminPage = lazy(() => import('../features/admin/AdminPage').then((module) => ({ default: module.AdminPage })));
const AuditSecurityPage = lazy(() => import('../features/admin/AuditSecurityPage').then((module) => ({ default: module.AuditSecurityPage })));
const ApplyPage = lazy(() => import('../pages/public/ApplyPage').then((module) => ({ default: module.ApplyPage })));
const ContactPage = lazy(() => import('../pages/public/ContactPage').then((module) => ({ default: module.ContactPage })));
const AboutPage = lazy(() => import('../pages/public/AboutPage').then((module) => ({ default: module.AboutPage })));
const ServicesPage = lazy(() => import('../pages/public/ServicesPage').then((module) => ({ default: module.ServicesPage })));
const ReviewsPage = lazy(
    () => import('../features/reviews/ReviewsPage')
            .then((module) => ({
              default: module.ReviewsPage,
            })),
);

function ScrollToTop() {
  const { pathname, search, hash } = useLocation();
  const previousPathname = useRef(pathname);
  const previousSearch = useRef(search);

  useEffect(() => {
    const samePath = previousPathname.current === pathname;
    const hasTarget = Boolean(hash);

    if (hasTarget) {
      const id = decodeURIComponent(hash.slice(1));
      let frame = 0;
      const scrollToTarget = () => {
        const target = document.getElementById(id);
        if (!target) return;
        const header = document.querySelector('.hv-public-nav');
        const offset = header instanceof HTMLElement ? header.offsetHeight + 18 : 96;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: Math.max(0, top), left: 0, behavior: 'smooth' });
      };
      frame = window.requestAnimationFrame(() => window.requestAnimationFrame(scrollToTarget));
      previousPathname.current = pathname;
      previousSearch.current = search;
      return () => window.cancelAnimationFrame(frame);
    }

    if (!samePath || previousSearch.current !== search) {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    }

    previousPathname.current = pathname;
    previousSearch.current = search;
  }, [pathname, search, hash]);

  return null;
}

function RouteSeo() {
  const { pathname } = useLocation();

  if (pathname === '/') {
    return (
        <Seo
            title="HireVibe Consultants"
            description="HireVibe Consultants connects people with meaningful career opportunities and helps organizations build stronger teams."
            canonical="/"
        />
    );
  }

  if (pathname === '/#open-roles') {
    return (
        <Seo
            title="Careers & Open Opportunities"
            description="Explore current career opportunities with HireVibe Consultants and take your next professional step."
            canonical="/"
        />
    );
  }

  if (pathname === '/insights') {
    return (
        <Seo
            title="Career Insights"
            description="Explore practical career insights, recruitment guidance and useful perspectives for your next move."
            canonical="/insights"
        />
    );
  }

  if (pathname === '/about') {
    return (
        <Seo
            title="About HireVibe Consultants"
            description="Learn about HireVibe Consultants and our approach to people, opportunity and growth."
            canonical="/about"
        />
    );
  }

  if (pathname === '/services') {
    return (
        <Seo
            title="Recruitment & Consulting Services"
            description="Explore HireVibe Consultants services for candidates, recruitment and organizational talent needs."
            canonical="/services"
        />
    );
  }

  if (pathname === '/contact') {
    return (
        <Seo
            title="Contact HireVibe Consultants"
            description="Get in touch with HireVibe Consultants for recruitment, career and opportunity-related enquiries."
            canonical="/contact"
        />
    );
  }

  if (pathname === '/apply') {
    return (
        <Seo
            title="Apply for Opportunities"
            description="Submit your application and take the next step toward your career opportunity."
            canonical="/apply"
        />
    );
  }

  if (pathname === '/login' || pathname.startsWith('/admin')) {
    return (
        <Seo
            title="Administration"
            description="HireVibe Consultants administration portal."

        />
    );
  }

  return null;
}

function RouteFallback() {
  return <Box sx={{ minHeight: 320, display: 'grid', placeItems: 'center' }}><CircularProgress size={28} /></Box>;
}

export function App() {
  return (
    <AuthProvider>
      <ScrollToTop />
      <RouteSeo />
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route path="/" element={<CandidateHomePage />} />
          <Route path="/careers" element={<PublicJobsPage />} />          <Route path="/careers/job/:id" element={<PublicJobPage />} />
          <Route path="/insights" element={<ContentHubPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/apply" element={<ApplyPage />} />
          <Route path="/insights/article/:slug" element={<PublicArticlePage />} />
          <Route path="/insights/video/:slug" element={<PublicVideoPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin" element={<ProtectedRoute />}><Route element={<Navigate to="/admin/dashboard" replace />} /></Route>
          <Route element={<ProtectedRoute />}>
            <Route element={<AppShell />}>
              <Route path="/admin/dashboard" element={<DashboardPage />} />
              <Route path="/admin/jobs" element={<JobsPage />} />
              <Route path="/admin/applications" element={<ApplicationsPage />} />
              <Route path="/admin/inquiries" element={<InquiriesPage />} />
              <Route path="/admin/contacts" element={<ContactsPage />} />
              <Route path="/admin/articles" element={<ArticlesPage />} />
              <Route path="/admin/videos" element={<VideosPage />} />
              <Route path="/admin/users" element={<AdminPage />} />
              <Route path="/admin/security" element={<AuditSecurityPage />} />
              <Route path="/admin/settings" element={<SettingsPage />} />
              <Route
                  path="/admin/reviews"
                  element={<ReviewsPage />}
              />
            </Route>
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </AuthProvider>
  );
}
