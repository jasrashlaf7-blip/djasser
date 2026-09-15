/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Project, Experience, Education } from '../types';

export const projectsData: Project[] = [
  {
    id: 'market-manager-ai',
    title: {
      en: 'Market Manager AI',
      ar: 'مدير السوق بالذكاء الاصطناعي',
      fr: 'Market Manager AI',
    },
    category: {
      en: 'Smart POS · Business · AI-Assisted',
      ar: 'نظام بيع ذكي · إدارة أعمال · مدعوم بالذكاء الاصطناعي',
      fr: 'POS Intelligent · Gestion · Assisté par IA',
    },
    description: {
      en: 'AI-assisted point-of-sale and store-management concept designed to help businesses manage products, sales, inventory, and daily operations.',
      ar: 'مفهوم ذكي لإدارة نقاط البيع والمتاجر يساعد الشركات على إدارة المنتجات، المبيعات، المخزون، وتحليل العمليات اليومية بدعم من الذكاء الاصطناعي.',
      fr: 'Concept de point de vente et de gestion de magasin assisté par IA, conçu pour aider à gérer les produits, les ventes, les stocks et les opérations quotidiennes.',
    },
    problem: {
      en: 'Small businesses often struggle with fragmented management tools. Keeping track of sales, inventory thresholds, product expiration, and daily profit margins manually is prone to errors and prevents data-driven scaling.',
      ar: 'تواجه المشاريع الصغيرة صعوبة في تشتت أدوات الإدارة. تتبع المبيعات، ومستويات المخزون، وتواريخ انتهاء المنتجات، وهامش الربح اليومي يدوياً يؤدي إلى أخطاء متكررة ويعيق النمو القائم على البيانات.',
      fr: 'Les petites entreprises luttent souvent avec des outils de gestion fragmentés. Suivre les ventes, les seuils de stock et les marges bénéficiaires quotidiennes à la main engendre des erreurs et freine l’expansion.',
    },
    solution: {
      en: 'A unified POS and inventory hub with an embedded AI assistant. It provides automated stock notifications, handles checkout flows, and leverages natural language queries to offer instant reports on revenue and business performance.',
      ar: 'نظام بيع ومخزن موحد ومدمج بمساعد ذكي بالذكاء الاصطناعي. يقدم إشعارات جرد تلقائية، ويدير عمليات الدفع، ويحلل الأسئلة باللغة الطبيعية لتقديم تقارير فورية عن العوائد ومؤشرات الأداء.',
      fr: 'Un concentrateur unifié pour le point de vente et les stocks doté d’un assistant IA. Il fournit des alertes de réapprovisionnement, gère les encaissements et exploite le traitement naturel du langage pour formuler des rapports financiers instantanés.',
    },
    features: {
      en: [
        'Interactive POS Billing interface',
        'Real-time Inventory tracking with threshold alerts',
        'Sales analysis and daily operations metrics dashboard',
        'AI Store Advisor concept for natural language business reports',
        'Product category and price management structures',
      ],
      ar: [
        'واجهة دفع وفواتير تفاعلية ذكية',
        'تتبع مستمر للمخزون في الوقت الحقيقي مع تنبيهات عند انخفاض الكميات',
        'لوحة معلومات لتحليل المبيعات ومؤشرات الأداء اليومي',
        'مستشار المتجر الذكي للإجابة عن أسئلة الأعمال باللغة الطبيعية',
        'إدارة تصنيفات المنتجات والتسعير الذكي',
      ],
      fr: [
        'Interface interactive de facturation et de caisse',
        'Suivi des stocks en temps réel avec seuils d’alertes',
        'Tableau de bord d’analyse des ventes et indicateurs journaliers',
        'Conseiller IA en langage naturel pour analyser les performances du commerce',
        'Gestion structurée des catégories de produits et des tarifs',
      ],
    },
    technologies: ['React', 'TypeScript', 'Tailwind CSS', 'LocalStorage', 'Lucide Icons'],
    status: 'prototype',
    github: 'https://github.com/jasrashlaf7-blip/djasser',
  },
  {
    id: 'grasis',
    title: {
      en: 'Grasis',
      ar: 'غراسيس (Grasis)',
      fr: 'Grasis',
    },
    category: {
      en: 'Transportation · Mobile / Web Concept',
      ar: 'النقل والمواصلات · مفهوم تطبيق هاتف وويب',
      fr: 'Transport · Concept Mobile & Web',
    },
    description: {
      en: 'A transportation-focused digital application designed to provide smarter tools and services for transportation management.',
      ar: 'تطبيق رقمي مخصص لقطاع النقل يهدف لتقديم أدوات وخدمات ذكية لتنظيم الرحلات وإدارة النقل والمواصلات بكفاءة عالية.',
      fr: 'Une application numérique axée sur le transport, conçue pour fournir des outils et des services plus intelligents pour la gestion de la mobilité.',
    },
    problem: {
      en: 'Commuters and dispatchers face unpredictable transit delays, poor scheduling systems, and a lack of real-time route optimization. This causes loss of productivity and high operational costs for transport systems.',
      ar: 'يواجه الركاب ومنظمو النقل تأخيرات غير متوقعة، وأنظمة جدولة ضعيفة، وغياباً تاماً لتحسين المسارات اللحظي. يتسبب ذلك في ضياع الإنتاجية وارتفاع تكاليف التشغيل.',
      fr: 'Les navetteurs et les répartiteurs font face à des retards imprévisibles, des systèmes de planification obsolètes et un manque d’optimisation des itinéraires, réduisant la productivité globale.',
    },
    solution: {
      en: 'An intuitive platform for tracking trips, organizing driver rosters, calculating optimized routes, and offering passengers automated waiting time estimates with minimal infrastructure footprint.',
      ar: 'منصة تفاعلية بديهية لتتبع الرحلات، وتنسيق جداول السائقين، وحساب المسارات المثلى، وتقديم تقديرات دقيقة لأوقات الانتظار للمسافرين بجهد تقني منخفض.',
      fr: 'Une plateforme intuitive pour planifier les trajets, organiser les rotations de chauffeurs, optimiser les trajets et offrir aux usagers des estimations d’attente automatisées et précises.',
    },
    features: {
      en: [
        'Dynamic Trip Coordinator dashboard',
        'Driver assignment and active route management',
        'Live passenger boarding and route optimization metrics',
        'Integrated cost and ETA estimation tool',
        'Responsive layouts optimized for tablet and mobile screens',
      ],
      ar: [
        'لوحة تحكم ديناميكية لتنسيق الرحلات وجدولتها',
        'إسناد السائقين وإدارة المسارات النشطة',
        'تتبع فوري لصعود الركاب ومؤشرات كفاءة الطريق',
        'حاسبة متكاملة لتقدير التكاليف وأوقات الوصول المقدرة',
        'تصميم متجاوب ومتوافق بالكامل مع الأجهزة اللوحية والهواتف',
      ],
      fr: [
        'Tableau de bord dynamique de coordination des trajets',
        'Attribution des chauffeurs et gestion des trajets actifs',
        'Indicateurs d’embarquement et d’optimisation des itinéraires',
        'Calculateur intégré des coûts et de l’heure d’arrivée estimée (ETA)',
        'Interface adaptative optimisée pour tablettes et smartphones',
      ],
    },
    technologies: ['Vite', 'TypeScript', 'Tailwind CSS', 'Geocoding APIs', 'State Managers'],
    status: 'prototype',
    github: 'https://github.com/jasrashlaf7-blip/djasser',
  },
  {
    id: 'mouth-control',
    title: {
      en: 'MouthControl',
      ar: 'التحكم بالفم (MouthControl)',
      fr: 'MouthControl',
    },
    category: {
      en: 'Accessibility · Experimental Technology',
      ar: 'سهولة الوصول · تكنولوجيا تجريبية ومبتكرة',
      fr: 'Accessibilité · Technologie Expérimentale',
    },
    description: {
      en: 'An experimental project exploring hands-free computer interaction through mouth movement and voice commands.',
      ar: 'مشروع تقني تجريبي يستكشف إمكانيات التحكم في الحاسوب بدون استخدام اليدين عن طريق حركات الفم والأوامر الصوتية.',
      fr: 'Projet expérimental explorant l’interaction informatique mains libres via des mouvements de la bouche et des commandes vocales.',
    },
    problem: {
      en: 'People with severe motor disabilities or hand injuries face a massive digital divide, as traditional keyboards and mice are completely inaccessible to them, isolating them from digital educational resources and tools.',
      ar: 'يواجه الأشخاص الذين يعانون من إعاقات حركية شديدة أو إصابات في الأيدي فجوة رقمية هائلة، حيث أن أدوات التحكم التقليدية مثل لوحة المفاتيح والفأرة غير صالحة لهم، مما يعزلهم عن التكنولوجيا والتعليم.',
      fr: 'Les personnes souffrant de handicaps moteurs sévères ou de blessures aux mains font face à une fracture numérique majeure, les claviers et souris traditionnels leur étant inaccessibles.',
    },
    solution: {
      en: 'A high-impact human-computer interface concept. It processes camera feeds to track facial expressions and translates voice signals into system inputs, facilitating browsing, typing, and digital creation without hands.',
      ar: 'واجهة تحكم مبتكرة وتفاعلية بين الإنسان والحاسوب. تحلل بث الكاميرا لتتبع حركات تعبيرات الوجه والشفاه وتحول الأوامر الصوتية إلى مدخلات للنظام، مما يسهل التصفح، الكتابة، والبناء الرقمي بدون يدين.',
      fr: 'Un concept d’interface homme-machine à fort impact. Il analyse le flux de la caméra pour suivre les expressions faciales et traduit les signaux vocaux en entrées système pour naviguer et créer.',
    },
    features: {
      en: [
        'Camera tracking interface simulator (interactive overlay)',
        'Voice trigger registry for navigating and clicking',
        'Hands-free keyboard typing concept',
        'Custom sensitivity and accessibility calibration panel',
        'Zero-server client-side computer vision blueprint model',
      ],
      ar: [
        'محاكاة لواجهة تتبع الكاميرا للوجه وتعبيرات الشفاه',
        'سجل أوامر صوتية مخصصة للتنقل والنقر الفوري',
        'نموذج مبدئي للكتابة والتصفح دون استخدام الأيدي',
        'لوحة معايرة مخصصة لدرجة الحساسية وسهولة الاستخدام',
        'نموذج برمجية رؤية حاسوبية يتم بالكامل على جهاز العميل دون خوادم',
      ],
      fr: [
        'Simulateur d’interface de suivi caméra (mouvements faciaux)',
        'Registre de déclencheurs vocaux pour naviguer et cliquer',
        'Concept de clavier mains libres virtuel',
        'Panneau de calibrage de sensibilité et de profils d’accessibilité',
        'Plan technique de vision par ordinateur exécuté localement en client-side',
      ],
    },
    technologies: ['HTML5 Canvas', 'Web Audio API', 'React', 'CSS Animations'],
    status: 'experimental',
    github: 'https://github.com/jasrashlaf7-blip/djasser',
  },
];

