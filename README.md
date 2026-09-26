# HireVibe Consultants

### Right People. Real Opportunities.

A production-ready full-stack recruitment platform designed to connect candidates with relevant career opportunities while helping employers and recruitment teams manage hiring workflows through a centralized digital platform.

🌐 **Live Website:** https://hirevibe.in

💻 **Repository:** https://github.com/zaheen-fatima/hirevibe-consultants

---

## Overview

HireVibe Consultants is a full-stack recruitment platform built to provide a modern digital experience for both candidates and recruitment operations.

The platform combines:

- Candidate-focused job discovery and application workflows
- Recruitment and hiring management capabilities
- Dynamic jobs and recruitment content
- Articles and professional insights
- Recruitment videos and media
- Secure administration
- Role-based access control
- RESTful backend APIs
- Database versioning and migrations
- Cloud-based media management
- Responsive and accessible user interfaces

The project was designed as an end-to-end production application rather than a static website, with a separate frontend, backend, database and administrative system.

---

# Key Capabilities

## Candidate Experience

HireVibe provides candidates with a streamlined experience for discovering and applying for relevant opportunities.

### Job Discovery

Candidates can:

- Browse available jobs
- Search jobs
- Filter opportunities
- View job details
- Review job requirements and qualifications
- Navigate through paginated job listings
- Submit applications for relevant positions

### Job Application Workflow

The application workflow collects relevant candidate information and supports a structured application process.

The workflow includes:

- Job selection
- Candidate information
- Qualification details
- Resume submission
- Application validation
- Submission feedback
- Successful application confirmation

The application experience is designed to reduce friction while maintaining structured candidate information for recruitment workflows.

---

# Recruitment Content

HireVibe includes a dedicated content layer for providing useful recruitment and career information.

## Articles

The platform supports dynamic recruitment and career-related articles.

Capabilities include:

- Article listing
- Article categories
- Pagination
- Article details
- Featured article content
- Cover/featured imagery
- Rich article content
- Administrative article management

Articles are managed dynamically rather than being hard-coded into the frontend.

---

## Videos

HireVibe also provides a video/content experience for recruitment-related media.

Capabilities include:

- Video listing
- Video categories
- Pagination
- Video details
- Video URLs
- Video thumbnails
- Administrative video management
- Media upload support

The platform is designed to support both externally hosted media and cloud-based media management.

---

# Administration Platform

HireVibe includes a dedicated administrative portal for managing the platform's operational content.

The administration system provides centralized management of platform resources while protecting administrative functionality through authentication and authorization.

## Administrative Capabilities

Administrators can manage areas such as:

- Jobs
- Applications
- Articles
- Videos
- Categories
- Media
- Recruitment resources
- Platform content

The administration interface is designed around reusable enterprise UI primitives and structured workflows.

---

# Authentication & Authorization

Security is an important part of the HireVibe architecture.

The backend uses:

- Spring Security
- JWT-based authentication
- Role-based authorization
- Protected API endpoints
- Password-based authentication
- Validation and authorization controls

Administrative functionality is protected so that restricted operations are not exposed through the public application.

---

# Role-Based Access Control

The platform separates public functionality from protected administrative functionality.

Authorization is applied to administrative operations and protected resources.

This provides a foundation for:

- Role-aware navigation
- Protected routes
- Protected API operations
- Administrative permissions
- Secure content management

---

# Media Management

HireVibe integrates cloud-based media management.

The backend includes Cloudinary integration for handling application media.

Supported media workflows include:

- Image URLs
- Device uploads
- Cloud media storage
- Featured images
- Video media
- Video thumbnails

This allows content administrators to manage media without requiring frontend code changes.

---

# Backend Architecture

The backend is implemented using Java and Spring Boot.

### Core Technologies

- Java 17
- Spring Boot
- Spring Security
- Spring Data JPA
- Hibernate
- REST APIs
- MySQL
- Flyway
- JWT
- Cloudinary
- OpenAPI / Swagger
- Maven

The backend follows a layered application architecture with responsibilities separated across areas such as:

