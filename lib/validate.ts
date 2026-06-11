/**
 * Input validation for the analyze endpoint
 */

import { AnalyzeRequest, ValidationError } from './types';

export function validateAnalyzeRequest(body: unknown): { valid: true; data: AnalyzeRequest } | { valid: false; error: ValidationError } {
  // Check if body is an object
  if (!body || typeof body !== 'object') {
    return {
      valid: false,
      error: { error: 'Invalid request body', details: 'Request must be a JSON object' },
    };
  }

  const data = body as Record<string, unknown>;

  // Check for required fields
  if (typeof data.notes !== 'string') {
    return {
      valid: false,
      error: { error: 'Missing field: notes', details: 'notes must be a non-empty string' },
    };
  }

  // Validate notes length
  if (data.notes.trim().length < 20) {
    return {
      valid: false,
      error: { error: 'Notes too short', details: 'Meeting notes must be at least 20 characters' },
    };
  }

  // meetingTitle is optional
  const meetingTitle = typeof data.meetingTitle === 'string' ? data.meetingTitle : '';

  return {
    valid: true,
    data: {
      meetingTitle,
      notes: data.notes,
    },
  };
}
