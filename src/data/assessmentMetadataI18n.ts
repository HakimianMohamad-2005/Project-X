import { AssessmentDimension } from './managerAssessment';

export interface LocalizedDimensionMeta {
  id: AssessmentDimension;
  title: string;
  shortDesc: string;
  bookChapterRef: string;
}

export interface LocalizedIntakeOptions {
  roleLabel: string;
  rolePlaceholder: string;
  roles: { value: string; label: string }[];
  industryLabel: string;
  industryPlaceholder: string;
  industries: { value: string; label: string }[];
  headcountLabel: string;
  headcountPlaceholder: string;
  headcounts: { value: string; label: string }[];
  experienceLabel: string;
  experiencePlaceholder: string;
  experiences: { value: string; label: string }[];
  scopeLabel: string;
  scopePlaceholder: string;
  scopes: { value: string; label: string }[];
}

export interface LocalizedTier {
  level: number;
  range: string;
  title: string;
  shortDesc: string;
  badgeColor: string;
  cardColor: string;
  description: string;
}

export interface LocalizedConsistency {
  title: string;
  description: string;
}

export interface LocalizedActionPlanStep {
  stepNumber: number;
  phaseTitle: string;
  actionTitle: string;
  description: string;
  keyRule: string;
}

// 8 Dimensions in 9 Languages
export const LOCALIZED_DIMENSION_METAS: Record<string, Record<AssessmentDimension, LocalizedDimensionMeta>> = {
  fa: {
    reality: {
      id: 'reality',
      title: 'مواجهه با واقعیت و مشاهده مستقیم',
      shortDesc: 'دیدن کف کارخانه بدون واسطه و روتوش، فرار از خودفریبی و گزارش‌های فریبنده',
      bookChapterRef: 'جلد اول • فصل ۱ و ۲ (دیدن واقعیت بدون روتوش، رفتن به کف کارخانه)'
    },
    execution: {
      id: 'execution',
      title: 'انضباط اجرایی و مهار بحران',
      shortDesc: 'تعیین شفاف مسئول، مهلت، شاخص و عدم مداخله شتاب‌زده بدون تفکیک حقایق',
      bookChapterRef: 'جلد دوم • فصل ۱ تا ۳ (انضباط اجرایی، مهار بحران و کنترل گلوگاه)'
    },
    systems: {
      id: 'systems',
      title: 'تفکر سیستمی و مدیریت گلوگاه',
      shortDesc: 'دیدن کل زنجیره ارزش، تمرکز بر گلوگاه واقعی و جلوگیری از بهینه‌سازی موضعی زیان‌بار',
      bookChapterRef: 'جلد اول • فصل ۴ و ۵ (تفکر سیستمی، زنجیره ارزش و تئوری محدودیت‌ها TOC)'
    },
    memory: {
      id: 'memory',
      title: 'حافظه سازمانی و استانداردسازی',
      shortDesc: 'تبدیل دانش فردی به چک‌لیست و فرآیند ماندگار جهت عدم وابستگی به حضور افراد',
      bookChapterRef: 'جلد اول • فصل ۳ و ۶ (انبارگردانی ۶۸ ساله، ساخت حافظه ماندگار و مدیر معلم)'
    },
    culture: {
      id: 'culture',
      title: 'فرهنگ پاسخگویی و گزارش‌دهی',
      shortDesc: 'تشویق گزارش زودهنگام خطا، شنیدن صدای خط مقدم و اصلاح سیستم پاداش در راستای منافع کلان',
      bookChapterRef: 'جلد اول • فصل ۷ و جلد دوم • فصل ۵ (فرهنگ شفافیت، گزارش صادقانه خطا و بازآرایی انگیزه‌ها)'
    },
    data: {
      id: 'data',
      title: 'تصمیم‌گیری مبتنی بر داده معتبر',
      shortDesc: 'تأیید اعتبار داده‌ها، هم‌راستاسازی آمارهای متناقض و تفکیک داده سالم از گزارش‌های روتوش‌شده',
      bookChapterRef: 'جلد دوم • فصل ۴ (داده‌های پاک، حذف فاکتور سمی و سنجش سود واقعی عملیاتی)'
    },
    operations: {
      id: 'operations',
      title: 'بهره‌وری عملیاتی و حذف اتلاف',
      shortDesc: 'شناسایی و ریشه‌کنی اتلاف‌های نامرئی، عیوب تکراری مزمن و توقف‌های به‌ظاهر کوچک',
      bookChapterRef: 'جلد اول • فصل ۴ و جلد دوم • فصل ۶ (حذف اتلاف پنهان، ضایعات و استانداردسازی مداخله)'
    },
    market: {
      id: 'market',
      title: 'مدیریت بازار، اعتبار و وصول',
      shortDesc: 'تفکیک فاکتور سمی از فروش سودآور، تعهدات واقع‌بینانه و اعتبارسنجی دقیق مشتریان',
      bookChapterRef: 'جلد دوم • فصل ۳ (مدیریت فروش دوم، وصول نقدینگی و اعتبارسنجی واقعی)'
    }
  },

  en: {
    reality: {
      id: 'reality',
      title: 'Reality & Direct Observation',
      shortDesc: 'Observing the shop floor unvarnished, eliminating self-deception and cosmetic reports',
      bookChapterRef: 'Volume 1 • Chapters 1 & 2 (Raw Reality Observation & Gemba Walks)'
    },
    execution: {
      id: 'execution',
      title: 'Execution Discipline & Crisis Containment',
      shortDesc: 'Clear task owners, hard deadlines, outcome metrics, avoiding panic interventions',
      bookChapterRef: 'Volume 2 • Chapters 1 to 3 (Execution Discipline & Bottleneck Control)'
    },
    systems: {
      id: 'systems',
      title: 'Systems Thinking & Bottleneck Management',
      shortDesc: 'Viewing the full value stream, focusing on true constraints, preventing harmful local optimization',
      bookChapterRef: 'Volume 1 • Chapters 4 & 5 (Systems Thinking, Value Stream & Theory of Constraints)'
    },
    memory: {
      id: 'memory',
      title: 'Organizational Memory & Standardization',
      shortDesc: 'Converting tribal knowledge into living checklists and enduring SOPs',
      bookChapterRef: 'Volume 1 • Chapters 3 & 6 (68-Year Warehouse Audit & The Manager as Teacher)'
    },
    culture: {
      id: 'culture',
      title: 'Accountability Culture & Error Reporting',
      shortDesc: 'Rewarding early error disclosure, listening to front-line workers, aligning incentives',
      bookChapterRef: 'Volume 1 • Chapter 7 & Volume 2 • Chapter 5 (Radical Transparency & Incentive Realignment)'
    },
    data: {
      id: 'data',
      title: 'Verified Data-Driven Decision Making',
      shortDesc: 'Auditing data integrity, reconciling conflicting dashboards, isolating genuine operational profits',
      bookChapterRef: 'Volume 2 • Chapter 4 (Clean Data, Toxic Invoices & True Operating Margins)'
    },
    operations: {
      id: 'operations',
      title: 'Operational Efficiency & Waste Elimination',
      shortDesc: 'Rooting out hidden micro-stoppages, recurring defects, and invisible yield drains',
      bookChapterRef: 'Volume 1 • Chapter 4 & Volume 2 • Chapter 6 (Hidden Waste Removal & Standardized Work)'
    },
    market: {
      id: 'market',
      title: 'Market, Credit & Collection Management',
      shortDesc: 'Eliminating toxic credit sales, setting realistic delivery promises, rigorous client vetting',
      bookChapterRef: 'Volume 2 • Chapter 3 (Repeat Sales Management & Cash Collection Health)'
    }
  },

  es: {
    reality: {
      id: 'reality',
      title: 'Realidad y Observación Directa',
      shortDesc: 'Ver la planta de operaciones sin filtros ni reportes maquillados, eliminando el autoengaño',
      bookChapterRef: 'Volumen 1 • Capítulos 1 y 2 (Observación directa de la realidad en el taller)'
    },
    execution: {
      id: 'execution',
      title: 'Disciplina de Ejecución y Contención de Crisis',
      shortDesc: 'Asignación clara de responsables, plazos firmes y métricas sin intervenciones impulsivas',
      bookChapterRef: 'Volumen 2 • Capítulos 1 al 3 (Disciplina de ejecución y control de cuellos de botella)'
    },
    systems: {
      id: 'systems',
      title: 'Pensamiento Sistémico y Gestión de Cuellos de Botella',
      shortDesc: 'Visión integral de la cadena de valor y enfoque en las restricciones verdaderas',
      bookChapterRef: 'Volumen 1 • Capítulos 4 y 5 (Pensamiento sistémico y Teoría de Restricciones TOC)'
    },
    memory: {
      id: 'memory',
      title: 'Memoria Organizacional y Estandarización',
      shortDesc: 'Transformar el conocimiento tácito en listas de verificación vivas e independientes de personas',
      bookChapterRef: 'Volumen 1 • Capítulos 3 y 6 (Auditoría de almacén de 68 años y el Gerente Maestro)'
    },
    culture: {
      id: 'culture',
      title: 'Cultura de Responsabilidad y Reporte de Errores',
      shortDesc: 'Incentivar el reporte temprano de fallas y alinear los incentivos con la salud del negocio',
      bookChapterRef: 'Volumen 1 • Cap. 7 y Volumen 2 • Cap. 5 (Transparencia e incentivos alineados)'
    },
    data: {
      id: 'data',
      title: 'Toma de Decisiones Basada en Datos Verificados',
      shortDesc: 'Auditar la integridad de los datos, reconciliar métricas y calcular la rentabilidad real',
      bookChapterRef: 'Volumen 2 • Capítulo 4 (Datos limpios, eliminación de facturas tóxicas y margen real)'
    },
    operations: {
      id: 'operations',
      title: 'Eficiencia Operativa y Eliminación de Desperdicios',
      shortDesc: 'Erradicar microparadas crónicas, defectos repetitivos y mermas invisibles de capacidad',
      bookChapterRef: 'Volumen 1 • Capítulo 4 y Volumen 2 • Capítulo 6 (Eliminación de desperdicios ocultos)'
    },
    market: {
      id: 'market',
      title: 'Gestión de Mercado, Crédito y Cobranza',
      shortDesc: 'Diferenciar ventas sanas de deudas incobrables y promesas realistas de entrega',
      bookChapterRef: 'Volumen 2 • Capítulo 3 (Gestión de segundas ventas y salud del flujo de caja)'
    }
  },

  de: {
    reality: {
      id: 'reality',
      title: 'Realität & Direkte Beobachtung',
      shortDesc: 'Ungeschönter Blick auf den Shopfloor, Überwindung von Schönfärberei und Selbsttäuschung',
      bookChapterRef: 'Band 1 • Kapitel 1 & 2 (Reale Beobachtung vor Ort und Gemba-Walks)'
    },
    execution: {
      id: 'execution',
      title: 'Ausführungsdisziplin & Krisenbewältigung',
      shortDesc: 'Klare Verantwortliche, feste Fristen und Kennzahlen ohne hektische Ad-hoc-Eingriffe',
      bookChapterRef: 'Band 2 • Kapitel 1 bis 3 (Ausführungsdisziplin & Engpasskontrolle)'
    },
    systems: {
      id: 'systems',
      title: 'Systemdenken & Engpassmanagement',
      shortDesc: 'Ganzheitliche Wertstromsicht, Fokus auf echte Engpässe und Vermeidung lokaler Scheinoptima',
      bookChapterRef: 'Band 1 • Kapitel 4 & 5 (Systemdenken, Wertstrom & Theory of Constraints TOC)'
    },
    memory: {
      id: 'memory',
      title: 'Organisationales Gedächtnis & Standardisierung',
      shortDesc: 'Umwandlung von Einzelwissen in lebendige Checklisten und personenunabhängige Prozesse',
      bookChapterRef: 'Band 1 • Kapitel 3 & 6 (68-Jahre-Lagerinventur und die Führungskraft als Lehrer)'
    },
    culture: {
      id: 'culture',
      title: 'Verantwortungskultur & Fehlermeldung',
      shortDesc: 'Förderung frühzeitiger Fehlermeldungen, Gehör für die Basis und Ausrichtung von Anreizen',
      bookChapterRef: 'Band 1 • Kapitel 7 & Band 2 • Kapitel 5 (Transparenzkultur und Anreizsysteme)'
    },
    data: {
      id: 'data',
      title: 'Verifizierte datengestützte Entscheidungsfindung',
      shortDesc: 'Datenintegrität sichern, Kennzahlen harmonisieren und echten operativen Gewinn messen',
      bookChapterRef: 'Band 2 • Kapitel 4 (Saubere Daten, giftige Rechnungen & operativer Reingewinn)'
    },
    operations: {
      id: 'operations',
      title: 'Betriebliche Effizienz & Verschwendungsvermeidung',
      shortDesc: 'Beseitigung chronischer Mikrostopps, wiederkehrender Fehler und unsichtbarer Verluste',
      bookChapterRef: 'Band 1 • Kapitel 4 & Band 2 • Kapitel 6 (Versteckte Verschwendung & Standardarbeit)'
    },
    market: {
      id: 'market',
      title: 'Markt-, Kredit- & Inkassomanagement',
      shortDesc: 'Trennung von Scheingewinnen und echter Liquidität, realistische Lieferzusagen',
      bookChapterRef: 'Band 2 • Kapitel 3 (Zweitverkaufsmanagement & Cashflow-Gesundheit)'
    }
  },

  fr: {
    reality: {
      id: 'reality',
      title: 'Réalité & Observation Directe',
      shortDesc: 'Observer le terrain sans filtre, éliminer l’auto-illusion et les rapports cosmétiques',
      bookChapterRef: 'Volume 1 • Chapitres 1 & 2 (Observer la réalité brute sur le terrain)'
    },
    execution: {
      id: 'execution',
      title: 'Discipline d\'Exécution & Gestion de Crise',
      shortDesc: 'Responsabilités claires, délais fermes et indicateurs sans interventions paniques',
      bookChapterRef: 'Volume 2 • Chapitres 1 à 3 (Discipline d\'exécution & maîtrise des goulots)'
    },
    systems: {
      id: 'systems',
      title: 'Pensée Systémique & Gestion des Goulots',
      shortDesc: 'Vision globale de la chaîne de valeur, focalisation sur les vraies contraintes',
      bookChapterRef: 'Volume 1 • Chapitres 4 & 5 (Pensée systémique et Théorie des Contraintes TOC)'
    },
    memory: {
      id: 'memory',
      title: 'Mémoire Organisationnelle & Standardisation',
      shortDesc: 'Transformer le savoir individuel en check-lists vivantes et pérennes',
      bookChapterRef: 'Volume 1 • Chapitres 3 & 6 (Inventaire de roulements de 68 ans & le Manager Formateur)'
    },
    culture: {
      id: 'culture',
      title: 'Culture de Responsabilité & Remontée d\'Erreurs',
      shortDesc: 'Encourager le signalement précoce des erreurs et aligner les primes sur la rentabilité',
      bookChapterRef: 'Volume 1 • Chap. 7 & Volume 2 • Chap. 5 (Transparence et alignement des incitations)'
    },
    data: {
      id: 'data',
      title: 'Prise de Décision Fondée sur des Données Vérifiées',
      shortDesc: 'Valider la sincérité des données, réconcilier les écarts et mesurer le profit réel',
      bookChapterRef: 'Volume 2 • Chapitre 4 (Données fiables, factures toxiques et marge opérationnelle)'
    },
    operations: {
      id: 'operations',
      title: 'Efficacité Opérationnelle & Élimination des Gaspillages',
      shortDesc: 'Éradiquer les micro-arrêts répétés, les défauts chroniques et les pertes invisibles',
      bookChapterRef: 'Volume 1 • Chapitre 4 & Volume 2 • Chapitre 6 (Élimination des gaspillages cachés)'
    },
    market: {
      id: 'market',
      title: 'Gestion du Marché, Crédit & Recouvrement',
      shortDesc: 'Distinguer ventes rentables et créances toxiques, engagements de livraison réalistes',
      bookChapterRef: 'Volume 2 • Chapitre 3 (Gestion du réachat et santé de la trésorerie)'
    }
  },

  zh: {
    reality: {
      id: 'reality',
      title: '面对现实与一线直接观察',
      shortDesc: '直面未经粉饰的生产现场，摆脱自欺欺人与虚假汇报',
      bookChapterRef: '第1卷 • 第1与第2章（不带滤镜看现实，深入现场一线）'
    },
    execution: {
      id: 'execution',
      title: '执行纪律与危机控制',
      shortDesc: '明确责任主体、截止时间与关键指标，杜绝未理清事实的盲目干预',
      bookChapterRef: '第2卷 • 第1至第3章（执行纪律、危机管控与瓶颈把控）'
    },
    systems: {
      id: 'systems',
      title: '系统性思维与瓶颈管理',
      shortDesc: '纵观整条价值链，聚焦核心制约瓶颈，防止有害的局部优化',
      bookChapterRef: '第1卷 • 第4与第5章（系统思考、价值流与约束理论TOC）'
    },
    memory: {
      id: 'memory',
      title: '组织记忆与标准化流程',
      shortDesc: '将个人经验转化为活态清单与标准制度，降低对关键个人的过度依赖',
      bookChapterRef: '第1卷 • 第3与第6章（68年轴承盘点、打造沉淀记忆与导师型管理者）'
    },
    culture: {
      id: 'culture',
      title: '问责文化与一线真实反馈',
      shortDesc: '鼓励尽早暴露错误，倾听一线声音，重塑与整体效益相符的激励机制',
      bookChapterRef: '第1卷 • 第7章 及 第2卷 • 第5章（透明文化、诚实上报与激励重塑）'
    },
    data: {
      id: 'data',
      title: '真实可信数据驱动决策',
      shortDesc: '验证数据源头与口径，消除矛盾统计，测算真正的营业利润',
      bookChapterRef: '第2卷 • 第4章（干净数据、剔除有毒发票与核算真实利润）'
    },
    operations: {
      id: 'operations',
      title: '运营效率与隐性浪费消除',
      shortDesc: '发现并根除隐性浪费、顽固性微小停机与重复性质量缺陷',
      bookChapterRef: '第1卷 • 第4章 及 第2卷 • 第6章（消除隐性浪费与干预标准化）'
    },
    market: {
      id: 'market',
      title: '市场、授信与回款管理',
      shortDesc: '严格区分优质订单与有毒账期，设定务实交付承诺，落实客户信用审核',
      bookChapterRef: '第2卷 • 第3章（二次销售管理、现金回款健康度与信用核查）'
    }
  },

  ja: {
    reality: {
      id: 'reality',
      title: '現実直視と現場直接観察',
      shortDesc: '加工された報告を排除し、現場現物をありのままに直視する',
      bookChapterRef: '第1巻 • 第1章・第2章（装飾なき現実直視・現場観察の鉄則）'
    },
    execution: {
      id: 'execution',
      title: '実行規律と危機管理',
      shortDesc: '責任者・納期・指標の明確化と、事実確認なき拙速な介入の抑止',
      bookChapterRef: '第2巻 • 第1章〜第3章（実行規律、危機収拾とボトルネック統制）'
    },
    systems: {
      id: 'systems',
      title: 'システム思考とボトルネック管理',
      shortDesc: 'バリューストリーム全体を俯瞰し、真の制約に注力して有害な局所最適化を防ぐ',
      bookChapterRef: '第1巻 • 第4章・第5章（システム思考、バリューストリーム、TOC制約理論）'
    },
    memory: {
      id: 'memory',
      title: '組織的記憶と標準化',
      shortDesc: '属人的知識を動的チェックリストと標準手順に落とし込み、属人化を解消する',
      bookChapterRef: '第1巻 • 第3章・第6章（68年のベアリング棚卸し、組織記憶の定着と指導型マネージャー）'
    },
    culture: {
      id: 'culture',
      title: '責任文化と早期エラー報告',
      shortDesc: '早期のミス報告を称賛し、現場の声を汲み上げ、全体利益に即した報酬設計を行う',
      bookChapterRef: '第1巻 • 第7章／第2巻 • 第5章（透明性の文化、誠実なエラー報告とインセンティブ再設計）'
    },
    data: {
      id: 'data',
      title: '検証済みデータに基づく意思決定',
      shortDesc: 'データの信頼性を検証し、矛盾する数値を統合して真の営業利益を算出する',
      bookChapterRef: '第2巻 • 第4章（クリーンデータ、有害請求書の排除と真の営業利益）'
    },
    operations: {
      id: 'operations',
      title: '業務効率化と見えないロスの排除',
      shortDesc: '慢性的なチョコ停、微細な反復不良、見えない歩留まりロスを根絶する',
      bookChapterRef: '第1巻 • 第4章／第2巻 • 第6章（潜在的ムダの排除、標準作業と介入のルール）'
    },
    market: {
      id: 'market',
      title: '市場・与信・債権回収管理',
      shortDesc: '有毒な売掛金と健全な利益の峻別、現実的な納期コミットメントと厳格な与信',
      bookChapterRef: '第2巻 • 第3章（リピート売上管理、キャッシュ回収の健全化と与信審査）'
    }
  },

  hi: {
    reality: {
      id: 'reality',
      title: 'वास्तविकता और प्रत्यक्ष अवलोकन',
      shortDesc: 'दिखावटी रिपोर्टों को छोड़कर शॉप-फ्लोर की जमीनी हकीकत को सीधे देखना',
      bookChapterRef: 'खंड 1 • अध्याय 1 और 2 (बिना दिखावे के जमीनी हकीकत देखना और जेम्बा वॉक)'
    },
    execution: {
      id: 'execution',
      title: 'निष्पादन अनुशासन और संकट नियंत्रण',
      shortDesc: 'स्पष्ट जिम्मेदारी, समय-सीमा, परिणाम संकेतक और बिना तैयारी के जल्दबाजी हस्तक्षेप से बचाव',
      bookChapterRef: 'खंड 2 • अध्याय 1 से 3 (निष्पादन अनुशासन और बाधा नियंत्रण)'
    },
    systems: {
      id: 'systems',
      title: 'प्रणालीगत सोच और बाधा प्रबंधन',
      shortDesc: 'संपूर्ण मूल्य श्रृंखला को देखना, वास्तविक बाधा पर ध्यान देना और हानिकारक स्थानीय अनुकूलन रोकना',
      bookChapterRef: 'खंड 1 • अध्याय 4 और 5 (सिस्टम थिंकिंग, वैल्यू स्ट्रीम और बाधा सिद्धांत TOC)'
    },
    memory: {
      id: 'memory',
      title: 'संगठनात्मक स्मृति और मानकीकरण',
      shortDesc: 'व्यक्तिगत ज्ञान को चेकलिस्ट और स्थायी प्रक्रियाओं में बदलना ताकि व्यक्ति पर निर्भरता खत्म हो',
      bookChapterRef: 'खंड 1 • अध्याय 3 और 6 (68 साल का वेयरहाउस ऑडिट और शिक्षक प्रबंधक)'
    },
    culture: {
      id: 'culture',
      title: 'जवाबदेही संस्कृति और त्रुटि रिपोर्टिंग',
      shortDesc: 'समय पर गलती बताने को प्रोत्साहित करना और प्रोत्साहनों को संगठन के हित से जोड़ना',
      bookChapterRef: 'खंड 1 • अध्याय 7 और खंड 2 • अध्याय 5 (पारदर्शिता और प्रोत्साहन सुधार)'
    },
    data: {
      id: 'data',
      title: 'सत्यापित डेटा-आधारित निर्णय',
      shortDesc: 'डेटा की शुद्धता जांचना, विरोधाभासी आंकड़ों को सुलझाना और वास्तविक परिचालन लाभ निकालना',
      bookChapterRef: 'खंड 2 • अध्याय 4 (स्वच्छ डेटा, हानिकारक बिलों की समाप्ति और वास्तविक लाभ)'
    },
    operations: {
      id: 'operations',
      title: 'परिचालन दक्षता और बर्बादी का उन्मूलन',
      shortDesc: 'अदृश्य छोटे ठहराव, बार-बार होने वाले दोष और छिपी हुई बर्बादी को जड़ से खत्म करना',
      bookChapterRef: 'खंड 1 • अध्याय 4 और खंड 2 • अध्याय 6 (छिपी बर्बादी की समाप्ति और मानक कार्य)'
    },
    market: {
      id: 'market',
      title: 'बाजार, क्रेडिट और वसूली प्रबंधन',
      shortDesc: 'जोखिम भरे चालानों को लाभदायक बिक्री से अलग करना और वास्तविक डिलीवरी वादे करना',
      bookChapterRef: 'खंड 2 • अध्याय 3 (पुनरावृत्ति बिक्री प्रबंधन और नकदी प्रवाह स्वास्थ्य)'
    }
  },

  ar: {
    reality: {
      id: 'reality',
      title: 'مواجهة الواقع والملاحظة المباشرة',
      shortDesc: 'معاينة أرض العمليات دون رتوش أو تجميل، والابتعاد عن التقارير المضللة',
      bookChapterRef: 'المجلد الأول • الفصلان ۱ و ۲ (رؤية الواقع بلا رتوش والنزول للميدان)'
    },
    execution: {
      id: 'execution',
      title: 'الانضباط التنفيذي واحتواء الأزمات',
      shortDesc: 'تحديد المسؤول والموعد والمؤشرات بوضوح، وتجنب التدخلات الانفعالية المتسرعة',
      bookChapterRef: 'المجلد الثاني • الفصول من ۱ إلى ۳ (الانضباط التنفيذي وإدارة الاختناقات)'
    },
    systems: {
      id: 'systems',
      title: 'التفكير المنظومي وإدارة الاختناقات',
      shortDesc: 'رؤية سلسلة القيمة بأكملها، والتركيز على الاختناق الحقيقي بدلاً من التحسين الجزئي الضار',
      bookChapterRef: 'المجلد الأول • الفصلان ٤ و ٥ (التفكير المنظومي ونظرية القيود TOC)'
    },
    memory: {
      id: 'memory',
      title: 'الذاكرة المؤسسية والتوثيق القياسي',
      shortDesc: 'تحويل الخبرات الفردية إلى قوائم تحقق وإجراءات مستدامة لإنهاء الارتهان للأفراد',
      bookChapterRef: 'المجلد الأول • الفصلان ۳ و ٦ (جرد المستودعات التراكمي والمدير المعلم)'
    },
    culture: {
      id: 'culture',
      title: 'ثقافة المسؤولية والإبلاغ الصادق',
      shortDesc: 'تشجيع الإبلاغ المبكر عن الأخطاء، وسماع صوت الخطوط الأمامية، وإصلاح الحوافز',
      bookChapterRef: 'المجلد الأول • الفصل ۷ والمجلد الثاني • الفصل ٥ (ثقافة الشفافية وإعادة هيكلة الحوافز)'
    },
    data: {
      id: 'data',
      title: 'اتخاذ القرارات القائمة على البيانات الموثوقة',
      shortDesc: 'التحقق من صحة البيانات، وتوحيد الأرقام المتضاربة، واحتساب الأرباح التشغيلية الحقيقية',
      bookChapterRef: 'المجلد الثاني • الفصل ٤ (البيانات النقية، إزالة الفواتير السامة والربح الفعلي)'
    },
    operations: {
      id: 'operations',
      title: 'الكفاءة التشغيلية والقضاء على الهدر',
      shortDesc: 'استئصال التوقفات المتكررة الخفية، والعيوب المزمنة، والهدر غير المرئي',
      bookChapterRef: 'المجلد الأول • الفصل ٤ والمجلد الثاني • الفصل ٦ (القضاء على الهدر المخفي)'
    },
    market: {
      id: 'market',
      title: 'إدارة السوق والائتمان والتحصيل',
      shortDesc: 'فصل الفواتير السامة عن المبيعات المربحة، والالتزام بمواعيد تسليم واقعية ومدروسة',
      bookChapterRef: 'المجلد الثاني • الفصل ۳ (إدارة المبيعات المتكررة والتحصيل النقدي السليم)'
    }
  }
};

