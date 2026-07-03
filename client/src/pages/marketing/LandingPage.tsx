import React from 'react';
import FeatureCard from '@/components/marketing/FeatureCard';
import FutureToolCard from '@/components/marketing/FutureToolCard';
import PricingCard from '@/components/marketing/PricingCard';
import FAQItem from '@/components/marketing/FAQItem';
import WaitlistForm from '@/components/marketing/WaitlistForm';

// ─── DATA ─────────────────────────────────────────────────────────────────────

const FEATURES = [
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
        <path
          d="M9 2l1.5 3.5L14 7l-2.5 2.5.5 3.5L9 11.5 6 13l.5-3.5L4 7l3.5-1.5L9 2z"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
      </svg>
    ),
    title: 'Admissions-Tuned AI',
    description:
      'Not a generic language model. Our AI is specifically calibrated on admissions frameworks, knowing what STEM, MBA, and Humanities committees look for — and what they ignore.',
    tag: 'Core',
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
        <rect x="2" y="2" width="14" height="14" rx="3" stroke="currentColor" strokeWidth="1.4" />
        <path
          d="M5 9h8M5 6h5M5 12h6"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
      </svg>
    ),
    title: 'Program-Aware Drafting',
    description:
      'Every SOP is tailored to the specific program and university — not a template swap. The AI understands the tone difference between Oxford and a mid-tier state school.',
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
        <path
          d="M3 15l4-4 3 2 5-6"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="14" cy="5" r="2" stroke="currentColor" strokeWidth="1.4" />
      </svg>
    ),
    title: 'Quality Scoring',
    description:
      'An instant scorecard grades your draft across structure, clarity, originality signal, and word count fit — with actionable suggestions, not vague feedback.',
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
        <path
          d="M9 2v4M9 12v4M2 9h4M12 9h4M4.2 4.2l2.8 2.8M11 11l2.8 2.8M4.2 13.8L7 11M11 7l2.8-2.8"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
      </svg>
    ),
    title: 'Iterative Refinement',
    description:
      'Generate a full draft, then regenerate individual sections. Adjust tone, expand your career goals paragraph, or make it sound more personal — all in one interface.',
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
        <path
          d="M6 2h6l4 4v10a1 1 0 01-1 1H3a1 1 0 01-1-1V3a1 1 0 011-1z"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
        <path
          d="M12 2v4h4M6 10h6M6 13h4"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
      </svg>
    ),
    title: 'PDF & DOCX Export',
    description:
      'Export your finalized document in any format in seconds. Free tier includes a watermarked PDF; Premium unlocks clean PDF and DOCX exports.',
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
        <circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.4" />
        <path
          d="M9 5v5l3 2"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    title: 'Version History',
    description:
      'Every generation and edit is automatically snapshotted. Revert to any prior version or compare drafts side by side to choose the strongest phrasing.',
  },
];

