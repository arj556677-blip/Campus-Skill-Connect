# Campus Skill Connect
## Complete Project Report and MVP Implementation Blueprint

**Project name:** Campus Skill Connect  
**Project type:** Skill-first student and faculty portfolio, discovery, networking and collaboration platform  
**Intended context:** Hackathon prototype with a 48-hour MVP target  
**Proposed MVP stack:** Next.js App Router, React, TypeScript/TSX, Tailwind CSS, Supabase PostgreSQL, Supabase Auth and Supabase Storage  
**Status of this document:** Product and implementation plan. Features described here are proposed unless explicitly identified as a build target; this report does not claim that they have already been implemented or deployed.

---

## 1. Executive Summary

Campus Skill Connect is a skill-first platform where students and faculty can present their abilities through evidence of work, discover people with shared interests, collaborate on projects and become more discoverable to recruiters. It combines elements of a professional networking platform, a portfolio gallery and a work-discovery service, while aiming to remain simpler and more accessible than a traditional professional social network.

The platform is designed for both technical and non-technical people. A member may showcase software projects, research papers, certifications, academic work, artwork, photography, writing, music, dance, performance videos or other creative achievements. Rather than requiring every member to fit a developer-oriented template, Campus Skill Connect uses flexible work categories and profile sections.

A central product principle is **control over personal visibility**. Members should be able to decide who can see their profile information, CV, social links and each published work item. Privacy choices must be enforced by the application backend and database authorization rules, not merely represented by a button or label in the frontend.

The long-term vision includes verified institutions, campus and community discovery, city-based zones, recruiter tools, CV assistance, content moderation, support workflows and potentially online collaboration meetings. However, the initial hackathon build should remain deliberately small. The first demonstrable vertical slice is:

1. Create an account and sign in.
2. Create or edit a profile.
3. Publish a work item.
4. Discover and filter people or work.
5. Send a connection request.
6. Accept or reject a connection request.
7. Enforce and test a basic set of privacy permissions.

The product should be visually polished, but working end-to-end interactions and credible privacy behaviour take priority over decorative complexity.

## 2. Background and Problem Statement

Students often spread their achievements across disconnected services: academic CVs, certificates, GitHub repositories, research links, social media, video channels, artwork galleries and personal websites. This makes it difficult to present a coherent picture of someone's skills and interests.

People who are not software developers can also find developer-centric portfolio templates unsuitable. A researcher, photographer, singer, dancer, writer or student club member may need different ways to show evidence of work.

At the same time, recruiters, faculty and potential collaborators may struggle to discover relevant talent across different institutions and disciplines. A profile can state that a person has a skill without providing convenient evidence of it. Public portfolio websites also tend to focus on presentation rather than relationships, campus communities and item-level access control.

Campus Skill Connect addresses these issues through a unified profile, a work-first gallery, search and discovery, consent-based connections and granular visibility controls.

### 2.1 Problem Statement

There is a need for a simple, inclusive platform that helps students and faculty bring their skills and work together in one place, discover relevant people and opportunities, and control who can view their information without forcing every user into a single professional or technical template.

## 3. Proposed Solution

Campus Skill Connect provides four primary user journeys:

- **Discover:** Find people, skills and work that are relevant to a member's interests.
- **Showcase:** Publish and organize evidence of skills across technical, academic and creative categories.
- **Connect / Collaborate:** Send and respond to connection requests, then use consent-based communication when a connection or collaboration is accepted.
- **Grow:** Improve a profile, document achievements, build a CV and explore opportunities. Some growth tools are future enhancements rather than MVP requirements.

The product combines a personal-profile experience with a searchable community platform. Its visual language should feel like a creative portfolio magazine supported by the clear structure of a professional talent-discovery tool.

### 3.1 Suggested Tagline

> **Show your work. Control your identity. Find your people. Discover opportunities.**

This is a proposed tagline and can be revised after branding validation.

## 4. Vision, Mission and Objectives

### 4.1 Vision

To make skills and meaningful work easier to present, discover and connect across campuses, disciplines and professional communities.

### 4.2 Mission

To give students and faculty one flexible space to showcase evidence of their abilities, discover collaborators and opportunities, and control how their work and personal information are shared.

### 4.3 Project Objectives

1. Provide a unified profile that combines skills, education, achievements, external links and evidence of work.
2. Support technical, academic and creative work equally.
3. Help members discover people and work using searchable skills, categories and institution-related filters.
4. Provide a consent-based connection workflow.
5. Support meaningful privacy controls for profile fields and individual work items.
6. Give recruiters a basic way to discover talent based on skills and demonstrated work.
7. Establish an extensible implementation that can later support more institutions, communities, geographic zones and AI-assisted tools.
8. Deliver a reliable, presentable MVP within the hackathon's time constraints.

## 5. Target Users and Roles

### 5.1 Students

Students can create profiles, list skills, share projects and achievements, find peers, request connections and discover collaboration opportunities. They may be freshers or have prior experience.

