import React, { useState, useId } from 'react';

interface FAQItemProps {
  question: string;
  answer: string;
}

/**
 * Accessible FAQ accordion item.
 * Toggles the answer with a smooth height transition using CSS max-height.
 * Uses aria-expanded and aria-controls for screen reader support.
 */
const FAQItem: React.FC<FAQItemProps> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  const id = useId();
  const panelId = `faq-panel-${id}`;
  const buttonId = `faq-btn-${id}`;

  return (
    <div
      className={`border-b border-slate-800/60 transition-colors duration-200 ${isOpen ? 'border-slate-700/60' : ''}`}
    >
      <button
        id={buttonId}
        type="button"
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full flex items-center justify-between gap-4 py-5 text-left group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-inset rounded-sm"
      >
        <span
          className={`text-[15px] font-medium leading-snug transition-colors duration-200 ${isOpen ? 'text-white' : 'text-slate-300 group-hover:text-white'}`}
        >
          {question}
        </span>
        {/* Chevron icon */}
        <span
          className={`shrink-0 w-5 h-5 text-slate-500 group-hover:text-slate-300 transition-all duration-300 ${isOpen ? 'rotate-45 text-brand-400' : ''}`}
          aria-hidden="true"
        >
          <svg viewBox="0 0 20 20" fill="none">
            <path
              d="M5 10h10M10 5v10"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </span>
      </button>

      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        className={[
          'overflow-hidden transition-all duration-300 ease-in-out',
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0',
        ].join(' ')}
      >
        <p className="text-sm text-slate-500 leading-relaxed pb-5 pr-8">{answer}</p>
      </div>
    </div>
  );
};

export default FAQItem;
