# TalentFlow - Enterprise Applicant Tracking System

A comprehensive, production-ready Applicant Tracking System (ATS) built with React, TypeScript, Tailwind CSS, and Supabase. Designed for fast-scaling organizations with enterprise-grade features comparable to Greenhouse, Lever, and Ashby.

**Complete Hiring Lifecycle Management:** Requisition Creation → Approval → Resume Screening → Interviewing → Offer Approval → Closure

## Features

### Core Functionality

#### 1. Job Requisition & Management
- Create, edit, and publish job requisitions
- Auto-generated requisition IDs (REQ-00001, REQ-00002, etc.)
- Job description templates
- Multiple job types (Full-time, Part-time, Contract, Internship)
- Salary range management
- Status tracking (Draft, Pending Approval, Approved, Published, Closed)

#### 2. Candidate Management
- Comprehensive candidate profiles
- Resume storage and management
- Skills tracking and tagging
- Source attribution (LinkedIn, Referral, Job Board, Website)
- Contact information management
- Work history tracking

#### 3. Pipeline Management
- **Kanban-style Pipeline View**: Drag-and-drop candidates between stages
- **List View**: Tabular view with sorting and filtering
- Pipeline Stages:
  - Applied
  - Screening
  - Interview
  - Offer
  - Hired
  - Rejected
- Real-time stage updates
- Activity timeline for each candidate

#### 4. Interview Scheduling
- Schedule interviews with specific dates and times
- Support for multiple interview types (Phone Screen, Technical, Behavioral, Final)
- Duration tracking
- Location or video meeting links
- Interview panel assignment
- Status tracking (Scheduled, Completed, Cancelled, Rescheduled)

#### 5. Interview Feedback & Scorecards
- Structured feedback forms
- Rating system (1-5) for:
  - Overall Rating
  - Technical Skills
  - Communication
  - Culture Fit
- Recommendation options (Strong Yes, Yes, Maybe, No, Strong No)
- Written comments section
- Panelist tracking

#### 6. Offer Management
- Comprehensive offer creation
- Compensation breakdown:
  - Fixed CTC
  - Variable compensation
  - Joining bonus
  - Equity options
- Start date tracking
- Version control for offers
- Status tracking (Draft, Pending Approval, Approved, Sent, Accepted, Rejected, Expired)

#### 7. Analytics Dashboard
- Key Metrics:
  - Average Time to Hire
  - Offer Acceptance Rate
  - Total Hires
  - Active Jobs
  - Monthly hiring trends
- Hiring Funnel Visualization
- Top Candidate Sources
- Performance tracking

#### 8. Role-Based Access Control (RBAC)
Supports 5 user roles with appropriate permissions:
- **Admin**: Full system access
- **Recruiter**: Manage jobs, candidates, interviews, offers
- **Hiring Manager**: View and collaborate on hiring for their department
- **Interviewer**: Access to assigned interviews and feedback
- **Finance**: View offers and compensation data (read-only)

#### 9. Career Page API
Public API endpoints for job listings:
- `GET /careers-api/jobs` - List all published jobs
- `GET /careers-api/jobs/:id` - Get specific job details
- `POST /careers-api/apply` - Submit job application
- Supports filtering by department, location, and search terms
- CORS-enabled for embedding in external websites

#### 10. Activity Logging
- Comprehensive audit trail
- Track all actions:
  - Job creation/updates
  - Candidate stage changes
  - Interview scheduling
  - Offer generation
- User attribution for all actions
- Timestamp tracking

### Technical Features

#### Security
- Row Level Security (RLS) on all tables
- JWT-based authentication
- Role-based access policies
- Secure API endpoints
- Activity audit trail

#### Database
- PostgreSQL with Supabase
- Normalized schema design
- Foreign key constraints
- Automatic timestamp management
- Auto-generated IDs

#### Performance
- Optimized database queries
- Indexed columns for fast searches
- Efficient data fetching
- Lazy loading support

## Database Schema

### Main Tables

1. **profiles** - User profiles with roles
2. **jobs** - Job requisitions
3. **job_approvals** - Approval workflow for jobs
4. **candidates** - Candidate information
5. **job_applications** - Links candidates to jobs
6. **interviews** - Interview scheduling
7. **interview_panelists** - Interview panel members
8. **interview_feedback** - Scorecard data
9. **offers** - Job offers
10. **offer_approvals** - Offer approval chain
11. **activity_logs** - Audit trail
12. **candidate_notes** - Notes and mentions
13. **email_templates** - Email automation templates
14. **email_logs** - Email tracking

## Getting Started

### First-Time Setup

1. Sign up for an account using the registration form
2. Choose your role (Admin, Recruiter, Hiring Manager, Interviewer, Finance)
3. The system comes with demo data including:
   - 10 sample job requisitions
   - 25+ demo candidates across all pipeline stages

### User Roles

#### Admin
- Full access to all features
- User management
- System configuration
- Analytics access

#### Recruiter
- Create and manage jobs
- Add and manage candidates
- Schedule interviews
- Create offers
- View analytics

#### Hiring Manager
- View jobs for their department
- Review candidates
- Provide interview feedback
- Approve job requisitions

#### Interviewer
- View assigned interviews
- Submit feedback and scorecards
- View candidate information

#### Finance
- View offers and compensation
- Approve budget for jobs
- Limited read-only access

## API Documentation

### Career Page Endpoints