// 5 Management Tiers in 9 Languages
export const LOCALIZED_TIERS: Record<string, LocalizedTier[]> = {
  fa: [
    {
      level: 1,
      range: '۰ تا ۱۹ درصد',
      title: 'سازمان خودکار و پایدار (+۳ نهادینه‌شده)',
      shortDesc: 'سطح ۱: مدیریت سیستماتیک با حافظه ماندگار',
      badgeColor: 'bg-teal-500 text-white',
      cardColor: 'border-teal-400 bg-teal-500/10 text-teal-700 dark:text-teal-300',
      description: 'سازمان شما از تله‌های تصمیم‌گیری غریزی فاصله زیادی دارد. فرآیندها مستندند، تصمیم‌ها بر پایه مشاهده داده‌های زنده کف کارخانه گرفته می‌شوند و خروج نیروهای کلیدی سازمان را فلج نمی‌کند.'
    },
    {
      level: 2,
      range: '۲۰ تا ۳۹ درصد',
      title: 'مدیریت ساختاریافته در مسیر تکامل',
      shortDesc: 'سطح ۲: تعادل فرآیندی با نیاز به تثبیت بیشتر',
      badgeColor: 'bg-emerald-500 text-white',
      cardColor: 'border-emerald-400 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
      description: 'پایه‌های سیستمی خوبی بنا نهاده شده است. اما در شرایط ابهام یا برخی حوزه‌ها (مانند انبار، وصول یا گزارش خطا) تمایل به راه‌حل‌های کوتاه‌مدت یا تشخیص فردی دیده می‌شود.'
    },
    {
      level: 3,
      range: '۴۰ تا ۵۹ درصد',
      title: 'مدیریت غریزی متوسط (درگیری دوره‌ای با اطفای حریق)',
      shortDesc: 'سطح ۳: نوسان میان سیستم و رفتارهای تکانشی',
      badgeColor: 'bg-amber-500 text-white',
      cardColor: 'border-amber-400 bg-amber-500/10 text-amber-700 dark:text-amber-300',
      description: 'سازمان در روزهای عادی منظم است، اما در مواقع بحران و نوسانات بازار، تصمیمات شتاب‌زده، فشار به جای تحلیل و راه‌حل‌های موقت غالب می‌شوند که نشتی مالی و فرسایش منابع ایجاد می‌کنند.'
    },
    {
      level: 4,
      range: '۶۰ تا ۷۹ درصد',
      title: 'مدیریت غریزی شدید (وابستگی عمیق به فرد و بحران دائم)',
      shortDesc: 'سطح ۴: فرسایش منابع و تصمیم‌گیری واکنشی',
      badgeColor: 'bg-orange-500 text-white',
      cardColor: 'border-orange-400 bg-orange-500/10 text-orange-700 dark:text-orange-300',
      description: 'سازمان به شدت متکی به حضور و حافظه فیزیکی مدیران ارشد است. دستورات ضربتی، تنبیه بدون تحلیل فرآیند، فاکتورهای سمی فروش و توقف‌های مکرر، انرژی سازمان را تخلیه می‌کنند.'
    },
    {
      level: 5,
      range: '۸۰ تا ۱۰۰ درصد',
      title: 'وضعیت بحرانی اورانگوتانی (غلبه کامل رفتارهای تکانشی)',
      shortDesc: 'سطح ۵: خطر فوری انسداد عملیاتی و فقدان حافظه',
      badgeColor: 'bg-red-500 text-white',
      cardColor: 'border-red-400 bg-red-500/10 text-red-700 dark:text-red-300',
      description: 'سازمان در وضعیت بحرانی اورانگوتانی قرار دارد؛ تصمیمات بر پایه حدس و گمان، واکنش‌های احساسی، گزارش‌های روتوش‌شده و پاک‌کردن صورت‌مسئله گرفته می‌شوند و حافظه سازمانی وجود ندارد.'
    }
  ],

  en: [
    {
      level: 1,
      range: '0 to 19%',
      title: 'Enduring Self-Learning Organization (+3 Embedded)',
      shortDesc: 'Level 1: Systemic Governance with Institutional Memory',
      badgeColor: 'bg-teal-500 text-white',
      cardColor: 'border-teal-400 bg-teal-500/10 text-teal-700 dark:text-teal-300',
      description: 'Your organization is well protected from instinctive decision traps. Workflows are documented, choices are anchored in verified ground-level data, and key departures do not halt operations.'
    },
    {
      level: 2,
      range: '20 to 39%',
      title: 'Structured Management in Evolution',
      shortDesc: 'Level 2: Balanced Systems with Room for Consolidation',
      badgeColor: 'bg-emerald-500 text-white',
      cardColor: 'border-emerald-400 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
      description: 'Solid operational foundations exist. However, during market volatility or in specific domains (such as inventory or collections), reliance on individual instincts still re-emerges.'
    },
    {
      level: 3,
      range: '40 to 59%',
      title: 'Moderate Instinctive Management (Periodic Firefighting)',
      shortDesc: 'Level 3: Fluctuating Between Systems and Impulse',
      badgeColor: 'bg-amber-500 text-white',
      cardColor: 'border-amber-400 bg-amber-500/10 text-amber-700 dark:text-amber-300',
      description: 'Operations are orderly during quiet periods, but market pressure triggers hasty orders, blame shifting, and quick fixes that bleed cash and exhaust key staff.'
    },
    {
      level: 4,
      range: '60 to 79%',
      title: 'Severe Instinctive Management (Chronic Hero Dependency)',
      shortDesc: 'Level 4: Resource Depletion and Reactive Decision Making',
      badgeColor: 'bg-orange-500 text-white',
      cardColor: 'border-orange-400 bg-orange-500/10 text-orange-700 dark:text-orange-300',
      description: 'Heavy reliance on executive memory and physical presence. Emergency meetings, punitive measures without process audits, and toxic sales invoices severely weaken operations.'
    },
    {
      level: 5,
      range: '80 to 100%',
      title: 'Critical Orangutan Crisis (Total Impulse Dominance)',
      shortDesc: 'Level 5: Imminent Operational Paralysis & Memory Void',
      badgeColor: 'bg-red-500 text-white',
      cardColor: 'border-red-400 bg-red-500/10 text-red-700 dark:text-red-300',
      description: 'The organization operates in acute Orangutan crisis mode. Decisions stem from guesswork, shouting, and cosmetic reporting with zero enduring institutional memory.'
    }
  ],

  es: [
    {
      level: 1,
      range: '0 a 19%',
      title: 'Organización Autónoma y Duradera (+3 Consolidado)',
      shortDesc: 'Nivel 1: Gestión Sistemática con Memoria Institucional',
      badgeColor: 'bg-teal-500 text-white',
      cardColor: 'border-teal-400 bg-teal-500/10 text-teal-700 dark:text-teal-300',
      description: 'Su organización está blindada contra trampas instintivas. Los procesos están documentados, las decisiones se basan en datos directos y la salida de personal clave no paraliza la operación.'
    },
    {
      level: 2,
      range: '20 a 39%',
      title: 'Gestión Estructurada en Evolución',
      shortDesc: 'Nivel 2: Procesos Balanceados con Necesidad de Refuerzo',
      badgeColor: 'bg-emerald-500 text-white',
      cardColor: 'border-emerald-400 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
      description: 'Existen buenas bases sistémicas, pero ante la incertidumbre o en áreas específicas (almacén o cobranza) aún surgen decisiones basadas en criterio puramente personal.'
    },
    {
      level: 3,
      range: '40 a 59%',
      title: 'Gestión Instintiva Moderada (Apagafuegos Periódico)',
      shortDesc: 'Nivel 3: Fluctuación entre Sistemas y Reacciones Impulsivas',
      badgeColor: 'bg-amber-500 text-white',
      cardColor: 'border-amber-400 bg-amber-500/10 text-amber-700 dark:text-amber-300',
      description: 'La organización funciona en días normales, pero las crisis desatan órdenes apresuradas y soluciones temporales que desgastan recursos y filtran liquidez.'
    },
    {
      level: 4,
      range: '60 a 79%',
      title: 'Gestión Instintiva Severa (Alta Dependencia Personal)',
      shortDesc: 'Nivel 4: Desgaste Operativo y Respuestas Reactivas',
      badgeColor: 'bg-orange-500 text-white',
      cardColor: 'border-orange-400 bg-orange-500/10 text-orange-700 dark:text-orange-300',
      description: 'Fuerte dependencia de la presencia de directivos clave. Medidas punitivas sin análisis de procesos y facturación tóxica agotan la energía del equipo.'
    },
    {
      level: 5,
      range: '80 a 100%',
      title: 'Estado Crítico de Modo Orangután (Impulso Total)',
      shortDesc: 'Nivel 5: Riesgo Inmediato de Parálisis y Falta de Memoria',
      badgeColor: 'bg-red-500 text-white',
      cardColor: 'border-red-400 bg-red-500/10 text-red-700 dark:text-red-300',
      description: 'La empresa está en crisis instintiva. Las decisiones se toman por conjeturas, gritos y reportes maquillados, careciendo totalmente de memoria institucional.'
    }
  ],

  de: [
    {
      level: 1,
      range: '0 bis 19%',
      title: 'Selbstlernende & Dauerhafte Organisation (+3 Verankert)',
      shortDesc: 'Stufe 1: Systematische Führung mit Institutionellem Gedächtnis',
      badgeColor: 'bg-teal-500 text-white',
      cardColor: 'border-teal-400 bg-teal-500/10 text-teal-700 dark:text-teal-300',
      description: 'Ihr Unternehmen ist vor instinktiven Entscheidungsfallen geschützt. Prozesse sind dokumentiert, Entscheidungen basieren auf Live-Daten und Personalabgänge lähmen den Betrieb nicht.'
    },
    {
      level: 2,
      range: '20 bis 39%',
      title: 'Strukturierte Führung im Reifeprozess',
      shortDesc: 'Stufe 2: Solide Prozesse mit weiterem Konsolidierungsbedarf',
      badgeColor: 'bg-emerald-500 text-white',
      cardColor: 'border-emerald-400 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
      description: 'Gute systemische Grundlagen sind vorhanden. In Krisen oder sensiblen Bereichen (Lager, Inkasso) greift man jedoch noch zu kurzfristigen Einzelentscheidungen.'
    },
    {
      level: 3,
      range: '40 bis 59%',
      title: 'Mittlere Instinktivführung (Periodische Brandbekämpfung)',
      shortDesc: 'Stufe 3: Schwankung zwischen Systemen und impulsivem Handeln',
      badgeColor: 'bg-amber-500 text-white',
      cardColor: 'border-amber-400 bg-amber-500/10 text-amber-700 dark:text-amber-300',
      description: 'Im Normalbetrieb geordnet, dominieren bei Marktvolatilität überstürzte Anordnungen und Notlösungen, die Liquidität kosten und Ressourcen erschöpfen.'
    },
    {
      level: 4,
      range: '60 bis 79%',
      title: 'Schwere Instinktivführung (Starke Personenabhängigkeit)',
      shortDesc: 'Stufe 4: Ressourcenverschleiß und rein reaktive Entscheidungen',
      badgeColor: 'bg-orange-500 text-white',
      cardColor: 'border-orange-400 bg-orange-500/10 text-orange-700 dark:text-orange-300',
      description: 'Hohe Abhängigkeit vom Gedächtnis einzelner Führungskräfte. Strafen ohne Ursachenanalyse und toxische Rechnungen schwächen die Organisation dauerhaft.'
    },
    {
      level: 5,
      range: '80 bis 100%',
      title: 'Kritischer Orang-Utan-Modus (Vollständige Impulsdominanz)',
      shortDesc: 'Stufe 5: Akute Lähmungsgefahr und fehlende Dokumentation',
      badgeColor: 'bg-red-500 text-white',
      cardColor: 'border-red-400 bg-red-500/10 text-red-700 dark:text-red-300',
      description: 'Das Unternehmen befindet sich im akuten Krisenmodus. Entscheidungen entstehen aus Vermutungen, emotionalen Reaktionen und geschönten Berichten ohne jede Systematik.'
    }
  ],

  fr: [
    {
      level: 1,
      range: '0 à 19%',
      title: 'Organisation Pérenne & Auto-Apprenante (+3 Intégré)',
      shortDesc: 'Niveau 1 : Gouvernance Systémique et Mémoire Établie',
      badgeColor: 'bg-teal-500 text-white',
      cardColor: 'border-teal-400 bg-teal-500/10 text-teal-700 dark:text-teal-300',
      description: 'Votre organisation est immunisée contre les réflexes instinctifs. Les processus sont documentés, les décisions reposent sur le terrain et les départs ne bloquent pas l’activité.'
    },
    {
      level: 2,
      range: '20 à 39%',
      title: 'Gestion Structurée en Consolidation',
      shortDesc: 'Niveau 2 : Bon Équilibre avec Besoin de Standardisation',
      badgeColor: 'bg-emerald-500 text-white',
      cardColor: 'border-emerald-400 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
      description: 'Les fondations sont solides, mais sous pression ou dans certains secteurs (stocks, recouvrement), la tentation du jugement individuel sans méthode subsiste.'
    },
    {
      level: 3,
      range: '40 à 59%',
      title: 'Gestion Instinctive Modérée (Pompiers Périodiques)',
      shortDesc: 'Niveau 3 : Oscillation entre Procédures et Impulsions',
      badgeColor: 'bg-amber-500 text-white',
      cardColor: 'border-amber-400 bg-amber-500/10 text-amber-700 dark:text-amber-300',
      description: 'Régulière en période calme, l\'organisation bascule dans l\'urgence et les solutions temporaires lors des crises, générant des fuites de trésorerie.'
    },
    {
      level: 4,
      range: '60 à 79%',
      title: 'Gestion Instinctive Sévère (Forte Dépendance Individuelle)',
      shortDesc: 'Niveau 4 : Épuisement des Ressources et Pilotage Réactif',
      badgeColor: 'bg-orange-500 text-white',
      cardColor: 'border-orange-400 bg-orange-500/10 text-orange-700 dark:text-orange-300',
      description: 'Dépendance excessive envers quelques dirigeants. Sanctions sans analyse de processus et factures toxiques sapent la rentabilité globale.'
    },
    {
      level: 5,
      range: '80 à 100%',
      title: 'Crise Critique du Mode Orang-outan (Impulsions Généralisées)',
      shortDesc: 'Niveau 5 : Risque Imminent de Blocage et Absence de Mémoire',
      badgeColor: 'bg-red-500 text-white',
      cardColor: 'border-red-400 bg-red-500/10 text-red-700 dark:text-red-300',
      description: 'L\'organisation est en crise réflexe aiguë. Les décisions reposent sur des suppositions, des colères et des rapports faussés, sans aucune mémoire collective.'
    }
  ],

  zh: [
    {
      level: 1,
      range: '0至19%',
      title: '自驱动沉淀型组织（3+ 深度内化）',
      shortDesc: '第1级：系统化治理与组织记忆健全',
      badgeColor: 'bg-teal-500 text-white',
      cardColor: 'border-teal-400 bg-teal-500/10 text-teal-700 dark:text-teal-300',
      description: '您的组织已有效摆脱本能式决策陷阱。核心流程高度文档化，决策依托一线实据，骨干流失不会导致运营瘫痪。'
    },
    {
      level: 2,
      range: '20至39%',
      title: '结构化管理进阶中',
      shortDesc: '第2级：流程体系初显成效，需进一步固化',
      badgeColor: 'bg-emerald-500 text-white',
      cardColor: 'border-emerald-400 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
      description: '建立了良好的系统基础。但在市场波动或特定领域（如仓储盘点、催款考核）中，仍存在依靠个人直觉拍脑袋的倾向。'
    },
    {
      level: 3,
      range: '40至59%',
      title: '中度本能式管理（周期性救火陷阱）',
      shortDesc: '第3级：在规范制度与冲动应激之间摇摆',
      badgeColor: 'bg-amber-500 text-white',
      cardColor: 'border-amber-400 bg-amber-500/10 text-amber-700 dark:text-amber-300',
      description: '平时运行相对规范，但一遇市场波动或紧急状况，仓促指令与权宜之计便占据主导，导致财务暗漏与团队内耗。'
    },
    {
      level: 4,
      range: '60至79%',
      title: '重度本能式管理（深度人身依附与持续危机）',
      shortDesc: '第4级：资源持续流失与被动应激决策',
      badgeColor: 'bg-orange-500 text-white',
      cardColor: 'border-orange-400 bg-orange-500/10 text-orange-700 dark:text-orange-300',
      description: '高度依赖高管个人的在场与记忆。缺乏流程审计的罚款、有毒应收账款及频繁停工严重损耗着组织能量。'
    },
    {
      level: 5,
      range: '80至100%',
      title: '猩猩模式危急状态（完全被冲动与情绪主导）',
      shortDesc: '第5级：面临运营停滞风险且缺乏沉淀机制',
      badgeColor: 'bg-red-500 text-white',
      cardColor: 'border-red-400 bg-red-500/10 text-red-700 dark:text-red-300',
      description: '组织深陷本能危机模式；决策依赖猜测、情绪化拍板和粉饰的报表，组织完全缺乏可传承的记忆与方法论。'
    }
  ],

  ja: [
    {
      level: 1,
      range: '0〜19%',
      title: '自律学習型・持続可能組織（3+ 体系定着）',
      shortDesc: 'レベル1：組織記憶に支えられた体系的ガバナンス',
      badgeColor: 'bg-teal-500 text-white',
      cardColor: 'border-teal-400 bg-teal-500/10 text-teal-700 dark:text-teal-300',
      description: '組織は本能的経営の罠から脱却しています。プロセスは文書化され、現場のリアルデータに基づいて意思決定が行われ、要員の離脱でも業務が止まりません。'
    },
    {
      level: 2,
      range: '20〜39%',
      title: '進化過程にある構造化経営',
      shortDesc: 'レベル2：プロセス均衡とさらなる定着の必要性',
      badgeColor: 'bg-emerald-500 text-white',
      cardColor: 'border-emerald-400 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
      description: '強固なシステム基盤が整っていますが、不確実な状況や特定領域（在庫・回収・エラー報告など）で個人の直感に頼る傾向が残っています。'
    },
    {
      level: 3,
      range: '40〜59%',
      title: '中度の本能的経営（周期的な火消し対応）',
      shortDesc: 'レベル3：システムと衝動的対応の間の揺らぎ',
      badgeColor: 'bg-amber-500 text-white',
      cardColor: 'border-amber-400 bg-amber-500/10 text-amber-700 dark:text-amber-300',
      description: '平常時は整然としていますが、市場のプレッシャーが高まると拙速な命令や対症療法が優先され、リソースの消耗と資金漏れが生じます。'
    },
    {
      level: 4,
      range: '60〜79%',
      title: '重度の本能的経営（属人化と慢性危機の常態化）',
      shortDesc: 'レベル4：資源の疲弊と場当たり的なリアクション経営',
      badgeColor: 'bg-orange-500 text-white',
      cardColor: 'border-orange-400 bg-orange-500/10 text-orange-700 dark:text-orange-300',
      description: '経営陣の個人的な記憶と現場での常時介入に過度に依存しています。根本原因分析なき罰則や有毒な売掛金が企業の体力を奪っています。'
    },
    {
      level: 5,
      range: '80〜100%',
      title: '危機的オランウータン状態（衝動と感情の完全支配）',
      shortDesc: 'レベル5：業務停止の切迫したリスクと組織記憶の欠如',
      badgeColor: 'bg-red-500 text-white',
      cardColor: 'border-red-400 bg-red-500/10 text-red-700 dark:text-red-300',
      description: '組織は危機的な本能モードにあります。推測、感情的な怒り、体裁を繕った報告によって意思決定が行われ、組織的記憶が皆無です。'
    }
  ],

  hi: [
    {
      level: 1,
      range: '0 से 19%',
      title: 'स्व-शिक्षण और स्थायी संगठन (+3 स्थापित)',
      shortDesc: 'स्तर 1: संस्थागत स्मृति के साथ व्यवस्थित शासन',
      badgeColor: 'bg-teal-500 text-white',
      cardColor: 'border-teal-400 bg-teal-500/10 text-teal-700 dark:text-teal-300',
      description: 'आपका संगठन सहज निर्णयों के नुकसान से सुरक्षित है। प्रक्रियाएं प्रलेखित हैं, निर्णय जमीनी आंकड़ों पर आधारित हैं और मुख्य कर्मचारियों के जाने से काम नहीं रुकता।'
    },
    {
      level: 2,
      range: '20 से 39%',
      title: 'विकास की राह पर संरचित प्रबंधन',
      shortDesc: 'स्तर 2: संतुलित प्रक्रियाएं और अधिक मजबूती की जरूरत',
      badgeColor: 'bg-emerald-500 text-white',
      cardColor: 'border-emerald-400 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
      description: 'मजबूत प्रणालीगत आधार मौजूद है। लेकिन दबाव या कुछ क्षेत्रों (जैसे गोदाम या वसूली) में व्यक्तिगत निर्णय पर निर्भरता अभी भी दिखाई देती है।'
    },
    {
      level: 3,
      range: '40 से 59%',
      title: 'मध्यम सहज प्रबंधन (समय-समय पर आग बुझाना)',
      shortDesc: 'स्तर 3: नियमों और आवेगी व्यवहार के बीच उतार-चढ़ाव',
      badgeColor: 'bg-amber-500 text-white',
      cardColor: 'border-amber-400 bg-amber-500/10 text-amber-700 dark:text-amber-300',
      description: 'सामान्य दिनों में सब व्यवस्थित रहता है, लेकिन बाजार के दबाव में जल्दबाजी के फैसले और अस्थायी समाधान हावी हो जाते हैं जिससे नकदी का नुकसान होता है।'
    },
    {
      level: 4,
      range: '60 से 79%',
      title: 'गंभीर सहज प्रबंधन (व्यक्ति पर अत्यधिक निर्भरता)',
      shortDesc: 'स्तर 4: संसाधनों की बर्बादी और प्रतिक्रियात्मक निर्णय',
      badgeColor: 'bg-orange-500 text-white',
      cardColor: 'border-orange-400 bg-orange-500/10 text-orange-700 dark:text-orange-300',
      description: 'वरिष्ठ अधिकारियों की उपस्थिति और याददाश्त पर अत्यधिक निर्भरता। बिना विश्लेषण के दंड और हानिकारक बिल संगठन की ऊर्जा खत्म कर रहे हैं।'
    },
    {
      level: 5,
      range: '80 से 100%',
      title: 'अत्यधिक संकटपूर्ण स्थिति (पूरी तरह आवेग का प्रभुत्व)',
      shortDesc: 'स्तर 5: काम रुकने का तत्काल जोखिम और स्मृति का अभाव',
      badgeColor: 'bg-red-500 text-white',
      cardColor: 'border-red-400 bg-red-500/10 text-red-700 dark:text-red-300',
      description: 'संगठन गंभीर सहज संकट में है। निर्णय अनुमानों, गुस्से और सजावटी रिपोर्टों पर आधारित हैं तथा कोई संस्थागत स्मृति मौजूद नहीं है।'
    }
  ],

  ar: [
    {
      level: 1,
      range: '۰ إلى ۱۹٪',
      title: 'مؤسسة ذاتية التعلم ومستدامة (+۳ راسخ)',
      shortDesc: 'المستوى ۱: إدارة منهجية ذات ذاكرة مؤسسية',
      badgeColor: 'bg-teal-500 text-white',
      cardColor: 'border-teal-400 bg-teal-500/10 text-teal-700 dark:text-teal-300',
      description: 'مؤسستكم محصنة ضد فخاخ القرارات الغريزية. الإجراءات موثقة، والقرارات مبنية على بيانات الميدان الحية، وخروج الكوادر لا يعطل العمليات.'
    },
    {
      level: 2,
      range: '۲۰ إلى ۳۹٪',
      title: 'إدارة مهيكلة في مسار التطور',
      shortDesc: 'المستوى ۲: توازن إجرائي بحاجة لمزيد من التثبيت',
      badgeColor: 'bg-emerald-500 text-white',
      cardColor: 'border-emerald-400 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
      description: 'هناك أسس منظومية جيدة. ولكن في أوقات الغموض أو في مجالات محددة (كالمستودعات أو التحصيل) تبرز الحلول الفردية والاجتهاد المؤقت.'
    },
    {
      level: 3,
      range: '٤۰ إلى ٥۹٪',
      title: 'إدارة غريزية متوسطة (إطفاء حرائق دوري)',
      shortDesc: 'المستوى ۳: تذبذب بين النظام وردود الفعل الانفعالية',
      badgeColor: 'bg-amber-500 text-white',
      cardColor: 'border-amber-400 bg-amber-500/10 text-amber-700 dark:text-amber-300',
      description: 'تسير الأمور بانتظام في الأوقات العادية، لكن ضغط الأزمات يفجر قرارات متسرعة وحلولاً ترقيعية تستنزف الموارد والسيولة النقدية.'
    },
    {
      level: 4,
      range: '٦۰ إلى ۷۹٪',
      title: 'إدارة غريزية شديدة (ارتهان دائم للأشخاص)',
      shortDesc: 'المستوى ٤: استنزاف الموارد والقرارات الانفعالية',
      badgeColor: 'bg-orange-500 text-white',
      cardColor: 'border-orange-400 bg-orange-500/10 text-orange-700 dark:text-orange-300',
      description: 'اعتماد هائل على الحضور الشخصي للمديرين. الأوامر المرتجلة، العقوبات دون فحص الإجراءات، والفواتير السامة ترهق طاقة المنشأة.'
    },
    {
      level: 5,
      range: '۸۰ إلى ۱۰۰٪',
      title: 'وضع الأورانغوتان الحرج (هيمنة تامة للانفعال)',
      shortDesc: 'المستوى ٥: خطر الشلل التشغيلي وغياب الذاكرة المؤسسية',
      badgeColor: 'bg-red-500 text-white',
      cardColor: 'border-red-400 bg-red-500/10 text-red-700 dark:text-red-300',
      description: 'المؤسسة في وضع غريزي حرج؛ القرارات مبنية على التخمين وردود الفعل العصبية والتقارير المزوقة، مع غياب تام للذاكرة المؤسسية.'
    }
  ]
};

