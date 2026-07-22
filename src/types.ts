/**
 * TypeScript Data Models for "Orangutan +3" (اورانگوتان +۳)
 * Author: Ali Asghar Hakimian
 */

export type ActiveTab = 'home' | 'books' | 'framework' | 'quiz' | 'case-studies' | 'cards' | 'mistakes-lessons' | 'faq' | 'b2b' | 'author';

export type ThemeMode = 'dark' | 'light';

export interface Chapter {
  number: number;
  title: string;
  description: string;
}

export interface BookItem {
  id: string;
  volumeNumber: number;
  title: string;
  subtitle: string;
  pageCount: number;
  price: number;
  originalPrice: number;
  isbn: string;
  badge: string;
  summary: string;
  coverAccent: string;
  chapters: Chapter[];
  keyTopics: string[];
}

export interface CartItem {
  id: string;
  bookId: string;
  title: string;
  price: number;
  originalPrice: number;
  quantity: number;
  authorSignatureRequested: boolean;
  recipientName?: string;
}

export type CaseCategory = 'all' | 'production' | 'finance' | 'sales' | 'ai';

export interface CaseStudy {
  id: string;
  title: string;
  subtitle: string;
  category: CaseCategory;
  categoryLabel: string;
  volumeRef: string;
  problem: string;
  leverIntervention: string;
  results: string;
  keyMetric: string;
  quote: string;
  iconName: string;
}

export interface QuizOption {
  text: string;
  score: number; // 0 = 100% Orangutan instinct, 10 = 100% +3 Systemic
  feedback: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: QuizOption[];
  chapterRef: string;
}

export type CardCategory = 'cost' | 'audit' | 'crisis' | 'people';

export interface DecisionCard {
  id: string;
  title: string;
  subtitle: string;
  category: CardCategory;
  categoryLabel: string;
  iconName: string;
  frontSummary: string;
  backProtocol: string;
  actionableSteps: string[];
  toolType: 'cost_calc' | 'bleed_audit' | 'crisis_72h' | 'key_person_risk';
}

export type CategoryTag = 'view' | 'decision' | 'people' | 'system' | 'market';

export interface MistakeLesson {
  id: string;
  number: number;
  type: 'mistake' | 'lesson';
  title: string;
  description: string;
  category: CategoryTag;
  categoryLabel: string;
  bookRef: string;
}

export interface OrderCustomerInfo {
  fullName: string;
  phone: string;
  province: string;
  city: string;
  address: string;
  postalCode: string;
  invoiceType: 'real' | 'legal';
  companyName?: string;
  nationalId?: string;
}

export interface Order {
  orderCode: string;
  date: string;
  items: CartItem[];
  totalPrice: number;
  discountPrice: number;
  finalPrice: number;
  customerInfo: OrderCustomerInfo;
  status: 'registered' | 'processing' | 'shipped' | 'delivered';
  paymentMethod: string;
  notes?: string;
}

export interface B2BForm {
  companyName: string;
  contactPerson: string;
  phone: string;
  email: string;
  quantity: number;
  requestAuthorMeeting: boolean;
  requestLegalInvoice: boolean;
  notes: string;
}

export interface LeadForm {
  fullName: string;
  phone: string;
  organization: string;
  position: string;
}