const FUTURE_TOOLS = [
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path
          d="M2 4h12v9a1 1 0 01-1 1H3a1 1 0 01-1-1V4zM5 4V3a1 1 0 011-1h4a1 1 0 011 1v1"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    name: 'SOP Generator',
    description: 'Full statement of purpose generation tuned per university and field.',
  },
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path
          d="M8 2C5.2 2 3 4.2 3 7c0 1.8.9 3.3 2.3 4.2L5 14h6l-.3-2.8C12.1 10.3 13 8.8 13 7c0-2.8-2.2-5-5-5z"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinejoin="round"
        />
      </svg>
    ),
    name: 'Personal Statement',
    description: 'Structured undergraduate personal statement builder with section coaching.',
  },
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <rect x="2" y="1" width="12" height="14" rx="2" stroke="currentColor" strokeWidth="1.3" />
        <path
          d="M5 5h6M5 8h4M5 11h5"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinecap="round"
        />
      </svg>
    ),
    name: 'CV Builder',
    description: 'Academic CV generation aligned with program expectations and ATS standards.',
  },
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path
          d="M8 2l1.5 3.5L13 6.5l-2.5 2.5.5 3.5L8 10.8 5 12.5l.5-3.5L3 6.5l3.5-1L8 2z"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinejoin="round"
        />
      </svg>
    ),
    name: 'Scholarship Essay',
    description: 'Merit and need-based scholarship essay generation with impact framing.',
  },
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.3" />
        <path d="M5 8h6M8 5v6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      </svg>
    ),
    name: 'Research Proposal',
    description: 'Structure and write a compelling PhD or postgraduate research proposal.',
  },
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path
          d="M8 3c-2.8 0-5 1.8-5 4s2.2 4 5 4c.5 0 1-.1 1.4-.2L12 13v-2.6C13.2 9.4 14 8.3 14 7c0-2.2-2.2-4-6-4z"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinejoin="round"
        />
      </svg>
    ),
    name: 'AI Reviewer',
    description: 'Score and critique any existing document you upload with actionable feedback.',
  },
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.3" />
        <path
          d="M5.5 8.5l1.5-1.5 1.5 1.5L11 5.5"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    name: 'University Finder',
    description: 'AI-powered program matching based on your profile, scores, and preferences.',
  },
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path
          d="M3 12V5a1 1 0 011-1h8a1 1 0 011 1v7"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinecap="round"
        />
        <path
          d="M1 12h14M6 7h4M6 9.5h2"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinecap="round"
        />
      </svg>
    ),
    name: 'Interview Coach',
    description: 'Mock university interview practice with AI feedback on structure and delivery.',
  },
];

const FREE_FEATURES = [
  { text: '1 full SOP generation per month', included: true },
  { text: 'Guided intake questionnaire', included: true },
  { text: 'Basic quality score', included: true },
  { text: 'Watermarked PDF export', included: true },
  { text: '1 active application', included: true },
  { text: 'DOCX export', included: false },
  { text: 'Version history', included: false },
  { text: 'Advanced tone controls', included: false },
];

const PREMIUM_FEATURES = [
  { text: '15 SOP generations per month', included: true },
  { text: 'Guided intake questionnaire', included: true },
  { text: 'Full quality scoring & originality analysis', included: true },
  { text: 'Unwatermarked PDF & DOCX export', included: true },
  { text: 'Up to 5 active applications', included: true },
  { text: 'Version history', included: true },
  { text: 'Advanced tone & length controls', included: true },
  { text: 'Priority AI generation speed', included: true },
];

const FAQ_ITEMS = [
  {
    question: 'Will my SOP be flagged as AI-generated?',
    answer:
      'GradPilot AI is specifically designed to produce authentic, human-sounding writing — not the generic, repetitive prose that AI detectors flag. We tune outputs to sound like you, not like a language model. That said, we always recommend reviewing and personalizing your draft before submission. The tool gives you a starting point, not a finished product.',
  },
  {
    question: 'Will universities share the same SOP template if everyone uses GradPilot?',
    answer:
      'No. Every SOP is generated from your unique profile data, academic background, personal experiences, and target program. Two users with identical credentials applying to the same university will receive meaningfully different outputs. The intake questionnaire ensures each document reflects your specific story.',
  },
  {
    question: 'What programs and degree levels does GradPilot support?',
    answer:
      'The MVP supports Masters (MS) and MBA programs, with undergraduate and PhD support in active development. The platform currently covers STEM, Business, and select Humanities fields. Program-specific tone guidance is available for US, UK, Canadian, and Australian universities.',
  },
  {
    question: 'How does the quality score work?',
    answer:
      'After generation, our scoring model evaluates your SOP across four dimensions: structure (does it follow the expected narrative arc), clarity (sentence-level readability), originality signal (low-probability phrasing that reads as authentic), and length fit (word count vs. typical program expectations). Each dimension gets a score with an actionable improvement tip.',
  },
  {
    question: 'Is my data and personal essay kept private?',
    answer:
      'Yes. Your questionnaire responses and generated documents are encrypted at rest and in transit. Critically, we do not use your content to train third-party AI models without explicit consent — a deliberate policy given the sensitivity of personal essays. You can request data deletion at any time.',
  },
  {
    question: 'Can I reuse my profile for multiple university applications?',
    answer:
      'Absolutely — this is a core efficiency feature. Your academic background, achievements, and career goals are saved to your profile and automatically pulled into every new application. You answer new prompts only for program-specific questions (Why this school? Why this program?). The AI adapts the tone and emphasis per target university.',
  },
  {
    question: 'What happens if the AI generation fails or produces a poor result?',
    answer:
      'Your usage quota is only deducted after a successful generation that produces a saved draft. If the AI provider has an outage or returns a malformed response, no quota is consumed. For poor-quality results, you can regenerate the full draft or specific sections with adjusted instructions — regenerations cost less quota than full generations.',
  },
  {
    question: 'Is there a free trial? What do I get without paying?',
    answer:
      'The Free tier gives you one complete SOP generation per month, access to the full guided intake questionnaire, basic quality scoring, and a watermarked PDF export — with no credit card required. It is designed to let you experience the full generation workflow before deciding whether to upgrade.',
  },
];