// Localized Consistency Feedback
export const LOCALIZED_CONSISTENCY: Record<string, { high: LocalizedConsistency; medium: LocalizedConsistency; low: LocalizedConsistency }> = {
  fa: {
    high: {
      title: 'اطمینان بالا (پاسخ‌های باثبات و همگرا)',
      description: 'پاسخ‌های شما در سناریوهای متقاطع از ثبات و یکپارچگی بالایی برخوردارند و الگوی فکری منسجمی را نشان می‌دهند.'
    },
    medium: {
      title: 'اطمینان متوسط (نوسان جزئی در سناریوهای مشابه)',
      description: 'در برخی سناریوهای مشابه، پاسخ‌های متفاوتی ثبت شده است که نشان‌دهنده تغییر سبک تصمیم‌گیری در شرایط فشار یا موضوعات خاص است.'
    },
    low: {
      title: 'پاسخ‌های ناسازگار (الگوی موقعیتی یا متناقض)',
      description: 'پاسخ‌ها در چند سناریوی مشابه ناسازگارند و نشان‌دهنده تصمیم‌گیری موقعیتی، احساسی یا عدم ثبات در اصول مدیریتی سازمان است.'
    }
  },
  en: {
    high: {
      title: 'High Confidence (Consistent & Convergent)',
      description: 'Your answers across cross-checking scenario pairs demonstrate strong stability and a coherent decision-making logic.'
    },
    medium: {
      title: 'Moderate Confidence (Slight Volatility)',
      description: 'Minor divergence observed in similar operational contexts, pointing to situational shifts under pressure.'
    },
    low: {
      title: 'Inconsistent Pattern (Situational / Conflicting)',
      description: 'Significant variances detected between matching control scenarios, reflecting reactive decision-making.'
    }
  },
  es: {
    high: {
      title: 'Alta Confianza (Respuestas Coherentes y Estables)',
      description: 'Sus respuestas en los escenarios cruzados muestran una lógica sólida y un patrón directivo consistente.'
    },
    medium: {
      title: 'Confianza Media (Ligera Variación Situacional)',
      description: 'Se observan discrepancias leves en contextos análogos, indicando variaciones de criterio bajo presión.'
    },
    low: {
      title: 'Patrón Inconsistente (Decisiones Reactivas)',
      description: 'Divergencias marcadas entre escenarios de control, reflejando falta de principios homogéneos.'
    }
  },
  de: {
    high: {
      title: 'Hohe Zuverlässigkeit (Konsistente Antworten)',
      description: 'Ihre Antworten in den Kontrollszenarien weisen eine bemerkenswerte Stabilität und ein klares Denkmuster auf.'
    },
    medium: {
      title: 'Mittlere Zuverlässigkeit (Leichte Schwankungen)',
      description: 'Geringe Abweichungen in ähnlichen Situationen deuten auf situatives Entscheiden unter Belastung hin.'
    },
    low: {
      title: 'Inkonsistentes Muster (Widersprüchliche Reaktionen)',
      description: 'Starke Varianzen zwischen Kontrollszenarien weisen auf reaktive und unbeständige Führungsansätze hin.'
    }
  },
  fr: {
    high: {
      title: 'Haute Confiance (Réponses Cohérentes et Stables)',
      description: 'Vos réponses sur les scénarios de contrôle croisé témoignent d\'une grande homogénéité de raisonnement.'
    },
    medium: {
      title: 'Confiance Modérée (Légère Fluctuation)',
      description: 'Quelques variations constatées dans des situations proches, révélant des arbitrages fluctuants sous pression.'
    },
    low: {
      title: 'Profil Hétérogène (Décisions Réactives)',
      description: 'Divergences nettes entre scénarios similaires, signe d\'un pilotage instinctif et conjoncturel.'
    }
  },
  zh: {
    high: {
      title: '高置信度（逻辑高度一致且稳定）',
      description: '您在交叉校验场景中的回答表现出极高的逻辑连贯性与思维稳定性。'
    },
    medium: {
      title: '中等置信度（部分同类场景存在波动）',
      description: '在相似业务场景中出现轻微回答偏离，表明在特定压力或领域下决策风格有所变动。'
    },
    low: {
      title: '置信度较低（存在情境式矛盾回答）',
      description: '多道交叉对照场景的回答存在明显冲突，反映出决策受情绪或偶发情境影响较大。'
    }
  },
  ja: {
    high: {
      title: '高信頼性（一貫性と収束性の高い回答）',
      description: 'クロスチェック設問において回答のブレが極めて少なく、首尾一貫した思考パターンを示しています。'
    },
    medium: {
      title: '中信頼性（類似シナリオでの軽微な変動）',
      description: '類似の状況下で回答に一部相違が見られ、プレッシャーや特定分野による判断基準の揺らぎが窺えます。'
    },
    low: {
      title: '低信頼性（場当たり的または矛盾する回答）',
      description: '類似シナリオ間で回答の不一致が目立ち、状況依存的で感情的な判断傾向が示唆されます。'
    }
  },
  hi: {
    high: {
      title: 'उच्च विश्वसनीयता (स्थिर और सुसंगत उत्तर)',
      description: 'क्रॉस-चेक परिदृश्यों में आपके उत्तर उच्च स्थिरता और स्पष्ट सोच पद्धति प्रदर्शित करते हैं।'
    },
    medium: {
      title: 'मध्यम विश्वसनीयता (मामूली उतार-चढ़ाव)',
      description: 'समान स्थितियों में मामूली अंतर दिखा है, जो दबाव में निर्णय शैली बदलने का संकेत है।'
    },
    low: {
      title: 'असंगत पैटर्न (परिवर्तनशील प्रतिक्रियाएं)',
      description: 'समान परिदृश्यों में स्पष्ट विरोधाभास है, जो भावनात्मक और स्थितिजन्य निर्णयों को दर्शाता है।'
    }
  },
  ar: {
    high: {
      title: 'موثوقية عالية (إجابات متسقة ومتقاربة)',
      description: 'أظهرت إجاباتكم في السيناريوهات المتقاطعة ثباتاً ملحوظاً ونمطاً فكرياً متماسكاً.'
    },
    medium: {
      title: 'موثوقية متوسطة (تذبذب طفيف في المواقف المتشابهة)',
      description: 'لوحظت فروقات طفيفة في سيناريوهات متطابقة، مما يشير لتغير أسلوب القرار تحت الضغط.'
    },
    low: {
      title: 'نمط غير متسق (قرارات ظرفية متناقضة)',
      description: 'تباينات واضحة بين السيناريوهات المتطابقة تدل على قرارات انفعالية تفتقر للمنهج الثابت.'
    }
  }
};