export const experienceData: Experience[] = [
  {
    id: 'python-instructor',
    title: {
      en: 'Python Programming Instructor',
      ar: 'مدرب لغة البرمجة بايثون',
      fr: 'Formateur en Programmation Python',
    },
    company: {
      en: 'Freelance & Educational Initiatives',
      ar: 'مبادرات تعليمية وعمل مستقل',
      fr: 'Initiatives Éducatives & Freelance',
    },
    period: {
      en: '2024 — Present',
      ar: '2024 — الحاضر',
      fr: '2024 — Présent',
    },
    responsibilities: {
      en: [
        'Teaching Python programming fundamentals to students and enthusiasts.',
        'Creating practical, hands-on programming exercises and quizzes.',
        'Building educational real-world scripts to explain algorithms and data structures.',
        'Designing academic assessments to track progress and logic comprehension.',
        'Simplifying complex computing paradigms for beginners.',
      ],
      ar: [
        'تعليم أساسيات لغة البرمجة بايثون للطلاب والمهتمين بالبرمجة.',
        'ابتكار تمارين برمجية عملية واختبارات لترسيخ المفاهيم الأكاديمية.',
        'بناء برمجيات ومشاريع حقيقية مبسطة لشرح الخوارزميات وهياكل البيانات.',
        'تصميم تقييمات واختبارات قياسية لمتابعة مستوى استيعاب المنطق البرمجي.',
        'تبسيط النظريات الحاسوبية المعقدة لتسهيل تعلم المبتدئين.',
      ],
      fr: [
        'Enseignement des fondamentaux du langage Python à des étudiants et passionnés.',
        'Conception d’exercices pratiques de codage et de questionnaires d’évaluation.',
        'Développement de scripts éducatifs concrets pour illustrer algorithmes et structures.',
        'Élaboration d’épreuves académiques pour suivre la progression et la logique.',
        'Vulgarisation de concepts informatiques complexes pour les débutants.',
      ],
    },
  },
  {
    id: 'english-teacher',
    title: {
      en: 'English Teacher',
      ar: 'مدرس لغة إنجليزية',
      fr: 'Enseignant d’Anglais',
    },
    company: {
      en: 'Private Instruction & Educational Centers',
      ar: 'تعليم خاص ومراكز تعليمية',
      fr: 'Enseignement Privé & Centres Éducatifs',
    },
    period: {
      en: '2025 — Present',
      ar: '2025 — الحاضر',
      fr: '2025 — Présent',
    },
    responsibilities: {
      en: [
        'Preparing engaging, interactive English lessons tailored for various student levels.',
        'Developing comprehensive educational materials and digital learning resources.',
        'Conducting conversation clubs and interactive classroom activities to build confidence.',
        'Evaluating student communication metrics, vocabulary, and grammar rules.',
      ],
      ar: [
        'إعداد دروس لغة إنجليزية ممتعة وتفاعلية تناسب مختلف مستويات الطلاب.',
        'تطوير مواد تعليمية شاملة ومصادر تعلم رقمية حديثة.',
        'تنظيم نوادي محادثة وأنشطة صفية تفاعلية لتعزيز ثقة الطلاب بأنفسهم.',
        'تقييم مهارات التواصل الشفهية والكتابية، والقواعد والتبادل اللغوي.',
      ],
      fr: [
        'Préparation de cours d’anglais interactifs et adaptés à différents niveaux.',
        'Développement de matériel pédagogique complet et de supports numériques.',
        'Animation d’ateliers de conversation et d’activités de groupe stimulantes.',
        'Évaluation des compétences de communication, du vocabulaire et de la grammaire.',
      ],
    },
  },
  {
    id: 'freelance-developer',
    title: {
      en: 'Freelance Developer',
      ar: 'مطور برمجيات مستقل',
      fr: 'Développeur Freelance',
    },
    company: {
      en: 'Digital Contract Projects',
      ar: 'مشاريع تطوير رقمية مستقلة',
      fr: 'Projets Numériques Indépendants',
    },
    period: {
      en: '2024 — Present',
      ar: '2024 — الحاضر',
      fr: '2024 — Présent',
    },
    responsibilities: {
      en: [
        'Developing client-oriented web applications and mobile application prototypes.',
        'Leveraging AI-assisted development (vibe coding) to construct products 10x faster.',
        'Integrating client-side serverless infrastructures with Firebase and LocalStorage.',
        'Structuring clean, modular codebases on GitHub for easy code handoff.',
      ],
      ar: [
        'تطوير تطبيقات ويب وتطبيقات هاتف ذكية متكاملة ومخصصة لمختلف العملاء.',
        'توظيف مهارات التطوير بالذكاء الاصطناعي لبناء مشاريع برمجية في وقت قياسي.',
        'دمج حلول وقواعد بيانات مستقلة باستخدام Firebase وتقنيات التخزين المحلي.',
        'هيكلة مستودعات برمجية نظيفة على منصة GitHub لتسهيل تسليم المشاريع.',
      ],
      fr: [
        'Développement d’applications web et de prototypes d’applications mobiles sur mesure.',
        'Exploitation du codage assisté par IA pour assembler des livrables 10 fois plus vite.',
        'Intégration d’infrastructures légères avec Firebase et stockage de données local.',
        'Structuration de dépôts GitHub modulaires et propres pour faciliter la livraison.',
      ],
    },
  },
  {
    id: 'freelance-designer',
    title: {
      en: 'Freelance Designer',
      ar: 'مصمم بصري مستقل',
      fr: 'Designer Graphique Freelance',
    },
    company: {
      en: 'Creative Design Contracts',
      ar: 'تعاقدات أعمال وتصاميم إبداعية',
      fr: 'Contrats de Création Graphique',
    },
    period: {
      en: '2023 — Present',
      ar: '2023 — الحاضر',
      fr: '2023 — Présent',
    },
    responsibilities: {
      en: [
        'Creating digital visual assets, modern branding, and promotional advertising.',
        'Designing user interfaces (UI) and user experience workflows for mobile applications.',
        'Ensuring Apple-level visual cleanliness and premium geometric grid systems.',
        'Producing rich vector-based iconography, banners, and digital collateral.',
      ],
      ar: [
        'تصميم الهويات البصرية والشعارات الإبداعية والمواد الإعلانية المبتكرة.',
        'تصميم واجهات وتجربة المستخدم (UI/UX) لتطبيقات الهاتف ومواقع الويب.',
        'تطبيق معايير التصميم الراقية المستوحاة من فلسفة Apple لضمان تناسق الواجهات.',
        'إنتاج الأيقونات المتجهة واللافتات الرقمية والمواد الترويجية الاحترافية.',
      ],
      fr: [
        'Création d’identités visuelles numériques, de logos et de supports publicitaires.',
        'Conception d’interfaces utilisateur (UI) et d’ergonomies (UX) pour applications.',
        'Application de critères de clarté visuelle de haut niveau inspirés du style Apple.',
        'Production d’iconographies vectorielles et de chartes graphiques de précision.',
      ],
    },
  },
];

