/**
 * POST /api/analyze - Meeting note analyzer endpoint
 * Uses Hono for routing and request handling
 */

import { Hono } from 'hono';
import { handle } from 'hono/vercel';
import { analyzeNotes } from '@/lib/analyzer';
import { validateAnalyzeRequest } from '@/lib/validate';
import type { AnalyzeRequest, AnalyzeResponse, ValidationError } from '@/lib/types';

const app = new Hono().basePath('/api/analyze');

/**
 * POST handler: Accepts meeting notes and returns structured analysis
 */
app.post('/', async (c) => {
  try {
    // Parse and validate request body
    const body = await c.req.json().catch(() => ({}));
    const validation = validateAnalyzeRequest(body);

    if (!validation.valid) {
      return c.json(validation.error as ValidationError, { status: 400 });
    }

    const request: AnalyzeRequest = validation.data;

    // Analyze the meeting notes
    const analysis: AnalyzeResponse = await analyzeNotes(request);

    // Return structured response
    return c.json(analysis, { status: 200 });
  } catch (error) {
    console.error('Error analyzing meeting notes:', error);
    return c.json(
      { error: 'Internal server error', details: 'An unexpected error occurred while analyzing the meeting notes' },
      { status: 500 }
    );
  }
});

/**
 * Health check endpoint
 */
app.get('/', (c) => {
  return c.json({
    status: 'ok',
    message: 'AI Meeting Action Extractor API is running',
    endpoint: 'POST /api/analyze',
  });
});

// Export handler for Next.js
export const POST = handle(app);
export const GET = handle(app);
