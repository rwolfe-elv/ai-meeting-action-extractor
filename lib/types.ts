/**
 * Request and response types for the meeting analysis API
 */

export interface AnalyzeRequest {
  meetingTitle: string;
  notes: string;
}

export interface ActionItem {
  owner: string;
  task: string;
  dueDate: string | null;
}

export interface AnalyzeResponse {
  summary: string;
  decisions: string[];
  actionItems: ActionItem[];
  risks: string[];
  openQuestions: string[];
  followUpEmail: string;
}

export interface ValidationError {
  error: string;
  details?: string;
}