```text
Controller
    ↓
Service
    ↓
Repository
    ↓
Database

DTOs and validation are used to maintain structured API contracts between the frontend and backend.

Frontend Architecture

The frontend is a modern React and TypeScript application.

Core Technologies
React
TypeScript
Vite
Material UI
React Router
TanStack React Query
Axios
React Hook Form
Zod
Framer Motion
Recharts
TipTap
Day.js
Notistack

The frontend is organized around reusable components, layouts, routes, API integration and feature-specific pages.

Frontend Experience

The public application includes dedicated experiences for areas such as:

Home
Jobs
Job Details
Applications
Articles
Article Details
Videos
Video Details
Authentication

The application also provides responsive layouts for desktop, tablet and mobile devices.

User Interface & UX

The HireVibe frontend was designed with a modern enterprise-oriented UI approach.

Key considerations include:

Responsive layouts
Light and dark themes
Consistent design system
Reusable UI components
Loading states
Skeleton states
Empty states
Error states
Form validation
Accessible interactions
Responsive navigation
Professional animations and micro-interactions
Reduced-motion considerations

Material UI is used as the primary component foundation while custom styling and motion are used to create the HireVibe visual identity.

Job Management

Jobs are dynamically managed through the backend and administrative platform.

The system supports workflows around:

Job creation
Job updates
Job publishing
Job discovery
Job search
Job filtering
Job details
Job applications
Pagination

This creates a complete flow from recruitment-side job management to candidate-side discovery and application.

Application Management

Candidate applications are stored and processed through the backend.

The platform supports:

Candidate application submission
Candidate information
Qualification information
Resume handling
Application validation
Application persistence
Administrative application management

This allows recruitment operations to manage candidate applications through the platform rather than relying exclusively on static forms or external systems.

Content Management

The administrative platform provides centralized management for dynamic recruitment content.

Content areas include:

Jobs
Articles
Videos
Categories
Images
Thumbnails
Recruitment resources

This architecture allows content to be updated without rebuilding or redeploying the frontend for every content change.

API Architecture

The frontend communicates with the Spring Boot backend through REST APIs.

Production API base:

https://hirevibe-consultants.onrender.com/api/v1

The API architecture separates public and protected operations and provides structured endpoints for the major application domains.

Examples of platform API areas include:

/jobs
/applications
/articles
/videos
/auth
/admin
/uploads

The exact endpoint structure is maintained by the backend API contract.

Database

HireVibe uses MySQL/MariaDB-compatible relational database infrastructure.

Database access is implemented using:

Spring Data JPA
Hibernate
Flyway migrations
MySQL Connector/J

Database schema changes are version-controlled through Flyway migrations.

This provides controlled and repeatable database evolution across environments.

Database Migration

Flyway is used for database version management.

Migration files are maintained as part of the backend project and allow the database schema to evolve in a controlled manner.

This approach helps maintain consistency between:

Development
        ↓
Testing
        ↓
Production
Cloud Infrastructure

The production architecture separates the frontend, backend, database and media storage responsibilities.

Production Architecture
                    ┌─────────────────────┐
                    │      HireVibe       │
                    │    Public Website   │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   React / Vite      │
                    │   TypeScript        │
                    │   Material UI       │
                    └──────────┬──────────┘
                               │
                         REST / HTTPS
                               │
                               ▼
                    ┌─────────────────────┐
                    │   Spring Boot API   │
                    │      Java 17        │
                    │ Spring Security     │
                    │       JWT           │
                    └──────┬───────┬──────┘
                           │       │
              ┌────────────┘       └─────────────┐
              ▼                                  ▼
    ┌──────────────────┐              ┌──────────────────┐
    │   MySQL/MariaDB  │              │    Cloudinary    │
    │     Database     │              │  Media Storage   │
    └──────────────────┘              └──────────────────┘
Production Deployment

The application is deployed as a real production web application.

Frontend
https://hirevibe.in
Backend
https://hirevibe-consultants.onrender.com
API
https://hirevibe-consultants.onrender.com/api/v1
Database

Production relational database hosted separately from the application runtime.

Media

Cloudinary is used for cloud-based media storage and delivery.

Why HireVibe Was Built

Recruitment platforms need to serve more than one type of user.

HireVibe was designed around three connected areas:

                 HIREVIBE
                    │
        ┌───────────┼───────────┐
        │           │           │
        ▼           ▼           ▼
   Candidates   Recruitment   Administration
        │           │           │
        ▼           ▼           ▼
    Discover     Manage       Control
    Apply        Hiring       Platform

The goal is to create a connected recruitment experience rather than treating job listings, applications and recruitment operations as separate systems.

HireVibe Consultants

🌐 https://hirevibe.in

Right People. Real Opportunities.

HireVibe Consultants connects candidates with relevant career opportunities and helps businesses move forward with recruitment solutions.