export const educationData: Education[] = [
  {
    id: 'usthb',
    school: {
      en: 'USTHB — Houari Boumediene University',
      ar: 'USTHB — جامعة العلوم والتكنولوجيا هواري بومدين',
      fr: 'USTHB — Université des Sciences et de la Technologie Houari Boumediene',
    },
    degree: {
      en: 'Computer Science Student',
      ar: 'طالب في قسم علوم الحاسوب',
      fr: 'Étudiant en Informatique',
    },
    period: {
      en: 'Starting 2026',
      ar: 'بداية من 2026',
      fr: 'Débute en 2026',
    },
    details: {
      en: 'Admitted to prestigious computer science studies. Active builder, planning future digital startup structures and technology research within the university environment.',
      ar: 'التحق بالدراسات البرمجية بالجامعة العريقة. بنّاء نشط يخطط لتأسيس مشاريع تكنولوجية ناشئة وأبحاث تطبيقية داخل أسوار الجامعة.',
      fr: 'Admis au cursus d’études en informatique. Prêt à concevoir de futures structures de startups et à mener des travaux expérimentaux au sein de l’université.',
    },
  },
  {
    id: 'baccalaureate',
    school: {
      en: 'National Baccalaureate Examination',
      ar: 'شهادة البكالوريا الوطنية',
      fr: 'Baccalauréat National',
    },
    degree: {
      en: 'High School Graduation',
      ar: 'شهادة التخرج من التعليم الثانوي',
      fr: 'Diplôme de Fin d’Études Secondaires',
    },
    period: {
      en: 'Graduated 2026',
      ar: 'تخرج في 2026',
      fr: 'Obtenu en 2026',
    },
    details: {
      en: 'Algeria. Graduated with honors, enabling placement in computer science specialized tracks.',
      ar: 'الجزائر. تخرج بتفوق مكنه من الالتحاق بالتخصصات البرمجية الدقيقة بـ USTHB.',
      fr: 'Algérie. Diplôme obtenu avec mentions, ouvrant l’accès aux filières informatiques d’élite.',
    },
  },
];
