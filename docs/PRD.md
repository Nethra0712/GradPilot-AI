# GradPilot AI — Product Requirements Document (PRD)

**Version:** 1.0 (MVP Definition)
**Prepared by:** Product / Architecture / UX
**Status:** Draft — Pending Founder Approval

---

## 1. Product Vision

GradPilot AI will become the operating system for international students navigating higher-education admissions — from the first "where should I apply?" question through offer acceptance and visa preparation. The long-term vision is a single platform that unifies application strategy, document creation, deadline management, recommendation coordination, and financial planning, powered by AI that understands each student's academic profile, target programs, and personal narrative.

The MVP is the first wedge into this vision: **the best AI-powered Statement of Purpose (SOP) generator in the world**, purpose-built for university admissions rather than generic writing.

## 2. Mission Statement

To give every student — regardless of geography, income, or access to expensive consultants — the tools to tell their story compellingly and get into the university that's right for them.

## 3. Target Audience

- **Primary:** International students (18–28) applying to undergraduate, graduate, or MBA programs abroad, particularly from India, Nigeria, Pakistan, Bangladesh, Vietnam, and the Middle East applying to the US, UK, Canada, Australia, and Europe.
- **Secondary:** Domestic students applying to competitive programs who lack access to private admissions consultants.
- **Tertiary (future):** Education consultants and agencies who manage applications for multiple students and need a productivity tool.

Common traits: English is often a second language, budget-conscious ($0–$500 for application help), time-constrained (juggling exams like GRE/IELTS/TOEFL alongside applications), and anxious about differentiation in a competitive pool.

## 4. User Personas

**Persona 1 — "Ambitious Amara" (Primary)**
21, final-year engineering student in Lagos, Nigeria, applying to 8 MS Computer Science programs in the US. Strong grades, weak essay-writing confidence. Budget: ~$150 total for application help. Uses ChatGPT today but distrusts the generic output and fears plagiarism flags.

**Persona 2 — "Careful Chen" (Secondary)**
24, working professional in Shanghai applying to MBA programs in the UK and Singapore. Time-poor, values structure and speed. Willing to pay for a premium/pro tier if it visibly improves quality and saves hours.

**Persona 3 — "First-Gen Fatima" (Underserved)**
19, first in her family to apply abroad (Pakistan → Canada, undergraduate). No access to a counselor. Needs heavy guidance, not just a text generator — wants to know *what* a good SOP even contains.

**Persona 4 — "Consultant Priya" (Future/B2B2C)**
32, runs a small study-abroad consultancy handling 40+ students/year. Wants a tool to speed up her own workflow and manage multiple client SOPs at once.

## 5. Problems We Solve

1. **Blank page paralysis** — students don't know how to structure an SOP or what admissions committees want to read.
2. **Generic AI output** — ChatGPT/QuillBot produce essays that sound the same across thousands of users, risking detection and rejection.
3. **Cost of human consultants** — professional SOP editing/consulting costs $100–$1,000+ per application, unaffordable at scale (especially across 5–10 applications).
4. **Language and tone gaps** — non-native English speakers struggle with idiomatic, persuasive academic tone without sounding unnatural or "over-polished."
5. **Program-specific customization** — students need a *different* SOP tone/content per university and program, which is tedious to redo manually.
6. **Lack of feedback loops** — students don't know if their SOP is actually strong; no scoring or benchmarking exists today.

## 6. Competitor Analysis

| Competitor | What They Do | Strengths | Weaknesses (Our Opportunity) |
|---|---|---|---|
| **ChatGPT (general)** | General-purpose LLM chat | Free/cheap, flexible, powerful reasoning | Not admissions-specific; no structured SOP framework; no plagiarism/AI-detection safety; generic, repetitive prose; no program/university context; no version history or scoring |
| **Grammarly** | Grammar, tone, and clarity checking | Excellent grammar/style engine, trusted brand | Doesn't *generate* content or SOP structure; no admissions expertise; not built for narrative storytelling |
| **QuillBot** | Paraphrasing, summarizing, grammar | Good for rewriting sentences | No holistic SOP strategy; paraphrased content often reads awkwardly; no domain-specific admissions knowledge |
| **Generic "SOP writing services"** (freelancers, agencies) | Human-written SOPs | High quality when good, personalized | Expensive, slow (days), inconsistent quality, not scalable, no transparency into process |
| **University-specific counselors** | 1:1 human guidance | Deep trust, personalized | Very expensive, limited availability, not accessible to most students globally |