const HOW_IT_WORKS_STEPS = [
  {
    number: '01',
    title: 'Enter your details',
    description:
      'Complete a guided questionnaire covering your academic background, achievements, motivations, and target program. Takes under 10 minutes.',
  },
  {
    number: '02',
    title: 'AI generates your document',
    description:
      'Our admissions-tuned AI produces a structured first draft, streamed to your screen section by section. Scores are calculated automatically.',
  },
  {
    number: '03',
    title: 'Review, refine, and export',
    description:
      'Edit inline, regenerate individual sections, adjust tone, and export as PDF or DOCX once you are satisfied with the result.',
  },
];

const STATS = [
  { value: '< 10 min', label: 'Time to first draft' },
  { value: '8+', label: 'AI document tools planned' },
  { value: '100K+', label: 'Target students by Year 1' },
  { value: '$0', label: 'To get started' },
];

// ─── PAGE COMPONENT ────────────────────────────────────────────────────────────

/**
 * Full marketing landing page.
 * Assembles all section components into a single cohesive long-scroll page.
 */
const LandingPage: React.FC = () => {
  const scrollToWaitlist = () => {
    document.querySelector('#waitlist')?.scrollIntoView({ behavior: 'smooth' });
  };
  const scrollToFeatures = () => {
    document.querySelector('#features')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative overflow-x-hidden">
      {/* ── 1. HERO ─────────────────────────────────────────────────────────── */}
      <section aria-labelledby="hero-heading" className="relative min-h-[90vh] flex items-center">
        {/* Background grid */}
        <div
          className="absolute inset-0 bg-grid-pattern bg-grid opacity-100 pointer-events-none"
          aria-hidden="true"
        />
        {/* Radial gradient fade */}
        <div
          className="absolute inset-0 bg-gradient-radial from-transparent via-slate-950/60 to-slate-950 pointer-events-none"
          aria-hidden="true"
        />
        {/* Top glow orb */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-brand-500/8 rounded-full blur-[120px] pointer-events-none"
          aria-hidden="true"
        />

        <div className="section-container relative z-10 py-28 sm:py-36">
          <div className="max-w-3xl mx-auto text-center">
            {/* Eyebrow badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-slate-700/60 bg-slate-900/60 backdrop-blur text-xs text-slate-400 mb-8 animate-fade-in">
              <span
                className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse-slow"
                aria-hidden="true"
              />
              Early Access — Join the Waitlist
            </div>

            {/* Headline */}
            <h1
              id="hero-heading"
              className="section-heading text-4xl sm:text-6xl lg:text-[68px] mb-6 animate-fade-up"
            >
              Your AI University{' '}
              <span className="relative">
                <span className="relative z-10 bg-gradient-to-r from-brand-400 to-brand-300 bg-clip-text text-transparent">
                  Application
                </span>
              </span>{' '}
              Copilot
            </h1>

            {/* Subheadline */}
            <p className="section-sub max-w-2xl mx-auto text-base sm:text-lg animate-fade-up-delay opacity-0-start">
              Generate exceptional Statements of Purpose, Personal Statements, CVs, Scholarship
              Essays, and more — all in one intelligent platform built specifically for admissions.
            </p>

            {/* CTAs */}
            <div className="flex items-center justify-center gap-3 mt-10 flex-wrap animate-fade-up-delay-2 opacity-0-start">
              <button
                type="button"
                onClick={scrollToWaitlist}
                className="inline-flex items-center gap-2 h-12 px-7 text-[15px] font-medium text-white bg-brand-500 hover:bg-brand-600 rounded-xl transition-all duration-200 shadow-[0_0_24px_rgba(56,85,255,0.4)] hover:shadow-[0_0_36px_rgba(56,85,255,0.6)] active:scale-[0.98]"
              >
                Join the Waitlist
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <path
                    d="M1 7h12M8 3l4 4-4 4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <button
                type="button"
                onClick={scrollToFeatures}
                className="inline-flex items-center gap-2 h-12 px-7 text-[15px] font-medium text-slate-300 bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 hover:border-slate-600 rounded-xl transition-all duration-200 active:scale-[0.98]"
              >
                See Features
              </button>
            </div>

            {/* Social proof hint */}
            <p className="mt-8 text-xs text-slate-600 animate-fade-up-delay-3 opacity-0-start">
              No credit card required &middot; Free tier available at launch
            </p>
          </div>
        </div>
      </section>

      {/* ── 2. TRUST / STATS ────────────────────────────────────────────────── */}
      <section aria-label="Platform statistics" className="divider">
        <div className="section-container py-16">
          <dl className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map(({ value, label }) => (
              <div key={label} className="flex flex-col items-center text-center gap-1">
                <dt
                  className="text-3xl font-bold text-white"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {value}
                </dt>
                <dd className="text-sm text-slate-600">{label}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-12 text-center">
            <p className="text-xs text-slate-700 uppercase tracking-widest font-medium mb-6">
              Future testimonials will appear here at launch
            </p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl border border-slate-800/40 bg-slate-900/30 w-64"
                >
                  <div className="w-8 h-8 rounded-full bg-slate-800 shrink-0" />
                  <div className="flex-1">
                    <div className="h-2.5 rounded bg-slate-800 mb-2 w-3/4" />
                    <div className="h-2 rounded bg-slate-800/60 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. FEATURES ─────────────────────────────────────────────────────── */}
      <section id="features" aria-labelledby="features-heading" className="divider">
        <div className="section-container py-20 sm:py-28">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="section-label">
              <span aria-hidden="true">◆</span> Capabilities
            </p>
            <h2 id="features-heading" className="section-heading">
              Built for admissions, not for general writing
            </h2>
            <p className="section-sub text-base">
              Every feature is designed around the specific challenges international students face
              when applying to competitive graduate and undergraduate programs.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map((feature) => (
              <FeatureCard key={feature.title} {...feature} />
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. HOW IT WORKS ─────────────────────────────────────────────────── */}
      <section id="how-it-works" aria-labelledby="how-it-works-heading" className="divider">
        <div className="section-container py-20 sm:py-28">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="section-label">
              <span aria-hidden="true">◆</span> Process
            </p>
            <h2 id="how-it-works-heading" className="section-heading">
              From blank page to final draft in minutes
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-10 relative">
            {/* Connector line (desktop only) */}
            <div
              className="hidden md:block absolute top-8 left-1/3 right-1/3 h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent pointer-events-none"
              aria-hidden="true"
            />

            {HOW_IT_WORKS_STEPS.map((step, index) => (
              <div
                key={step.number}
                className="relative flex flex-col items-start md:items-center text-left md:text-center gap-4"
              >
                {/* Step number badge */}
                <div className="relative flex items-center justify-center w-16 h-16 rounded-2xl border border-slate-700/60 bg-slate-900/60 shrink-0">
                  <span
                    className="text-2xl font-bold text-slate-700"
                    style={{ fontFamily: 'var(--font-display)' }}
                    aria-hidden="true"
                  >
                    {step.number}
                  </span>
                  {/* Active indicator for step 2 */}
                  {index === 1 && (
                    <div
                      className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-brand-500 border-2 border-slate-950 animate-pulse-slow"
                      aria-hidden="true"
                    />
                  )}
                </div>

                <div>
                  <h3
                    className="text-[15px] font-semibold text-white mb-2"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {step.title}
                  </h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. FUTURE TOOLS ─────────────────────────────────────────────────── */}
      <section id="tools" aria-labelledby="tools-heading" className="divider">
        <div className="section-container py-20 sm:py-28">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="section-label">
              <span aria-hidden="true">◆</span> Roadmap
            </p>
            <h2 id="tools-heading" className="section-heading">
              One platform. Every document you need.
            </h2>
            <p className="section-sub text-base">
              GradPilot is building the complete operating system for university applications. The
              SOP generator is the first of many specialized AI tools.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {FUTURE_TOOLS.map((tool) => (
              <FutureToolCard key={tool.name} {...tool} />
            ))}
          </div>

          <p className="text-center text-xs text-slate-700 mt-8">
            All tools shown above are in active development and will be released post-MVP.
          </p>
        </div>
      </section>

      {/* ── 6. PRICING ──────────────────────────────────────────────────────── */}
      <section id="pricing" aria-labelledby="pricing-heading" className="divider">
        <div className="section-container py-20 sm:py-28">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="section-label">
              <span aria-hidden="true">◆</span> Pricing
            </p>
            <h2 id="pricing-heading" className="section-heading">
              Accessible to every student
            </h2>
            <p className="section-sub text-base">
              Pricing designed around what international students can actually afford — not what US
              consultants charge. Indicative pricing; confirmed at launch.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-5 max-w-3xl mx-auto">
            <PricingCard
              tier="free"
              name="Free"
              price="$0"
              priceNote="forever"
              description="Start generating immediately. No credit card required. Experience the full workflow before you commit."
              features={FREE_FEATURES}
              ctaLabel="Join Waitlist — Free"
              ctaAction={scrollToWaitlist}
            />
            <PricingCard
              tier="premium"
              name="Premium"
              price="~$12"
              priceNote="/ month"
              description="For students applying to multiple programs who need more generations, exports, and advanced controls."
              features={PREMIUM_FEATURES}
              ctaLabel="Get Early Access"
              ctaAction={scrollToWaitlist}
              highlighted
            />
          </div>

          <p className="text-center text-xs text-slate-700 mt-8 max-w-md mx-auto">
            Application-cycle passes (one-time, 2–3 months) will also be available at launch — ideal
            for seasonal usage patterns.
          </p>
        </div>
      </section>

      {/* ── 7. FAQ ──────────────────────────────────────────────────────────── */}
      <section id="faq" aria-labelledby="faq-heading" className="divider">
        <div className="section-container py-20 sm:py-28">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="section-label">
              <span aria-hidden="true">◆</span> FAQ
            </p>
            <h2 id="faq-heading" className="section-heading">
              Common questions
            </h2>
          </div>

          <div className="max-w-2xl mx-auto">
            {FAQ_ITEMS.map((item) => (
              <FAQItem key={item.question} question={item.question} answer={item.answer} />
            ))}
          </div>
        </div>
      </section>

      {/* ── 8. WAITLIST CTA ─────────────────────────────────────────────────── */}
      <section id="waitlist" aria-labelledby="waitlist-heading" className="divider">
        <div className="section-container py-24 sm:py-32">
          <div className="relative max-w-2xl mx-auto text-center">
            {/* Background glow */}
            <div
              className="absolute -inset-10 bg-gradient-radial from-brand-500/10 via-transparent to-transparent rounded-full blur-3xl pointer-events-none"
              aria-hidden="true"
            />

            <div className="relative">
              <p className="section-label justify-center">
                <span aria-hidden="true">◆</span> Early Access
              </p>
              <h2 id="waitlist-heading" className="section-heading text-3xl sm:text-5xl mb-5">
                Be first when we launch
              </h2>
              <p className="section-sub text-base mb-10 max-w-lg mx-auto">
                Join the waitlist for priority access, launch-day pricing, and updates as we build.
                No spam — only what matters.
              </p>
              <WaitlistForm />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
