# InnerVoice

A Next.js web application that provides personalized quotes from historical figures, comforting letters, and interactive chat with your AI-powered inner voice, all based on your personal information and current mood.

## Features

### 🎭 Core Functionality
- **Personal Form**: Collect user's name, surname, date of birth, and current mood
- **AI-Powered Quotes**: Generate inspirational quotes from well-known historical figures
- **Comforting Letters**: Create personalized, empathetic letters for emotional support
- **Interactive Chat**: Real-time conversation with your AI-powered "Inner Voice"

### 🌍 Internationalization
- **Dual Language Support**: Full English and Turkish localization
- **Language Switcher**: Seamless switching between languages
- **Localized AI Responses**: AI generates content in the selected language
- **Translated Mood Options**: All mood selections properly translated

### 🎨 User Experience
- **Beautiful UI**: Modern, responsive design with Tailwind CSS
- **Animated Gradients**: Eye-catching animated backgrounds in chat modal
- **Always-Visible Actions**: Chat and generate buttons always accessible when form is valid
- **Form Validation**: Robust form validation with Zod and React Hook Form
- **Loading States**: Smooth loading indicators and user feedback

### 🔧 Technical Features
- **OpenRouter Integration**: Uses OpenRouter APIs for AI functionality
- **Context-Aware Chat**: AI remembers conversation history and user context
- **Improved JSON Parsing**: Robust parsing with fallback mechanisms
- **Error Handling**: Comprehensive error handling throughout the application

## Tech Stack

- **Next.js 15+** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling and animations
- **React Hook Form** with Zod validation
- **OpenRouter API** for AI functionality
- **React Context** for language management
- **Lucide React** for icons

## Getting Started

### Prerequisites

- Node.js 18+ installed
- OpenRouter API key

### Installation

1. Clone the repository:
```bash
git clone [<repository-url>](https://github.com/cnhsn/innervoice.git)
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

### 1. User Input & Language Selection
- Users select their preferred language (English/Turkish)
- Fill out a form with personal information and current mood
- All form validation and labels adapt to the selected language

### 2. AI Content Generation
- Form data is sent to OpenRouter API via Next.js API routes
- Three types of AI-powered content are generated:
  - **Inspirational Quote**: From a historical figure relevant to the user's mood
  - **Personalized Letter**: A comforting, empathetic letter addressing their situation
  - **Chat Responses**: Real-time conversational responses as their "Inner Voice"

### 3. Interactive Features
- **Results Display**: Quote and letter shown in beautiful, readable format
- **Live Chat**: Users can engage in ongoing conversation with their AI Inner Voice
- **Context Awareness**: Chat AI remembers user details and conversation history
- **Language Consistency**: All AI responses maintain the selected language

### 4. Enhanced User Experience
- **Persistent Language**: Language preference is saved across sessions
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Smooth Animations**: Animated gradients and transitions enhance the experience
- **Always Available**: Key actions remain accessible when form is complete

## API Routes

- `POST /api/generate` - Generates quotes and letters based on user input
- `POST /api/chat` - Handles real-time chat conversations with the AI Inner Voice

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── generate/     # API route for quotes & letters
│   │   └── chat/         # API route for chat functionality
│   ├── layout.tsx        # Root layout with language provider
│   └── page.tsx          # Home page
├── components/
│   ├── UserForm.tsx      # Main form component
│   ├── ChatWindow.tsx    # Interactive chat modal
│   └── LanguageSwitcher.tsx # Language selection component
├── lib/
│   ├── openrouter.ts     # OpenRouter API client with chat support
│   ├── validation.ts     # Form validation schemas
│   ├── translations.ts   # Language translations
│   └── language-context.tsx # Language context provider
└── types/
    └── index.ts          # TypeScript type definitions
```

## Available Languages

- **English (EN)**: Full support with English AI responses
- **Turkish (TR)**: Complete Turkish localization including:
  - Form labels and validation messages
  - Mood options and custom mood input
  - AI-generated quotes, letters, and chat responses
  - User interface elements and buttons

## Chat Features

The interactive chat feature allows users to:
- Have ongoing conversations with their AI "Inner Voice"
- Get contextual responses based on their form data and mood
- Maintain conversation history within the session
- Switch languages and continue chatting seamlessly
- Receive empathetic, personalized support in real-time

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the Apache 2.0 License.

## Support

If you encounter any issues or have questions, please open an issue on GitHub.