### 5.2 Faculty and Professors

Faculty members can share research, publications, teaching-related projects, achievements, creative work and mentoring interests. The platform should not assume that all faculty profiles need recruitment-focused fields.

### 5.3 Recruiters and Talent Scouts

Recruiters can search profiles and public or otherwise authorized work, filter candidates by relevant attributes and inspect evidence of skills. Access to private fields or restricted work must not be granted simply because an account is labelled as a recruiter.

### 5.4 Collaborators and Project Teams

Members who are looking for teammates can discover people by skill, interest and relevant evidence. Connection requests or collaboration requests provide an explicit consent step before private communication is enabled.

### 5.5 Platform Administrators and Moderators

Administrators may be responsible for reports, moderation, account support, audit review and platform configuration. Administrative privileges must be separated from ordinary user permissions and limited to authorized accounts.

### 5.6 Future Institutional or Company Accounts

Institutional representatives and company accounts may be considered later. They should not be implemented as privileged account types until the authorization model and use cases are defined.

## 6. Product Principles

1. **Evidence over unsupported claims:** Make it easy to link skills to projects, documents, demonstrations or other work.
2. **Inclusive by design:** Treat technical, academic and creative work as first-class categories.
3. **Privacy by default:** Users should understand visibility before publishing, and restricted content must be protected by backend rules.
4. **Consent-based networking:** A connection should not automatically expose private contact details or enable unrestricted messages.
5. **Simple MVP, extensible foundation:** Build one complete workflow before adding many incomplete features.
6. **Usability over decoration:** Animation and visual effects must not obstruct navigation, readability or performance.
7. **Honest verification:** A social link or uploaded certificate is not automatically a verified credential.
8. **Accessible and responsive:** Core pages and controls should work across laptop, tablet and phone sizes.

## 7. Functional Scope

### 7.1 Core MVP Features

#### A. Authentication

- Register an account and sign in.
- Sign out securely.
- Protect member-only routes.
- Associate member records with the authenticated user identifier.
- Provide useful loading, validation and error feedback.

Supabase Auth is the proposed authentication service. Exact sign-in methods should be selected based on available hackathon time.

#### B. Member Profile

- Create and edit a profile.
- Include display name, short biography, institution or community details where available, field or interests, skills and external links.
- Present selected work and relevant achievements.
- Support optional profile-image upload if time permits.
- Make profile visibility clear and enforceable.

#### C. Skills

- Add skills and remove or edit them.
- Associate skill tags with profile information and, where useful, individual work items.
- Avoid treating a self-declared skill as independently verified.
- Support a flexible vocabulary so the platform can cover software, research, art, design, performance, communication and other fields.

#### D. Publish Work

Members should be able to publish work with fields such as:

- Title.
- Category.
- Description.
- Skills, tools or topics.
- External URL and/or optional uploaded media.
- Date or period, where relevant.
- Author role and collaborators, where relevant.
- Visibility setting.

The first release should prioritize link-based publishing because it is fast to implement and reduces file-storage complexity. Uploads can be added for selected file types, with size limits and validation.

#### E. Work Gallery and Discovery

- Browse work cards.
- Search by text and filter by category or tags.
- Navigate to a work-detail view.
- Show only work the viewing user is authorized to access.
- Provide understandable empty states when there are no matches.

#### F. People Discovery

- Search profiles by name or supported profile data.
- Filter by skills, field, institution and other attributes that are implemented and backed by data.
- Display concise profile summaries with selected work evidence.
- Avoid returning private profile fields in search results.

#### G. Connection Requests

- Send a request to another member.
- View pending requests.
- Accept or reject received requests.
- Represent connection status clearly in the user interface.
- Prevent duplicate or self-directed requests.
- Enforce allowed state changes on the server or database.

#### H. Basic Privacy

The MVP should implement a small, testable set of access levels instead of displaying a long list that the backend does not support. A practical first slice could include:

- **Only Me:** The owner can view the item.
- **Connections:** The owner and accepted connections can view the item.
- **Campus or Community:** Members meeting the configured campus or community rule can view the item, only if that membership data exists and is trustworthy.
- **Worldwide / Public:** Anyone allowed by the platform can view the item.

Selected-people lists, selected communities, multiple zones and complex combinations can be deferred until their data model and policies are implemented. The user interface must not offer an option that the backend does not actually enforce.

### 7.2 MVP Stretch Features

These should only be attempted after authentication, profiles, work publishing, discovery, connections and basic privacy have been tested:

- Basic recruiter-search page with additional filters.
- CV upload and a simple extraction pipeline, with human review before saving extracted fields.
- One AI-assisted CV feedback feature.
- Basic report submission for a profile or work item.
- Profile and work sharing previews.

### 7.3 Future Features

The following belong to the broader product roadmap and should not endanger the 48-hour MVP:

