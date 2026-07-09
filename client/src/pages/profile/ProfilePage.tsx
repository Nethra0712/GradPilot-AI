import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useProfile } from '@/features/profile/hooks/useProfile';
import { useUpdateProfile } from '@/features/profile/hooks/useUpdateProfile';
import { StudentProfile } from '@/features/profile/types/profile.types';
import { calculateProfileCompletion } from '@/features/profile/utils/profileCompletion';
import {
  TargetUniversitiesInput,
  ExperienceListInput,
  ProjectListInput,
  AwardListInput,
  SkillListInput,
  LanguageListInput,
  EnglishTestsInput,
} from '@/features/profile/components/ProfileListInputs';

// Accordion sections structure
type SectionId =
  | 'personal'
  | 'education'
  | 'target'
  | 'career'
  | 'experience'
  | 'achievements'
  | 'skills'
  | 'languages'
  | 'tests'
  | 'notes';

export const ProfilePage: React.FC = () => {
  const { data, isLoading } = useProfile();
  const updateMutation = useUpdateProfile();
  const [activeSection, setActiveSection] = useState<SectionId | null>('personal');

  // Autosave status indicators
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'error'>('saved');
  const [lastSavedText, setLastSavedText] = useState<string>('All changes saved');
  const lastSavedTime = useRef<Date>(new Date());

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors, isDirty },
  } = useForm<StudentProfile>({
    defaultValues: {},
  });

  // Load existing profile values into the form
  useEffect(() => {
    if (data?.profile) {
      // Format Date for datetime input if present
      const formattedProfile = { ...data.profile };
      if (formattedProfile.dob) {
        formattedProfile.dob = new Date(formattedProfile.dob).toISOString().substring(0, 10);
      }
      reset(formattedProfile);
      lastSavedTime.current = new Date(data.profile.updatedAt || new Date());
    }
  }, [data, reset]);

  // Update "Last saved" timestamp message
  useEffect(() => {
    const interval = setInterval(() => {
      if (saveStatus === 'saved') {
        const diffSecs = Math.floor(
          (new Date().getTime() - lastSavedTime.current.getTime()) / 1000
        );
        if (diffSecs < 5) {
          setLastSavedText('All changes saved');
        } else if (diffSecs < 60) {
          setLastSavedText(`Last saved ${diffSecs} seconds ago`);
        } else {
          setLastSavedText(`Last saved ${Math.floor(diffSecs / 60)} minutes ago`);
        }
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [saveStatus]);

  // Unsaved changes browser prompt
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (saveStatus === 'saving' || isDirty) {
        e.preventDefault();
        e.returnValue = 'Autosave is in progress. Leaving now may discard your recent edits.';
        return e.returnValue;
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [saveStatus, isDirty]);

  // Debounced Autosave ref
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  // Perform form save to server wrapped in useCallback
  const saveFormData = useCallback(
    async (formData: StudentProfile) => {
      setSaveStatus('saving');
      try {
        await updateMutation.mutateAsync(formData);
        lastSavedTime.current = new Date();
        setSaveStatus('saved');
        setLastSavedText('All changes saved');
      } catch {
        setSaveStatus('error');
      }
    },
    [updateMutation]
  );

  // Watch for changes to trigger debounced autosave (800ms)
  useEffect(() => {
    const subscription = watch((_value) => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
      debounceTimer.current = setTimeout(() => {
        handleSubmit((data) => {
          saveFormData(data);
        })();
      }, 800); // 800ms debounce
    });
    return () => subscription.unsubscribe();
  }, [watch, handleSubmit, saveFormData]);

  // Trigger instant save on Input Blur
  const handleBlur = () => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    handleSubmit((data) => {
      saveFormData(data);
    })();
  };

  // Section validations toggle
  const toggleSection = async (section: SectionId) => {
    if (activeSection === section) {
      setActiveSection(null);
    } else {
      setActiveSection(section);
    }
  };

  if (isLoading) {
    return (
      <div className="py-12 flex items-center justify-center">
        <svg className="animate-spin h-8 w-8 text-brand-500" fill="none" viewBox="0 0 24 24">
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      </div>
    );
  }

  const completion = calculateProfileCompletion(data?.profile || null);

  // Check if a section has errors to highlight in header
  const sectionHasErrors = (fields: Array<keyof StudentProfile>) => {
    return fields.some((field) => !!errors[field]);
  };

  return (
    <div className="space-y-6 select-none animate-fade-in">
      {/* ─── PAGE HEADER & AUTOSAVE STATUS ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-900 pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white font-display">
            Academic Profile
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Build your profile. Every AI generation will use this context automatically.
          </p>
        </div>

        {/* Autosave Indicator */}
        <div className="flex items-center gap-2.5 text-xs text-slate-400 font-medium">
          {saveStatus === 'saving' && (
            <>
              <svg
                className="animate-spin h-3.5 w-3.5 text-brand-500"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              <span>Saving changes...</span>
            </>
          )}
          {saveStatus === 'saved' && (
            <>
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
              <span>{lastSavedText}</span>
            </>
          )}
          {saveStatus === 'error' && (
            <>
              <div className="w-1.5 h-1.5 bg-red-500 rounded-full" />
              <span className="text-red-400">Save failed. Retrying...</span>
            </>
          )}
        </div>
      </div>

      {/* ─── COMPLETION SUMMARY WIDGET ─── */}
      <div className="grid md:grid-cols-3 gap-6 p-6 border border-slate-900 bg-slate-900/20 rounded-2xl">
        <div className="flex items-center gap-4">
          {/* Progress Ring */}
          <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="32"
                cy="32"
                r="28"
                className="stroke-slate-900 fill-transparent"
                strokeWidth="4"
              />
              <circle
                cx="32"
                cy="32"
                r="28"
                className="stroke-brand-500 fill-transparent transition-all duration-500"
                strokeWidth="4"
                strokeDasharray={2 * Math.PI * 28}
                strokeDashoffset={2 * Math.PI * 28 * (1 - completion.percentage / 100)}
              />
            </svg>
            <span className="absolute text-xs font-bold text-white">{completion.percentage}%</span>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-200">Completeness Profile</h3>
            <p className="text-[11px] text-slate-500 mt-0.5">
              {completion.completedSectionsCount} of {completion.totalSectionsCount} sections
              populated
            </p>
          </div>
        </div>

        {/* Missing checklists */}
        <div className="md:col-span-2 text-xs">
          <p className="text-slate-400 font-semibold mb-2">Remaining sections to complete:</p>
          {completion.remainingSections.length === 0 ? (
            <p className="text-emerald-400 font-semibold">
              🎉 Profile is 100% complete! Ready for AI prompt context.
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {completion.remainingSections.map((sec) => (
                <span
                  key={sec}
                  className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800/60 text-slate-500"
                >
                  {sec}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ─── PROFILE SECTIONS FORM ACCORDIONS ─── */}
      <form onBlur={handleBlur} className="space-y-3">
        {/* SECTION 1: Personal Details */}
        <div className="border border-slate-900 bg-slate-900/40 rounded-2xl overflow-hidden">
          <button
            type="button"
            onClick={() => toggleSection('personal')}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-900/60 text-left"
          >
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-white">1. Personal Details</span>
              {sectionHasErrors(['dob', 'nationality']) && (
                <span className="text-[10px] font-semibold text-red-400 bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded-full">
                  Errors
                </span>
              )}
            </div>
            <svg
              className={`w-4 h-4 text-slate-500 transform transition-transform duration-200 ${
                activeSection === 'personal' ? 'rotate-180' : ''
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {activeSection === 'personal' && (
            <div className="px-6 pb-6 pt-2 border-t border-slate-900/50 space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    {...register('dob')}
                    className="w-full h-11 bg-slate-950 border border-slate-900 rounded-xl text-sm px-4 text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Nationality
                  </label>
                  <input
                    {...register('nationality')}
                    className="w-full h-11 bg-slate-950 border border-slate-900 rounded-xl text-sm px-4 text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
                    placeholder="e.g. French, Canadian"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* SECTION 2: Education Details */}
        <div className="border border-slate-900 bg-slate-900/40 rounded-2xl overflow-hidden">
          <button
            type="button"
            onClick={() => toggleSection('education')}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-900/60 text-left"
          >
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-white">2. Education Background</span>
              {sectionHasErrors(['currentEducation', 'institution', 'gpa', 'graduationYear']) && (
                <span className="text-[10px] font-semibold text-red-400 bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded-full">
                  Errors
                </span>
              )}
            </div>
            <svg
              className={`w-4 h-4 text-slate-500 transform transition-transform duration-200 ${
                activeSection === 'education' ? 'rotate-180' : ''
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {activeSection === 'education' && (
            <div className="px-6 pb-6 pt-2 border-t border-slate-900/50 space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Current Degree / Level
                  </label>
                  <input
                    {...register('currentEducation')}
                    className="w-full h-11 bg-slate-950 border border-slate-900 rounded-xl text-sm px-4 text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
                    placeholder="e.g. Bachelor of Science"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Institution / University
                  </label>
                  <input
                    {...register('institution')}
                    className="w-full h-11 bg-slate-950 border border-slate-900 rounded-xl text-sm px-4 text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
                    placeholder="e.g. Sorbonne University"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    GPA (e.g. 3.8/4.0 or 85%)
                  </label>
                  <input
                    {...register('gpa')}
                    className="w-full h-11 bg-slate-950 border border-slate-900 rounded-xl text-sm px-4 text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
                    placeholder="e.g. 3.84/4.0"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Graduation Year
                  </label>
                  <input
                    type="number"
                    {...register('graduationYear', { valueAsNumber: true })}
                    className="w-full h-11 bg-slate-950 border border-slate-900 rounded-xl text-sm px-4 text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
                    placeholder="e.g. 2025"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* SECTION 3: Target Studies */}
        <div className="border border-slate-900 bg-slate-900/40 rounded-2xl overflow-hidden">
          <button
            type="button"
            onClick={() => toggleSection('target')}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-900/60 text-left"
          >
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-white">3. Target Studies</span>
              {sectionHasErrors(['targetDegree', 'targetUniversities']) && (
                <span className="text-[10px] font-semibold text-red-400 bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded-full">
                  Errors
                </span>
              )}
            </div>
            <svg
              className={`w-4 h-4 text-slate-500 transform transition-transform duration-200 ${
                activeSection === 'target' ? 'rotate-180' : ''
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {activeSection === 'target' && (
            <div className="px-6 pb-6 pt-2 border-t border-slate-900/50 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Target Degree & field
                </label>
                <input
                  {...register('targetDegree')}
                  className="w-full h-11 bg-slate-950 border border-slate-900 rounded-xl text-sm px-4 text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  placeholder="e.g. MS in Computer Science"
                />
              </div>

              {/* Dynamic array university list input */}
              <TargetUniversitiesInput control={control} register={register} errors={errors} />
            </div>
          )}
        </div>

        {/* SECTION 4: Career Goals */}
        <div className="border border-slate-900 bg-slate-900/40 rounded-2xl overflow-hidden">
          <button
            type="button"
            onClick={() => toggleSection('career')}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-900/60 text-left"
          >
            <span className="text-sm font-semibold text-white">4. Career Targets</span>
            <svg
              className={`w-4 h-4 text-slate-500 transform transition-transform duration-200 ${
                activeSection === 'career' ? 'rotate-180' : ''
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {activeSection === 'career' && (
            <div className="px-6 pb-6 pt-2 border-t border-slate-900/50 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Dream Job / Destination Position
                </label>
                <input
                  {...register('dreamJob')}
                  className="w-full h-11 bg-slate-950 border border-slate-900 rounded-xl text-sm px-4 text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  placeholder="e.g. Machine Learning Research Engineer"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Long-term Career Goals
                </label>
                <textarea
                  {...register('careerGoals')}
                  rows={3}
                  className="w-full bg-slate-950 border border-slate-900 rounded-xl text-sm p-4 text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
                  placeholder="Explain your career drive and where you want to be in 5 years..."
                />
              </div>
            </div>
          )}
        </div>

        {/* SECTION 5: Work Experience & Projects */}
        <div className="border border-slate-900 bg-slate-900/40 rounded-2xl overflow-hidden">
          <button
            type="button"
            onClick={() => toggleSection('experience')}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-900/60 text-left"
          >
            <span className="text-sm font-semibold text-white">5. Work Experience & Projects</span>
            <svg
              className={`w-4 h-4 text-slate-500 transform transition-transform duration-200 ${
                activeSection === 'experience' ? 'rotate-180' : ''
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {activeSection === 'experience' && (
            <div className="px-6 pb-6 pt-2 border-t border-slate-900/50 space-y-6">
              <ExperienceListInput control={control} register={register} />
              <div className="border-t border-slate-900/60 my-4" />
              <ProjectListInput control={control} register={register} />
            </div>
          )}
        </div>

        {/* SECTION 6: Achievements */}
        <div className="border border-slate-900 bg-slate-900/40 rounded-2xl overflow-hidden">
          <button
            type="button"
            onClick={() => toggleSection('achievements')}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-900/60 text-left"
          >
            <span className="text-sm font-semibold text-white">6. Awards & Honors</span>
            <svg
              className={`w-4 h-4 text-slate-500 transform transition-transform duration-200 ${
                activeSection === 'achievements' ? 'rotate-180' : ''
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {activeSection === 'achievements' && (
            <div className="px-6 pb-6 pt-2 border-t border-slate-900/50">
              <AwardListInput control={control} register={register} />
            </div>
          )}
        </div>

        {/* SECTION 7: Skills */}
        <div className="border border-slate-900 bg-slate-900/40 rounded-2xl overflow-hidden">
          <button
            type="button"
            onClick={() => toggleSection('skills')}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-900/60 text-left"
          >
            <span className="text-sm font-semibold text-white">7. Skills & Expertise</span>
            <svg
              className={`w-4 h-4 text-slate-500 transform transition-transform duration-200 ${
                activeSection === 'skills' ? 'rotate-180' : ''
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {activeSection === 'skills' && (
            <div className="px-6 pb-6 pt-2 border-t border-slate-900/50">
              <SkillListInput control={control} register={register} />
            </div>
          )}
        </div>

        {/* SECTION 8: Languages */}
        <div className="border border-slate-900 bg-slate-900/40 rounded-2xl overflow-hidden">
          <button
            type="button"
            onClick={() => toggleSection('languages')}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-900/60 text-left"
          >
            <span className="text-sm font-semibold text-white">8. Languages</span>
            <svg
              className={`w-4 h-4 text-slate-500 transform transition-transform duration-200 ${
                activeSection === 'languages' ? 'rotate-180' : ''
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {activeSection === 'languages' && (
            <div className="px-6 pb-6 pt-2 border-t border-slate-900/50">
              <LanguageListInput control={control} register={register} />
            </div>
          )}
        </div>

        {/* SECTION 9: English Tests */}
        <div className="border border-slate-900 bg-slate-900/40 rounded-2xl overflow-hidden">
          <button
            type="button"
            onClick={() => toggleSection('tests')}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-900/60 text-left"
          >
            <span className="text-sm font-semibold text-white">9. English Proficiency Tests</span>
            <svg
              className={`w-4 h-4 text-slate-500 transform transition-transform duration-200 ${
                activeSection === 'tests' ? 'rotate-180' : ''
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {activeSection === 'tests' && (
            <div className="px-6 pb-6 pt-2 border-t border-slate-900/50">
              <EnglishTestsInput control={control} register={register} />
            </div>
          )}
        </div>

        {/* SECTION 10: Additional Notes */}
        <div className="border border-slate-900 bg-slate-900/40 rounded-2xl overflow-hidden">
          <button
            type="button"
            onClick={() => toggleSection('notes')}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-900/60 text-left"
          >
            <span className="text-sm font-semibold text-white">10. Additional Notes</span>
            <svg
              className={`w-4 h-4 text-slate-500 transform transition-transform duration-200 ${
                activeSection === 'notes' ? 'rotate-180' : ''
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {activeSection === 'notes' && (
            <div className="px-6 pb-6 pt-2 border-t border-slate-900/50">
              <textarea
                {...register('additionalNotes')}
                rows={4}
                className="w-full bg-slate-950 border border-slate-900 rounded-xl text-sm p-4 text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
                placeholder="Mention any research publications, special volunteer items, or circumstances..."
              />
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default ProfilePage;