#### List Jobs
```bash
GET /careers-api/jobs
Query Params:
  - department (optional): Filter by department
  - location (optional): Filter by location
  - search (optional): Search in title and description
```

#### Get Job Details
```bash
GET /careers-api/jobs/:id
```

#### Submit Application
```bash
POST /careers-api/apply
Body:
{
  "job_id": "uuid",
  "full_name": "string",
  "email": "string",
  "phone": "string" (optional),
  "resume_url": "string" (optional),
  "linkedin_url": "string" (optional)
}
```

## Data Model

### Job Statuses
- Draft
- Pending Approval
- Approved
- Published
- Closed

### Candidate Stages
- Applied
- Screening
- Interview
- Offer
- Hired
- Rejected

### Interview Types
- Phone Screen
- Technical
- Behavioral
- Final Round
- Custom

### Offer Statuses
- Draft
- Pending Approval
- Approved
- Sent
- Accepted
- Rejected
- Expired

## Best Practices

### For Recruiters
1. Always add source attribution when creating candidates
2. Use tags for better candidate organization
3. Add notes with @mentions to collaborate
4. Move candidates through pipeline stages systematically

### For Hiring Managers
1. Review candidates promptly
2. Provide detailed feedback after interviews
3. Keep interview scorecards consistent
4. Approve requisitions in a timely manner

### For Interviewers
1. Submit feedback within 24 hours of interview
2. Use the structured scorecard format
3. Be specific in written comments
4. Calibrate ratings with your team

## Architecture

### Frontend
- React 18 with TypeScript
- Tailwind CSS for styling
- Lucide React for icons
- Client-side routing
- Real-time updates via Supabase

### Backend
- Supabase (PostgreSQL)
- Row Level Security
- Edge Functions for APIs
- Automatic backups

### Deployment
- Vite for building
- Production-ready build system
- Environment variable management

## NEW: Advanced Features (PRD Implementation)

### Resume Screening with Keyword Matching
- **Intelligent Candidate Prioritization**: Automatic scoring based on job requirements
- **Mandatory vs Preferred Skills**: Differentiate must-have from nice-to-have qualifications
- **Experience Matching**: Verify years of experience against requirements
- **Visual Match Indicators**: See at-a-glance which candidates match best
- **No Black-Box Scoring**: Transparent, rule-based matching that recruiters can understand

**How it works:**
1. When creating a job, specify:
   - Mandatory keywords (must-have skills)
   - Preferred keywords (good-to-have skills)
   - Minimum experience years
   - Required qualifications
2. System automatically calculates match scores for each applicant
3. Scores based on:
   - 60% - Mandatory keywords matched
   - 30% - Preferred keywords matched
   - 10% - Experience requirement met
4. View detailed screening analysis for each candidate

### Role-Based Question Bank
- **Structured Interview Questions**: Pre-built question library by role, department, and level
- **Question Types**: Technical, Behavioral, Case-Based, Situational
- **Difficulty Levels**: Easy, Medium, Hard
- **Evaluation Criteria**: Built-in guidance for assessing responses
- **Usage Tracking**: See which questions were asked in each interview
- **Version Control**: Track updates to question sets

**Features:**
- 10+ pre-loaded sample questions
- Filter by department, role, experience level
- Add custom questions during interviews
- Evaluation criteria for consistent scoring

### Comprehensive Interview Feedback System
- **5-Star Rating System**: Rate candidates on multiple dimensions
  - Overall Rating
  - Technical Skills
  - Communication
  - Culture Fit
- **Hiring Recommendations**: Strong Yes, Yes, Maybe, No, Strong No
- **Mandatory Comments**: Detailed written feedback required
- **Question Tracking**: Link asked questions to interviews
- **Audit Trail**: All feedback timestamped and attributed

### Enhanced Job Requisitions
- **Target Hire Date**: Track urgency and timelines
- **Number of Openings**: Manage multiple positions in one requisition
- **Screening Criteria Built-in**: Mandatory and preferred skills embedded in JD
- **Positions Filled Tracking**: Monitor progress toward fulfillment
- **Requisition Closure**: Formal closure process with reasons and metrics

### Approval Workflows
- **Multi-Stage Approvals**: Configurable approval chains
  - Job Requisitions: Hiring Manager → Finance → HRBP
  - Offers: Hiring Manager → Finance → HR Head
- **Approval Timestamps**: Complete audit trail
- **Comments on Approvals**: Provide context for decisions
- **Status Tracking**: Pending, Approved, Rejected

### Analytics & Metrics
- **Time to Fill**: Track days from requisition to hire
- **Funnel Conversion**: Measure dropoff at each stage
- **Source Analytics**: See which channels bring best candidates
- **Offer Acceptance Rate**: Monitor competitiveness
- **Recruiter Performance**: Track individual metrics

## Future Enhancements

This ATS is production-ready and can be extended with:
- Email automation (templates included, automation pending)
- Calendar integration (Google/Microsoft for scheduling)
- AI-powered resume parsing
- Bulk candidate actions
- Advanced reporting and BI dashboards
- Slack/Teams notifications
- GDPR compliance tools (data anonymization)
- Self-service interview scheduling
- Automated offer letter generation
- Background check integration
- Reference check workflow
- Candidate self-scheduling portal

## Support

For questions or issues, please refer to:
- Database schema in migrations
- API documentation above
- Component source code with inline comments

---

Built with modern web technologies for scalability, security, and performance.