- Full in-app messaging and real-time chat.
- Deep LinkedIn, GitHub and social-platform OAuth/API integrations.
- Full CV builder with templates and multiple export formats.
- AI career assistant or general-purpose chatbot.
- Advanced ATS-oriented CV scoring and recommendations.
- Fine-grained access rules for selected individuals, groups, communities and multiple zones.
- Automated link and file safety scanning.
- Advanced reporting, moderation queues, audit dashboards and support-ticket workflows.
- Online meeting or virtual collaboration infrastructure.
- Institution verification workflows.
- Company and institutional accounts.
- Large-scale recommendations, analytics and ranking systems.
- City-based zones and broader cross-institution networks.
- High-scale caching, queues, Redis, NGINX or a microservices architecture where justified by measured need.

## 8. Non-Functional Requirements

### 8.1 Security and Privacy

- Use environment variables for server secrets.
- Never expose a Supabase service-role key in browser-side code or a `NEXT_PUBLIC_` variable.
- Enforce authorization in Supabase Row Level Security (RLS) and server-side logic.
- Validate user input on the server as well as in the browser.
- Restrict file types and sizes if upload is enabled.
- Avoid exposing email addresses, personal phone numbers, CVs or restricted work in public API responses.
- Check the authorization rules for direct reads and writes, not only page navigation.
- Keep administrative permissions narrow and auditable.

### 8.2 Usability

- Use consistent navigation and interaction patterns.
- Provide visible focus states and keyboard-accessible controls.
- Give clear feedback when an operation succeeds or fails.
- Make important actions understandable without relying on icons alone.
- Use confirmation or recovery options for destructive actions where appropriate.

### 8.3 Performance

- Use optimized images and appropriately sized uploads.
- Avoid loading large media files in every gallery card.
- Implement basic pagination or limits for growing lists.
- Avoid unnecessary client-side dependencies and animations.
- Monitor the deployed build for runtime errors.

### 8.4 Maintainability

- Use TypeScript types for core entities and props.
- Organize the code by features or clear application layers.
- Reuse design-system components.
- Keep authorization logic close to data operations and test it separately.
- Document environment setup and database migrations.

### 8.5 Responsive Design

The main flows—sign-in, profile editing, publishing work, discovery and connection management—should remain usable on mobile, tablet and desktop. Recruiter filters may use a collapsible panel on smaller screens.

## 9. Information Architecture and Main Pages

Suggested route structure for the Next.js App Router:

| Route | Purpose | MVP status |
|---|---|---|
| `/` | Landing page and product introduction | Build |
| `/discover` | Browse people and discoverable work | Build |
| `/showcase` | Search and filter published work | Build or combine with Discover initially |
| `/profile/[id]` | View a member profile | Build |
| `/profile/edit` | Edit the authenticated member's profile | Build |
| `/works/new` | Publish work | Build |
| `/works/[id]` | View an authorized work item | Build |
| `/connections` | Manage pending and accepted connections | Build |
| `/recruiter/search` | Search talent | Stretch; basic page preferred if core is complete |
| `/cv` | CV upload or builder | Future / stretch |
| `/settings/privacy` | Configure privacy defaults or settings | Basic version as required by the privacy model |
| `/admin` | Administration and moderation | Future; do not expose to ordinary accounts |

Routes may be consolidated to fit the MVP, but core actions should remain clear to users.

## 10. UX and Visual Design Strategy

### 10.1 Recommended Direction

Use a combination of:

- The personal-profile clarity and typography of a software-engineer portfolio.
- The editorial feeling of a creative portfolio or magazine.
- The structured filters and scannable results of a talent-discovery interface.

The Dribbble reference selected for the talent-profile aesthetic is:

https://dribbble.com/shots/25339060-Personal-Website-Design-for-a-Software-Engineer

It should be treated as a visual reference, not copied pixel-for-pixel. It is a personal website design, so its principles must be adapted for a multi-user platform with authentication, access controls, search and relational workflows.

### 10.2 Proposed Color Tokens

The following are proposed Campus Skill Connect colors, not claimed to be extracted from the Dribbble reference:

| Token | Hex | Intended use |
|---|---|---|
| Ink | `#171921` | Dark panels, primary text and navigation accents |
| Paper | `#F5F2E9` | Warm off-white page background |
| Ultramarine | `#3855D9` | Primary actions and selected states |
| Acid lime | `#D8F36A` | Small accent or highlight, used sparingly |
| Coral | `#EF7057` | Secondary accent and selected attention states |

Check contrast for all text and interactive controls. Use accent colors consistently rather than adding more colors to every screen.

### 10.3 Typography

Suggested starting point:

- **Headings:** Space Grotesk or Syne.
- **Body and controls:** Inter.
- **Metadata:** A restrained monospace face where it improves scanning.

The hero can use larger display typography; recruiter results, form labels, descriptions and filters should prioritize readability.

### 10.4 Core Design Components

Build reusable components for:

