import {
  ADVANCED_ASSESSMENT_QUESTIONS,
  DIMENSION_METAS,
  AssessmentDimension,
  AssessmentQuestion
} from '../data/managerAssessment';

export interface AssessmentRespondentProfile {
  role: string;
  industry: string;
  headcount: string;
  experience: string;
  scope: string;
  createdAt: string;
}

export interface DimensionResult {
  dimension: AssessmentDimension;
  titleFa: string;
  titleEn: string;
  shortDescFa: string;
  bookChapterRefFa: string;
  rawScore: number; // 0 to 9
  percentage: number; // 0 to 100
}

export interface ConsistencyAnalysis {
  score: number; // float 0.0 to 3.0
  level: 'high' | 'medium' | 'low';
  titleFa: string;
  descriptionFa: string;
}

export interface ManagementTier {
  level: number; // 1 to 5
  range: string;
  titleFa: string;
  shortDescFa: string;
  badgeColor: string;
  cardColor: string;
  descriptionFa: string;
}

export interface ActionPlanStep {
  stepNumber: number;
  phaseTitleFa: string;
  actionTitleFa: string;
  descriptionFa: string;
  keyRuleFa: string;
}

export interface AdvancedAssessmentResult {
  id: string;
  profile: AssessmentRespondentProfile;
  rawScore: number; // 0 to 72
  engagementPercentage: number; // 0 to 100 ("درصد درگیری با وضعیت اورانگوتانی")
  tier: ManagementTier;
  dimensionResults: DimensionResult[];
  hotspots: DimensionResult[]; // 3 weakest dimensions (highest engagement)
  keyStrength: DimensionResult; // 1 strongest dimension (lowest engagement)
  consistency: ConsistencyAnalysis;
  actionPlan: ActionPlanStep[];
  bookRecommendations: {
    dimension: AssessmentDimension;
    titleFa: string;
    chapterRefFa: string;
    whyNeededFa: string;
  }[];
  answers: Record<number, { optionId: string; score: number }>;
  createdAt: string;
}

// 5 Management Tiers
export const MANAGEMENT_TIERS: ManagementTier[] = [
  {
    level: 1,
    range: '۰ تا ۱۹ درصد',
    titleFa: 'سازمان خودکار و پایدار (+۳ نهادینه‌شده)',
    shortDescFa: 'سطح ۱: مدیریت سیستماتیک با حافظه ماندگار',
    badgeColor: 'bg-teal-500 text-white',
    cardColor: 'border-teal-400 bg-teal-500/10 text-teal-700 dark:text-teal-300',
    descriptionFa: 'سازمان شما از تله‌های تصمیم‌گیری غریزی فاصله زیادی دارد. فرآیندها مستندند، تصمیم‌ها بر پایه مشاهده داده‌های زنده کف کارخانه گرفته می‌شوند و خروج نیروهای کلیدی سازمان را فلج نمی‌کند.'
  },
  {
    level: 2,
    range: '۲۰ تا ۳۹ درصد',
    titleFa: 'مدیریت ساختاریافته در مسیر تکامل',
    shortDescFa: 'سطح ۲: تعادل فرآیندی با نیاز به تثبیت بیشتر',
    badgeColor: 'bg-emerald-500 text-white',
    cardColor: 'border-emerald-400 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
    descriptionFa: 'پایه‌های سیستمی خوبی بنا نهاده شده است. اما در شرایط ابهام یا برخی حوزه‌ها (مانند انبار، وصول یا گزارش خطا) تمایل به راه‌حل‌های کوتاه‌مدت یا تشخیص فردی دیده می‌شود.'
  },
  {
    level: 3,
    range: '۴۰ تا ۵۹ درصد',
    titleFa: 'مدیریت غریزی متوسط (درگیری دوره‌ای با اطفای حریق)',
    shortDescFa: 'سطح ۳: نوسان میان سیستم و رفتارهای تکانشی',
    badgeColor: 'bg-amber-500 text-white',
    cardColor: 'border-amber-400 bg-amber-500/10 text-amber-700 dark:text-amber-300',
    descriptionFa: 'سازمان در روزهای عادی منظم است، اما در مواقع بحران و نوسانات بازار، تصمیمات شتاب‌زده، فشار به جای تحلیل و راه‌حل‌های موقت غالب می‌شوند که نشتی مالی و فرسایش منابع ایجاد می‌کنند.'
  },
  {
    level: 4,
    range: '۶۰ تا ۷۹ درصد',
    titleFa: 'مدیریت غریزی شدید (وابستگی عمیق به فرد و بحران دائم)',
    shortDescFa: 'سطح ۴: فرسایش منابع و تصمیم‌گیری واکنشی',
    badgeColor: 'bg-orange-500 text-white',
    cardColor: 'border-orange-400 bg-orange-500/10 text-orange-700 dark:text-orange-300',
    descriptionFa: 'سازمان به شدت متکی به حضور و حافظه فیزیکی مدیران ارشد است. دستورات ضربتی، تنبیه بدون تحلیل فرآیند، فاکتورهای سمی فروش و توقف‌های مکرر، انرژی سازمان را تخلیه می‌کنند.'
  },
  {
    level: 5,
    range: '۸۰ تا ۱۰۰ درصد',
    titleFa: 'وضعیت بحرانی اورانگوتانی (غلبه کامل رفتارهای تکانشی)',
    shortDescFa: 'سطح ۵: خطر فوری انسداد عملیاتی و فقدان حافظه',
    badgeColor: 'bg-red-500 text-white',
    cardColor: 'border-red-400 bg-red-500/10 text-red-700 dark:text-red-300',
    descriptionFa: 'سازمان در وضعیت بحرانی اورانگوتانی قرار دارد؛ تصمیمات بر پایه حدس و گمان، واکنش‌های احساسی، گزارش‌های روتوش‌شده و پاک‌کردن صورت‌مسئله گرفته می‌شوند و حافظه سازمانی وجود ندارد.'
  }
];

