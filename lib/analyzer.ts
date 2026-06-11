/**
 * Meeting analyzer - processes notes and extracts structured information
 * Uses mock data for MVP; can be swapped with OpenAI/Claude API
 */

import { AnalyzeRequest, AnalyzeResponse } from './types';

/**
 * Builds the LLM prompt for meeting analysis
 * Instructs the model to return strict JSON only, no markdown
 */
export function buildAnalysisPrompt(request: AnalyzeRequest): string {
  return `You are an expert at turning meeting notes into actionable insights. 
Analyze the following meeting notes and extract structured information.

IMPORTANT: Return ONLY valid JSON. No markdown, no explanations, no code blocks.

Meeting Title: ${request.meetingTitle || 'Untitled Meeting'}

Meeting Notes:
${request.notes}

Return a JSON object with EXACTLY this structure (use null for missing data):
{
  "summary": "1-2 sentence summary of the meeting",
  "decisions": ["confirmed decision 1", "confirmed decision 2"],
  "actionItems": [
    {"owner": "Name or Unassigned", "task": "what needs to be done", "dueDate": "YYYY-MM-DD or null"}
  ],
  "risks": ["potential blocker 1", "potential blocker 2"],
  "openQuestions": ["unresolved question 1", "unresolved question 2"],
  "followUpEmail": "Professional warm-toned email summarizing the meeting"
}

Rules:
- Be concise but specific
- Do NOT invent names, due dates, or decisions not mentioned
- If owner is unclear, use "Unassigned"
- If due date is unclear, use null
- Separate confirmed decisions from open questions
- Do NOT include markdown in the followUpEmail`;
}

/**
 * Mock analyzer for MVP - simulates LLM analysis
 * Replace this function to integrate OpenAI, Claude, or another LLM
 */
export async function analyzeNotes(request: AnalyzeRequest): Promise<AnalyzeResponse> {
  // Simulate API latency
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Mock response based on the meeting title and notes
  const notes = request.notes.toLowerCase();
  const hasDeadline = notes.includes('deadline') || notes.includes('due') || notes.includes('friday');
  const hasRisks = notes.includes('risk') || notes.includes('concern') || notes.includes('problem');
  const hasQuestions = notes.includes('?') || notes.includes('clarify') || notes.includes('unclear');

  return {
    summary: `Meeting on "${request.meetingTitle}" to discuss project progress, upcoming deliverables, and team coordination.`,
    decisions: [
      'Team will proceed with current sprint priorities',
      'Weekly sync meetings will continue every Monday at 10 AM',
    ],
    actionItems: [
      {
        owner: 'Unassigned',
        task: 'Compile project status report for stakeholders',
        dueDate: hasDeadline ? '2024-06-21' : null,
      },
      {
        owner: 'Unassigned',
        task: 'Review meeting notes and confirm action items',
        dueDate: '2024-06-14',
      },
      {
        owner: 'Unassigned',
        task: 'Follow up on outstanding blockers from previous meeting',
        dueDate: null,
      },
    ],
    risks: hasRisks
      ? ['Resource constraints may impact timeline', 'Dependency on external vendor delivery']
      : ['No critical risks identified at this time'],
    openQuestions: hasQuestions
      ? ['Budget allocation for Q3 initiatives?', 'What is the timeline for the new feature rollout?']
      : ['All key items clarified during meeting'],
    followUpEmail: `Hi Team,

Thank you for attending today's meeting. Below is a summary of our discussion:

**Summary**: We reviewed project status and coordinated on upcoming deliverables.

**Key Decisions**:
• Proceeding with current sprint priorities
• Weekly syncs every Monday at 10 AM

**Action Items**:
• Compile project status report for stakeholders (unassigned)
• Review meeting notes (due June 14)
• Follow up on outstanding blockers

Please let me know if you have any questions or need clarification on these items.

Best regards`,
  };
}