- Primary and secondary buttons.
- Navigation and profile menu.
- Search bar and filter controls.
- Profile identity header.
- Skill chips and category labels.
- Work cards for different media types.
- Connection status and request actions.
- Privacy indicators and settings controls.
- Form fields, validation messages and upload controls.
- Loading skeletons, empty states, error states and confirmation dialogues.

### 10.5 Page-Specific Design

**Discover:** A strong search entry point, categorized filters, profile summaries, recent work and recommendations when supported by actual data.

**Showcase:** A flexible grid that can display code projects, papers, certificates, images, video links, music and writing. Avoid forcing all content into the same image-card format.

**Talent profile:** A strong personal introduction, institution and interests, key skills, external links, selected work, achievements and appropriate connection actions.

**Recruiter search:** Compact candidate summaries, clear filters and work evidence. Avoid excessive decorative space that makes comparisons difficult.

**Publish work:** A straightforward form with preview, accessible validation, external-link support and the privacy setting visible before publishing.

## 11. Technical Architecture

### 11.1 Proposed Stack

| Layer | Proposed technology | Responsibility |
|---|---|---|
| Frontend framework | Next.js App Router | Routing, page rendering and application structure |
| UI | React + TypeScript/TSX | Components and interactions |
| Styling | Tailwind CSS | Responsive layout and design tokens |
| UI primitives | shadcn/ui, where useful | Accessible, reusable interface components |
| Icons | Lucide React | Consistent interface icons |
| Authentication | Supabase Auth | Registration, sessions and identity |
| Database | Supabase PostgreSQL | Profiles, skills, work, connections and related data |
| Authorization | PostgreSQL Row Level Security | Data-level read/write permissions |
| Media | Supabase Storage | Optional images and supported work files |
| Server functions | Next.js Route Handlers / Server Actions | Validated server-side operations where appropriate |
| Version control | GitHub | Source history and collaboration |
| Deployment | Vercel or another compatible host | Deploy the Next.js application |

The architecture is deliberately a single Next.js application with Supabase as a managed backend. Separate microservices, Redis and NGINX are not necessary for the first 48-hour hosted MVP unless a specific deployment constraint creates a demonstrated need.

### 11.2 High-Level Architecture

```text
Member / Recruiter / Faculty
            |
            v
 Responsive Next.js Application
 (React + TypeScript + Tailwind)
            |
            v
 Server-side actions / validated data access
            |
            v
 Supabase
   |        |          |
   v        v          v
 Auth    PostgreSQL   Storage
           |
           v
   Row Level Security
   + constraints + policies
```

The frontend must not be treated as the security boundary. Database and server-side authorization decide whether an operation is allowed.

### 11.3 Typical Request Flow

1. A member signs in through Supabase Auth.
2. The client obtains a session using the recommended Supabase SSR/cookie-based approach for Next.js.
3. The application requests the relevant profile, work or connection data.
4. Supabase checks Row Level Security policies for the authenticated user.
5. The application renders only the authorized data.
6. Writes are validated and stored only if the session and policy permit them.

## 12. Proposed Data Model

This is an MVP data model proposal. Table names and columns should be confirmed before implementation and captured in migrations.

### 12.1 `profiles`

Suggested fields:

- `id` — UUID, tied to the authenticated user identifier.
- `display_name` — preferred public name.
- `headline` — short summary or role.
- `bio` — optional introduction.
- `institution_id` — optional relation to an institution or community record.
- `campus_id` — optional relation if campus data is available.
- `field` — optional discipline or work area.
- `location_zone_id` — optional future geographic relation.
- `avatar_path` — optional storage path.
- `profile_visibility` — supported visibility level.
- `created_at`, `updated_at` — timestamps.

Sensitive fields such as private email, phone number and CV storage path should not be exposed by default profile queries. Prefer separate protected data or carefully controlled columns/policies when the use case requires it.

### 12.2 `skills`

Suggested fields:

- `id` — primary key.
- `name` — display name.
- `category` — optional category such as technical, research, design, performance or communication.

### 12.3 `user_skills`

Suggested fields:

- `user_id` — profile/member identifier.
- `skill_id` — skill identifier.
- `proficiency` — optional self-described level.
- `created_at` — timestamp.

A unique constraint on the pair `(user_id, skill_id)` can prevent duplicate skill assignments.

### 12.4 `works`

Suggested fields:

- `id` — primary key.
- `owner_id` — member who owns the work record.
- `title` — title of the item.
- `description` — optional description.
- `category` — software, research, certification, art, photography, music, dance, writing, video or another extensible category.
- `external_url` — optional external link.
- `storage_path` — optional uploaded file path.
- `visibility` — item-level visibility.
- `published_at` — optional publication timestamp.
- `created_at`, `updated_at` — timestamps.

Do not rely on a client-supplied `owner_id` for authorization. Derive or verify ownership from the authenticated session and database rules.

### 12.5 `work_skills`

Optional join table that relates works to skills or topics:

- `work_id`.
- `skill_id`.

### 12.6 `connection_requests`

Suggested fields:

