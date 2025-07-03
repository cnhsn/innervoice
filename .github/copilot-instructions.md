# InnerVoice Project - Copilot Instructions

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Project Overview
This is a Next.js web application called "InnerVoice" that helps users receive personalized quotes and comforting letters based on their personal information and mood.

## Key Features
- User form with fields: Name, Surname, Date of Birth, Mood (dropdown with "Other" option)
- AI-powered quote generation from historical figures
- AI-powered comforting letter generation
- Integration with OpenRouter APIs
- Environment variable management for API configurations

## Technology Stack
- Next.js 15+ with App Router
- TypeScript
- Tailwind CSS
- React Hook Form for form handling
- OpenRouter API integration

## Code Style Guidelines
- Use TypeScript for all components and utilities
- Follow Next.js App Router patterns
- Use Tailwind CSS for styling
- Implement proper error handling for API calls
- Use environment variables for sensitive data like API keys
- Follow React best practices with hooks and state management

## API Integration
- Use OpenRouter APIs for AI functionality
- Implement proper error handling and loading states
- Store API keys and model configurations in .env.local
- Create reusable API utility functions

## Form Handling
- Use controlled components for form inputs
- Implement proper form validation
- Handle dropdown with "Other" option elegantly
- Provide good user feedback during form submission
