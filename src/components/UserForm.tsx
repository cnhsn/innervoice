'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { userFormSchema, UserFormData } from '@/lib/validation';
import { AIResponse } from '@/types';
import { Loader2, Heart, Quote, MessageCircle } from 'lucide-react';
import ChatWindow from './ChatWindow';

const MOOD_OPTIONS = [
  { value: 'happy', label: 'Happy' },
  { value: 'sad', label: 'Sad' },
  { value: 'anxious', label: 'Anxious' },
  { value: 'stressed', label: 'Stressed' },
  { value: 'excited', label: 'Excited' },
  { value: 'confused', label: 'Confused' },
  { value: 'lonely', label: 'Lonely' },
  { value: 'grateful', label: 'Grateful' },
  { value: 'angry', label: 'Angry' },
  { value: 'hopeful', label: 'Hopeful' },
  { value: 'other', label: 'Other' },
];

export default function UserForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<AIResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [formData, setFormData] = useState<UserFormData | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<UserFormData>({
    resolver: zodResolver(userFormSchema),
  });

  const selectedMood = watch('mood');

  const onSubmit = async (data: UserFormData) => {
    setIsLoading(true);
    setError(null);
    setResponse(null);
    setFormData(data); // Store form data for chat functionality

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to generate response');
      }

      const aiResponse: AIResponse = await res.json();
      setResponse(aiResponse);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewSubmission = () => {
    setResponse(null);
    setError(null);
    setFormData(null);
    reset();
  };

  const handleChatOpen = () => {
    if (formData) {
      setIsChatOpen(true);
    }
  };

  const handleChatFromForm = () => {
    const currentFormData = watch(); // Get current form values
    if (currentFormData.name && currentFormData.surname && currentFormData.dateOfBirth && currentFormData.mood) {
      const validFormData: UserFormData = {
        name: currentFormData.name,
        surname: currentFormData.surname,
        dateOfBirth: currentFormData.dateOfBirth,
        mood: currentFormData.mood,
        customMood: currentFormData.customMood,
      };
      setFormData(validFormData);
      setIsChatOpen(true);
    }
  };

  const isFormValidForChat = () => {
    const currentFormData = watch();
    return currentFormData.name && currentFormData.surname && currentFormData.dateOfBirth && currentFormData.mood;
  };

  if (response) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Your InnerVoice</h1>
            <p className="text-gray-600">Here&apos;s what we have for you today</p>
          </div>

          <div className="space-y-8">
            {/* Quote Section */}
            <div className="bg-white rounded-lg shadow-lg p-8 border-l-4 border-purple-500">
              <div className="flex items-start space-x-4">
                <Quote className="text-purple-500 mt-1 flex-shrink-0" size={24} />
                <div>
                  <h2 className="text-2xl font-semibold text-gray-800 mb-4">Inspirational Quote</h2>
                  <blockquote className="text-lg text-gray-700 italic mb-4 leading-relaxed">
                    &ldquo;{response.quote.text}&rdquo;
                  </blockquote>
                  <cite className="text-purple-600 font-medium">— {response.quote.author}</cite>
                </div>
              </div>
            </div>

            {/* Letter Section */}
            <div className="bg-white rounded-lg shadow-lg p-8 border-l-4 border-pink-500">
              <div className="flex items-start space-x-4">
                <Heart className="text-pink-500 mt-1 flex-shrink-0" size={24} />
                <div>
                  <h2 className="text-2xl font-semibold text-gray-800 mb-4">A Letter for You</h2>
                  <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {response.letter.content}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-8 space-y-4">
            <button
              onClick={handleChatOpen}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3 rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center space-x-2 mx-auto"
            >
              <MessageCircle size={20} />
              <span>Chat with Your Inner Voice</span>
            </button>
            <button
              onClick={handleNewSubmission}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Create Another
            </button>
          </div>
        </div>

        {/* Chat Window */}
        {formData && (
          <ChatWindow
            isOpen={isChatOpen}
            onClose={() => setIsChatOpen(false)}
            userContext={formData}
          />
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">InnerVoice</h1>            <p className="text-gray-600">Share a bit about yourself and receive personalized wisdom and comfort</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                First Name
              </label>
              <input
                {...register('name')}
                type="text"
                id="name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400"
                placeholder="Enter your first name"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            {/* Surname */}
            <div>
              <label htmlFor="surname" className="block text-sm font-medium text-gray-700 mb-2">
                Last Name
              </label>
              <input
                {...register('surname')}
                type="text"
                id="surname"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400"
                placeholder="Enter your last name"
              />
              {errors.surname && (
                <p className="mt-1 text-sm text-red-600">{errors.surname.message}</p>
              )}
            </div>

            {/* Date of Birth */}
            <div>
              <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-2">
                Date of Birth
              </label>
              <input
                {...register('dateOfBirth')}
                type="date"
                id="dateOfBirth"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-gray-900"
              />
              {errors.dateOfBirth && (
                <p className="mt-1 text-sm text-red-600">{errors.dateOfBirth.message}</p>
              )}
            </div>

            {/* Mood */}
            <div>
              <label htmlFor="mood" className="block text-sm font-medium text-gray-700 mb-2">
                How are you feeling today?
              </label>
              <select
                {...register('mood')}
                id="mood"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-gray-900"
              >
                <option value="">Select your mood</option>
                {MOOD_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors.mood && (
                <p className="mt-1 text-sm text-red-600">{errors.mood.message}</p>
              )}
            </div>

            {/* Custom Mood */}
            {selectedMood === 'other' && (
              <div>
                <label htmlFor="customMood" className="block text-sm font-medium text-gray-700 mb-2">
                  Please describe how you&apos;re feeling
                </label>
                <input
                  {...register('customMood')}
                  type="text"
                  id="customMood"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400"
                  placeholder="Describe your current mood"
                />
                {errors.customMood && (
                  <p className="mt-1 text-sm text-red-600">{errors.customMood.message}</p>
                )}
              </div>
            )}

            {/* Chat Button - Always visible */}
            <button
              type="button"
              onClick={handleChatFromForm}
              disabled={!isFormValidForChat()}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 focus:ring-4 focus:ring-indigo-300 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <MessageCircle size={20} />
              <span>Chat with Your Inner Voice</span>
            </button>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !isFormValidForChat()}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-6 rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 focus:ring-4 focus:ring-purple-300 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <Loader2 className="animate-spin" size={20} />
                  <span>Generating your InnerVoice...</span>
                </div>
              ) : (
                'Generate My InnerVoice'
              )}
            </button>
          </form>
        </div>
        
        {/* Chat Window */}
        {formData && (
          <ChatWindow
            isOpen={isChatOpen}
            onClose={() => setIsChatOpen(false)}
            userContext={formData}
          />
        )}
      </div>
    </div>
  );
}