- `id` — primary key.
- `sender_id` — authenticated sender.
- `receiver_id` — intended recipient.
- `status` — `pending`, `accepted`, `rejected` or another explicitly defined state.
- `created_at`, `updated_at` — timestamps.

Suggested constraints and logic:

- Prevent requests from a user to themselves.
- Avoid duplicate pending requests for the same pair.
- Validate which user may accept or reject a request.
- Avoid allowing clients to set an accepted state without satisfying the correct workflow.

### 12.7 `communities`, `campuses` and `zones`

These support the larger vision but may be simplified or omitted from the first MVP if reliable data is not available.

- **Community:** a college, university or other defined membership group.
- **Campus:** a physical campus associated with an institution.
- **Zone:** a geographic area such as a city.

These concepts must remain distinct. A campus is not automatically equivalent to an entire institution, and a city zone is not the same as a user-selected community.

### 12.8 Additional Future Tables

Possible later tables include `work_access` for selected-person rules, `reports`, `moderation_actions`, `support_tickets`, `audit_logs`, CV metadata and notification records. Do not create complex tables unless the associated workflow and policy are understood.

## 13. Authorization and Privacy Model

### 13.1 General Rule

A user should be able to read or modify only the information authorized for that user and action. The design must be reflected in database policies and tested with multiple accounts.

### 13.2 Initial Visibility Levels

A practical MVP can begin with:

- **Only Me:** owner-only access.
- **Connections:** owner and accepted connections.
- **Public / Worldwide:** any viewer allowed by platform policy.
- **Campus / Community:** only after a reliable membership relationship has been implemented and tested.

The UI should display only the privacy levels supported by the backend. A label alone is not access control.

### 13.3 Privacy Areas

Privacy may apply independently to:

- Profile details.
- Work items.
- Uploaded files.
- CV data.
- External social links.
- Personal contact information.
- Future messages and collaboration material.

### 13.4 File Access

Private files should not be exposed through permanent public URLs. Use appropriate storage policies and authorized access mechanisms. Validate files and define accepted types and size limits before enabling uploads. Link-first publishing is a simpler MVP option.

### 13.5 Privacy Test Matrix

Test at least these cases with two or more accounts:

| Scenario | Expected result |
|---|---|
| Owner views own private work | Allowed |
| Unconnected member views Only Me work | Denied |
| Unconnected member views Connections-only work | Denied |
| Accepted connection views Connections-only work | Allowed if the rule is implemented as specified |
| Any allowed viewer views public work | Allowed |
| Unauthorized account requests a private file path | Denied |
| User tries to edit another user's profile | Denied |
| User tries to change another user's work visibility | Denied |
| User tries to accept a request they did not receive | Denied |
| User attempts to send a connection request to themselves | Denied |

The test should cover direct data requests as well as page rendering. Hiding a button is not an authorization test.

## 14. Connection and Collaboration Workflow

### 14.1 Basic Workflow

1. Member A discovers Member B.
2. Member A opens B's authorized profile and sends a connection request.
3. Member B sees the incoming request.
4. Member B accepts or rejects it.
5. If accepted, the system records the connection state.
6. Authorized collaboration or messaging options may then become available, depending on implemented policy.

### 14.2 MVP Constraints

- Build request creation and acceptance/rejection first.
- Show pending, connected and rejected states clearly.
- Prevent duplicate requests and unauthorized state changes.
- Do not build a real-time chat system unless the core MVP is complete.
- An accepted connection should not automatically expose private phone numbers, email addresses or private work.

## 15. Recruiter Discovery

The recruiter experience should make evidence of skill easier to inspect. Candidate search may support filters for:

- Skills.
- Work category or field.
- Institution or community, if supported by reliable data.
- Campus or city zone, if supported.
- Freshers or experienced members, if experience information is collected consistently.
- Public or otherwise authorized work evidence.

Keep search results compact enough to compare, and link to detailed profiles. Do not reveal private information in search snippets. Avoid presenting a simple keyword match as a guarantee of candidate suitability.

For the hackathon, a basic recruiter view can reuse the same profile and work data as the member-facing discovery page with a more structured filter layout.

## 16. CV and AI Features

### 16.1 CV Upload and Extraction — Future or Stretch

A later workflow could allow a member to upload a CV, extract selected fields and map them into a structured profile. The user must review and approve extracted content before it becomes public or changes profile data.

### 16.2 CV Builder — Future

An in-app CV builder could use structured profile data and offer export templates. It should not be allowed to publish private profile fields into an exported CV without the user's deliberate choice.

### 16.3 AI CV Feedback — Optional Stretch

Only one narrow AI feature should be considered for the MVP, after core flows work. A reasonable option is feedback on clarity, structure and alignment between a CV and a provided role description.

AI feedback should be framed as suggestions, not guaranteed ATS outcomes, guaranteed selection or objective assessments of a person's potential. The user should control whether their document is sent to an AI service and understand what data is processed.

### 16.4 AI Boundaries