// 5 Intake Profile Dropdowns in 9 Languages
export const LOCALIZED_INTAKE_OPTIONS: Record<string, LocalizedIntakeOptions> = {
  fa: {
    roleLabel: '۱. سمت یا جایگاه سازمانی',
    rolePlaceholder: '-- انتخاب سمت سازمانی --',
    roles: [
      { value: 'مدیرعامل / مؤسس / مالک کسب‌وکار', label: 'مدیرعامل / مؤسس / مالک کسب‌وکار' },
      { value: 'عضو هیئت‌مدیره / سهامدار ارشد', label: 'عضو هیئت‌مدیره / سهامدار ارشد' },
      { value: 'مدیر ارشد عملیات و تولید / مدیر کارخانه', label: 'مدیر ارشد عملیات و تولید / مدیر کارخانه' },
      { value: 'مدیر میانی (فروش، مالی، انبار، کیفیت)', label: 'مدیر میانی (فروش، مالی، انبار، منابع انسانی، کیفیت)' },
      { value: 'سرپرست خط / کارشناس ارشد', label: 'سرپرست خط / کارشناس ارشد اجرایی' },
      { value: 'مشاور مدیریت / ارزیاب سازمانی', label: 'مشاور مدیریت / مدرس / ارزیاب سازمانی' }
    ],
    industryLabel: '۲. صنعت / نوع سازمان',
    industryPlaceholder: '-- انتخاب حوزه فعالیت --',
    industries: [
      { value: 'تولیدی / صنعتی / کارخانجات', label: 'تولیدی / صنعتی / کارخانجات و فرآوری' },
      { value: 'بازرگانی / پخش و توزیع', label: 'بازرگانی / واردات / صادرات / پخش و توزیع' },
      { value: 'خدماتی / فناوری و IT / استارتاپ', label: 'خدماتی / فناوری اطلاعات و نرم‌افزار / پلتفرم' },
      { value: 'پیمانکاری / عمرانی / ساختمانی', label: 'پیمانکاری / مهندسی / نفت و گاز / عمران' },
      { value: 'بهداشتی / دارویی / مواد غذایی', label: 'صنایع غذایی / دارویی / آرایشی و بهداشتی' },
      { value: 'فروشگاهی / خرده‌فروشی / زنجیره‌ای', label: 'فروشگاهی / خرده‌فروشی / هایپرمارکت' }
    ],
    headcountLabel: '۳. تعداد کل کارکنان',
    headcountPlaceholder: '-- انتخاب تعداد پرسنل --',
    headcounts: [
      { value: '۱ تا ۱۰ نفر (تیم کوچک)', label: '۱ تا ۱۰ نفر (میکرو / تیم کوچک)' },
      { value: '۱۱ تا ۵۰ نفر (کسب‌وکار کوچک)', label: '۱۱ تا ۵۰ نفر (کسب‌وکار کوچک)' },
      { value: '۵۱ تا ۲۰۰ نفر (سازمان متوسط)', label: '۵۱ تا ۲۰۰ نفر (سازمان متوسط)' },
      { value: '۲۰۱ تا ۵۰۰ نفر (سازمان بزرگ)', label: '۲۰۱ تا ۵۰۰ نفر (صنایع بزرگ)' },
      { value: 'بیش از ۵۰۰ نفر (سازمان هلدینگ)', label: 'بیش از ۵۰۰ نفر (سازمان‌های بزرگ و هلدینگ)' }
    ],
    experienceLabel: '۴. سابقه مدیریت شما',
    experiencePlaceholder: '-- سابقه مدیریتی --',
    experiences: [
      { value: 'کمتر از ۲ سال', label: 'کمتر از ۲ سال (مدیر نوپا)' },
      { value: '۲ تا ۵ سال', label: '۲ تا ۵ سال' },
      { value: '۶ تا ۱۰ سال', label: '۶ تا ۱۰ سال' },
      { value: '۱۱ تا ۲۰ سال', label: '۱۱ تا ۲۰ سال' },
      { value: 'بیش از ۲۰ سال', label: 'بیش از ۲۰ سال (مدیر باسابقه و پیشکسوت)' }
    ],
    scopeLabel: '۵. محدوده ارزیابی',
    scopePlaceholder: '-- انتخاب محدوده ارزیابی --',
    scopes: [
      { value: 'کل سازمان / شرکت / کارخانه', label: 'کل سازمان / شرکت / کارخانه (نگاه هلی‌کوپتری به تمام واحدها)' },
      { value: 'واحد یا کارخانه تحت مدیریت مستقیم من', label: 'واحد یا کارخانه تحت مدیریت مستقیم من' },
      { value: 'سبک و عادات تصمیم‌گیری شخصی من به عنوان مدیر', label: 'سبک و عادات تصمیم‌گیری شخصی من به عنوان مدیر' }
    ]
  },

  en: {
    roleLabel: '1. Your Organizational Role',
    rolePlaceholder: '-- Select Your Role --',
    roles: [
      { value: 'CEO / Founder / Business Owner', label: 'CEO / Founder / Business Owner' },
      { value: 'Board Member / Senior Shareholder', label: 'Board Member / Senior Shareholder' },
      { value: 'COO / Plant Manager / Operations VP', label: 'COO / Plant Manager / Operations VP' },
      { value: 'Middle Manager (Sales, Finance, QA, Supply Chain)', label: 'Middle Manager (Sales, Finance, QA, Supply Chain)' },
      { value: 'Frontline Supervisor / Senior Lead', label: 'Frontline Supervisor / Senior Lead' },
      { value: 'Management Consultant / Executive Coach', label: 'Management Consultant / Executive Coach' }
    ],
    industryLabel: '2. Industry & Sector',
    industryPlaceholder: '-- Select Industry --',
    industries: [
      { value: 'Manufacturing & Heavy Industry', label: 'Manufacturing, Heavy Industry & Fabrication' },
      { value: 'Trade, Import/Export & Distribution', label: 'Trade, Import/Export, Wholesale & Distribution' },
      { value: 'Technology, Software & IT Services', label: 'Technology, Software, Platforms & IT Services' },
      { value: 'Engineering, Construction & Energy', label: 'Engineering, EPC, Construction & Energy' },
      { value: 'Food, Pharma & FMCG', label: 'Food, Pharmaceuticals & FMCG' },
      { value: 'Retail & Multi-Unit Commerce', label: 'Retail, Hypermarkets & Multi-Unit Commerce' }
    ],
    headcountLabel: '3. Total Workforce Size',
    headcountPlaceholder: '-- Select Headcount --',
    headcounts: [
      { value: '1 to 10 employees (Micro Team)', label: '1 to 10 employees (Micro Team)' },
      { value: '11 to 50 employees (Small Business)', label: '11 to 50 employees (Small Business)' },
      { value: '51 to 200 employees (Mid-Sized Enterprise)', label: '51 to 200 employees (Mid-Sized Enterprise)' },
      { value: '201 to 500 employees (Large Corporation)', label: '201 to 500 employees (Large Corporation)' },
      { value: 'Over 500 employees (Conglomerate/Holding)', label: 'Over 500 employees (Conglomerate/Holding)' }
    ],
    experienceLabel: '4. Executive Experience',
    experiencePlaceholder: '-- Select Experience --',
    experiences: [
      { value: 'Under 2 years (Emerging Executive)', label: 'Under 2 years (Emerging Executive)' },
      { value: '2 to 5 years', label: '2 to 5 years' },
      { value: '6 to 10 years', label: '6 to 10 years' },
      { value: '11 to 20 years', label: '11 to 20 years' },
      { value: 'Over 20 years (Seasoned Veteran)', label: 'Over 20 years (Seasoned Veteran)' }
    ],
    scopeLabel: '5. Assessment Scope',
    scopePlaceholder: '-- Select Scope --',
    scopes: [
      { value: 'Entire Enterprise / Parent Company', label: 'Entire Enterprise / Parent Company (Holistic View)' },
      { value: 'My Dedicated Division or Manufacturing Plant', label: 'My Dedicated Division or Manufacturing Plant' },
      { value: 'My Personal Executive Decision Habits', label: 'My Personal Executive Decision Habits' }
    ]
  },

  es: {
    roleLabel: '1. Puesto o Rol Organizacional',
    rolePlaceholder: '-- Seleccione su Rol --',
    roles: [
      { value: 'Director General / Fundador / Propietario', label: 'Director General / Fundador / Propietario' },
      { value: 'Miembro del Consejo / Accionista', label: 'Miembro del Consejo / Accionista' },
      { value: 'Director de Operaciones / Planta', label: 'Director de Operaciones / Planta Industrial' },
      { value: 'Gerente de Área (Ventas, Finanzas, Calidad, Cadena)', label: 'Gerente de Área (Ventas, Finanzas, Calidad, Cadena)' },
      { value: 'Supervisor de Línea / Especialista Senior', label: 'Supervisor de Línea / Especialista Senior' },
      { value: 'Consultor de Gestión / Evaluador', label: 'Consultor de Gestión / Evaluador' }
    ],
    industryLabel: '2. Industria / Sector',
    industryPlaceholder: '-- Seleccione Industria --',
    industries: [
      { value: 'Manufactura e Industria Pesada', label: 'Manufactura e Industria Pesada' },
      { value: 'Comercio, Importación y Distribución', label: 'Comercio, Importación y Distribución' },
      { value: 'Servicios, Tecnología y Software', label: 'Servicios, Tecnología y Software' },
      { value: 'Construcción, Ingeniería y Energía', label: 'Construcción, Ingeniería y Energía' },
      { value: 'Alimentos, Farmacéutica y Consumo', label: 'Alimentos, Farmacéutica y Consumo Masivo' },
      { value: 'Retail y Cadenas Comerciales', label: 'Retail y Cadenas Comerciales' }
    ],
    headcountLabel: '3. Número Total de Empleados',
    headcountPlaceholder: '-- Seleccione Tamaño --',
    headcounts: [
      { value: '1 a 10 empleados (Micro)', label: '1 a 10 empleados (Microempresa)' },
      { value: '11 a 50 empleados (Pequeña)', label: '11 a 50 empleados (Pequeña Empresa)' },
      { value: '51 a 200 empleados (Mediana)', label: '51 a 200 empleados (Mediana Empresa)' },
      { value: '201 a 500 empleados (Grande)', label: '201 a 500 empleados (Gran Empresa)' },
      { value: 'Más de 500 empleados (Corporativo)', label: 'Más de 500 empleados (Corporativo/Holding)' }
    ],
    experienceLabel: '4. Años de Experiencia Directiva',
    experiencePlaceholder: '-- Seleccione Experiencia --',
    experiences: [
      { value: 'Menos de 2 años', label: 'Menos de 2 años (Directivo Novel)' },
      { value: '2 a 5 años', label: '2 a 5 años' },
      { value: '6 a 10 años', label: '6 a 10 años' },
      { value: '11 a 20 años', label: '11 a 20 años' },
      { value: 'Más de 20 años', label: 'Más de 20 años (Líder Experimentado)' }
    ],
    scopeLabel: '5. Alcance de la Evaluación',
    scopePlaceholder: '-- Seleccione Alcance --',
    scopes: [
      { value: 'Toda la Empresa / Matriz', label: 'Toda la Empresa / Matriz (Visión Global)' },
      { value: 'Mi Planta o Unidad Bajo Control Directo', label: 'Mi Planta o Unidad Bajo Control Directo' },
      { value: 'Mis Hábitos Personales de Decisión', label: 'Mis Hábitos Personales de Decisión' }
    ]
  },

  de: {
    roleLabel: '1. Ihre Führungsrolle',
    rolePlaceholder: '-- Rolle auswählen --',
    roles: [
      { value: 'Geschäftsführer / Inhaber / Gründer', label: 'Geschäftsführer / Inhaber / Gründer' },
      { value: 'Beirat / Vorstand / Gesellschafter', label: 'Beirat / Vorstand / Gesellschafter' },
      { value: 'Werksleiter / Betriebsleiter / COO', label: 'Werksleiter / Betriebsleiter / COO' },
      { value: 'Abteilungsleiter (Vertrieb, Finanzen, QA, Logistik)', label: 'Abteilungsleiter (Vertrieb, Finanzen, QA, Logistik)' },
      { value: 'Schichtleiter / Leitender Ingenieur', label: 'Schichtleiter / Leitender Ingenieur' },
      { value: 'Unternehmensberater / Coach', label: 'Unternehmensberater / Coach' }
    ],
    industryLabel: '2. Branche / Tätigkeitsfeld',
    industryPlaceholder: '-- Branche auswählen --',
    industries: [
      { value: 'Produktion & Schwerindustrie', label: 'Produktion, Fertigung & Schwerindustrie' },
      { value: 'Handel, Großhandel & Distribution', label: 'Handel, Großhandel & Distribution' },
      { value: 'IT, Software & Dienstleistungen', label: 'IT, Software & Dienstleistungen' },
      { value: 'Bauwesen, Engineering & Energie', label: 'Bauwesen, Engineering & Energie' },
      { value: 'Lebensmittel, Pharma & Konsumgüter', label: 'Lebensmittel, Pharma & Konsumgüter' },
      { value: 'Einzelhandel & Filialnetze', label: 'Einzelhandel & Filialnetze' }
    ],
    headcountLabel: '3. Gesamtzahl der Mitarbeiter',
    headcountPlaceholder: '-- Mitarbeiterzahl --',
    headcounts: [
      { value: '1 bis 10 Mitarbeiter (Mikro)', label: '1 bis 10 Mitarbeiter (Mikroteam)' },
      { value: '11 bis 50 Mitarbeiter (Klein)', label: '11 bis 50 Mitarbeiter (Kleinbetrieb)' },
      { value: '51 bis 200 Mitarbeiter (Mittelstand)', label: '51 bis 200 Mitarbeiter (Mittelstand)' },
      { value: '201 bis 500 Mitarbeiter (Großunternehmen)', label: '201 bis 500 Mitarbeiter (Großunternehmen)' },
      { value: 'Über 500 Mitarbeiter (Konzern)', label: 'Über 500 Mitarbeiter (Konzern/Holding)' }
    ],
    experienceLabel: '4. Führungserfahrung',
    experiencePlaceholder: '-- Erfahrung auswählen --',
    experiences: [
      { value: 'Unter 2 Jahre', label: 'Unter 2 Jahre (Nachwuchsführungskraft)' },
      { value: '2 bis 5 Jahre', label: '2 bis 5 Jahre' },
      { value: '6 bis 10 Jahre', label: '6 bis 10 Jahre' },
      { value: '11 bis 20 Jahre', label: '11 bis 20 Jahre' },
      { value: 'Über 20 Jahre', label: 'Über 20 Jahre (Erfahrene Führungskraft)' }
    ],
    scopeLabel: '5. Reichweite der Bewertung',
    scopePlaceholder: '-- Reichweite auswählen --',
    scopes: [
      { value: 'Gesamtes Unternehmen / Muttergesellschaft', label: 'Gesamtes Unternehmen / Muttergesellschaft (Gesamtsicht)' },
      { value: 'Mein direkt verantworteter Bereich / Werk', label: 'Mein direkt verantworteter Bereich / Werk' },
      { value: 'Meine persönlichen Entscheidungsmuster', label: 'Meine persönlichen Entscheidungsmuster' }
    ]
  },

  fr: {
    roleLabel: '1. Rôle Organisationnel',
    rolePlaceholder: '-- Sélectionner votre rôle --',
    roles: [
      { value: 'PDG / Fondateur / Dirigeant', label: 'PDG / Fondateur / Dirigeant d\'entreprise' },
      { value: 'Membre du Conseil / Actionnaire', label: 'Membre du Conseil / Actionnaire' },
      { value: 'Directeur des Opérations / Directeur d\'Usine', label: 'Directeur des Opérations / Directeur d\'Usine' },
      { value: 'Manager de Département (Ventes, Finance, Qualité)', label: 'Manager de Département (Ventes, Finance, Qualité)' },
      { value: 'Superviseur de Ligne / Expert Senior', label: 'Superviseur de Ligne / Expert Senior' },
      { value: 'Consultant en Management / Évaluateur', label: 'Consultant en Management / Évaluateur' }
    ],
    industryLabel: '2. Secteur d\'Activité',
    industryPlaceholder: '-- Sélectionner le secteur --',
    industries: [
      { value: 'Industrie & Fabrication lourde', label: 'Industrie, Transformation & Fabrication lourde' },
      { value: 'Commerce, Import/Export & Distribution', label: 'Commerce, Import/Export & Distribution' },
      { value: 'Technologies, Logiciels & Services IT', label: 'Technologies, Logiciels & Services IT' },
      { value: 'BTP, Ingénierie & Énergie', label: 'BTP, Ingénierie & Énergie' },
      { value: 'Agroalimentaire, Pharma & Santé', label: 'Agroalimentaire, Pharma & Cosmétique' },
      { value: 'Distribution & Réseaux de détail', label: 'Distribution & Réseaux de détail' }
    ],
    headcountLabel: '3. Effectif Total',
    headcountPlaceholder: '-- Sélectionner l\'effectif --',
    headcounts: [
      { value: '1 à 10 collaborateurs (TPE)', label: '1 à 10 collaborateurs (TPE / Micro-équipe)' },
      { value: '11 à 50 collaborateurs (PME)', label: '11 à 50 collaborateurs (Petite entreprise)' },
      { value: '51 à 200 collaborateurs (ETI moyenne)', label: '51 à 200 collaborateurs (Moyenne entreprise)' },
      { value: '201 à 500 collaborateurs (Grande entreprise)', label: '201 à 500 collaborateurs (Grande entreprise)' },
      { value: 'Plus de 500 collaborateurs (Groupe/Holding)', label: 'Plus de 500 collaborateurs (Groupe / Holding)' }
    ],
    experienceLabel: '4. Années d\'Expérience Managériale',
    experiencePlaceholder: '-- Sélectionner l\'expérience --',
    experiences: [
      { value: 'Moins de 2 ans', label: 'Moins de 2 ans (Manager débutant)' },
      { value: '2 à 5 ans', label: '2 à 5 ans' },
      { value: '6 à 10 ans', label: '6 à 10 ans' },
      { value: '11 à 20 ans', label: '11 à 20 ans' },
      { value: 'Plus de 20 ans', label: 'Plus de 20 ans (Dirigeant chevronné)' }
    ],
    scopeLabel: '5. Périmètre de l\'Évaluation',
    scopePlaceholder: '-- Sélectionner le périmètre --',
    scopes: [
      { value: 'Toute l\'Entreprise / Maison Mère', label: 'Toute l\'Entreprise / Maison Mère (Vue globale)' },
      { value: 'Mon Usine ou Département sous gestion directe', label: 'Mon Usine ou Département sous gestion directe' },
      { value: 'Mes Habitudes Personnelles de Décision', label: 'Mes Habitudes Personnelles de Décision' }
    ]
  },

  zh: {
    roleLabel: '1. 您的组织职位与管理角色',
    rolePlaceholder: '-- 请选择您的管理角色 --',
    roles: [
      { value: '董事长 / 创始人 / 企业主', label: '董事长 / 创始人 / 实际控制人' },
      { value: '董事会成员 / 高级合伙人', label: '董事会成员 / 核心股东' },
      { value: 'COO / 生产副总 / 工厂厂长', label: 'COO / 生产运营副总裁 / 工厂厂长' },
      { value: '中层主管（营销、财务、品控、供应链）', label: '中层部门经理（营销、财务、品控、供应链）' },
      { value: '一线主管 / 资深技术带头人', label: '车间主管 / 资深骨干专家' },
      { value: '企业管理顾问 / 评审专家', label: '管理顾问 / 讲师 / 组织诊断顾问' }
    ],
    industryLabel: '2. 行业类型与业务领域',
    industryPlaceholder: '-- 请选择所在行业 --',
    industries: [
      { value: '生产制造与重工业', label: '机械制造、重工业与加工生产' },
      { value: '商贸进出口与分销流通', label: '商贸进出口、批发与物流分销' },
      { value: 'IT科技、软件与服务业', label: '信息科技、软件开发与现代服务' },
      { value: '建筑施工、工程与能源', label: '工程施工、总包建设与能源化工' },
      { value: '食品饮料、医药健康与快消品', label: '食品饮料、生物医药与快速消费品' },
      { value: '商业连锁与大型零售', label: '商超连锁、零售专卖与电商' }
    ],
    headcountLabel: '3. 企业人员规模',
    headcountPlaceholder: '-- 请选择人员规模 --',
    headcounts: [
      { value: '1至10人（微型团队）', label: '1至10人（初创微型团队）' },
      { value: '11至50人（小型企业）', label: '11至50人（小型成长企业）' },
      { value: '51至200人（中型企业）', label: '51至200人（中型成熟企业）' },
      { value: '201至500人（大型规模型）', label: '201至500人（规模型大企业）' },
      { value: '500人以上（集团控股）', label: '500人以上（大型集团 / 控股母公司）' }
    ],
    experienceLabel: '4. 您的管理年限',
    experiencePlaceholder: '-- 请选择管理年限 --',
    experiences: [
      { value: '2年以内', label: '2年以内（新晋管理者）' },
      { value: '2至5年', label: '2至5年' },
      { value: '6至10年', label: '6至10年' },
      { value: '11至20年', label: '11至20年' },
      { value: '20年以上', label: '20年以上（资深行业老将）' }
    ],
    scopeLabel: '5. 测评覆盖范围',
    scopePlaceholder: '-- 请选择测评范围 --',
    scopes: [
      { value: '整个企业集团 / 母公司（全局视角）', label: '整个企业集团 / 母公司（俯瞰全局各部门）' },
      { value: '我直接分管的厂区或事业部', label: '我直接分管的厂区或事业部' },
      { value: '我个人的日常决策习惯与思维风格', label: '我个人的日常决策习惯与思维风格' }
    ]
  },

  ja: {
    roleLabel: '1. 役職・組織上のポジション',
    rolePlaceholder: '-- 役職を選択してください --',
    roles: [
      { value: '代表取締役 / 創業者 / オーナー', label: '代表取締役 / 創業者 / オーナー経営者' },
      { value: '取締役 / 役員 / 主要株主', label: '取締役 / 役員 / 主要株主' },
      { value: 'COO / 工場長 / 生産・業務統括責任者', label: 'COO / 工場長 / 生産・業務統括責任者' },
      { value: '部門長・課長（営業、財務、品質、調達）', label: '部門長・課長（営業、財務、品質、調達）' },
      { value: '現場リーダー / 上級主任・エキスパート', label: '現場リーダー / 上級主任・エキスパート' },
      { value: '経営コンサルタント / 診断士', label: '経営コンサルタント / 診断士' }
    ],
    industryLabel: '2. 業界・事業領域',
    industryPlaceholder: '-- 業界を選択してください --',
    industries: [
      { value: '製造業・重工業・加工組立', label: '製造業・重工業・加工組立' },
      { value: '商社・卸売・物流・ディストリビューション', label: '商社・卸売・物流・ディストリビューション' },
      { value: 'IT・ソフトウェア・サービス業', label: 'IT・ソフトウェア・サービス業' },
      { value: '建設・エンジニアリング・エネルギー', label: '建設・エンジニアリング・エネルギー' },
      { value: '食品・医薬品・日用品', label: '食品・医薬品・日用品' },
      { value: '小売・チェーンストア', label: '小売・チェーンストア' }
    ],
    headcountLabel: '3. 従業員規模',
    headcountPlaceholder: '-- 従業員数を選択 --',
    headcounts: [
      { value: '1〜10名（小規模チーム）', label: '1〜10名（小規模チーム）' },
      { value: '11〜50名（小規模企業）', label: '11〜50名（小規模企業）' },
      { value: '51〜200名（中堅企業）', label: '51〜200名（中堅企業）' },
      { value: '201〜500名（大企業）', label: '201〜500名（大企業）' },
      { value: '500名超（グループ・ホールディングス）', label: '500名超（グループ・ホールディングス）' }
    ],
    experienceLabel: '4. マネジメント経験年数',
    experiencePlaceholder: '-- 経験年数を選択 --',
    experiences: [
      { value: '2年未満', label: '2年未満（新任マネージャー）' },
      { value: '2〜5年', label: '2〜5年' },
      { value: '6〜10年', label: '6〜10年' },
      { value: '11〜20年', label: '11〜20年' },
      { value: '20年超', label: '20年超（ベテラン経営幹部）' }
    ],
    scopeLabel: '5. 診断の適用範囲',
    scopePlaceholder: '-- 範囲を選択してください --',
    scopes: [
      { value: '企業全体 / 本社・グループ全般', label: '企業全体 / 本社・グループ全般（全体俯瞰視点）' },
      { value: '自身が直接管轄する工場または事業部', label: '自身が直接管轄する工場または事業部' },
      { value: '私自身の個人的な意思決定習慣', label: '私自身の個人的な意思決定習慣' }
    ]
  },

  hi: {
    roleLabel: '1. संगठनात्मक पद और भूमिका',
    rolePlaceholder: '-- अपनी भूमिका चुनें --',
    roles: [
      { value: 'सीईओ / संस्थापक / व्यापार मालिक', label: 'सीईओ / संस्थापक / व्यापार मालिक' },
      { value: 'बोर्ड सदस्य / वरिष्ठ शेयरधारक', label: 'बोर्ड सदस्य / वरिष्ठ शेयरधारक' },
      { value: 'प्लांट मैनेजर / ऑपरेशंस डायरेक्टर', label: 'प्लांट मैनेजर / ऑपरेशंस डायरेक्टर' },
      { value: 'मध्यम प्रबंधक (बिक्री, वित्त, गुणवत्ता)', label: 'मध्यम प्रबंधक (बिक्री, वित्त, गुणवत्ता, आपूर्ति)' },
      { value: 'लाइन सुपरवाइजर / वरिष्ठ विशेषज्ञ', label: 'लाइन सुपरवाइजर / वरिष्ठ विशेषज्ञ' },
      { value: 'प्रबंधन सलाहकार / प्रशिक्षक', label: 'प्रबंधन सलाहकार / प्रशिक्षक' }
    ],
    industryLabel: '2. उद्योग / कार्यक्षेत्र',
    industryPlaceholder: '-- उद्योग चुनें --',
    industries: [
      { value: 'विनिर्माण और भारी उद्योग', label: 'विनिर्माण, विरचना और भारी उद्योग' },
      { value: 'व्यापार, आयात/निर्यात और वितरण', label: 'व्यापार, आयात/निर्यात और वितरण' },
      { value: 'प्रौद्योगिकी, सॉफ्टवेयर और सेवाएं', label: 'प्रौद्योगिकी, सॉफ्टवेयर और आईटी सेवाएं' },
      { value: 'इंजीनियरिंग, निर्माण और ऊर्जा', label: 'इंजीनियरिंग, निर्माण और ऊर्जा' },
      { value: 'खाद्य, फार्मा और उपभोक्ता उत्पाद', label: 'खाद्य, फार्मा और उपभोक्ता उत्पाद' },
      { value: 'खुदरा और स्टोर श्रृंखलाएं', label: 'खुदरा और स्टोर श्रृंखलाएं' }
    ],
    headcountLabel: '3. कुल कर्मचारियों की संख्या',
    headcountPlaceholder: '-- कर्मचारियों की संख्या चुनें --',
    headcounts: [
      { value: '1 से 10 (माइक्रो टीम)', label: '1 से 10 कर्मचारी (माइक्रो टीम)' },
      { value: '11 से 50 (छोटा व्यवसाय)', label: '11 से 50 कर्मचारी (छोटा व्यवसाय)' },
      { value: '51 से 200 (मध्यम संगठन)', label: '51 से 200 कर्मचारी (मध्यम संगठन)' },
      { value: '201 से 500 (बड़ा उद्योग)', label: '201 से 500 कर्मचारी (बड़ा उद्योग)' },
      { value: '500 से अधिक (होल्डिंग/समूह)', label: '500 से अधिक कर्मचारी (होल्डिंग/समूह)' }
    ],
    experienceLabel: '4. प्रबंधन अनुभव',
    experiencePlaceholder: '-- अनुभव चुनें --',
    experiences: [
      { value: '2 वर्ष से कम', label: '2 वर्ष से कम (नवागंतुक प्रबंधक)' },
      { value: '2 से 5 वर्ष', label: '2 से 5 वर्ष' },
      { value: '6 से 10 वर्ष', label: '6 से 10 वर्ष' },
      { value: '11 से 20 वर्ष', label: '11 से 20 वर्ष' },
      { value: '20 वर्ष से अधिक', label: '20 वर्ष से अधिक (अनुभवी दिग्गज)' }
    ],
    scopeLabel: '5. मूल्यांकन का दायरा',
    scopePlaceholder: '-- दायरा चुनें --',
    scopes: [
      { value: 'संपूर्ण संगठन / मूल कंपनी', label: 'संपूर्ण संगठन / मूल कंपनी (समग्र दृष्टिकोण)' },
      { value: 'मेरे सीधे नियंत्रण वाली इकाई या कारखाना', label: 'मेरे सीधे नियंत्रण वाली इकाई या कारखाना' },
      { value: 'प्रबंधक के रूप में मेरे व्यक्तिगत निर्णय लेने की आदतें', label: 'प्रबंधक के रूप में मेरे व्यक्तिगत निर्णय लेने की आदतें' }
    ]
  },

  ar: {
    roleLabel: '۱. المنصب أو الصفة الإدارية',
    rolePlaceholder: '-- اختر صفتك الوظيفية --',
    roles: [
      { value: 'الرئيس التنفيذي / المؤسس / مالك العمل', label: 'الرئيس التنفيذي / المؤسس / مالك العمل' },
      { value: 'عضو مجلس الإدارة / شريك رئيسي', label: 'عضو مجلس الإدارة / شريك رئيسي' },
      { value: 'مدير العمليات / مدير المصنع', label: 'مدير العمليات / مدير المصنع والإنتاج' },
      { value: 'مدير قسم (مبيعات، مالية، جودة، سلاسل الإمداد)', label: 'مدير قسم (مبيعات، مالية، جودة، سلاسل الإمداد)' },
      { value: 'مشرف خط / أخصائي تنفيذي أول', label: 'مشرف خط / أخصائي تنفيذي أول' },
      { value: 'مستشار إداري / مقيم مؤسسي', label: 'مستشار إداري / مقيم مؤسسي' }
    ],
    industryLabel: '۲. القطاع / مجال النشاط',
    industryPlaceholder: '-- اختر قطاع العمل --',
    industries: [
      { value: 'الصناعة والإنتاج والمعامل', label: 'الصناعة، المعامل والإنتاج والتحويل' },
      { value: 'التجارة، الاستيراد والتوزيع', label: 'التجارة، الاستيراد، التصدير والتوزيع' },
      { value: 'الخدمات، تقنية المعلومات والبرمجيات', label: 'الخدمات، تقنية المعلومات والبرمجيات' },
      { value: 'المقاولات، الهندسة والطاقة', label: 'المقاولات، الهندسة، النفط والغاز' },
      { value: 'الأغذية، الأدوية والمستهلكات', label: 'الصناعات الغذائية، الدوائية والتجميلية' },
      { value: 'المتاجر وسلاسل التجزئة', label: 'المتاجر الكبرى وسلاسل التجزئة' }
    ],
    headcountLabel: '۳. إجمالي عدد العاملين',
    headcountPlaceholder: '-- اختر حجم العمالة --',
    headcounts: [
      { value: '۱ إلى ۱۰ موظفين (فريق مصغر)', label: '۱ إلى ۱۰ موظفين (فريق مصغر)' },
      { value: '۱۱ إلى ۵۰ موظفاً (منشأة صغيرة)', label: '۱۱ إلى ۵۰ موظفاً (منشأة صغيرة)' },
      { value: '۵۱ إلى ۲۰۰ موظف (مؤسسة متوسطة)', label: '۵۱ إلى ۲۰۰ موظف (مؤسسة متوسطة)' },
      { value: '۲۰۱ إلى ۵۰۰ موظف (صناعة كبرى)', label: '۲۰۱ إلى ۵۰۰ موظف (صناعة كبرى)' },
      { value: 'أكثر من ۵۰۰ موظف (مجموعة قابضة)', label: 'أكثر من ۵۰۰ موظف (مجموعة قابضة)' }
    ],
    experienceLabel: '٤. سنوات الخبرة القيادية',
    experiencePlaceholder: '-- اختر سنوات الخبرة --',
    experiences: [
      { value: 'أقل من سنتين', label: 'أقل من سنتين (مدير واعد)' },
      { value: '۲ إلى ۵ سنوات', label: '۲ إلى ۵ سنوات' },
      { value: '٦ إلى ۱۰ سنوات', label: '٦ إلى ۱۰ سنوات' },
      { value: '۱۱ إلى ۲۰ سنة', label: '۱۱ إلى ۲۰ سنة' },
      { value: 'أكثر من ۲۰ سنة', label: 'أكثر من ۲۰ سنة (قائد خبير)' }
    ],
    scopeLabel: '۵. نطاق التقييم',
    scopePlaceholder: '-- اختر نطاق التقييم --',
    scopes: [
      { value: 'كامل المؤسسة / الشركة / المصنع', label: 'كامل المؤسسة / الشركة / المصنع (نظرة شمولية)' },
      { value: 'المصنع أو الإدارة الخاضعة لإشرافي المباشر', label: 'المصنع أو الإدارة الخاضعة لإشرافي المباشر' },
      { value: 'عاداتي وأسلوبي الشخصي في اتخاذ القرار كمدير', label: 'عاداتي وأسلوبي الشخصي في اتخاذ القرار كمدير' }
    ]
  }
};

