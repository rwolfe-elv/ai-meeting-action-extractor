'use client';

import { useState } from 'react';

export default function AnalyzerForm() {
  const [meetingTitle, setMeetingTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    summary: string;
    decisions: string[];
    actionItems: Array<{ owner: string; task: string; dueDate: string | null }>;
    risks: string[];
    openQuestions: string[];
    followUpEmail: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResult(null);
    setLoading(true);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ meetingTitle, notes }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to analyze meeting notes');
      }

      const data: AnalyzeResponse = await response.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 mb-4">
            AI Meeting Action Extractor
          </h1>
          <p className="text-xl text-slate-300 font-light">
            Transform meeting notes into clear, actionable insights.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="bg-slate-800 rounded-2xl shadow-2xl border border-slate-700 p-8 backdrop-blur-sm">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Meeting Title Input */}
              <div>
                <label htmlFor="title" className="block text-sm font-semibold text-slate-200 mb-3">
                  Meeting Title <span className="text-slate-500 font-normal">(optional)</span>
                </label>
                <input
                  id="title"
                  type="text"
                  placeholder="e.g., Q2 Planning Session"
                  value={meetingTitle}
                  onChange={(e) => setMeetingTitle(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
                <p className="text-xs text-slate-400 mt-2">Leave blank to auto-generate from notes</p>
              </div>

              {/* Meeting Notes Textarea */}
              <div>
                <label htmlFor="notes" className="block text-sm font-semibold text-slate-200 mb-3">
                  Meeting Notes / Transcript <span className="text-red-400">*</span>
                </label>
                <textarea
                  id="notes"
                  placeholder="Paste your meeting transcript or notes here. Include as much detail as possible for better analysis..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={10}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all duration-200"
                />
                <p className="text-xs text-slate-400 mt-2">
                  {notes.length}/20 characters required • {notes.trim().length < 20 ? '🔴 Too short' : '🟢 Ready'}
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-900/30 border border-red-700 rounded-lg p-4 backdrop-blur-sm">
                  <p className="text-sm text-red-200">⚠️ {error}</p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || notes.trim().length < 20}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 disabled:from-slate-600 disabled:to-slate-600 text-white font-bold py-4 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:hover:scale-100 shadow-lg"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Analyzing your meeting...
                  </span>
                ) : (
                  <span>Extract Action Plan</span>
                )}
              </button>
            </form>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {loading && (
              <div className="bg-blue-900/30 border border-blue-700 rounded-2xl p-8 text-center backdrop-blur-sm">
                <div className="flex justify-center mb-4">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-t-2 border-blue-400"></div>
                </div>
                <p className="text-blue-200 font-medium">Analyzing your meeting notes...</p>
              </div>
            )}

            {result && !loading && (
              <div className="space-y-6 overflow-y-auto max-h-[800px] pr-4">
                {/* Meeting Title Display */}
                <div className="bg-gradient-to-r from-blue-900/50 to-cyan-900/50 rounded-xl border border-blue-700 p-6 backdrop-blur-sm">
                  <h2 className="text-2xl font-bold text-blue-200">{result.meetingTitle}</h2>
                </div>

                {/* Summary Card */}
                <div className="bg-slate-800 rounded-xl shadow-lg border border-slate-700 p-6 backdrop-blur-sm hover:border-slate-600 transition-colors duration-200">
                  <h3 className="text-lg font-bold text-slate-100 mb-3 flex items-center">
                    <span className="w-2 h-2 bg-blue-400 rounded-full mr-3"></span>
                    Summary
                  </h3>
                  <p className="text-slate-300 leading-relaxed">{result.summary}</p>
                </div>

                {/* Decisions Card */}
                {result.decisions.length > 0 && (
                  <div className="bg-slate-800 rounded-xl shadow-lg border border-slate-700 p-6 backdrop-blur-sm hover:border-slate-600 transition-colors duration-200">
                    <h3 className="text-lg font-bold text-slate-100 mb-4 flex items-center">
                      <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
                      Key Decisions
                    </h3>
                    <ul className="space-y-3">
                      {result.decisions.map((decision, idx) => (
                        <li key={idx} className="flex items-start">
                          <span className="text-green-400 mr-3 font-bold text-lg">✓</span>
                          <span className="text-slate-300">{decision}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Action Items Card */}
                {result.actionItems.length > 0 && (
                  <div className="bg-slate-800 rounded-xl shadow-lg border border-slate-700 p-6 backdrop-blur-sm hover:border-slate-600 transition-colors duration-200">
                    <h3 className="text-lg font-bold text-slate-100 mb-4 flex items-center">
                      <span className="w-2 h-2 bg-purple-400 rounded-full mr-3"></span>
                      Action Items
                    </h3>
                    <div className="space-y-4">
                      {result.actionItems.map((item, idx) => (
                        <div key={idx} className="border-l-4 border-purple-500 bg-slate-700/50 rounded pl-4 py-3 pr-4">
                          <p className="font-semibold text-slate-100">{item.task}</p>
                          <div className="flex flex-col gap-1 text-sm text-slate-300 mt-2">
                            <span>👤 <strong>Owner:</strong> {item.owner}</span>
                            {item.dueDate && <span>📅 <strong>Due:</strong> {item.dueDate}</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Risks Card */}
                {result.risks.length > 0 && (
                  <div className="bg-slate-800 rounded-xl shadow-lg border border-slate-700 p-6 backdrop-blur-sm hover:border-slate-600 transition-colors duration-200">
                    <h3 className="text-lg font-bold text-slate-100 mb-4 flex items-center">
                      <span className="w-2 h-2 bg-orange-400 rounded-full mr-3"></span>
                      Risks & Blockers
                    </h3>
                    <ul className="space-y-3">
                      {result.risks.map((risk, idx) => (
                        <li key={idx} className="flex items-start">
                          <span className="text-orange-400 mr-3 font-bold text-lg">⚠</span>
                          <span className="text-slate-300">{risk}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Open Questions Card */}
                {result.openQuestions.length > 0 && (
                  <div className="bg-slate-800 rounded-xl shadow-lg border border-slate-700 p-6 backdrop-blur-sm hover:border-slate-600 transition-colors duration-200">
                    <h3 className="text-lg font-bold text-slate-100 mb-4 flex items-center">
                      <span className="w-2 h-2 bg-amber-400 rounded-full mr-3"></span>
                      Open Questions
                    </h3>
                    <ul className="space-y-3">
                      {result.openQuestions.map((question, idx) => (
                        <li key={idx} className="flex items-start">
                          <span className="text-amber-400 mr-3 font-bold text-lg">?</span>
                          <span className="text-slate-300">{question}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Follow-up Email Card */}
                {result.followUpEmail && (
                  <div className="bg-slate-700/50 rounded-xl shadow-lg border border-slate-600 p-6 backdrop-blur-sm hover:border-slate-500 transition-colors duration-200">
                    <h3 className="text-lg font-bold text-slate-100 mb-4 flex items-center">
                      <span className="w-2 h-2 bg-indigo-400 rounded-full mr-3"></span>
                      Follow-up Email Draft
                    </h3>
                    <pre className="text-sm text-slate-300 whitespace-pre-wrap font-mono bg-slate-800 p-4 rounded-lg border border-slate-600 overflow-auto max-h-64 leading-relaxed">
                      {result.followUpEmail}
                    </pre>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center border-t border-slate-700 mt-16 pt-8">
          <p className="text-slate-400 text-sm">
            Built by <span className="font-semibold text-slate-300">Ellevelle Consulting</span>
          </p>
        </div>
      </div>
    </div>
  );
}