A generic chatbot, automated hiring decisions, large recommendation engine and broad multi-agent system are not requirements for the first release. Do not let AI work delay authentication, publishing, discovery, connections or privacy enforcement.

## 17. Admin, Reports and Trust Workflows

The complete vision includes a secure administration area to review reports and manage platform integrity. That area may eventually include:

- Reports on profiles, work items, messages or recruiter accounts.
- Report status and moderation notes.
- Support tickets.
- Audit logs for sensitive administrative operations.
- Account restrictions and appeal or support processes.
- Basic metrics for safety and platform usage.

For the MVP, a simple report-submission endpoint or form may be a stretch feature. Admin pages must not be accessible merely because someone knows the URL. Administrative authorization should be verified on the server and, where relevant, through database policy. Do not use a client-editable field alone to confer admin privileges.

Automated URL or file scanning can be added later. Such scanners are one layer of defence, not a complete security solution.

## 18. Implementation Plan for a 48-Hour MVP

The schedule below is a planning guide rather than a guarantee. Actual time will depend on familiarity with the tooling, integration issues and the event requirements.

### Phase 1 — Scope and scaffold (Hours 0–3)

- Confirm the six-step demo workflow.
- Create the Next.js App Router project with TypeScript and Tailwind.
- Set up Git and a README.
- Establish the visual tokens, typography and responsive layout.
- Create shared navigation, button, card and form components.

**Exit condition:** The app runs locally and its basic layout is consistent.

### Phase 2 — Frontend skeleton and sample data (Hours 3–6)

- Build landing, discover, profile and publish-work layouts.
- Use clearly identified sample data while the backend is being prepared.
- Make navigation and major controls functional, not decorative.
- Add loading, empty and error states.

**Exit condition:** A reviewer can navigate through the main screens and understand the product flow.

### Phase 3 — Supabase setup and authentication (Hours 6–10)

- Create the Supabase project.
- Configure environment variables.
- Create initial database migrations.
- Configure the recommended cookie-based server-side authentication pattern for Next.js.
- Protect member-only routes.
- Establish initial RLS policies and test them.

**Exit condition:** Users can authenticate and protected pages respond correctly to session state.

### Phase 4 — Profiles and publishing (Hours 10–15)

- Create and edit profile data.
- Add or edit skills.
- Publish work records using links and basic text.
- Implement ownership checks and item-level visibility.
- Add upload support only if time and security controls allow it.

**Exit condition:** A signed-in user can publish work and see it in the correct profile or gallery.

### Phase 5 — Discovery and filtering (Hours 15–19)

- Connect search and filters to real data.
- Filter by implemented attributes only.
- Apply privacy rules to every search result.
- Ensure profile and work details are accessible only under the intended policies.

**Exit condition:** A member can find another member or work item using real application data.

### Phase 6 — Connection requests (Hours 19–23)

- Send and receive requests.
- Accept and reject requests.
- Display request status.
- Add server/database guards against invalid transitions and duplicate requests.

**Exit condition:** The connection workflow works between at least two test accounts.

### Phase 7 — Privacy and recruiter pass (Hours 23–28)

- Verify every supported visibility setting.
- Test with owner, unconnected and connected accounts.
- Build the simplest useful recruiter search layout if the core flow is stable.
- Remove any privacy option that is not fully supported.

**Exit condition:** Core privacy tests pass and recruiter search is usable, if included.

### Phase 8 — Polish and deploy (Hours 28–36)

- Fix responsive layout issues.
- Add error and empty states.
- Check accessibility basics.
- Deploy to the chosen host.
- Validate environment variables, redirects and server errors.

**Exit condition:** The deployed app can complete the core workflow without relying on local-only state.

### Phase 9 — Regression, demo and buffer (Hours 36–48)

- Test registration/login, profile editing, work publishing, discovery and requests.
- Run privacy tests again against the deployed build.
- Prepare realistic demonstration accounts and data.
- Rehearse a short demo and have a fallback sequence if a live external service is temporarily unavailable.
- Use remaining time to fix defects, not start major new modules.

**Exit condition:** The team can demonstrate the core product consistently and explain current limitations honestly.

## 19. Suggested Project Setup

Example starter commands:

```bash
npx create-next-app@latest campus-skill-connect --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
cd campus-skill-connect
npm install @supabase/supabase-js @supabase/ssr lucide-react
npx shadcn@latest init
npm run dev
```

An optional motion library may be added later, but motion is not required for the MVP. Follow current official documentation if a CLI option has changed since this report was prepared.

### 19.1 Environment Variables