**Our opportunity:** No existing player combines (a) admissions-specific SOP structure and best practices, (b) AI generation tuned to *avoid* generic/robotic output, (c) program/university-aware customization, and (d) an accessible price point for students in emerging markets.

## 7. Unique Value Proposition

> **"The only AI writing assistant built specifically for university admissions — not just another chatbot."**

- Purpose-built SOP frameworks based on what admissions committees actually look for (per program type: STEM, MBA, Humanities, etc.)
- AI output tuned for authenticity and originality — reduces "AI-sounding" red flags
- University- and program-aware prompting (knows the difference between an SOP for Oxford vs. a State University)
- Iterative refinement workflow (draft → score → revise) instead of one-shot generation
- Affordable, transparent pricing accessible to students in emerging markets
- Built-in guidance for students who don't know where to start (unlike ChatGPT, which assumes you already know what to ask)

## 8. MVP Scope

**In scope for MVP:**
- User authentication and profile creation (academic background, target programs, universities)
- Guided intake questionnaire (background, achievements, motivations, goals, target program)
- AI-powered SOP generation engine (first draft based on intake + guided prompts)
- Iterative editing: regenerate section, adjust tone, expand/shorten, rewrite paragraph
- SOP quality score/feedback (structure, originality signal, clarity, word count fit)
- Document export (PDF, DOCX, copy to clipboard)
- Basic dashboard: list of SOPs by application/university
- Subscription tiers with usage limits (Free / Premium / Pro)
- Basic account and billing management

**Explicitly out of scope for MVP (future roadmap):**
- Recommendation letter generation
- Full application tracker (deadlines, document checklist across universities)
- University/program discovery and matching
- Scholarship/financial aid guidance
- Visa document assistance
- Consultant/agency multi-client dashboard
- Mobile native apps (web-responsive only at MVP)
- Peer review / community feedback marketplace

## 9. Future Roadmap

**Phase 2 (Post-MVP, 0–6 months after launch)**
- Letter of Recommendation (LOR) assistant
- Application tracker with deadline reminders
- University/program database with AI-matching ("Where should I apply?")
- Multi-language intake support

**Phase 3 (6–12 months)**
- Interview preparation module (mock interviews, common questions by program)
- Scholarship and financial aid guidance
- Consultant/agency B2B2C dashboard (multi-student management)
- Peer/mentor review marketplace

**Phase 4 (12+ months)**
- Visa application document assistance
- Post-admission support (housing, pre-departure guidance)
- Native mobile apps (iOS/Android)
- API/partnerships with universities and consultancies

## 10. User Journey

1. **Discovery** — Student finds GradPilot via search, social media, or referral, lands on marketing site.
2. **Sign-up** — Creates account (email or OAuth), completes lightweight onboarding (target country, degree level, field of study).
3. **Profile building** — Adds academic background, achievements, extracurriculars, career goals via guided questionnaire.
4. **Create new SOP** — Selects target university/program, GradPilot pulls in program-specific tone guidance.
5. **AI generation** — Answers guided prompts (why this field, why this school, career goals, unique story) → AI generates first draft.
6. **Review & refine** — Student reviews score/feedback, edits sections, regenerates specific paragraphs, adjusts tone/length.
7. **Finalize** — Exports as PDF/DOCX, marks SOP as "final" for that application.
8. **Repeat** — Duplicates and adapts SOP for additional universities (efficiency value prop).
9. **Upgrade** — Hits free-tier limits, converts to Premium/Pro for more generations, universities, and advanced features.
10. **Retention** — Returns each application cycle; refers peers.

## 11. Functional Requirements

- FR1: Users can register/login via email+password and OAuth (Google).
- FR2: Users can create and edit an academic/personal profile.
- FR3: Users can create multiple "Applications," each tied to a university + program.
- FR4: System provides a guided questionnaire to collect SOP inputs per application.
- FR5: System generates an SOP draft via AI based on profile + questionnaire + program context.
- FR6: Users can regenerate the full draft or specific paragraphs/sections.
- FR7: Users can manually edit generated text inline.
- FR8: System provides a quality score/feedback panel (structure, clarity, originality, length).
- FR9: Users can adjust tone/style parameters (formal, narrative-driven, concise, etc.).
- FR10: Users can export SOPs as PDF and DOCX.
- FR11: Users can view version history of a given SOP.
- FR12: System enforces usage limits based on subscription tier.
- FR13: Users can upgrade/downgrade/cancel subscription and manage billing.
- FR14: System sends transactional emails (welcome, generation complete, limit reached, billing).
- FR15: Admin/internal dashboard for monitoring usage, errors, and AI cost per user (internal tool, not customer-facing).

