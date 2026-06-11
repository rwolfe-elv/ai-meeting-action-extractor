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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-slate-900 mb-2">
            AI Meeting Action Extractor
          </h1>
          <p className="text-xl text-slate-600">
            Turn messy meeting notes into clear next steps.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Form Section */}
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Meeting Title Input */}
              <div>
                <label htmlFor="title" className="block text-sm font-semibold text-slate-700 mb-2">
                  Meeting Title
                </label>
                <input
                  id="title"
                  type="text"
                  placeholder="e.g., Q2 Planning Session"
                  value={meetingTitle}
                  onChange={(e) => setMeetingTitle(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Meeting Notes Textarea */}
              <div>
                <label htmlFor="notes" className="block text-sm font-semibold text-slate-700 mb-2">
                  Meeting Notes / Transcript *
                </label>
                <textarea
                  id="notes"
                  placeholder="Paste your meeting transcript or notes here. Include as much detail as possible..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={8}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
                <p className="text-xs text-slate-500 mt-1">Minimum 20 characters required</p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || notes.trim().length < 20}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200"
              >
                {loading ? 'Extracting...' : 'Extract Action Plan'}
              </button>
            </form>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {loading && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 text-center">
                <div className="inline-block">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-3"></div>
                </div>
                <p className="text-blue-700 font-medium">Analyzing your meeting notes...</p>
              </div>
            )}

            {result && !loading && (
              <div className="space-y-6">
                {/* Summary Card */}
                <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-3">Summary</h3>
                  <p className="text-slate-700">{result.summary}</p>
                </div>

                {/* Decisions Card */}
                {result.decisions.length > 0 && (
                  <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
                    <h3 className="text-lg font-semibold text-slate-900 mb-3">Key Decisions</h3>
                    <ul className="space-y-2">
                      {result.decisions.map((decision, idx) => (
                        <li key={idx} className="flex items-start">
                          <span className="text-green-600 mr-3 font-bold">✓</span>
                          <span className="text-slate-700">{decision}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Action Items Card */}
                {result.actionItems.length > 0 && (
                  <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">Action Items</h3>
                    <div className="space-y-3">
                      {result.actionItems.map((item, idx) => (
                        <div key={idx} className="border-l-4 border-blue-500 pl-4 py-2">
                          <p className="font-semibold text-slate-900">{item.task}</p>
                          <div className="flex justify-between text-sm text-slate-600 mt-1">
                            <span>Owner: <strong>{item.owner}</strong></span>
                            {item.dueDate && <span>Due: <strong>{item.dueDate}</strong></span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Risks Card */}
                {result.risks.length > 0 && (
                  <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
                    <h3 className="text-lg font-semibold text-slate-900 mb-3">Risks & Blockers</h3>
                    <ul className="space-y-2">
                      {result.risks.map((risk, idx) => (
                        <li key={idx} className="flex items-start">
                          <span className="text-orange-600 mr-3 font-bold">⚠</span>
                          <span className="text-slate-700">{risk}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Open Questions Card */}
                {result.openQuestions.length > 0 && (
                  <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
                    <h3 className="text-lg font-semibold text-slate-900 mb-3">Open Questions</h3>
                    <ul className="space-y-2">
                      {result.openQuestions.map((question, idx) => (
                        <li key={idx} className="flex items-start">
                          <span className="text-purple-600 mr-3 font-bold">?</span>
                          <span className="text-slate-700">{question}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Follow-up Email Card */}
                {result.followUpEmail && (
                  <div className="bg-slate-50 rounded-lg shadow-sm border border-slate-200 p-6">
                    <h3 className="text-lg font-semibold text-slate-900 mb-3">Follow-up Email Draft</h3>
                    <pre className="text-sm text-slate-700 whitespace-pre-wrap font-mono bg-white p-4 rounded border border-slate-300 overflow-auto max-h-60">
                      {result.followUpEmail}
                    </pre>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center border-t border-slate-200 pt-8">
          <p className="text-slate-600 text-sm">
            Built by <span className="font-semibold">Ellevelle Consulting</span>
          </p>
        </div>
      </div>
    </div>
  );
}