Example `.env.local` structure:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
```

Use the environment-variable names required by the selected Supabase client configuration and current official documentation. Never place a service-role key in a `NEXT_PUBLIC_` variable or commit secrets to Git.

### 19.2 Development Workflow

- Use Git commits after each completed vertical slice.
- Keep the main branch in a deployable state when possible.
- Add database schema through tracked SQL migrations.
- Test core authorization behaviour whenever a policy changes.
- Use sample content that is appropriate for a public demo and does not expose real personal data.
- Run a production build before the final demonstration.

## 20. Recommended Antigravity Prompt Sequence

Do not ask Antigravity to build the entire product in one giant instruction. Work in steps, inspect its changes and test after each stage.

### Prompt 1 — Plan the application

```text
Act as a senior product engineer. Read the Campus Skill Connect project specification.
Produce a concise MVP plan, route map, reusable component list, proposed database schema and security checklist.
Separate MVP, stretch and future features. Do not start implementing every feature at once.
Prioritize this complete flow: authentication -> profile -> publish work -> discover/filter -> connection request -> accept/reject.
Privacy must be enforced at the database/server level, not only in the user interface.
```

### Prompt 2 — Build the design system and first frontend pages

```text
Use this Dribbble reference as visual inspiration for the individual talent profile:
https://dribbble.com/shots/25339060-Personal-Website-Design-for-a-Software-Engineer