## 12. Non-Functional Requirements

- **Scalability:** Architecture must support growth to 100,000+ registered users and concurrent AI generation load without redesign.
- **Performance:** SOP generation response initiated within 2 seconds; full draft streamed within 15–30 seconds.
- **Availability:** 99.5%+ uptime target for MVP; 99.9% as product matures.
- **Security:** All user data encrypted at rest and in transit (TLS 1.2+, AES-256). Compliance groundwork for GDPR (EU users) and general data privacy best practices.
- **Data privacy:** Student personal essays are sensitive; must never be used to train third-party foundation models without explicit consent; clear data deletion policy.
- **Reliability:** Graceful degradation if AI provider has an outage (queuing, retry, user-facing status).
- **Cost efficiency:** AI generation cost per user must be tracked and stay within gross-margin targets as usage scales.
- **Accessibility:** WCAG 2.1 AA compliance target for core flows.
- **Internationalization-readiness:** UI text externalized for future localization even if MVP ships English-only.
- **Auditability:** All AI generations logged (prompt/response metadata, not necessarily full content) for quality monitoring and abuse prevention.

## 13. Database Entities (High-Level)

- **User** — account credentials, auth provider, subscription status, timestamps
- **Profile** — academic background, achievements, career goals, target countries/fields
- **Application** — links User to a target University + Program + intake term
- **University** (reference data) — name, country, ranking metadata, program list
- **Program** (reference data) — degree level, field, university relation, tone/style guidance metadata
- **SOP (Document)** — belongs to Application, current content, status (draft/final), score metadata
- **SOPVersion** — historical snapshots of an SOP for version history
- **QuestionnaireResponse** — structured inputs collected per SOP generation
- **Subscription** — plan tier, billing cycle, status, linked payment provider ID
- **UsageLog** — tracks generations/exports against tier limits (for quota enforcement)
- **Feedback/Score** — structured AI-evaluation output per SOP version

## 14. Authentication Flow

1. User selects Sign Up (email/password) or Continue with Google.
2. **Email flow:** email + password submitted → verification email sent → account marked verified on link click → onboarding begins.
3. **OAuth flow:** Google consent → account created/linked → onboarding begins immediately (no email verification needed).
4. Session managed via secure, short-lived access tokens + refresh tokens (httpOnly cookies).
5. Password reset via emailed time-limited token link.
6. Optional (Phase 2): multi-factor authentication for account security.
7. All authenticated routes protected server-side; role-based access separates regular users from internal admin roles.

## 15. AI Generation Flow

1. User selects/creates an Application (university + program) and opens the SOP generator.
2. System loads: user Profile, Program tone/style guidance (reference data), and any prior SOPs (for reuse/adaptation).
3. Guided questionnaire captures SOP-specific inputs (motivation, key experiences, why this program, career vision).
4. System constructs a structured prompt combining: profile data + questionnaire answers + program-specific guidance + anti-generic-output instructions.
5. Request sent to the AI provider; response streamed back to the UI in real time.
6. Generated draft is parsed into sections (Intro, Academic Background, Motivation, Why This Program, Career Goals, Conclusion) for the editor UI.
7. Quality-scoring pass evaluates structure, clarity, length-fit, and originality signal; results shown alongside the draft.
8. User can trigger section-level regeneration (re-runs prompt scoped to just that section, preserving the rest).
9. Every generation/edit is versioned and saved automatically.
10. Usage is logged against the user's subscription quota at each generation call.

## 16. Subscription Model

| Tier | Price (indicative) | Generations / Month | Universities/Applications | Export | Key Features |
|---|---|---|---|---|---|
| **Free** | $0 | 1 full SOP generation, limited regenerations | 1 active application | Watermarked PDF export | Basic quality score, core editor |
| **Premium** | ~$9–15/mo or per-cycle pass | Generous monthly generation allowance (e.g., 15) | Up to 5 active applications | Unwatermarked PDF & DOCX | Full quality scoring, tone controls, version history |
| **Pro** | ~$25–35/mo or per-cycle pass | High/near-unlimited generations | Unlimited applications | All export formats | Priority AI speed, advanced originality analysis, priority support |

*Pricing shown is indicative and subject to market validation; final pricing to be confirmed via willingness-to-pay research per target geography (purchasing power varies significantly, e.g., India/Nigeria vs. US/UK students).*

