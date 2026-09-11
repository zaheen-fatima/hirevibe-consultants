import { useEffect } from 'react';

const SITE_URL = (
    import.meta.env.VITE_SITE_URL || 'https://hirevibe.in'
).replace(/\/+$/, '');

const DEFAULT_TITLE = 'HireVibe Consultants | People · Opportunity · Growth';

const DEFAULT_DESCRIPTION =
    'HireVibe Consultants connects talented people with meaningful career opportunities and helps businesses build stronger teams.';

const DEFAULT_IMAGE = '/hirevibe-logo-transparent.png';

export interface SeoProps {
    title?: string;
    description?: string;
    canonical?: string;
    image?: string;
    robots?: string;
    type?: 'website' | 'article' | 'video.other';
}

function absoluteUrl(value: string): string {
    if (/^https?:\/\//i.test(value)) {
        return value;
    }

    if (value.startsWith('/')) {
        return `${SITE_URL}${value}`;
    }

    return `${SITE_URL}/${value}`;
}

function setMeta(
    attribute: 'name' | 'property',
    key: string,
    content: string,
): void {
    let element = document.head.querySelector<HTMLMetaElement>(
        `meta[${attribute}="${key}"]`,
    );

    if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, key);
        document.head.appendChild(element);
    }

    element.setAttribute('content', content);
}

function setCanonical(url: string): void {
    let element = document.head.querySelector<HTMLLinkElement>(
        'link[rel="canonical"]',
    );

    if (!element) {
        element = document.createElement('link');
        element.setAttribute('rel', 'canonical');
        document.head.appendChild(element);
    }

    element.setAttribute('href', url);
}

export function Seo({
                        title = DEFAULT_TITLE,
                        description = DEFAULT_DESCRIPTION,
                        canonical,
                        image = DEFAULT_IMAGE,
                        robots = 'index,follow',
                        type = 'website',
                    }: SeoProps) {
    useEffect(() => {
        const canonicalUrl = absoluteUrl(
            canonical || window.location.pathname,
        );

        const imageUrl = absoluteUrl(image);

        document.title = title;

        setMeta('name', 'description', description);
        setMeta('name', 'robots', robots);

        setMeta('property', 'og:title', title);
        setMeta('property', 'og:description', description);
        setMeta('property', 'og:type', type);
        setMeta('property', 'og:url', canonicalUrl);
        setMeta('property', 'og:image', imageUrl);
        setMeta('property', 'og:site_name', 'HireVibe Consultants');

        setMeta('name', 'twitter:card', 'summary_large_image');
        setMeta('name', 'twitter:title', title);
        setMeta('name', 'twitter:description', description);
        setMeta('name', 'twitter:image', imageUrl);

        setCanonical(canonicalUrl);

        return () => {
            document.title = DEFAULT_TITLE;
        };
    }, [title, description, canonical, image, robots, type]);

    return null;
}

export function RouteSeo() {
    const pathname = window.location.pathname;

    let title = DEFAULT_TITLE;
    let description = DEFAULT_DESCRIPTION;

    if (pathname === '/') {
        title =
            'HireVibe Consultants | People · Opportunity · Growth';

        description =
            'HireVibe Consultants connects talented people with meaningful career opportunities and helps businesses build stronger teams.';
    } else if (pathname === '/#open-roles') {
        title =
            'Careers & Jobs | HireVibe Consultants';

        description =
            'Explore current career opportunities and find your next move with HireVibe Consultants.';
    } else if (pathname === '/apply') {
        title =
            'Apply for Opportunities | HireVibe Consultants';

        description =
            'Apply for career opportunities with HireVibe Consultants and take the next step in your career journey.';
    } else if (pathname === '/about') {
        title =
            'About HireVibe Consultants';

        description =
            'Learn more about HireVibe Consultants and our approach to connecting people, opportunity and growth.';
    } else if (pathname === '/services') {
        title =
            'Recruitment Services | HireVibe Consultants';

        description =
            'Discover recruitment and talent solutions from HireVibe Consultants.';
    } else if (pathname === '/contact') {
        title =
            'Contact HireVibe Consultants';

        description =
            'Get in touch with HireVibe Consultants for recruitment, career and opportunity-related enquiries.';
    } else if (pathname === '/articles') {
        title =
            'Insights & Articles | HireVibe Consultants';

        description =
            'Explore career, recruitment and workplace insights from HireVibe Consultants.';
    } else if (pathname === '/videos') {
        title =
            'Videos | HireVibe Consultants';

        description =
            'Watch recruitment, career and workplace content from HireVibe Consultants.';
    }

    return (
        <Seo
            title={title}
            description={description}
            canonical={pathname}
        />
    );
}