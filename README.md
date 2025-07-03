# InnerVoice

A Next.js web application that provides personalized quotes from historical figures and comforting letters based on user input and mood.

## Features

- **Personal Form**: Collect user's name, surname, date of birth, and current mood
- **AI-Powered Quotes**: Generate inspirational quotes from well-known historical figures
- **Comforting Letters**: Create personalized, empathetic letters for emotional support
- **OpenRouter Integration**: Uses OpenRouter APIs for AI functionality
- **Beautiful UI**: Modern, responsive design with Tailwind CSS
- **Form Validation**: Robust form validation with Zod and React Hook Form

## Tech Stack

- **Next.js 15+** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **React Hook Form** with Zod validation
- **OpenRouter API** for AI functionality
- **Lucide React** for icons

## Getting Started

### Prerequisites

- Node.js 18+ installed
- OpenRouter API key

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd innervoice
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Edit `.env.local` and add your OpenRouter API key:
```env
OPENROUTER_API_KEY=your_openrouter_api_key_here
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

| Variable | Description | Default Value |
|----------|-------------|---------------|
| `OPENROUTER_API_KEY` | Your OpenRouter API key | Required |
| `OPENROUTER_BASE_URL` | OpenRouter API base URL | `https://openrouter.ai/api/v1` |
| `OPENROUTER_MODEL_QUOTE` | Model for quote generation | `anthropic/claude-3-haiku:beta` |
| `OPENROUTER_MODEL_LETTER` | Model for letter generation | `anthropic/claude-3-haiku:beta` |

## How It Works

1. **User Input**: Users fill out a form with their personal information and current mood
2. **API Processing**: The form data is sent to the OpenRouter API via our Next.js API route
3. **AI Generation**: Two separate AI requests generate:
   - An inspirational quote from a historical figure
   - A personalized comforting letter
4. **Results Display**: Both the quote and letter are displayed in a beautiful, readable format

## API Routes

- `POST /api/generate` - Generates quotes and letters based on user input

## Project Structure

```
src/
├── app/
│   ├── api/generate/     # API route for AI generation
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home page
├── components/
│   └── UserForm.tsx      # Main form component
├── lib/
│   ├── openrouter.ts     # OpenRouter API client
│   └── validation.ts     # Form validation schemas
└── types/
    └── index.ts          # TypeScript type definitions
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

If you encounter any issues or have questions, please open an issue on GitHub.