Application-cycle passes (e.g., a one-time payment covering a 2–3 month admissions season) should be tested alongside monthly subscriptions, since students' usage is highly seasonal.

## 17. Landing Page Sections

1. **Hero** — headline + subheadline articulating the core promise ("Write a Statement of Purpose that gets you in"), primary CTA (Get Started Free), visual of the product in action.
2. **Problem/Pain** — short section naming the pain points (blank page, generic AI, expensive consultants).
3. **How It Works** — 3–4 step visual (Tell us about you → AI drafts your SOP → Refine & score → Export & apply).
4. **Product Demo/Screenshot** — real UI screenshots or short embedded video of the generator.
5. **Why GradPilot vs. ChatGPT/Generic Tools** — comparison table highlighting admissions-specific value.
6. **Social Proof** — testimonials, universities students have been admitted to, usage stats (once available).
7. **Pricing** — tier comparison with clear CTA per plan.
8. **FAQ** — plagiarism/originality concerns, data privacy, refund policy, supported countries.
9. **Final CTA** — reinforced sign-up prompt.
10. **Footer** — links (About, Privacy, Terms, Contact, Blog/Resources for SEO).

## 18. Dashboard Layout

- **Top Navigation:** Logo, account menu, subscription/upgrade badge, notifications.
- **Left Sidebar:** My Applications, My Profile, Billing/Subscription, Settings, Help/Support.
- **Main Panel (Applications view):** Card/list of Applications, each showing university, program, SOP status (Draft/Final), last edited date; "New Application" CTA prominent.
- **Application Detail View:** SOP editor (left: generated content by section; right: quality score panel, tone controls, regenerate buttons); questionnaire responses accessible/editable; export button.
- **Profile Section:** Editable academic background, achievements, goals used across all SOP generations.
- **Usage/Quota Widget:** Visible indicator of generations remaining this cycle, with upgrade prompt when near limit.

## 19. AI Generator Workflow (Product-Level UX)

**Step 1 — Setup:** User selects/creates Application (university + program + intake term).
**Step 2 — Guided Intake:** Multi-step questionnaire (not a blank textbox) — background story, key achievements, why this field, why this specific program/university, future goals, optional personal anecdote.
**Step 3 — Generate:** User clicks "Generate SOP"; system streams a structured draft, section by section, with a visible progress indicator.
**Step 4 — Review & Score:** Draft displayed alongside a scorecard (Structure ✔, Clarity ✔, Originality Signal ✔, Word Count Fit ✔) with actionable suggestions.
**Step 5 — Refine:** User can (a) edit text directly, (b) regenerate a specific section with adjusted instructions, (c) change tone/length globally, (d) request "make this sound more personal/less generic."
**Step 6 — Finalize & Export:** User marks SOP as Final, exports as PDF/DOCX, or duplicates it as a starting point for another university's SOP.
**Step 7 — Iterate Across Applications:** User reuses core profile/story across multiple Applications, letting AI adapt tone/content per target program efficiently.

## 20. Success Metrics

**Activation**
- % of sign-ups who complete profile + generate at least 1 SOP draft (target: >60%)
- Time-to-first-generated-draft (target: <10 minutes from sign-up)

**Engagement**
- Average SOPs created per active user per application cycle
- Regeneration/edit interactions per SOP (signal of active refinement, not passive one-shot use)

**Monetization**
- Free-to-paid conversion rate (target: 8–15% typical for freemium SaaS)
- Average revenue per user (ARPU) by tier
- Application-cycle pass vs. subscription mix

**Retention**
- Month-over-month retention within an admissions cycle
- Cross-cycle return rate (student returns next application season, or refers peers)

**Quality/Trust**
- Average AI-generated SOP quality score
- % of exported SOPs marked "Final" (proxy for perceived quality/usability)
- Support ticket volume related to output quality or originality concerns

**Business/Scale Readiness**
- AI generation cost per user vs. revenue per user (unit economics)
- System uptime and generation latency at scale (100K+ user readiness)
- Net Promoter Score (NPS) among active users

---

### Next Steps

Pending your approval of this PRD, the next phase will cover **Software Architecture** — system design, tech stack recommendations, AI provider/model strategy, infrastructure, API design, and data flow diagrams — building directly on the scope defined above.

**Please review and confirm:**
1. Are the MVP scope boundaries (Section 8) correct, or should anything move in/out?
2. Does the subscription pricing structure (Section 16) align with your target market strategy?
3. Any personas, competitors, or roadmap items missing?
