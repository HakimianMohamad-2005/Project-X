import {
  AssessmentDimension,
  AssessmentQuestion
} from '../data/managerAssessment';
import {
  getLocalizedDimensionMetas,
  getLocalizedTiers,
  getLocalizedConsistency,
  LocalizedTier,
  LocalizedDimensionMeta
} from '../data/assessmentMetadataI18n';
import { getLocalizedQuestions } from '../data/assessmentQuestionsI18n';

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
  title: string;
  titleFa: string;
  titleEn: string;
  shortDesc: string;
  shortDescFa: string;
  bookChapterRef: string;
  bookChapterRefFa: string;
  rawScore: number; // 0 to 9
  percentage: number; // 0 to 100
}

export interface ConsistencyAnalysis {
  score: number; // float 0.0 to 3.0
  level: 'high' | 'medium' | 'low';
  title: string;
  titleFa: string;
  description: string;
  descriptionFa: string;
}

export interface ManagementTier {
  level: number; // 1 to 5
  range: string;
  title: string;
  titleFa: string;
  shortDesc: string;
  shortDescFa: string;
  badgeColor: string;
  cardColor: string;
  description: string;
  descriptionFa: string;
}

export interface ActionPlanStep {
  stepNumber: number;
  phaseTitle: string;
  phaseTitleFa: string;
  actionTitle: string;
  actionTitleFa: string;
  description: string;
  descriptionFa: string;
  keyRule: string;
  keyRuleFa: string;
}

export interface AdvancedAssessmentResult {
  id: string;
  lang: string;
  profile: AssessmentRespondentProfile;
  rawScore: number; // 0 to 72
  engagementPercentage: number; // 0 to 100
  tier: ManagementTier;
  dimensionResults: DimensionResult[];
  hotspots: DimensionResult[]; // 3 weakest dimensions
  keyStrength: DimensionResult; // 1 strongest dimension
  consistency: ConsistencyAnalysis;
  actionPlan: ActionPlanStep[];
  bookRecommendations: {
    dimension: AssessmentDimension;
    title: string;
    titleFa: string;
    chapterRef: string;
    chapterRefFa: string;
    whyNeeded: string;
    whyNeededFa: string;
  }[];
  answers: Record<number, { optionId: string; score: number }>;
  createdAt: string;
}

export function getTierByPercentage(percentage: number, lang: string = 'fa'): ManagementTier {
  const tiers = getLocalizedTiers(lang);
  const faTiers = getLocalizedTiers('fa');
  
  let selectedIdx = 4;
  if (percentage <= 19) selectedIdx = 0;
  else if (percentage <= 39) selectedIdx = 1;
  else if (percentage <= 59) selectedIdx = 2;
  else if (percentage <= 79) selectedIdx = 3;

  const locTier = tiers[selectedIdx] || tiers[4];
  const faTier = faTiers[selectedIdx] || faTiers[4];

  return {
    level: locTier.level,
    range: locTier.range,
    title: locTier.title,
    titleFa: faTier.title,
    shortDesc: locTier.shortDesc,
    shortDescFa: faTier.shortDesc,
    badgeColor: locTier.badgeColor,
    cardColor: locTier.cardColor,
    description: locTier.description,
    descriptionFa: faTier.description
  };
}

/**
 * Calculates consistency index based on 4 cross-checking scenario pairs:
 * Pair 1: Q2 vs Q20
 * Pair 2: Q3 vs Q11
 * Pair 3: Q8 vs Q21
 * Pair 4: Q9 vs Q23
 */
export function calculateConsistency(
  answers: Record<number, { optionId: string; score: number }>,
  lang: string = 'fa'
): ConsistencyAnalysis {
  const getScore = (qId: number) => answers[qId]?.score ?? 0;

  const diff1 = Math.abs(getScore(2) - getScore(20));
  const diff2 = Math.abs(getScore(3) - getScore(11));
  const diff3 = Math.abs(getScore(8) - getScore(21));
  const diff4 = Math.abs(getScore(9) - getScore(23));

  const averageDiff = Number(((diff1 + diff2 + diff3 + diff4) / 4).toFixed(2));

  let level: 'high' | 'medium' | 'low' = 'low';
  if (averageDiff <= 0.75) level = 'high';
  else if (averageDiff <= 1.25) level = 'medium';

  const loc = getLocalizedConsistency(level, lang);
  const fa = getLocalizedConsistency(level, 'fa');

  return {
    score: averageDiff,
    level,
    title: loc.title,
    titleFa: fa.title,
    description: loc.description,
    descriptionFa: fa.description
  };
}

