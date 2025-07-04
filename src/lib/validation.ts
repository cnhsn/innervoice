import { z } from 'zod';
import { Translations } from './translations';

export const createUserFormSchema = (t: Translations) => {
  return z.object({
    name: z.string().min(1, t.nameRequired).max(50, 'Name must be less than 50 characters'),
    surname: z.string().min(1, t.surnameRequired).max(50, 'Surname must be less than 50 characters'),
    dateOfBirth: z.string().min(1, t.dateRequired),
    mood: z.string().min(1, t.moodRequired),
    customMood: z.string().optional(),
  }).refine((data) => {
    if (data.mood === 'other' && (!data.customMood || data.customMood.trim() === '')) {
      return false;
    }
    return true;
  }, {
    message: t.customMoodRequired,
    path: ['customMood'],
  });
};

// Default schema for backward compatibility
export const userFormSchema = z.object({
  name: z.string().min(1, 'Name is required').max(50, 'Name must be less than 50 characters'),
  surname: z.string().min(1, 'Surname is required').max(50, 'Surname must be less than 50 characters'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  mood: z.string().min(1, 'Please select a mood'),
  customMood: z.string().optional(),
}).refine((data) => {
  if (data.mood === 'other' && (!data.customMood || data.customMood.trim() === '')) {
    return false;
  }
  return true;
}, {
  message: 'Please specify your mood when selecting "Other"',
  path: ['customMood'],
});

export type UserFormData = z.infer<typeof userFormSchema>;
