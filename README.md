# Node.js AI Backend

A modern Node.js backend project with AI capabilities, built with JavaScript and Express. Works out of the box with mock AI responses - no API keys required!

## Features

- 🤖 AI chat completions (with mock or OpenAI)
- 📝 Text generation
- 😊 Sentiment analysis
- 📄 Text summarization
- ⚡ Express.js for RESTful API
- 🔒 Input validation with Zod
- 🎭 Mock AI service (works without API keys)
- 🔄 Automatic fallback to mock if OpenAI fails
- 🚀 Optimized performance with caching and rate limiting

## Prerequisites

- Node.js 18+ 
- npm or yarn
- OpenAI API key (optional - mock service works without it)

## Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. (Optional) Create a `.env` file for custom configuration:
```bash
PORT=3000
NODE_ENV=development
# OPENAI_API_KEY=your_key_here  # Optional - set only if you want real AI
```

**That's it!** The project works immediately with mock AI responses. No complex setup required.

## Usage

### Development
```bash
npm run dev
```

### Production
```bash
npm start
```

The server will start on `http://localhost:3000` (or the port specified in your `.env` file).

## API Endpoints

### Health Check
```
GET /health
```

### Chat Completion
```
POST /api/ai/chat
Body: {
  "messages": [
    { "role": "user", "content": "Hello!" }
  ]
}
```

### Text Generation
```
POST /api/ai/generate
Body: {
  "prompt": "Write a short story about a robot",
  "systemPrompt": "You are a creative writer" // optional
}
```

### Sentiment Analysis
```
POST /api/ai/sentiment
Body: {
  "text": "I love this product!"
}
```

### Text Summarization
```
POST /api/ai/summarize
Body: {
  "text": "Long text to summarize...",
  "maxLength": 100 // optional, default 100
}
```

### User Management
```
GET    /api/users        # Get all users
GET    /api/users/:id    # Get user by ID
POST   /api/users        # Create user
PUT    /api/users/:id    # Update user
DELETE /api/users/:id    # Delete user
```

## Project Structure

```
backend-ai/
├── src/
│   ├── config/
│   │   └── env.js          # Environment configuration
│   ├── controllers/
│   │   ├── ai.controller.js
│   │   └── user.controller.js
│   ├── middleware/
│   │   ├── errorHandler.js
│   │   ├── rateLimiter.js
│   │   ├── requestLogger.js
│   │   └── validator.js
│   ├── models/
│   │   └── User.model.js
│   ├── routes/
│   │   ├── ai.routes.js
│   │   ├── user.routes.js
│   │   └── index.js
│   ├── services/
│   │   ├── ai.service.js
│   │   └── cache.service.js
│   ├── utils/
│   │   ├── errors.js
│   │   ├── logger.js
│   │   ├── rateLimiter.js
│   │   ├── response.js
│   │   └── validation.js
│   └── index.js            # Application entry point
├── package.json
└── README.md
```

## Scripts

- `npm run dev` - Start development server
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix linting errors automatically
- `npm run format` - Format code with Prettier
- `npm test` - Run tests
- `npm run seed` - Seed database with sample data
- `npm run health-check` - Run health check script

## Using Real AI (Optional)

To use OpenAI instead of mock responses:

1. Get an OpenAI API key from [OpenAI](https://platform.openai.com/)
2. Add it to your `.env` file:
   ```
   OPENAI_API_KEY=sk-your-key-here
   ```
3. Restart the server

The service will automatically detect the API key and use OpenAI. If the API key is missing or invalid, it will gracefully fall back to mock responses.

## License

MIT
