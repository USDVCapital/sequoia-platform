'use client';

import { useState } from 'react';
import { ExternalLink, Send, CheckCircle, PlayCircle } from 'lucide-react';

const pastVideos = [
  { title: 'How to Approach Your First Client', date: 'March 21, 2026' },
  { title: 'Understanding the EHMP Commission Structure', date: 'March 14, 2026' },
  { title: 'Fix & Flip Loan Criteria Explained', date: 'March 7, 2026' },
  { title: 'Building Your Team: Levels 1-3', date: 'February 28, 2026' },
  { title: "Working Capital vs. Term Loan: What's the Difference?", date: 'February 21, 2026' },
];

const inputClasses =
  'w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:ring-2 focus:ring-[#C9A84C] focus:border-[#C9A84C] outline-none';

export default function WeeklyQAPage() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [question, setQuestion] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setTimeout(() => {
      setStatus('success');
    }, 1500);
  };

  const resetForm = () => {
    setFirstName('');
    setLastName('');
    setEmail('');
    setQuestion('');
    setStatus('idle');
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#0D2B1E]">Weekly Q&A</h1>
        <p className="mt-2 text-neutral-600">
          Submit your questions for Friday&apos;s video. Answers are posted to the YouTube channel
          every Friday.
        </p>
      </div>

      {/* Two-column layout */}
      <div className="grid gap-8 lg:grid-cols-5">
        {/* Left Column — Question Submission Form */}
        <div className="lg:col-span-3">
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
            {status === 'success' ? (
              <div className="flex flex-col items-center text-center py-8 space-y-4">
                <CheckCircle className="h-14 w-14 text-green-600" />
                <h2 className="text-2xl font-bold text-[#0D2B1E]">Question Submitted!</h2>
                <p className="max-w-md text-neutral-600">
                  Thank you, {firstName}. Your question has been submitted and may be featured in
                  Friday&apos;s video. We&apos;ll post the answer on our YouTube channel at{' '}
                  youtube.com/@seqsolution
                </p>
                <a
                  href="https://www.youtube.com/@seqsolution"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-[#C9A84C] font-medium hover:underline"
                >
                  Watch Past Q&A Videos
                  <ExternalLink className="h-4 w-4" />
                </a>
                <button
                  onClick={resetForm}
                  className="mt-4 rounded-lg bg-[#0D2B1E] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#164A33] transition-colors"
                >
                  Submit Another Question
                </button>
              </div>
            ) : (
              <>
                <h2 className="text-xl font-semibold text-[#0D2B1E] mb-5">Submit a Question</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Question */}
                  <div>
                    <label htmlFor="question" className="block text-sm font-medium text-neutral-700 mb-1">
                      What question would you like us to cover in Friday&apos;s video?
                    </label>
                    <textarea
                      id="question"
                      rows={4}
                      required
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      placeholder="Ask anything about our products, compensation plan, how to find clients, or how to grow your team..."
                      className={inputClasses}
                    />
                  </div>

                  {/* First Name */}
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-neutral-700 mb-1">
                      First Name
                    </label>
                    <input
                      id="firstName"
                      type="text"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className={inputClasses}
                    />
                  </div>

                  {/* Last Name */}
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-neutral-700 mb-1">
                      Last Name
                    </label>
                    <input
                      id="lastName"
                      type="text"
                      required
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className={inputClasses}
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-1">
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={inputClasses}
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="inline-flex items-center gap-2 rounded-lg bg-[#0D2B1E] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#164A33] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {status === 'loading' ? (
                      <>
                        <svg
                          className="h-4 w-4 animate-spin"
                          viewBox="0 0 24 24"
                          fill="none"
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
                            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                          />
                        </svg>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        Submit Question
                      </>
                    )}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>

        {/* Right Column — Schedule & Past Videos */}
        <div className="lg:col-span-2 space-y-6">
          {/* Schedule Card */}
          <div className="rounded-2xl bg-[#0D2B1E] text-white p-6 space-y-4">
            <h3 className="text-lg font-semibold">Q&A Schedule</h3>

            <div className="space-y-3 text-sm">
              <div>
                <span className="block text-[#C9A84C] font-medium">Next Q&A Recording</span>
                <span>This Friday</span>
              </div>
              <div>
                <span className="block text-[#C9A84C] font-medium">Posted to YouTube</span>
                <span>Every Friday</span>
              </div>
              <div>
                <span className="block text-[#C9A84C] font-medium">YouTube Channel</span>
                <span>@seqsolution</span>
              </div>
            </div>

            <a
              href="https://www.youtube.com/@seqsolution"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-2 rounded-lg bg-[#C9A84C] px-5 py-2.5 text-sm font-semibold text-[#0D2B1E] hover:bg-[#b8963f] transition-colors"
            >
              <PlayCircle className="h-4 w-4" />
              Watch on YouTube
            </a>
          </div>

          {/* Past Q&A Videos */}
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-[#0D2B1E] mb-4">Past Q&A Videos</h3>

            <ul className="space-y-3">
              {pastVideos.map((video) => (
                <li key={video.title}>
                  <a
                    href="https://www.youtube.com/@seqsolution"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-start justify-between gap-2 rounded-lg p-2 -mx-2 hover:bg-neutral-50 transition-colors"
                  >
                    <div>
                      <p className="text-sm font-medium text-neutral-800 group-hover:text-[#0D2B1E]">
                        {video.title}
                      </p>
                      <p className="text-xs text-neutral-500">{video.date}</p>
                    </div>
                    <ExternalLink className="mt-0.5 h-4 w-4 flex-shrink-0 text-neutral-400 group-hover:text-[#C9A84C]" />
                  </a>
                </li>
              ))}
            </ul>

            <p className="mt-4 text-xs text-neutral-500">
              New videos are posted every Friday. Subscribe to the channel to be notified.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