Build an original Campus Skill Connect interface using Next.js App Router, React, TypeScript/TSX and Tailwind CSS.
Use bold but readable typography, a warm light background, dark content panels, clear navigation and polished work cards.
Create reusable components and responsive layouts for landing, Discover, Showcase, talent profile and Publish Work.
Support software, research, certification, art, photography, music, dance, video and writing.
Do not copy the reference pixel-for-pixel. Do not use decorative buttons that do nothing. Use clearly identified sample data at this stage and include loading, empty and error states.
```

### Prompt 3 — Integrate authentication and database

```text
Integrate the existing Next.js frontend with Supabase using the current recommended SSR/cookie-based authentication pattern.
Implement sign-up, sign-in, sign-out and protected routes.
Create migrations for profiles, skills, user_skills, works and connection_requests.
Add and verify Row Level Security policies before connecting user-facing reads and writes.
Keep server secrets out of browser code. Never expose the service-role key.
Show useful validation and error states. Document required environment variables and setup steps.
```

### Prompt 4 — Implement work publishing and discovery

```text
Connect the profile, Publish Work and Showcase/Discover pages to real Supabase data.
Implement create, edit, view and delete operations only where authorized.
Support external links first, with upload support only if suitable storage policies and file validation are implemented.
Add search and filters based on real columns and show only records the viewer is authorized to access.
Do not fake privacy by filtering only in the frontend.
Test the flow using at least two accounts and report any unfinished cases.
```

### Prompt 5 — Implement connection workflow

```text
Implement connection requests between two different authenticated users.
Support pending, accepted and rejected states. Prevent self-requests, duplicate pending requests and unauthorized state changes.
Show incoming requests and allow the intended recipient to accept or reject them.
Use server/database validation and appropriate RLS policies.
Test the workflow with two accounts and document the results.
```

### Prompt 6 — Security, responsive polish and release

```text
Audit the current Campus Skill Connect implementation before adding features.
Test privacy rules for owners, unconnected viewers and accepted connections. Test direct data access, not only visible pages.
Check route protection, work ownership, file access, server-side validation, environment variables, responsive layouts, keyboard focus, empty states and errors.
Remove or disable any privacy level or button that is not actually implemented.
Fix defects, run the production build and provide a concise deployment and demo checklist.
Do not add Redis, NGINX, microservices, real-time chat or broad AI features unless they are required by a demonstrated need.
```

## 21. Testing and Acceptance Criteria

The MVP should not be considered complete merely because the homepage renders. At minimum, test the following.

### 21.1 Authentication Tests

- Valid user can register and sign in.
- Invalid input produces useful feedback.
- Signed-out visitors cannot perform protected actions.
- Sign-out clears the active session as expected.

### 21.2 Profile Tests

- A member can edit their own allowed profile fields.
- A member cannot edit another member's profile.
- Optional fields do not break profile display.
- Private fields are not returned unnecessarily.

### 21.3 Work Tests

- A member can create and edit their own work.
- Required fields are validated.
- External URLs are handled safely and rendered appropriately.
- A member cannot modify another member's work.
- Restricted work cannot be read by unauthorized users.

### 21.4 Discovery Tests

- Search and filters return relevant records from real data.
- Empty searches and no-result searches have useful messages.
- Private profile fields and work are not leaked through results.

### 21.5 Connection Tests

- A request can be sent and accepted by the intended recipient.
- The recipient can reject a request.
- A user cannot accept a request received by someone else.
- Duplicate and self-directed requests are prevented.

### 21.6 Deployment Tests

- Production build succeeds.
- Authentication redirects and callback URLs work on the deployed domain.
- Required environment variables are configured.
- Core flows work after deployment, not just locally.
- No secrets are exposed in browser bundles or repository history.

### 21.7 Demo Acceptance Criteria

A successful demonstration should show, in order:

1. A member signs in.
2. The member updates a profile.
3. The member publishes a work item.
4. Another account discovers the work or profile.
5. That account sends a connection request.
6. The owner accepts the request.
7. A restricted item is demonstrably unavailable to an unauthorized account.

## 22. Risks and Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Too many features planned for 48 hours | Core workflows remain incomplete | Lock MVP scope and defer future features explicitly |
| Privacy options are only visual | Sensitive information can be exposed | Enforce policies in Supabase and run cross-account tests |
| Inconsistent UI across pages | Product feels unfinished | Define tokens and reusable components early |
| Building a full chat or AI feature too soon | Time lost before core flow is complete | Prioritize authentication, publishing, discovery and requests |
| Fake or static search | Demo does not prove a working platform | Connect at least one search path to real data |
| Unsafe file uploads or public file URLs | Privacy or security incident | Start with links; validate uploads and use protected storage rules |
| Unclear verification labels | Users over-trust unsupported credentials | Clearly distinguish self-declared content from verified information |
| Insufficient demonstration data | Product appears empty | Prepare clearly labelled sample accounts and work before presentation |
| Overcomplicated architecture | More integration and deployment failure points | Use one Next.js app and managed Supabase for the MVP |
| AI output is treated as guaranteed advice | Misleading recommendations | Present AI as optional assistance and keep user review in control |

## 23. Success Metrics

For a hackathon MVP, use simple observable criteria rather than attempting sophisticated analytics immediately.

- A new member can complete registration and profile setup without assistance.
- A member can publish a work item in a small number of steps.
- Search can find the expected profile or work using test data.
- Connection requests can be sent and accepted between two accounts.
- All implemented privacy test cases pass.
- The deployed app completes the demonstration flow without a critical failure.
- The design remains readable and usable on both desktop and mobile widths.

Longer-term metrics could include profile-completion rate, work items published per active member, search-to-profile visits, connection-request acceptance rate, collaboration starts and the frequency of privacy-related errors or reports. Collect analytics only with appropriate transparency and safeguards.

## 24. Long-Term Product Roadmap

### Stage 1 — Functional MVP

Authentication, member profile, skills, work publishing, discovery, connection requests, basic privacy enforcement and deployment.

### Stage 2 — Better Portfolios and Recruiter Tools

More work categories, richer project details, portfolio customization, additional search filters, basic recruiter views and CV feedback if justified.

### Stage 3 — Community and Institution Features

Institution and campus records, membership management, community discovery, city zones and carefully designed visibility rules.

### Stage 4 — Trust and Safety

Reporting queues, moderation controls, support tickets, administrative audit logs, file/link scanning and clear verification processes.

### Stage 5 — Integrations and Collaboration

External identity integrations where APIs and permissions allow them, more advanced collaboration workflows, notifications and optionally in-app messaging or meetings.

### Stage 6 — Scale and Optimization

Add background jobs, caching, search infrastructure, queues or additional services only when usage and performance measurements justify them. Avoid premature infrastructure complexity.

## 25. What Not to Build First

The following are deliberate deferrals for the 48-hour MVP:

- A general-purpose AI chatbot.
- Full real-time chat.
- Full online meeting infrastructure.
- Complex LinkedIn/GitHub synchronization and OAuth integrations.
- Multiple microservices.
- Redis or NGINX without a concrete deployment need.
- Advanced AI ranking or automated hiring decisions.
- A complete ATS engine or guaranteed ATS score.
- A large administrative suite before the basic user and privacy model is stable.
- Every possible privacy level before the underlying access rules and membership data are tested.

These omissions are scope choices, not statements that the features would never be useful.

## 26. Final Recommendation

Campus Skill Connect should be presented as a **skill-first, work-first and privacy-conscious discovery platform**, not just a collection of student portfolios.

Use the selected Dribbble design as inspiration for the individual profile's visual identity. Build the Showcase page with a flexible gallery, and give Recruiter Search a more compact, functional layout. Keep the same colors, type system, navigation logic and reusable components throughout the platform.

For the hackathon, focus on making one complete and secure journey work: authentication, profile, work publication, discovery, connection request and acceptance. Implement only privacy controls that are genuinely enforced and tested. Add CV assistance or other AI features only when the essential flow is stable.

The guiding principle is:

> **Build a smaller product that works end to end, demonstrates real user value and respects privacy before expanding the product vision.**

## 27. Source and Implementation Notes

- **Dribbble visual reference:** [Personal Website Design for a Software Engineer](https://dribbble.com/shots/25339060-Personal-Website-Design-for-a-Software-Engineer). Used as design inspiration for the talent profile; the proposed Campus Skill Connect design is an adaptation, not a claim of identical design or functionality.
- **Framework:** Next.js App Router, React and TypeScript.
- **Backend services:** Supabase Auth, PostgreSQL, Storage and Row Level Security.
- **Hosting:** Vercel or a compatible hosting platform.
- **Important distinction:** All database tables, route examples, feature priorities and prompts in this report are recommendations for the proposed MVP. Confirm them against the current repository, hackathon rules and current official documentation before implementation.

---

**End of report**