export function getTierByPercentage(percentage: number): ManagementTier {
  if (percentage <= 19) return MANAGEMENT_TIERS[0];
  if (percentage <= 39) return MANAGEMENT_TIERS[1];
  if (percentage <= 59) return MANAGEMENT_TIERS[2];
  if (percentage <= 79) return MANAGEMENT_TIERS[3];
  return MANAGEMENT_TIERS[4];
}

/**
 * Calculates consistency index based on 4 cross-checking scenario pairs:
 * Pair 1: Q2 vs Q20
 * Pair 2: Q3 vs Q11
 * Pair 3: Q8 vs Q21
 * Pair 4: Q9 vs Q23
 */
export function calculateConsistency(answers: Record<number, { optionId: string; score: number }>): ConsistencyAnalysis {
  const getScore = (qId: number) => answers[qId]?.score ?? 0;

  const diff1 = Math.abs(getScore(2) - getScore(20));
  const diff2 = Math.abs(getScore(3) - getScore(11));
  const diff3 = Math.abs(getScore(8) - getScore(21));
  const diff4 = Math.abs(getScore(9) - getScore(23));

  const averageDiff = Number(((diff1 + diff2 + diff3 + diff4) / 4).toFixed(2));

  if (averageDiff <= 0.75) {
    return {
      score: averageDiff,
      level: 'high',
      titleFa: 'اطمینان بالا (پاسخ‌های باثبات و همگرا)',
      descriptionFa: 'پاسخ‌های شما در سناریوهای متقاطع از ثبات و یکپارچگی بالایی برخوردارند و الگوی فکری منسجمی را نشان می‌دهند.'
    };
  } else if (averageDiff <= 1.25) {
    return {
      score: averageDiff,
      level: 'medium',
      titleFa: 'اطمینان متوسط (نوسان جزئی در سناریوهای مشابه)',
      descriptionFa: 'در برخی سناریوهای مشابه، پاسخ‌های متفاوتی ثبت شده است که نشان‌دهنده تغییر سبک تصمیم‌گیری در شرایط فشار یا موضوعات خاص است.'
    };
  } else {
    return {
      score: averageDiff,
      level: 'low',
      titleFa: 'پاسخ‌های ناسازگار (الگوی موقعیتی یا متناقض)',
      descriptionFa: 'پاسخ‌ها در چند سناریوی مشابه ناسازگارند و نشان‌دهنده تصمیم‌گیری موقعیتی، احساسی یا عدم ثبات در اصول مدیریتی سازمان است.'
    };
  }
}

/**
 * Generates the full diagnostic assessment result from answers and respondent profile
 */
