# AI Meeting Action Extractor

Turn messy meeting notes into clear next steps.

A free tool for Ellevelle Consulting that helps small businesses, nonprofits, healthcare practices, and operations teams transform meeting transcripts into structured action plans.

## Features

- **Meeting Summary**: Quick overview of what was discussed
- **Key Decisions**: Confirmed decisions extracted from the transcript
- **Action Items**: Tasks with assigned owner and due date (when available)
- **Risks & Blockers**: Potential issues or obstacles identified
- **Open Questions**: Unresolved items for follow-up
- **Follow-up Email**: Professional draft email summarizing the meeting

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Backend**: Hono API
- **Containerization**: Docker
- **Package Manager**: NPM

## Project Setup

### Prerequisites

- Node.js 20+
- NPM 10+
- Docker (optional, for containerized deployment)

### Installation

```bash
# Clone the repository
git clone https://github.com/rwolfe-elv/ai-meeting-action-extractor.git
cd ai-meeting-action-extractor

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local and add your AI_API_KEY if using an LLM
```

### Development

```bash
# Run the development server
npm run dev

# Open http://localhost:3000 in your browser
```

### Build for Production

```bash
# Build the application
npm run build

# Start the production server
npm start
```

## Docker Deployment

Build and run the Docker image:

```bash
# Build the image
docker build -t ai-meeting-extractor .

# Run the container
docker run -p 3000:3000 ai-meeting-extractor
```

The app will be available at `http://localhost:3000`.

## API

### POST `/api/analyze`

Extracts structured action items from meeting notes.

**Request:**
```json
{
  "meetingTitle": "Q2 Planning Session",
  "notes": "..."
}
```

**Response:**
```json
{
  "summary": "...",
  "decisions": ["..."],
  "actionItems": [
    {
      "owner": "Name",
      "task": "Task description",
      "dueDate": "2024-06-30" or null
    }
  ],
  "risks": ["..."],
  "openQuestions": ["..."],
  "followUpEmail": "..."
}
```

## Development Notes

- Meeting notes must be at least 20 characters
- Owners default to "Unassigned" if unclear
- Due dates are optional (returns `null` if not detected)
- The app uses mock analysis for demo purposes; integrate a real LLM by updating `analyzeNotes()` in the backend

## Future Enhancements

- OpenAI / Claude integration
- User authentication
- Meeting history and archive
- Slack integration
- Email delivery
- Customizable templates

## License

Built for Ellevelle Consulting.