/**
 * Generates the full diagnostic assessment result from answers and respondent profile
 */
export function evaluateAdvancedAssessment(
  profile: AssessmentRespondentProfile,
  answers: Record<number, { optionId: string; score: number }>,
  lang: string = 'fa'
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

  const locMetas = getLocalizedDimensionMetas(lang);
  const faMetas = getLocalizedDimensionMetas('fa');
  const enMetas = getLocalizedDimensionMetas('en');
  const questions = getLocalizedQuestions(lang);

  let totalRawScore = 0;
  const dimensionResults: DimensionResult[] = [];

  dimensionsOrder.forEach((dim) => {
    const locMeta = locMetas[dim];
    const faMeta = faMetas[dim];
    const enMeta = enMetas[dim];
    const dimQuestions = questions.filter((q) => q.dimension === dim);
    
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
      title: locMeta.title,
      titleFa: faMeta.title,
      titleEn: enMeta.title,
      shortDesc: locMeta.shortDesc,
      shortDescFa: faMeta.shortDesc,
      bookChapterRef: locMeta.bookChapterRef,
      bookChapterRefFa: faMeta.bookChapterRef,
      rawScore: dimRaw,
      percentage
    });
  });

  const totalEngagementPercentage = Math.round((totalRawScore / 72) * 100);
  const tier = getTierByPercentage(totalEngagementPercentage, lang);
  const consistency = calculateConsistency(answers, lang);

  // Sort dimensions by percentage descending to find Hotspots (weakest = highest engagement with orangutan behavior)
  const sortedByWeakness = [...dimensionResults].sort((a, b) => b.percentage - a.percentage);
  const hotspots = sortedByWeakness.slice(0, 3);
  
  // Strongest dimension = lowest engagement percentage
  const sortedByStrength = [...dimensionResults].sort((a, b) => a.percentage - b.percentage);
  const keyStrength = sortedByStrength[0];

  // Action plan customized with the user's top hotspots
  const top1 = hotspots[0] || dimensionResults[0];
  const top2 = hotspots[1] || dimensionResults[1];

  // Localized Action Plan Templates
  const actionPlan: ActionPlanStep[] = buildLocalizedActionPlan(top1, top2, lang);

  // Book recommendations based on the 3 hotspots
  const bookRecommendations = hotspots.map((item) => ({
    dimension: item.dimension,
    title: item.title,
    titleFa: item.titleFa,
    chapterRef: item.bookChapterRef,
    chapterRefFa: item.bookChapterRefFa,
    whyNeeded: buildBookRecommendationWhy(item, lang),
    whyNeededFa: `به دلیل درصد درگیری بالای شما در این بعد (${item.percentage}٪)، مطالعه این فصل‌ها ساختار فکری و چک‌لیست‌های عملیاتی نجات‌بخش را در اختیارتان می‌گذارد.`
  }));

  const result: AdvancedAssessmentResult = {
    id: `assessment-${Date.now()}`,
    lang,
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

function buildLocalizedActionPlan(top1: DimensionResult, top2: DimensionResult, lang: string): ActionPlanStep[] {
  // Multilingual Action Plans (All 9 supported languages)
  const templates: Record<string, {
    s1Phase: string;
    s1Title: (t: string) => string;
    s1Desc: (t: string) => string;
    s1Rule: string;
    s2Phase: string;
    s2Title: (t: string) => string;
    s2Desc: (t: string) => string;
    s2Rule: string;
    s3Phase: string;
    s3Title: string;
    s3Desc: string;
    s3Rule: string;
  }> = {
    fa: {
      s1Phase: 'گام اول: ببین',
      s1Title: (t: string) => `مشاهده بدون روتوش در حوزه «${t}»`,
      s1Desc: (t: string) => `از اتاق جلسات بیرون بیایید و جریان واقعی در بخش «${t}» را با داده‌های دست‌اول و بدون واسطه از کف سازمان یا خط تماس ثبت کنید.`,
      s1Rule: 'قاعده طلایی: هیچ تصمیمی بر پایه حدس و گزارش‌های شفاهی نگیرید؛ داده زنده را لمس کنید.',
      s2Phase: 'گام دوم: مداخله کن',
      s2Title: (t: string) => `تمرکز بر نقطه اهرمی در حوزه «${t}»`,
      s2Desc: (t: string) => `به جای فشار به تمام بخش‌ها، گلوگاه محدودکننده را در «${t}» پیدا کنید و مداخله هدفمند خود را بر آزادسازی ظرفیت همان نقطه متمرکز سازید.`,
      s2Rule: 'قاعده طلایی: بهبود موضعی بدون در نظر گرفتن کل زنجیره، هزینه است نه دستاورد.',
      s3Phase: 'گام سوم: ماندگار کن',
      s3Title: 'تثبیت در حافظه سازمان، چک‌لیست‌ها و آموزش جانشینان',
      s3Desc: 'راه‌حل را به یک پروتکل، چک‌لیست غیرقابل‌دورزدن و استاندارد عملیاتی تبدیل کنید تا با تغییر یا خروج افراد، دستاورد از بین نرود.',
      s3Rule: 'قاعده طلایی: اگر راه‌حلی بدون حضور شخص شما اجرا نمی‌شود، هنوز سیستمی نشده است.'
    },
    en: {
      s1Phase: 'Step 1: SEE (Observe)',
      s1Title: (t: string) => `Unvarnished Ground Observation in "${t}"`,
      s1Desc: (t: string) => `Step out of boardroom assumptions and audit actual shop-floor workflows in "${t}" using raw, unpolished first-party data.`,
      s1Rule: 'Golden Rule: Never make decisions based on hearsay or filtered dashboards; touch live ground reality.',
      s2Phase: 'Step 2: INTERVENE (Leverage)',
      s2Title: (t: string) => `Targeted Leverage Point Intervention in "${t}"`,
      s2Desc: (t: string) => `Instead of applying broad pressure across all departments, identify the true constraint in "${t}" and focus capacity release on that critical bottleneck.`,
      s2Rule: 'Golden Rule: Local optimizations that disregard full value-stream flow increase costs rather than throughput.',
      s3Phase: 'Step 3: EMBED (Institutionalize)',
      s3Title: 'Standardize into Living SOPs & Train Successors',
      s3Desc: 'Convert the resolution into non-negotiable checklists and living operational standards so improvements endure beyond personal leadership.',
      s3Rule: 'Golden Rule: If an operational solution relies solely on your physical presence, it is not yet systematized.'
    },
    es: {
      s1Phase: 'Paso 1: OBSERVAR (Ver la Realidad)',
      s1Title: (t: string) => `Observación Directa sin Filtros en "${t}"`,
      s1Desc: (t: string) => `Salga de la sala de juntas y audite los flujos reales de trabajo en "${t}" utilizando datos directos de primera mano.`,
      s1Rule: 'Regla de Oro: Nunca decida sobre conjeturas o reportes maquillados; verifique la realidad viva.',
      s2Phase: 'Paso 2: INTERVENIR (Punto Clave)',
      s2Title: (t: string) => `Intervención Enfocada en Cuellos de Botella de "${t}"`,
      s2Desc: (t: string) => `En lugar de presionar a ciegas a todas las áreas, identifique la restricción real en "${t}" y concentre allí sus recursos.`,
      s2Rule: 'Regla de Oro: Optimizar localmente sin considerar el flujo total genera sobrecostos innecesarios.',
      s3Phase: 'Paso 3: CONSOLIDAR (Memoria)',
      s3Title: 'Institucionalizar en Listas Vivas y Formar Sucesores',
      s3Desc: 'Convierta las soluciones en listas de verificación y protocolos de trabajo para que el avance perdure con o sin usted.',
      s3Rule: 'Regla de Oro: Si una solución requiere su presencia diaria para funcionar, aún no es un sistema.'
    },
    de: {
      s1Phase: 'Schritt 1: SEHEN (Reale Beobachtung)',
      s1Title: (t: string) => `Ungeschminkte Vor-Ort-Beobachtung im Bereich „${t}“`,
      s1Desc: (t: string) => `Verlassen Sie Besprechungsräume und Annahmen; auditieren Sie die tatsächlichen Abläufe in „${t}“ mit ungefilterten Primärdaten von der Basis.`,
      s1Rule: 'Goldene Regel: Treffen Sie niemals Entscheidungen auf Basis von Vermutungen oder geschönten Berichten; erleben Sie die Live-Daten.',
      s2Phase: 'Schritt 2: INTERVENIEREN (Hebelpunkt)',
      s2Title: (t: string) => `Gezielte Hebelpunkt-Intervention im Bereich „${t}“`,
      s2Desc: (t: string) => `Statt ziellosen Druck auf alle Abteilungen auszuüben, identifizieren Sie den Engpass in „${t}“ und konzentrieren Sie die Kapazitätsfreisetzung genau dort.`,
      s2Rule: 'Goldene Regel: Lokale Optimierung ohne Berücksichtigung der gesamten Wertschöpfungskette verursacht Kosten statt Mehrwert.',
      s3Phase: 'Schritt 3: VERANKERN (Systematisierung)',
      s3Title: 'In lebendige SOPs und Checklisten überführen sowie Nachfolger schulen',
      s3Desc: 'Verwandeln Sie die Lösung in verbindliche Checklisten und Betriebsstandards, damit der Fortschritt unabhängig von einzelnen Personen dauerhaft gesichert bleibt.',
      s3Rule: 'Goldene Regel: Wenn eine Lösung nur durch Ihre persönliche Anwesenheit funktioniert, ist sie noch kein System.'
    },
    fr: {
      s1Phase: 'Étape 1 : OBSERVER (Voir le terrain)',
      s1Title: (t: string) => `Observation directe et sans fard dans le domaine « ${t} »`,
      s1Desc: (t: string) => `Sortez des salles de réunion et examinez les flux de travail réels dans « ${t} » à partir de données brutes et directes du terrain.`,
      s1Rule: 'Règle d\'or : Ne prenez aucune décision sur des suppositions ou des rapports enjolivés ; touchez la réalité du terrain.',
      s2Phase: 'Étape 2 : INTERVENIR (Point de levier)',
      s2Title: (t: string) => `Intervention ciblée sur le goulot d'étranglement de « ${t} »`,
      s2Desc: (t: string) => `Au lieu de faire pression aveuglément sur tous les services, identifiez la véritable contrainte dans « ${t} » et concentrez-y vos efforts.`,
      s2Rule: 'Règle d\'or : Une optimisation locale ignorant le flux global génère des coûts plutôt que de la valeur.',
      s3Phase: 'Étape 3 : PÉRENNISER (Mémoire d\'entreprise)',
      s3Title: 'Institutionnaliser dans des standards vivants et former les successeurs',
      s3Desc: 'Transformez les solutions en check-lists rigoureuses et procédures opérationnelles pour que les progrès subsistent avec ou sans vous.',
      s3Rule: 'Règle d\'or : Si une solution exige votre présence physique quotidienne, elle ne constitue pas encore un système.'
    },
    zh: {
      s1Phase: '第一步：实地观察（穿透虚像）',
      s1Title: (t: string) => `深入「${t}」领域进行未经修饰的一线实况审视`,
      s1Desc: (t: string) => `走出会议室的主观预设，运用来自业务一线和现场的第一手未过滤数据，穿透「${t}」的真实运转流程。`,
      s1Rule: '黄金法则：绝不依据道听途说或粉饰报表做决策；必须亲自触摸鲜活的一线数据。',
      s2Phase: '第二步：精准干预（聚焦杠杆）',
      s2Title: (t: string) => `聚焦「${t}」核心约束瓶颈的杠杆解干预`,
      s2Desc: (t: string) => `摒弃对所有环节的盲目施压，精准定位「${t}」系统中的关键瓶颈，集中资源释放该处的约束阻力。` ,
      s2Rule: '黄金法则：脱离整体价值流的局部优化是成本黑洞而非组织增益。',
      s3Phase: '第三步：固化传承（组织记忆）',
      s3Title: '沉淀为活态SOP标准清单与梯队接班人培训',
      s3Desc: '将解决方案固化为不可逾越的执行清单与运营标准，确保组织能力不因个别人员流动而流失。',
      s3Rule: '黄金法则：如果某项解决方案脱离了您的个人在场便无法运转，则说明它尚未真正系统化。'
    },
    ja: {
      s1Phase: 'ステップ1：直視する（現場の事実確認）',
      s1Title: (t: string) => `「${t}」領域における飾りのない現場事実の観察`,
      s1Desc: (t: string) => `会議室の思い込みを排し、「${t}」の現場・最前線から得られる加工されていない一次データで実態を監査します。`,
      s1Rule: '黄金律：推測や粉飾された報告に基づく判断を捨て、生きた現場データを自ら確認してください。',
      s2Phase: 'ステップ2：介入する（レバレッジ・ポイント）',
      s2Title: (t: string) => `「${t}」のボトルネックへの集中介入`,
      s2Desc: (t: string) => `全方位に闇雲な負荷をかけるのではなく、「${t}」における真の制約要因を特定し、その一点の突破にリソースを集中させます。`,
      s2Rule: '黄金律：全体フローを無視した局所的な最適化は、成果ではなくコストの増大を招きます。',
      s3Phase: 'ステップ3：定着させる（組織記憶と標準化）',
      s3Title: '形骸化しないチェックリストへの落とし込みと後継者育成',
      s3Desc: '解決策をバイパス不可能な業務基準とチェックリストに昇華させ、担当者の交代に左右されない恒久的な仕組みを構築します。',
      s3Rule: '黄金律：あなた自身の常時立ち会いがなければ機能しない解決策は、まだ真のシステムではありません。'
    },
    hi: {
      s1Phase: 'चरण 1: देखें (धरातलीय अवलोकन)',
      s1Title: (t: string) => `"${t}" क्षेत्र में बिना किसी दिखावे के प्रत्यक्ष जमीनी अवलोकन`,
      s1Desc: (t: string) => `मीटिंग रूम के अनुमानों से बाहर निकलें और "${t}" में वास्तविक प्रक्रियाओं का बिना किसी मिलावट के प्राथमिक डेटा से ऑडिट करें।`,
      s1Rule: 'स्वर्ण नियम: कभी भी सुनी-सुनाई बातों या सजावटी रिपोर्टों पर निर्णय न लें; प्रत्यक्ष डेटा को स्पर्श करें।',
      s2Phase: 'चरण 2: हस्तक्षेप करें (मुख्य उत्तोलक बिंदु)',
      s2Title: (t: string) => `"${t}" में मुख्य बाधा पर लक्षित हस्तक्षेप`,
      s2Desc: (t: string) => `सभी विभागों पर अंधाधुंध दबाव डालने के बजाय, "${t}" में वास्तविक बाधा की पहचान करें और अपनी ऊर्जा उसी बिंदु पर केंद्रित करें।`,
      s2Rule: 'स्वर्ण नियम: संपूर्ण प्रक्रिया प्रवाह को नजरअंदाज करके किया गया स्थानीय सुधार केवल लागत बढ़ाता है।',
      s3Phase: 'चरण 3: स्थापित करें (संस्थागत स्मृति)',
      s3Title: 'सख्त चेकलिस्ट में मानकीकरण और उत्तराधिकारियों का प्रशिक्षण',
      s3Desc: 'समाधान को गैर-परक्राम्य चेकलिस्ट और मानक प्रक्रियाओं में बदलें ताकि व्यक्तियों के बदलने पर भी सुधार बना रहे।',
      s3Rule: 'स्वर्ण नियम: यदि कोई समाधान केवल आपकी भौतिक उपस्थिति पर निर्भर करता है, तो वह अभी तक प्रणाली नहीं बना है।'
    },
    ar: {
      s1Phase: 'الخطوة الأولى: شاهِد (الملاحظة الميدانية)',
      s1Title: (t: string) => `معاينة الواقع دون تجميل في مجال «${t}»`,
      s1Desc: (t: string) => `اخرج من قاعات الاجتماعات وعاين العمليات الحية في «${t}» ببيانات موثوقة من أرض الواقع مباشرة.`,
      s1Rule: 'القاعدة الذهبية: لا تتخذ أي قرار بناءً على التخمين أو التقارير الشفهية؛ لامِس البيانات الحية.',
      s2Phase: 'الخطوة الثانية: تدخّل (نقطة الارتكاز)',
      s2Title: (t: string) => `التركيز على عنق الزجاجة في مجال «${t}»`,
      s2Desc: (t: string) => `بدلاً من الضغط العشوائي على كافة الأقسام، حدد الاختناق الحقيقي في «${t}» ووجّه التدخل لتحرير طاقته.`,
      s2Rule: 'القاعدة الذهبية: التحسين الموضعي المعزول عن السلسلة بأكملها هدر وتكلفة زائدة.',
      s3Phase: 'الخطوة الثالثة: ثبّت (الذاكرة المؤسسية)',
      s3Title: 'الترسيخ في الذاكرة المؤسسية وقوائم التحقق وتدريب البدلاء',
      s3Desc: 'حوّل الحلول إلى بروتوكولات وقوائم تدقيق غير قابلة للتجاوز لضمان استدامة الإنجاز بصرف النظر عن الأشخاص.',
      s3Rule: 'القاعدة الذهبية: إذا كان الحل لا يعمل إلا بحضورك الشخصي، فهو لم يتحول لنظام بعد.'
    }
  };

  const tpl = templates[lang] || templates['en'];

  return [
    {
      stepNumber: 1,
      phaseTitle: tpl.s1Phase,
      phaseTitleFa: 'گام اول: ببین',
      actionTitle: tpl.s1Title(top1.title),
      actionTitleFa: `مشاهده بدون روتوش در حوزه «${top1.titleFa}»`,
      description: tpl.s1Desc(top1.title),
      descriptionFa: `از اتاق جلسات بیرون بیایید و جریان واقعی در بخش «${top1.titleFa}» را با داده‌های دست‌اول و بدون واسطه از کف سازمان یا خط تماس ثبت کنید.`,
      keyRule: tpl.s1Rule,
      keyRuleFa: 'قاعده طلایی: هیچ تصمیمی بر پایه حدس و گزارش‌های شفاهی نگیرید؛ داده زنده را لمس کنید.'
    },
    {
      stepNumber: 2,
      phaseTitle: tpl.s2Phase,
      phaseTitleFa: 'گام دوم: مداخله کن',
      actionTitle: tpl.s2Title(top2.title),
      actionTitleFa: `تمرکز بر نقطه اهرمی در حوزه «${top2.titleFa}»`,
      description: tpl.s2Desc(top2.title),
      descriptionFa: `به جای فشار به تمام بخش‌ها، گلوگاه محدودکننده را در «${top2.titleFa}» پیدا کنید و مداخله هدفمند خود را بر آزادسازی ظرفیت همان نقطه متمرکز سازید.`,
      keyRule: tpl.s2Rule,
      keyRuleFa: 'قاعده طلایی: بهبود موضعی بدون در نظر گرفتن کل زنجیره، هزینه است نه دستاورد.'
    },
    {
      stepNumber: 3,
      phaseTitle: tpl.s3Phase,
      phaseTitleFa: 'گام سوم: ماندگار کن',
      actionTitle: tpl.s3Title,
      actionTitleFa: 'تثبیت در حافظه سازمان، چک‌لیست‌ها و آموزش جانشینان',
      description: tpl.s3Desc,
      descriptionFa: 'راه‌حل را به یک پروتکل، چک‌لیست غیرقابل‌دورزدن و استاندارد عملیاتی تبدیل کنید تا با تغییر یا خروج افراد، دستاورد از بین نرود.',
      keyRule: tpl.s3Rule,
      keyRuleFa: 'قاعده طلایی: اگر راه‌حلی بدون حضور شخص شما اجرا نمی‌شود، هنوز سیستمی نشده است.'
    }
  ];
}

function buildBookRecommendationWhy(item: DimensionResult, lang: string): string {
  switch (lang) {
    case 'fa':
      return `به دلیل درصد درگیری بالای شما در این بعد (${item.percentage}٪)، مطالعه این فصل‌ها ساختار فکری و چک‌لیست‌های عملیاتی نجات‌بخش را در اختیارتان می‌گذارد.`;
    case 'es':
      return `Debido a su alta exposición a riesgos en esta dimensión (${item.percentage}%), estos capítulos le brindan marcos conceptuales y listas de verificación prácticas inmediatas.`;
    case 'de':
      return `Aufgrund Ihrer hohen Betroffenheit in dieser Dimension (${item.percentage}%) liefern Ihnen diese Kapitel bewährte Denkmodelle und sofort einsatzbereite Checklisten.`;
    case 'fr':
      return `En raison de votre niveau d'exposition dans cette dimension (${item.percentage}%), ces chapitres vous offrent les outils méthodologiques et check-lists opérationnelles adaptés.`;
    case 'zh':
      return `鉴于您在这一维度的本能受累指数较高（${item.percentage}%），深度研读这些章节将为您提供关键思维模型与落地清单。`;
    case 'ja':
      return `この領域における本能的経営の関与度（${item.percentage}%）に基づき、本書の該当章で実践的な思考フレームとチェックリストが提示されます。`;
    case 'hi':
      return `इस आयाम में आपके उच्च जोखिम प्रतिशत (${item.percentage}%) को देखते हुए, इन अध्यायों का अध्ययन आपको व्यावहारिक चेकलिस्ट और दिशा प्रदान करेगा।`;
    case 'ar':
      return `نظراً لارتفاع مؤشر المخاطر في هذا البعد (${item.percentage}٪)، توفر لك هذه الفصول أطر تفكير وقوائم تدقيق عملية منقذة.`;
    default:
      return `Due to your high exposure in this dimension (${item.percentage}%), studying these chapters equips you with vital executive frameworks and turnaround checklists.`;
  }
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
