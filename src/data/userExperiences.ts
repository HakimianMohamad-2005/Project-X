import { UserExperience } from '../types';

export const USER_EXPERIENCES_I18N: Record<string, UserExperience[]> = {
  fa: [],
  en: [],
  es: [],
  de: [],
  fr: [],
  zh: [],
  ja: [],
  hi: [],
  ar: []
};

export const USER_EXPERIENCES_DATA: UserExperience[] = [];

export function getUserExperiencesForLanguage(_lang?: string): UserExperience[] {
  return [];
}