export function getLocalizedDimensionMetas(lang: string = 'fa') {
  return LOCALIZED_DIMENSION_METAS[lang] || LOCALIZED_DIMENSION_METAS['fa'];
}

export function getLocalizedTiers(lang: string = 'fa') {
  return LOCALIZED_TIERS[lang] || LOCALIZED_TIERS['fa'];
}

export function getLocalizedConsistency(level: 'high' | 'medium' | 'low', lang: string = 'fa') {
  const table = LOCALIZED_CONSISTENCY[lang] || LOCALIZED_CONSISTENCY['fa'];
  return table[level];
}

export function getLocalizedIntakeOptions(lang: string = 'fa') {
  return LOCALIZED_INTAKE_OPTIONS[lang] || LOCALIZED_INTAKE_OPTIONS['fa'];
}

export function getIntakeFormOptions(lang: string = 'fa') {
  const opts = LOCALIZED_INTAKE_OPTIONS[lang] || LOCALIZED_INTAKE_OPTIONS['fa'];
  return {
    roles: opts.roles,
    industries: opts.industries,
    headcounts: opts.headcounts,
    experiences: opts.experiences,
    scopes: opts.scopes
  };
}

export function getIntakeFormLabels(lang: string = 'fa') {
  const opts = LOCALIZED_INTAKE_OPTIONS[lang] || LOCALIZED_INTAKE_OPTIONS['fa'];
  const titles: Record<string, {
    title: string;
    subtitle: string;
    backBtn: string;
    submitBtn: string;
    fullNameLabel: string;
    fullNamePlaceholder: string;
    phoneLabel: string;
    phonePlaceholder: string;
    phoneOptionalBadge: string;
    defaultFullName: string;
  }> = {
    fa: {
      title: 'مشخصات اولیه سازمان و مدیر پاسخ‌دهنده',
      subtitle: 'جهت شخصی‌سازی گزارش تحلیلی، نقاط داغ و توصیه‌های فصل‌های کتاب، اطلاعات زیر را تکمیل فرمایید.',
      backBtn: 'بازگشت به انتخاب آزمون',
      submitBtn: 'شروع ارزیابی ۲۴ سناریویی',
      fullNameLabel: 'نام و نام خانوادگی',
      fullNamePlaceholder: 'مثال: علی رضایی',
      phoneLabel: 'شماره تماس',
      phonePlaceholder: 'مثال: ۰۹۱۲۳۴۵۶۷۸۹',
      phoneOptionalBadge: '(اختیاری)',
      defaultFullName: 'مدیر ارشد سازمان'
    },
    en: {
      title: 'Respondent & Organization Profile',
      subtitle: 'To tailor the diagnostic report, hotspots, and book chapter recommendations, please fill in the details below.',
      backBtn: 'Back to Mode Select',
      submitBtn: 'Start 24-Scenario Assessment',
      fullNameLabel: 'Full Name',
      fullNamePlaceholder: 'e.g. John Doe',
      phoneLabel: 'Phone Number',
      phonePlaceholder: 'e.g. +98 912 345 6789',
      phoneOptionalBadge: '(Optional)',
      defaultFullName: 'Senior Executive'
    },
    es: {
      title: 'Perfil del Directivo y la Organización',
      subtitle: 'Para personalizar el informe diagnóstico, los puntos críticos y las recomendaciones, complete los siguientes datos.',
      backBtn: 'Volver a Selección',
      submitBtn: 'Iniciar Evaluación de 24 Escenarios',
      fullNameLabel: 'Nombre y Apellido',
      fullNamePlaceholder: 'ej. Carlos García',
      phoneLabel: 'Número de Teléfono',
      phonePlaceholder: 'ej. +34 612 345 678',
      phoneOptionalBadge: '(Opcional)',
      defaultFullName: 'Director Ejecutivo'
    },
    de: {
      title: 'Profil der Führungskraft & Organisation',
      subtitle: 'Um den Diagnosebericht, Hotspots und Buchempfehlungen anzupassen, füllen Sie bitte die folgenden Felder aus.',
      backBtn: 'Zurück zur Modusauswahl',
      submitBtn: '24-Szenarien-Test starten',
      fullNameLabel: 'Vor- und Nachname',
      fullNamePlaceholder: 'z.B. Markus Weber',
      phoneLabel: 'Telefonnummer',
      phonePlaceholder: 'z.B. +49 170 1234567',
      phoneOptionalBadge: '(Optional)',
      defaultFullName: 'Geschäftsführer'
    },
    fr: {
      title: 'Profil du Dirigeant & de l\'Organisation',
      subtitle: 'Pour personnaliser le rapport de diagnostic, les points chauds et les recommandations de chapitres, veuillez renseigner les détails ci-dessous.',
      backBtn: 'Retour à la sélection',
      submitBtn: 'Lancer l\'évaluation en 24 scénarios',
      fullNameLabel: 'Nom et Prénom',
      fullNamePlaceholder: 'ex. Pierre Martin',
      phoneLabel: 'Numéro de Téléphone',
      phonePlaceholder: 'ex. +33 6 12 34 56 78',
      phoneOptionalBadge: '(Optionnel)',
      defaultFullName: 'Cadre Dirigeant'
    },
    zh: {
      title: '受测管理者与组织基本信息',
      subtitle: '为定制专属诊断报告、热点痛点及书籍章节建议，请填写以下基本信息。',
      backBtn: '返回模式选择',
      submitBtn: '开始24场景进阶测评',
      fullNameLabel: '姓名',
      fullNamePlaceholder: '例如：张伟',
      phoneLabel: '联系电话',
      phonePlaceholder: '例如：13800138000',
      phoneOptionalBadge: '(选填)',
      defaultFullName: '高级管理者'
    },
    ja: {
      title: '回答者および組織の基本情報',
      subtitle: '診断レポート、弱点領域、書籍の推奨章を個別にカスタマイズするため、以下の項目をご入力ください。',
      backBtn: 'モード選択に戻る',
      submitBtn: '24シナリオ総合診断を開始',
      fullNameLabel: '氏名',
      fullNamePlaceholder: '例：山田 太郎',
      phoneLabel: '電話番号',
      phonePlaceholder: '例：090-1234-5678',
      phoneOptionalBadge: '(任意)',
      defaultFullName: '経営管理者'
    },
    hi: {
      title: 'प्रबंधक एवं संगठन की प्रारंभिक जानकारी',
      subtitle: 'निदान रिपोर्ट, हॉटस्पॉट और पुस्तक अनुशंसाओं को अनुकूलित करने के लिए कृपया नीचे दी गई जानकारी भरें।',
      backBtn: 'मोड चयन पर वापस जाएं',
      submitBtn: '24-परिदृश्य मूल्यांकन शुरू करें',
      fullNameLabel: 'पूरा नाम',
      fullNamePlaceholder: 'उदा. अमित शर्मा',
      phoneLabel: 'फ़ोन नंबर',
      phonePlaceholder: 'उदा. 9876543210',
      phoneOptionalBadge: '(वैकल्पिक)',
      defaultFullName: 'वरिष्ठ प्रबंधक'
    },
    ar: {
      title: 'البيانات الأولية للمؤسسة والمدير المجيب',
      subtitle: 'لتخصيص تقرير التشخيص ونقاط الاختناق والتوصيات بفصول الكتاب، يرجى تعبئة الحقول أدناه.',
      backBtn: 'العودة لاختيار التقييم',
      submitBtn: 'بدء تقييم ۲٤ سيناريو',
      fullNameLabel: 'الاسم واللقب',
      fullNamePlaceholder: 'مثال: أحمد المحمد',
      phoneLabel: 'رقم الهاتف',
      phonePlaceholder: 'مثال: 09123456789',
      phoneOptionalBadge: '(اختياري)',
      defaultFullName: 'المدير التنفيذي'
    }
  };

  const t = titles[lang] || titles['fa'];
  return {
    title: t.title,
    subtitle: t.subtitle,
    backBtn: t.backBtn,
    submitBtn: t.submitBtn,
    fullNameLabel: t.fullNameLabel,
    fullNamePlaceholder: t.fullNamePlaceholder,
    phoneLabel: t.phoneLabel,
    phonePlaceholder: t.phonePlaceholder,
    phoneOptionalBadge: t.phoneOptionalBadge,
    defaultFullName: t.defaultFullName,
    roleLabel: opts.roleLabel,
    rolePlaceholder: opts.rolePlaceholder,
    industryLabel: opts.industryLabel,
    industryPlaceholder: opts.industryPlaceholder,
    headcountLabel: opts.headcountLabel,
    headcountPlaceholder: opts.headcountPlaceholder,
    experienceLabel: opts.experienceLabel,
    experiencePlaceholder: opts.experiencePlaceholder,
    scopeLabel: opts.scopeLabel,
    scopePlaceholder: opts.scopePlaceholder
  };
}

