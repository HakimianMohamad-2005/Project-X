import { AssessmentQuestion } from './managerAssessment';
import { FA_QUESTIONS } from './questions/fa';
import { EN_QUESTIONS } from './questions/en';
import { ES_QUESTIONS } from './questions/es';
import { DE_QUESTIONS } from './questions/de';
import { FR_QUESTIONS } from './questions/fr';
import { ZH_QUESTIONS } from './questions/zh';
import { JA_QUESTIONS } from './questions/ja';
import { HI_QUESTIONS } from './questions/hi';
import { AR_QUESTIONS } from './questions/ar';

// 24 High-Resolution Management Scenarios in all 9 Languages
export const ADVANCED_ASSESSMENT_QUESTIONS_I18N: Record<string, AssessmentQuestion[]> = {
  fa: FA_QUESTIONS,
  en: EN_QUESTIONS,
  es: ES_QUESTIONS,
  de: DE_QUESTIONS,
  fr: FR_QUESTIONS,
  zh: ZH_QUESTIONS,
  ja: JA_QUESTIONS,
  hi: HI_QUESTIONS,
  ar: AR_QUESTIONS
};

/**
 * Returns the localized 24-question array for the requested language.
 * Defaults to 'fa' (Persian) if the language is unknown or invalid.
 */
export function getLocalizedQuestions(lang: string = 'fa'): AssessmentQuestion[] {
  const normalizedLang = (lang || 'fa').toLowerCase().trim();
  return ADVANCED_ASSESSMENT_QUESTIONS_I18N[normalizedLang] || ADVANCED_ASSESSMENT_QUESTIONS_I18N['fa'];
}
