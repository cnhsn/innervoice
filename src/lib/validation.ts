import { z } from 'zod';

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