export function getAssessmentUILabels(lang: string = 'fa') {
  const ui: Record<string, {
    questionCount: (current: string, total: string) => string;
    dimensionLabel: (dim: string) => string;
    scenarioNumber: (num: string, title: string) => string;
    userResponseLabel: string;
    prevBtn: string;
    nextBtn: string;
    calcResultsBtn: string;
    resultBadge: string;
    resultTitle: (pct: string) => string;
    of100: string;
    consistencyTitle: string;
    radarTitle: string;
    radarDesc: string;
    hotspotsTitle: string;
    keyStrengthTitle: string;
    keyStrengthBadge: (pct: string) => string;
    keyStrengthFooter: string;
    actionPlanTitle: string;
    recommendedChaptersTitle: string;
    orderBundleBtn: string;
    compareBtn: string;
    closeCompareBtn: string;
    prevAssessmentScore: (pct: string) => string;
    currentLabel: (pct: string) => string;
    printBtn: string;
    retakeBtn: string;
  }> = {
    fa: {
      questionCount: (c, t) => `پرسش ${c} از ${t}`,
      dimensionLabel: (d) => `بُعد: ${d}`,
      scenarioNumber: (n, t) => `سناریوی شماره ${n}: ${t}`,
      userResponseLabel: 'واکنش و رویه شما در چنین موقعیتی:',
      prevBtn: 'قبلی',
      nextBtn: 'پرسش بعدی',
      calcResultsBtn: 'محاسبه گزارش جامع و اکشن‌پلان',
      resultBadge: 'گزارش جامع ۲۴ سناریویی و نقشه راه اختصاصی',
      resultTitle: (pct) => `درصد درگیری با وضعیت اورانگوتانی: ${pct}`,
      of100: 'از ۱۰۰٪',
      consistencyTitle: 'شاخص سازگاری پاسخ‌ها:',
      radarTitle: 'نمودار راداری ابعاد هشت‌گانه رفتار مدیریتی',
      radarDesc: 'فاصله بیشتر هر بُعد از مرکز، نشان‌دهنده غلبه رفتارهای تکانشی و غریزی در آن حوزه است.',
      hotspotsTitle: '۳ نقطه داغ و اولویت‌های اصلی مداخله:',
      keyStrengthTitle: 'نقطه قوت و پایداری سازمانی شما:',
      keyStrengthBadge: (pct) => `درگیری اندک: ${pct}`,
      keyStrengthFooter: 'این بُعد ستون اصلی پایداری فعلی شماست؛ از ابزارهای آن برای الگوبرداری در سایر بخش‌ها بهره بگیرید.',
      actionPlanTitle: 'اکشن‌پلان سه گام «برنامه ثابت +۳» (فرمول علی‌اصغر حکیمیان)',
      recommendedChaptersTitle: 'فصل‌های پیشنهادی از کتاب اورانگوتان +۳ برای ۳ بُعد ضعیف‌تر شما:',
      orderBundleBtn: 'سفارش دوره کامل کتاب (جلد ۱ و ۲)',
      compareBtn: 'مقایسه این نتیجه با آخرین ارزیابی ذخیره‌شده شما',
      closeCompareBtn: 'بستن مقایسه با ارزیابی پیشین',
      prevAssessmentScore: (pct) => `ارزیابی قبلی: ${pct} درگیری`,
      currentLabel: (pct) => `فعلی: ${pct}`,
      printBtn: 'چاپ و ذخیره گزارش (PDF)',
      retakeBtn: 'تکرار آزمون'
    },
    en: {
      questionCount: (c, t) => `Question ${c} of ${t}`,
      dimensionLabel: (d) => `Dimension: ${d}`,
      scenarioNumber: (n, t) => `Scenario #${n}: ${t}`,
      userResponseLabel: 'Your reaction and practice in this situation:',
      prevBtn: 'Previous',
      nextBtn: 'Next Question',
      calcResultsBtn: 'Generate Comprehensive Report & Action Plan',
      resultBadge: 'Comprehensive 24-Scenario Diagnostic & Roadmap',
      resultTitle: (pct) => `Instinctive Orangutan Mode Engagement: ${pct}`,
      of100: 'out of 100%',
      consistencyTitle: 'Response Consistency Index:',
      radarTitle: '8-Dimension Radar Chart of Management Behaviors',
      radarDesc: 'Greater distance from the center indicates stronger instinctive and reactive habits in that area.',
      hotspotsTitle: '3 Hotspots & Immediate Intervention Priorities:',
      keyStrengthTitle: 'Key Organizational Pillar & Strength:',
      keyStrengthBadge: (pct) => `Low Friction: ${pct}`,
      keyStrengthFooter: 'This dimension is your strongest systemic anchor; leverage its tools across weaker areas.',
      actionPlanTitle: '3-Step +3 Framework Action Plan (Ali Asghar Hakimian)',
      recommendedChaptersTitle: 'Recommended Book Chapters for Your 3 Weaker Dimensions:',
      orderBundleBtn: 'Order Complete 2-Volume Bundle',
      compareBtn: 'Compare with Your Previous Saved Assessment',
      closeCompareBtn: 'Close Historical Comparison',
      prevAssessmentScore: (pct) => `Previous: ${pct} engagement`,
      currentLabel: (pct) => `Current: ${pct}`,
      printBtn: 'Print & Save Report (PDF)',
      retakeBtn: 'Retake Assessment'
    },
    es: {
      questionCount: (c, t) => `Pregunta ${c} de ${t}`,
      dimensionLabel: (d) => `Dimensión: ${d}`,
      scenarioNumber: (n, t) => `Escenario #${n}: ${t}`,
      userResponseLabel: 'Su reacción y procedimiento en esta situación:',
      prevBtn: 'Anterior',
      nextBtn: 'Siguiente Pregunta',
      calcResultsBtn: 'Calcular Informe y Plan de Acción',
      resultBadge: 'Informe Integral de 24 Escenarios y Hoja de Ruta',
      resultTitle: (pct) => `Grado de Gestión Instintiva: ${pct}`,
      of100: 'de 100%',
      consistencyTitle: 'Índice de Consistencia:',
      radarTitle: 'Gráfico Radar de las 8 Dimensiones Organizacionales',
      radarDesc: 'Una mayor distancia del centro refleja un predominio de patrones reactivos en esa área.',
      hotspotsTitle: '3 Puntos Críticos y Prioridades de Intervención:',
      keyStrengthTitle: 'Pilar de Fortaleza Organizacional:',
      keyStrengthBadge: (pct) => `Baja Fricción: ${pct}`,
      keyStrengthFooter: 'Esta dimensión es su ancla sistémica; replique sus prácticas en las áreas más débiles.',
      actionPlanTitle: 'Plan de Acción 3+ en 3 Pasos (Ali Asghar Hakimian)',
      recommendedChaptersTitle: 'Capítulos Recomendados del Libro para sus 3 Dimensiones Débiles:',
      orderBundleBtn: 'Pedir Colección Completa (Vol 1 y 2)',
      compareBtn: 'Comparar con su Evaluación Anterior Guardada',
      closeCompareBtn: 'Cerrar Comparación Histórica',
      prevAssessmentScore: (pct) => `Anterior: ${pct}`,
      currentLabel: (pct) => `Actual: ${pct}`,
      printBtn: 'Imprimir y Guardar (PDF)',
      retakeBtn: 'Repetir Evaluación'
    },
    de: {
      questionCount: (c, t) => `Frage ${c} von ${t}`,
      dimensionLabel: (d) => `Dimension: ${d}`,
      scenarioNumber: (n, t) => `Szenario #${n}: ${t}`,
      userResponseLabel: 'Ihre Reaktion und Vorgehensweise in dieser Situation:',
      prevBtn: 'Zurück',
      nextBtn: 'Nächste Frage',
      calcResultsBtn: 'Bericht & Aktionsplan berechnen',
      resultBadge: 'Umfassender 24-Szenarien-Bericht & Roadmap',
      resultTitle: (pct) => `Grad der instinktiven Führung: ${pct}`,
      of100: 'von 100%',
      consistencyTitle: 'Konsistenzindex der Antworten:',
      radarTitle: 'Netzdiagramm der 8 Führungsdimensionen',
      radarDesc: 'Ein größerer Abstand vom Zentrum zeigt eine Dominanz instinktiver Verhaltensweisen.',
      hotspotsTitle: '3 Hotspots & Dringende Interventionsprioritäten:',
      keyStrengthTitle: 'Ihre organisatorische Kernstärke:',
      keyStrengthBadge: (pct) => `Geringe Reibung: ${pct}`,
      keyStrengthFooter: 'Diese Dimension bildet Ihr stabiles Fundament; nutzen Sie deren Methoden für andere Bereiche.',
      actionPlanTitle: '3-Schritte-Aktionsplan nach dem 3+ Framework (Ali Asghar Hakimian)',
      recommendedChaptersTitle: 'Empfohlene Buchkapitel für Ihre 3 schwächeren Dimensionen:',
      orderBundleBtn: 'Komplettes 2-Bände-Set bestellen',
      compareBtn: 'Mit vorheriger gespeicherter Bewertung vergleichen',
      closeCompareBtn: 'Vergleich schließen',
      prevAssessmentScore: (pct) => `Vorherige: ${pct}`,
      currentLabel: (pct) => `Aktuell: ${pct}`,
      printBtn: 'Bericht drucken & speichern (PDF)',
      retakeBtn: 'Test wiederholen'
    },
    fr: {
      questionCount: (c, t) => `Question ${c} sur ${t}`,
      dimensionLabel: (d) => `Dimension : ${d}`,
      scenarioNumber: (n, t) => `Scénario #${n} : ${t}`,
      userResponseLabel: 'Votre réaction et votre approche dans cette situation :',
      prevBtn: 'Précédent',
      nextBtn: 'Question suivante',
      calcResultsBtn: 'Générer le rapport complet et le plan d\'action',
      resultBadge: 'Rapport complet en 24 scénarios et feuille de route',
      resultTitle: (pct) => `Degré d'engagement en mode instinctif : ${pct}`,
      of100: 'sur 100%',
      consistencyTitle: 'Indice de cohérence des réponses :',
      radarTitle: 'Graphique radar des 8 dimensions managériales',
      radarDesc: 'Plus une dimension s\'éloigne du centre, plus les comportements instinctifs y dominent.',
      hotspotsTitle: '3 Points chauds et priorités d\'intervention :',
      keyStrengthTitle: 'Pilier et force organisationnelle :',
      keyStrengthBadge: (pct) => `Faible friction : ${pct}`,
      keyStrengthFooter: 'Cette dimension constitue votre ancrage systémique ; servez-vous de ses outils ailleurs.',
      actionPlanTitle: 'Plan d\'action en 3 étapes 3+ (Ali Asghar Hakimian)',
      recommendedChaptersTitle: 'Chapitres recommandés du livre pour vos 3 dimensions les plus faibles :',
      orderBundleBtn: 'Commander le coffret 2 volumes',
      compareBtn: 'Comparer avec votre évaluation précédente enregistrée',
      closeCompareBtn: 'Fermer la comparaison',
      prevAssessmentScore: (pct) => `Précédent : ${pct}`,
      currentLabel: (pct) => `Actuel : ${pct}`,
      printBtn: 'Imprimer et enregistrer (PDF)',
      retakeBtn: 'Refaire l\'évaluation'
    },
    zh: {
      questionCount: (c, t) => `第 ${c} 题 / 共 ${t} 题`,
      dimensionLabel: (d) => `评估维度：${d}`,
      scenarioNumber: (n, t) => `场景 #${n}：${t}`,
      userResponseLabel: '在此情境下您的第一反应与惯常做法：',
      prevBtn: '上一题',
      nextBtn: '下一题',
      calcResultsBtn: '生成综合诊断报告与落地行动方案',
      resultBadge: '24场景全维度综合诊断报告与专属路线图',
      resultTitle: (pct) => `本能式管理程度指标：${pct}`,
      of100: '满分 100%',
      consistencyTitle: '回答一致性指数：',
      radarTitle: '管理行为八大组织维度雷达图',
      radarDesc: '离中心点越远，说明在该领域中本能与情绪化决策的占比越高。',
      hotspotsTitle: '3大亟待干预的核心痛点领域：',
      keyStrengthTitle: '组织韧性支柱与核心优势：',
      keyStrengthBadge: (pct) => `低摩擦度：${pct}`,
      keyStrengthFooter: '该维度是您当前最稳固的系统支柱，可将其标准化经验推广至其他弱势部门。',
      actionPlanTitle: '3步落地行动方案（Ali Asghar Hakimian 3+ 理论）',
      recommendedChaptersTitle: '针对您的3大薄弱维度为您推荐的专属章节：',
      orderBundleBtn: '订购全套双卷图书',
      compareBtn: '与上次保存的测评结果进行对比',
      closeCompareBtn: '关闭历史对比',
      prevAssessmentScore: (pct) => `上次测评：${pct}`,
      currentLabel: (pct) => `当前：${pct}`,
      printBtn: '打印并保存诊断报告 (PDF)',
      retakeBtn: '重新测评'
    },
    ja: {
      questionCount: (c, t) => `設問 ${c} / 全 ${t} 問`,
      dimensionLabel: (d) => `評価次元：${d}`,
      scenarioNumber: (n, t) => `シナリオ #${n}：${t}`,
      userResponseLabel: 'この状況におけるあなたの対応と行動パターン：',
      prevBtn: '前の問題',
      nextBtn: '次の問題',
      calcResultsBtn: '総合診断レポートとアクションプランを生成',
      resultBadge: '24シナリオ総合診断レポート＆ロードマップ',
      resultTitle: (pct) => `本能的経営への関与度：${pct}`,
      of100: '100% 中',
      consistencyTitle: '回答の一貫性指数：',
      radarTitle: '8つの経営行動次元レーダーチャート',
      radarDesc: '中心からの距離が遠いほど、その領域で衝動的・本能的行動が優勢であることを示します。',
      hotspotsTitle: '3つの最重要改善ポイント（ホットスポット）：',
      keyStrengthTitle: '組織の強みと安定の柱：',
      keyStrengthBadge: (pct) => `低摩擦：${pct}`,
      keyStrengthFooter: 'この次元は強固な土台です。この成功プロセスを他の弱点領域へ展開してください。',
      actionPlanTitle: '3段階「3+ 体系的アクションプラン」（Ali Asghar Hakimian）',
      recommendedChaptersTitle: '弱点3次元の改善に向けた書籍の推奨章：',
      orderBundleBtn: '書籍全巻セットを注文',
      compareBtn: '過去の保存された診断結果と比較する',
      closeCompareBtn: '比較表示を閉じる',
      prevAssessmentScore: (pct) => `前回：${pct}`,
      currentLabel: (pct) => `今回：${pct}`,
      printBtn: 'レポートの印刷・保存 (PDF)',
      retakeBtn: '診断をやり直す'
    },
    hi: {
      questionCount: (c, t) => `प्रश्न ${c} / ${t}`,
      dimensionLabel: (d) => `आयाम: ${d}`,
      scenarioNumber: (n, t) => `परिदृश्य #${n}: ${t}`,
      userResponseLabel: 'इस परिस्थिति में आपकी सामान्य प्रतिक्रिया और निर्णय:',
      prevBtn: 'पिछला प्रश्न',
      nextBtn: 'अगला प्रश्न',
      calcResultsBtn: 'व्यापक रिपोर्ट और कार्ययोजना प्राप्त करें',
      resultBadge: '24-परिदृश्य समग्र निदान रिपोर्ट व रोडमैप',
      resultTitle: (pct) => `सहज प्रबंधन में संलिप्तता: ${pct}`,
      of100: '100% में से',
      consistencyTitle: 'उत्तर स्थिरता सूचकांक:',
      radarTitle: '8 प्रबंधकीय आयामों का रडार चार्ट',
      radarDesc: 'केंद्र से अधिक दूरी उस क्षेत्र में सहज प्रतिक्रियाओं की प्रधानता दर्शाती है।',
      hotspotsTitle: '3 मुख्य हॉटस्पॉट और तत्काल सुधार प्राथमिकताएं:',
      keyStrengthTitle: 'आपकी संगठनात्मक शक्ति और स्थिरता का स्तंभ:',
      keyStrengthBadge: (pct) => `न्यूनतम घर्षण: ${pct}`,
      keyStrengthFooter: 'यह आयाम आपकी वर्तमान शक्ति है; इसके उपकरणों का उपयोग अन्य क्षेत्रों में करें।',
      actionPlanTitle: '3-चरणीय 3+ कार्ययोजना (Ali Asghar Hakimian)',
      recommendedChaptersTitle: 'आपके 3 कमजोर आयामों के लिए अनुशंसित पुस्तक अध्याय:',
      orderBundleBtn: 'संपूर्ण 2-खंड सेट ऑर्डर करें',
      compareBtn: 'पिछले सहेजे गए परिणाम से तुलना करें',
      closeCompareBtn: 'तुलना बंद करें',
      prevAssessmentScore: (pct) => `पिछला: ${pct}`,
      currentLabel: (pct) => `वर्तमान: ${pct}`,
      printBtn: 'प्रिंट व सहेजें (PDF)',
      retakeBtn: 'पुनः मूल्यांकन करें'
    },
    ar: {
      questionCount: (c, t) => `السؤال ${c} من ${t}`,
      dimensionLabel: (d) => `البُعد: ${d}`,
      scenarioNumber: (n, t) => `السيناريو #${n}: ${t}`,
      userResponseLabel: 'رد فعلك وإجراءاتك المتبعة في هذا الموقف:',
      prevBtn: 'السابق',
      nextBtn: 'السؤال التالي',
      calcResultsBtn: 'احتساب التقرير الشامل وخطة العمل',
      resultBadge: 'التقرير الشامل في ۲٤ سيناريو وخريطة الطريق',
      resultTitle: (pct) => `نسبة الانخراط في الإدارة الغريزية: ${pct}`,
      of100: 'من ۱۰۰٪',
      consistencyTitle: 'مؤشر تناسق الإجابات:',
      radarTitle: 'مخطط راداري للأبعاد الثمانية للسلوك الإداري',
      radarDesc: 'المسافة الأكبر عن المركز تعكس سيطرة السلوكيات الانفعالية والغريزية في ذلك المجال.',
      hotspotsTitle: '۳ نقاط اختناق وأولويات التدخل العاجل:',
      keyStrengthTitle: 'نقطة القوة والاستقرار المؤسسي لديك:',
      keyStrengthBadge: (pct) => `احتكاك منخفض: ${pct}`,
      keyStrengthFooter: 'هذا البُعد هو الركيزة الأساسية لاستقرارك الحالي؛ استفد من أدواته في سائر الأقسام.',
      actionPlanTitle: 'خطة العمل في ۳ خطوات لمنهجية +۳ (علي أصغر حكيميان)',
      recommendedChaptersTitle: 'الفصول المقترحة من كتاب أورانغوتان +۳ للأبعاد الضعيفة لديك:',
      orderBundleBtn: 'طلب المجموعة الكاملة من مجلدين',
      compareBtn: 'مقارنة هذه النتيجة بآخر تقييم محفوظ لديك',
      closeCompareBtn: 'إغلاق المقارنة التاريخية',
      prevAssessmentScore: (pct) => `التقييم السابق: ${pct}`,
      currentLabel: (pct) => `الحالي: ${pct}`,
      printBtn: 'طباعة وحفظ التقرير (PDF)',
      retakeBtn: 'إعادة التقييم'
    }
  };

  return ui[lang] || ui['fa'];
}