export function evaluateAdvancedAssessment(
  profile: AssessmentRespondentProfile,
  answers: Record<number, { optionId: string; score: number }>
): AdvancedAssessmentResult {
  const dimensionsOrder: AssessmentDimension[] = [
    'reality',
    'execution',
    'systems',
    'memory',
    'culture',
    'data',
    'operations',
    'market'
  ];

  let totalRawScore = 0;
  const dimensionResults: DimensionResult[] = [];

  dimensionsOrder.forEach((dim) => {
    const meta = DIMENSION_METAS[dim];
    const dimQuestions = ADVANCED_ASSESSMENT_QUESTIONS.filter((q) => q.dimension === dim);
    
    let dimRaw = 0;
    dimQuestions.forEach((q) => {
      const ans = answers[q.id];
      if (ans) {
        dimRaw += ans.score;
      }
    });

    totalRawScore += dimRaw;
    const percentage = Math.round((dimRaw / 9) * 100);

    dimensionResults.push({
      dimension: dim,
      titleFa: meta.titleFa,
      titleEn: meta.titleEn,
      shortDescFa: meta.shortDescFa,
      bookChapterRefFa: meta.bookChapterRefFa,
      rawScore: dimRaw,
      percentage
    });
  });

  const totalEngagementPercentage = Math.round((totalRawScore / 72) * 100);
  const tier = getTierByPercentage(totalEngagementPercentage);
  const consistency = calculateConsistency(answers);

  // Sort dimensions by percentage descending to find Hotspots (weakest = highest engagement with orangutan behavior)
  const sortedByWeakness = [...dimensionResults].sort((a, b) => b.percentage - a.percentage);
  const hotspots = sortedByWeakness.slice(0, 3);
  
  // Strongest dimension = lowest engagement percentage
  const sortedByStrength = [...dimensionResults].sort((a, b) => a.percentage - b.percentage);
  const keyStrength = sortedByStrength[0];

  // Action plan customized with the user's top hotspots
  const top1 = hotspots[0] || dimensionResults[0];
  const top2 = hotspots[1] || dimensionResults[1];

  const actionPlan: ActionPlanStep[] = [
    {
      stepNumber: 1,
      phaseTitleFa: 'گام اول: ببین',
      actionTitleFa: `مشاهده بدون روتوش در حوزه «${top1.titleFa}»`,
      descriptionFa: `از اتاق جلسات بیرون بیایید و جریان واقعی در بخش «${top1.titleFa}» را با داده‌های دست‌اول و بدون واسطه از کف سازمان یا خط تماس ثبت کنید.`,
      keyRuleFa: 'قاعده طلایی: هیچ تصمیمی بر پایه حدس و گزارش‌های شفاهی نگیرید؛ داده زنده را لمس کنید.'
    },
    {
      stepNumber: 2,
      phaseTitleFa: 'گام دوم: مداخله کن',
      actionTitleFa: `تمرکز بر نقطه اهرمی در حوزه «${top2.titleFa}»`,
      descriptionFa: `به جای فشار به تمام بخش‌ها، گلوگاه محدودکننده را در «${top2.titleFa}» پیدا کنید و مداخله هدفمند خود را بر آزادسازی ظرفیت همان نقطه متمرکز سازید.`,
      keyRuleFa: 'قاعده طلایی: بهبود موضعی بدون در نظر گرفتن کل زنجیره، هزینه است نه دستاورد.'
    },
    {
      stepNumber: 3,
      phaseTitleFa: 'گام سوم: ماندگار کن',
      actionTitleFa: 'تثبیت در حافظه سازمان، چک‌لیست‌ها و آموزش جانشینان',
      descriptionFa: 'راه‌حل را به یک پروتکل، چک‌لیست غیرقابل‌دورزدن و استاندارد عملیاتی تبدیل کنید تا با تغییر یا خروج افراد، دستاورد از بین نرود.',
      keyRuleFa: 'قاعده طلایی: اگر راه‌حلی بدون حضور شخص شما اجرا نمی‌شود، هنوز سیستمی نشده است.'
    }
  ];

  // Book recommendations based on the 3 hotspots
  const bookRecommendations = hotspots.map((item) => ({
    dimension: item.dimension,
    titleFa: item.titleFa,
    chapterRefFa: item.bookChapterRefFa,
    whyNeededFa: `به دلیل درصد درگیری بالای شما در این بعد (${item.percentage}٪)، مطالعه این فصل‌ها ساختار فکری و چک‌لیست‌های عملیاتی نجات‌بخش را در اختیارتان می‌گذارد.`
  }));

  const result: AdvancedAssessmentResult = {
    id: `assessment-${Date.now()}`,
    profile,
    rawScore: totalRawScore,
    engagementPercentage: totalEngagementPercentage,
    tier,
    dimensionResults,
    hotspots,
    keyStrength,
    consistency,
    actionPlan,
    bookRecommendations,
    answers,
    createdAt: new Date().toISOString()
  };

  return result;
}

// Local Storage Keys
export const LS_ASSESSMENT_DRAFT_KEY = 'orangutan_manager_assessment_draft';
export const LS_ASSESSMENT_HISTORY_KEY = 'orangutan_manager_assessment_history';

export function saveAssessmentDraft(state: any) {
  try {
    localStorage.setItem(LS_ASSESSMENT_DRAFT_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save assessment draft to localStorage', e);
  }
}

export function loadAssessmentDraft() {
  try {
    const raw = localStorage.getItem(LS_ASSESSMENT_DRAFT_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
}

export function clearAssessmentDraft() {
  try {
    localStorage.removeItem(LS_ASSESSMENT_DRAFT_KEY);
  } catch (e) {
    // ignore
  }
}

export function saveAssessmentResultToHistory(result: AdvancedAssessmentResult) {
  try {
    const existing = getAssessmentHistory();
    const updated = [result, ...existing].slice(0, 10); // keep last 10
    localStorage.setItem(LS_ASSESSMENT_HISTORY_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save assessment to history', e);
  }
}

export function getAssessmentHistory(): AdvancedAssessmentResult[] {
  try {
    const raw = localStorage.getItem(LS_ASSESSMENT_HISTORY_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
}

export function getLatestAssessmentResult(): AdvancedAssessmentResult | null {
  const history = getAssessmentHistory();
  return history.length > 0 ? history[0] : null;
}
