import React, { useState, useRef, useMemo, useCallback, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { Share2, Check, Volume2, Square, RotateCcw } from 'lucide-react';

// --- Types & Constants ---
interface Question {
  id: number;
  section: 'section1' | 'section2';
  category: string;
  text: { en: string; mr: string };
  options: {
    text: { en: string; mr: string };
    scores: { vata: number; pitta: number; kapha: number };
  }[];
}

const QUESTIONS: Question[] = [
  {
    id: 1, section: 'section1', category: 'Activities',
    text: { en: "How do you do your activities?", mr: "तुम्ही तुमची कामे कशी करता?" },
    options: [
      { text: { en: "With a lot of initiative, very quickly", mr: "खूप पुढाकार घेऊन, अतिशय वेगाने" }, scores: { vata: 3, pitta: 0, kapha: 0 } },
      { text: { en: "With medium initiative or speed", mr: "मध्यम पुढाकार किंवा वेगाने" }, scores: { vata: 0, pitta: 3, kapha: 0 } },
      { text: { en: "Slowly and steadily", mr: "हळूहळू आणि स्थिरपणे" }, scores: { vata: 0, pitta: 0, kapha: 3 } }
    ]
  },
  {
    id: 2, section: 'section1', category: 'Excitement',
    text: { en: "How do you become excited?", mr: "तुम्ही किती लवकर उत्तेजित होता?" },
    options: [
      { text: { en: "Very quickly", mr: "अतिशय वेगाने" }, scores: { vata: 3, pitta: 0, kapha: 0 } },
      { text: { en: "Quickly", mr: "वेगाने" }, scores: { vata: 0, pitta: 3, kapha: 0 } },
      { text: { en: "Slowly", mr: "हळूहळू" }, scores: { vata: 0, pitta: 0, kapha: 3 } }
    ]
  },
  {
    id: 3, section: 'section1', category: 'Learning',
    text: { en: "Receptive power (How quickly do you learn new things)?", mr: "तुमची ग्रहण शक्ती कशी आहे (नवीन गोष्टी शिकणे)?" },
    options: [
      { text: { en: "Very quick assimilation", mr: "अतिशय लवकर समजते" }, scores: { vata: 3, pitta: 0, kapha: 0 } },
      { text: { en: "Quick assimilation", mr: "लवकर समजते" }, scores: { vata: 0, pitta: 3, kapha: 0 } },
      { text: { en: "Slow assimilation", mr: "हळूहळू समजते" }, scores: { vata: 0, pitta: 0, kapha: 3 } }
    ]
  },
  {
    id: 4, section: 'section1', category: 'Memory',
    text: { en: "How is your memory?", mr: "तुमची स्मरणशक्ती कशी आहे?" },
    options: [
      { text: { en: "Short memory", mr: "अल्पकालीन स्मरणशक्ती" }, scores: { vata: 3, pitta: 0, kapha: 0 } },
      { text: { en: "Medium / Very sharp memory", mr: "मध्यम / अतिशय तीक्ष्ण स्मरणशक्ती" }, scores: { vata: 0, pitta: 3, kapha: 0 } },
      { text: { en: "Long memory", mr: "दीर्घकालीन स्मरणशक्ती" }, scores: { vata: 0, pitta: 0, kapha: 3 } }
    ]
  },
  {
    id: 5, section: 'section1', category: 'Speech',
    text: { en: "How do you talk?", mr: "तुम्ही कसे बोलता?" },
    options: [
      { text: { en: "Fast, missing some letters or words", mr: "जलद, काही अक्षरे किंवा शब्द गाळणे" }, scores: { vata: 3, pitta: 0, kapha: 0 } },
      { text: { en: "Fast but sharp and clear cut", mr: "जलद पण स्पष्ट आणि तीक्ष्ण" }, scores: { vata: 0, pitta: 3, kapha: 0 } },
      { text: { en: "Slow, clear and sweet", mr: "हळूवार, स्पष्ट आणि मधुर" }, scores: { vata: 0, pitta: 0, kapha: 3 } }
    ]
  },
  {
    id: 6, section: 'section1', category: 'Gait',
    text: { en: "How do you walk?", mr: "तुम्ही कसे चालता?" },
    options: [
      { text: { en: "Very fast, light movement", mr: "अतिशय जलद, हलकी हालचाल" }, scores: { vata: 3, pitta: 0, kapha: 0 } },
      { text: { en: "Medium movement but sharp", mr: "मध्यम वेग पण निश्चयी" }, scores: { vata: 0, pitta: 3, kapha: 0 } },
      { text: { en: "Slow, pressing the foot on the ground", mr: "हळूवार, पाय घट्ट टेकवून" }, scores: { vata: 0, pitta: 0, kapha: 3 } }
    ]
  },
  {
    id: 7, section: 'section1', category: 'Hunger',
    text: { en: "How is your hunger?", mr: "तुमची भूक कशी आहे?" },
    options: [
      { text: { en: "Irregular (Sometimes yes, sometimes no)", mr: "अनियमित (कधी लागते, कधी नाही)" }, scores: { vata: 3, pitta: 0, kapha: 0 } },
      { text: { en: "Sharp (Cannot skip, need food first then work)", mr: "तीव्र (टाळू शकत नाही, आधी जेवण मग काम)" }, scores: { vata: 0, pitta: 3, kapha: 0 } },
      { text: { en: "Low (Can skip meals easily)", mr: "मंद (सहज जेवण टाळू शकतो)" }, scores: { vata: 0, pitta: 0, kapha: 3 } }
    ]
  },
  {
    id: 8, section: 'section1', category: 'Taste',
    text: { en: "Which group of tastes do you like more?", mr: "तुम्हाला कोणत्या चवी जास्त आवडतात?" },
    options: [
      { text: { en: "Sweet, Sour, Salty", mr: "गोड, आंबट, खारट" }, scores: { vata: 3, pitta: 0, kapha: 0 } },
      { text: { en: "Sweet, Bitter, Astringent", mr: "गोड, कडू, तुरट" }, scores: { vata: 0, pitta: 3, kapha: 0 } },
      { text: { en: "Pungent, Bitter, Astringent", mr: "तिखट, कडू, तुरट" }, scores: { vata: 0, pitta: 0, kapha: 3 } }
    ]
  },
  {
    id: 9, section: 'section1', category: 'Cravings',
    text: { en: "Do you crave warm or cold food?", mr: "तुम्हाला गरम की थंड अन्न आवडते?" },
    options: [
      { text: { en: "Yes, warm food", mr: "हो, गरम अन्न आवडते" }, scores: { vata: 3, pitta: 0, kapha: 0 } },
      { text: { en: "No, I crave cold food", mr: "नाही, थंड अन्न आवडते" }, scores: { vata: 0, pitta: 3, kapha: 0 } },
      { text: { en: "Warm and dry", mr: "गरम आणि कोरडे अन्न" }, scores: { vata: 0, pitta: 0, kapha: 3 } }
    ]
  },
  {
    id: 10, section: 'section1', category: 'Sweat',
    text: { en: "How much do you perspire (sweat)?", mr: "तुम्हाला घाम किती येतो?" },
    options: [
      { text: { en: "Scanty", mr: "कमी / अत्यल्प" }, scores: { vata: 3, pitta: 0, kapha: 0 } },
      { text: { en: "Abundant, sometimes with odor", mr: "भरपूर, कधीकधी वासासह" }, scores: { vata: 0, pitta: 3, kapha: 0 } },
      { text: { en: "Very little", mr: "अतिशय कमी" }, scores: { vata: 0, pitta: 0, kapha: 3 } }
    ]
  },
  {
    id: 11, section: 'section1', category: 'Sleep',
    text: { en: "How is your sleep?", mr: "तुमची झोप कशी आहे?" },
    options: [
      { text: { en: "Scanty, interrupted (~6 hours)", mr: "कमी, मध्येच मोडणारी (~६ तास)" }, scores: { vata: 3, pitta: 0, kapha: 0 } },
      { text: { en: "Little but sound (6-8 hours)", mr: "कमी पण शांत (६-८ तास)" }, scores: { vata: 0, pitta: 3, kapha: 0 } },
      { text: { en: "Abundant, heavy (>8 hours)", mr: "भरपूर, गाढ (८ तासांपेक्षा जास्त)" }, scores: { vata: 0, pitta: 0, kapha: 3 } }
    ]
  },
  {
    id: 12, section: 'section1', category: 'Dreams',
    text: { en: "What is the theme of your dreams?", mr: "तुम्हाला स्वप्न कशा प्रकारचे पडतात?" },
    options: [
      { text: { en: "Flying, jumping, fear, mountains", mr: "उडणे, उड्या मारणे, भीती, डोंगर" }, scores: { vata: 3, pitta: 0, kapha: 0 } },
      { text: { en: "Anger, fire, wars, struggle", mr: "राग, अग्नी, युद्ध, संघर्ष" }, scores: { vata: 0, pitta: 3, kapha: 0 } },
      { text: { en: "Water, lakes, birds, romance", mr: "पाणी, तलाव, पक्षी, प्रेम" }, scores: { vata: 0, pitta: 0, kapha: 3 } }
    ]
  },
  {
    id: 13, section: 'section2', category: 'Body Frame',
    text: { en: "How is your body frame?", mr: "तुमची शरीराची ठेवण कशी आहे?" },
    options: [
      { text: { en: "Lean, long or short", mr: "कृश (पातळ), उंच किंवा ठेंगणे" }, scores: { vata: 3, pitta: 0, kapha: 0 } },
      { text: { en: "Medium size", mr: "मध्यम" }, scores: { vata: 0, pitta: 3, kapha: 0 } },
      { text: { en: "Large, plump, fleshy", mr: "मोठी, मांसल आणि पुष्ट" }, scores: { vata: 0, pitta: 0, kapha: 3 } }
    ]
  },
  {
    id: 14, section: 'section2', category: 'Skin Moistness',
    text: { en: "How is your skin moistness?", mr: "तुमची त्वचा किती तेलकट आहे?" },
    options: [
      { text: { en: "Dry", mr: "कोरडी" }, scores: { vata: 3, pitta: 0, kapha: 0 } },
      { text: { en: "Slightly unctuous (Oily)", mr: "किंचित तेलकट" }, scores: { vata: 0, pitta: 3, kapha: 0 } },
      { text: { en: "Unctuous (Oily and smooth)", mr: "तेलकट आणि मऊ" }, scores: { vata: 0, pitta: 0, kapha: 3 } }
    ]
  },
  {
    id: 15, section: 'section2', category: 'Complexion',
    text: { en: "Your skin complexion?", mr: "तुमचा रंग (त्वचा) कसा आहे?" },
    options: [
      { text: { en: "Dark, blackish", mr: "सावळा, काळपट" }, scores: { vata: 3, pitta: 0, kapha: 0 } },
      { text: { en: "Fair, reddish, copper type", mr: "गोरा, लालसर, तांबूस छटा" }, scores: { vata: 0, pitta: 3, kapha: 0 } },
      { text: { en: "White, bright", mr: "पांढरट, तेजस्वी" }, scores: { vata: 0, pitta: 0, kapha: 3 } }
    ]
  },
  {
    id: 16, section: 'section2', category: 'Hair',
    text: { en: "Your hair (head)?", mr: "तुमचे केस कसे आहेत?" },
    options: [
      { text: { en: "Scanty, rough", mr: "विरळ, खडबडीत" }, scores: { vata: 3, pitta: 0, kapha: 0 } },
      { text: { en: "Soft, graying tendency, baldness", mr: "मऊ, अकाली पांढरे होणे किंवा गळणे" }, scores: { vata: 0, pitta: 3, kapha: 0 } },
      { text: { en: "Plentiful, thick, wavy, glossy", mr: "दाट, जाड, कुरळे, चमकदार" }, scores: { vata: 0, pitta: 0, kapha: 3 } }
    ]
  }
];

const TRANSLATIONS: Record<string, any> = {
  en: {
    title: 'PRAKRITI', subtitle: 'YOUR AYURVEDIC BLUEPRINT', desc: 'Prakriti is your foundational psycho-physiological profile, determining your physical traits, mental inclinations, and health predispositions.',
    start: 'BEGIN JOURNEY', previous: 'Back', next: 'Next', finish: 'See Analysis', loading: 'Analyzing your clinical profile...', results: 'Your Prakriti Analysis', primary: 'Primary Constitution',
    breakdown: 'Dosha Breakdown', traits: 'Key Characteristics', risks: 'Potential Imbalances', advice: 'Wellness Recommendations', insight: 'Holistic Insight', listen: 'Listen to Analysis', stop: 'Stop Audio', restart: 'START OVER', section1: 'Behavior & Physiology', section2: 'Physical Examination', error: 'Analysis failed. Please try again.',
    share: 'Share Result', copied: 'Copied!',
    loginTitle: 'Sign In', loginDesc: 'Enter your credentials to access the Prakriti blueprint portal.',
    demoCreds: 'Demo Credentials', username: 'Username', password: 'Password', signInBtn: 'Sign In',
    profileTitle: 'Your Demographic Details', profileDesc: 'Enter your basic measurements to customize your Ayurvedic recommendations.',
    fullName: 'Full Name', height: 'Height (cm)', age: 'Age (years)', gender: 'Gender', selectGender: 'Select Gender',
    male: 'Male', female: 'Female', other: 'Other', pnotSay: 'Prefer not to say', saveProfile: 'Continue',
    retestBannerTitle: '1-Month Progress Tracking', retestBannerDesc: 'Have you followed your Ayurvedic blueprint for 1 month? Simulate a retest to generate a comparative progress graph and see how your doshas have balanced!',
    retestBtn: 'Simulate 1-Month Retest', retestActive: 'Taking Retest', comparisonTitle: '1-Month Clinical Progress', comparisonSub: 'Comparison of your baseline constitution versus 1-month retest result.',
    baselineLabel: 'Baseline', retestLabel: '1-Month Retest', balanceTrend: 'Balance Trend', closerToBalance: 'Optimal Balance',
    tabSummary: 'Summary', tabFoods: 'Avoid Foods', tabPrecautions: 'Precautions', tabSuggestions: 'Tips', tabYoga: 'Yoga & Exercise', tabCauses: 'Causes',
    riskGaugeTitle: 'Constitutional Health Risk', riskLow: 'Low Risk', riskMedium: 'Moderate Risk', riskHigh: 'High Risk',
    riskDesc: 'Calculated risk of developing dosha-specific structural or metabolic imbalances based on current profile and habits.'
  },
  mr: {
    title: 'प्रकृती', subtitle: 'तुमची आयुर्वेदिक ब्लूप्रिंट', desc: 'प्रकृती हे तुमचे मूळ मानस-शारीरिक व्यक्तिमत्व आहे, जे तुमचे शारीरिक गुणधर्म आणि आरोग्याची स्थिती ठरवते.',
    start: 'सुरू करा', previous: 'मागे', next: 'पुढील', finish: 'निकाल पहा', loading: 'तुमच्या प्रकृतीचे विश्लेषण करत आहे...', results: 'तुमचे प्रकृती विश्लेषण', primary: 'मुख्य प्रकृती',
    breakdown: 'दोषांचे विश्लेषण', traits: 'मुख्य वैशिष्ट्ये', risks: 'संभाव्य धोके', advice: 'आरोग्य शिफारसी', insight: 'सखोल माहिती', listen: 'विश्लेषण ऐका', stop: 'ऑडिओ थांबवा', restart: 'पुन्हा सुरू करा', section1: 'व्यवहार आणि शारीरिक क्रिया', section2: 'शारीरिक परीक्षण', error: 'विश्लेषण अयशस्वी झाले. कृपया पुन्हा प्रयत्न करा.',
    share: 'निकाल शेअर करा', copied: 'कॉपी केले!',
    loginTitle: 'लॉग इन करा', loginDesc: 'प्रकृती ब्लूप्रिंट पोर्टलमध्ये प्रवेश करण्यासाठी तुमची माहिती प्रविष्ट करा.',
    demoCreds: 'डेमो क्रेडेंशियल्स', username: 'वापरकर्ता नाव', password: 'पासवर्ड', signInBtn: 'प्रवेश करा',
    profileTitle: 'तुमची वैयक्तिक माहिती', profileDesc: 'तुमच्या आयुर्वेदिक शिफारसी सानुकूलित करण्यासाठी तुमची मोजमापे प्रविष्ट करा.',
    fullName: 'पूर्ण नाव', height: 'उंची (सेमी)', age: 'वय (वर्षे)', gender: 'लिंग', selectGender: 'लिंग निवडा',
    male: 'पुरुष', female: 'स्त्री', other: 'इतर', pnotSay: 'सांगू इच्छित नाही', saveProfile: 'पुढे जा',
    retestBannerTitle: '१-महिन्याचा प्रगती अहवाल', retestBannerDesc: 'तुमची १ महिना तुमच्या आयुर्वेदिक शिफारसी दिनचर्या पाळली आहे का? प्रगतीचा आलेख पाहण्यासाठी चाचणीची पुनरावृत्ती करा!',
    retestBtn: '१-महिन्याची पुनरावृत्ती चाचणी', retestActive: 'पुनरावृत्ती चाचणी सुरू', comparisonTitle: '१-महिन्याची क्लिनिकल प्रगती', comparisonSub: 'तुमच्या सुरुवातीच्या प्रकृतीची १-महिन्याच्या पुनरावृत्ती निकालाशी तुलना.',
    baselineLabel: 'सुरुवातीची चाचणी', retestLabel: '१-महिन्यानंतरची चाचणी', balanceTrend: 'प्रगती दिशा', closerToBalance: 'उत्कृष्ट संतुलन',
    tabSummary: 'थोडक्यात माहिती', tabFoods: 'वर्ज्य अन्न', tabPrecautions: 'दक्षता/सावधानता', tabSuggestions: 'टीप आणि सल्ले', tabYoga: 'योग आणि व्यायाम', tabCauses: 'कारणे',
    riskGaugeTitle: 'आरोग्य धोका मूल्यांकन', riskLow: 'कमी धोका', riskMedium: 'मध्यम धोका', riskHigh: 'उच्च धोका',
    riskDesc: 'तुमच्या वैयक्तिक प्रोफाइल, वय आणि दोषांच्या आधारे उद्भवू शकणाऱ्या संभाव्य विकारांचे मोजमाप.'
  }
};

const LOADING_MESSAGES = {
  en: ["Calibrating Vata-Pitta ratios...", "Assessing physiological tendencies...", "Synthesizing Ayurvedic insights...", "Mapping your biological blueprint..."],
  mr: ["वात-पित्त प्रमाणाचे मोजमाप करत आहे...", "शारीरिक प्रवृत्तींचे मूल्यांकन करत आहे...", "आयुर्वेदिक माहितीचे विश्लेषण करत आहे...", "तुमचा जैविक नकाशा तयार करत आहे..."]
};

// --- Sub-components ---
const DoshaChart = React.memo(({ scores }: { scores: any }) => {
  const vata = scores?.vata || 0;
  const pitta = scores?.pitta || 0;
  const kapha = scores?.kapha || 0;
  const total = vata + pitta + kapha;
  
  return (
    <div className="dosha-chart">
      {[
        { name: 'Vata', val: vata },
        { name: 'Pitta', val: pitta },
        { name: 'Kapha', val: kapha }
      ].map(d => {
        const percent = total > 0 ? Math.round((d.val / total) * 100) : 0;
        return (
          <div key={d.name} className="chart-column">
            <div className="bar-container"><div className="bar" style={{ height: `${percent}%` }} /></div>
            <span className="chart-label">{d.name} {percent}%</span>
          </div>
        );
      })}
    </div>
  );
});

// --- Custom Sub-components for Advanced Analysis ---

const ProgressGraph = React.memo(({ baseline, retest, lang }: { baseline: any; retest: any; lang: 'en' | 'mr' }) => {
  if (!baseline || !retest) return null;
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

  const totalBaseline = baseline.vata + baseline.pitta + baseline.kapha;
  const totalRetest = retest.vata + retest.pitta + retest.kapha;

  const baselineVata = totalBaseline > 0 ? Math.round((baseline.vata / totalBaseline) * 100) : 0;
  const baselinePitta = totalBaseline > 0 ? Math.round((baseline.pitta / totalBaseline) * 100) : 0;
  const baselineKapha = totalBaseline > 0 ? Math.round((baseline.kapha / totalBaseline) * 100) : 0;

  const retestVata = totalRetest > 0 ? Math.round((retest.vata / totalRetest) * 100) : 0;
  const retestPitta = totalRetest > 0 ? Math.round((retest.pitta / totalRetest) * 100) : 0;
  const retestKapha = totalRetest > 0 ? Math.round((retest.kapha / totalRetest) * 100) : 0;

  const getTrend = (dosha: string, basePercent: number, retestPercent: number) => {
    // Shifting closer to tridoshic equal proportion (33.3%) represents balanced stabilization
    const baseDiff = Math.abs(basePercent - 33.3);
    const retestDiff = Math.abs(retestPercent - 33.3);
    const diff = baseDiff - retestDiff;

    if (diff > 0.5) {
      return {
        text: lang === 'en' ? `Balanced (-${Math.round(diff)}%)` : `संतुलित (-${Math.round(diff)}%)`,
        style: 'trend-better'
      };
    } else {
      return {
        text: lang === 'en' ? `Stable (${retestPercent}%)` : `स्थिर (${retestPercent}%)`,
        style: 'trend-neutral'
      };
    }
  };

  const vataTrend = getTrend('Vata', baselineVata, retestVata);
  const pittaTrend = getTrend('Pitta', baselinePitta, retestPitta);
  const kaphaTrend = getTrend('Kapha', baselineKapha, retestKapha);

  return (
    <div className="timeline-card">
      <h3 className="timeline-title">{t.comparisonTitle}</h3>
      <p className="timeline-subtitle">{t.comparisonSub}</p>

      <div className="timeline-chart-wrap">
        {/* Vata */}
        <div className="timeline-bar-group">
          <div className="timeline-bar-label">
            <span className="dosha-label-styled">Vata 💨</span>
            <span className={`trend-arrow ${vataTrend.style}`}>{vataTrend.text}</span>
          </div>
          <div className="timeline-bar-track">
            <div className="timeline-bar-value baseline" style={{ width: `${baselineVata}%` }} />
            <div className="timeline-bar-value retest" style={{ width: `${retestVata}%` }} />
          </div>
        </div>

        {/* Pitta */}
        <div className="timeline-bar-group">
          <div className="timeline-bar-label">
            <span className="dosha-label-styled">Pitta 🔥</span>
            <span className={`trend-arrow ${pittaTrend.style}`}>{pittaTrend.text}</span>
          </div>
          <div className="timeline-bar-track">
            <div className="timeline-bar-value baseline" style={{ width: `${baselinePitta}%` }} />
            <div className="timeline-bar-value retest" style={{ width: `${retestPitta}%` }} />
          </div>
        </div>

        {/* Kapha */}
        <div className="timeline-bar-group">
          <div className="timeline-bar-label">
            <span className="dosha-label-styled">Kapha 💧</span>
            <span className={`trend-arrow ${kaphaTrend.style}`}>{kaphaTrend.text}</span>
          </div>
          <div className="timeline-bar-track">
            <div className="timeline-bar-value baseline" style={{ width: `${baselineKapha}%` }} />
            <div className="timeline-bar-value retest" style={{ width: `${retestKapha}%` }} />
          </div>
        </div>
      </div>

      <div className="timeline-legend">
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: 'var(--primary-light)', opacity: 0.45 }} />
          <span>{t.baselineLabel}</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: 'var(--primary)' }} />
          <span>{t.retestLabel}</span>
        </div>
      </div>
    </div>
  );
});

const RiskGauge = React.memo(({ percentage, lang }: { percentage: number; lang: 'en' | 'mr' }) => {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (Math.min(100, Math.max(0, percentage)) / 100) * circumference;

  let levelClass = 'low';
  let levelText = t.riskLow;
  if (percentage >= 35 && percentage <= 65) {
    levelClass = 'mod';
    levelText = t.riskMedium;
  } else if (percentage > 65) {
    levelClass = 'high';
    levelText = t.riskHigh;
  }

  return (
    <div className="risk-gauge-card">
      <div className="gauge-visual">
        <svg className="gauge-svg" viewBox="0 0 120 120">
          <circle className="gauge-bg" cx="60" cy="60" r="50" />
          <circle
            className={`gauge-fill ${levelClass}`}
            cx="60"
            cy="60"
            r="50"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
          />
        </svg>
        <div className="gauge-text">
          <span className="gauge-number">{percentage}<span className="gauge-percent-sign">%</span></span>
          <span className={`gauge-level-lbl ${levelClass}`}>{levelText}</span>
        </div>
      </div>

      <div className="gauge-info-box">
        <h4 className="gauge-info-title">{t.riskGaugeTitle}</h4>
        <p className="gauge-info-desc">{t.riskDesc}</p>
      </div>
    </div>
  );
});

// --- App Component ---
const App: React.FC = () => {
  // Check Authentication & saved Profile (checks both Local and Session storage)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('prakriti_auth') === 'true' || sessionStorage.getItem('prakriti_auth') === 'true';
  });

  const [profile, setProfile] = useState<{ name: string; height: number; age: number; gender: string } | null>(() => {
    const saved = localStorage.getItem('prakriti_profile') || sessionStorage.getItem('prakriti_profile');
    return saved ? JSON.parse(saved) : null;
  });

  const [step, setStep] = useState<'login' | 'profile' | 'intro' | 'quiz' | 'loading' | 'results'>(() => {
    const authed = localStorage.getItem('prakriti_auth') === 'true' || sessionStorage.getItem('prakriti_auth') === 'true';
    if (!authed) return 'login';
    const savedProfile = localStorage.getItem('prakriti_profile') || sessionStorage.getItem('prakriti_profile');
    if (!savedProfile) return 'profile';
    return 'intro';
  });

  const [isTempSave, setIsTempSave] = useState<boolean>(() => {
    return sessionStorage.getItem('prakriti_temp_save') === 'true';
  });

  // Login credentials state
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const [lang, setLang] = useState<'en' | 'mr'>('en');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<(number | undefined)[]>(Array(QUESTIONS.length).fill(undefined));
  const [analysis, setAnalysis] = useState<any>(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [loadingMsgIdx, setLoadingMsgIdx] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [copiedState, setCopiedState] = useState(false);

  // Recommendations Tab state
  const [activeTab, setActiveTab] = useState<string>('summary');

  // Baseline and Retest scores state (checks both Local and Session storage)
  const [baselineScores, setBaselineScores] = useState<{ vata: number; pitta: number; kapha: number } | null>(() => {
    const saved = localStorage.getItem('prakriti_baseline_scores') || sessionStorage.getItem('prakriti_baseline_scores');
    return saved ? JSON.parse(saved) : null;
  });
  const [retestScores, setRetestScores] = useState<{ vata: number; pitta: number; kapha: number } | null>(() => {
    const saved = localStorage.getItem('prakriti_retest_scores') || sessionStorage.getItem('prakriti_retest_scores');
    return saved ? JSON.parse(saved) : null;
  });

  const audioContextRef = useRef<AudioContext | null>(null);
  const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);

  const t = useMemo(() => TRANSLATIONS[lang] || TRANSLATIONS.en, [lang]);

  // Loading Message Cycle
  useEffect(() => {
    if (step !== 'loading') return;
    const interval = setInterval(() => {
      setLoadingMsgIdx(prev => (prev + 1) % LOADING_MESSAGES[lang].length);
    }, 1800);
    return () => clearInterval(interval);
  }, [step, lang]);

  // Handle Login submission
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const u = username.trim().toLowerCase();
    const p = password.trim();

    if (u === 'user1@gmail.com' && p === '123456') {
      if (isTempSave) {
        sessionStorage.setItem('prakriti_auth', 'true');
        sessionStorage.setItem('prakriti_temp_save', 'true');
        localStorage.removeItem('prakriti_auth');
      } else {
        localStorage.setItem('prakriti_auth', 'true');
        localStorage.removeItem('prakriti_temp_save');
        sessionStorage.removeItem('prakriti_auth');
      }
      setIsAuthenticated(true);
      setLoginError('');

      const savedProfile = localStorage.getItem('prakriti_profile') || sessionStorage.getItem('prakriti_profile');
      if (savedProfile) {
        setStep('intro');
      } else {
        setStep('profile');
      }
    } else {
      setLoginError(lang === 'en' ? 'Invalid credentials. Please use the hidden credentials.' : 'अवैध वापरकर्ता नाव किंवा संकेतशब्द. कृपया क्रेडेंशियल्स तपासा.');
    }
  };

  // Handle Profile setup submission
  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nameVal = (document.getElementById('profile-name') as HTMLInputElement)?.value || '';
    const ageVal = parseInt((document.getElementById('profile-age') as HTMLInputElement)?.value || '0');
    const heightVal = parseInt((document.getElementById('profile-height') as HTMLInputElement)?.value || '0');
    const genderVal = (document.getElementById('profile-gender') as HTMLSelectElement)?.value || '';
    const isTempChecked = (document.getElementById('profile-temp-save') as HTMLInputElement)?.checked || false;

    if (!nameVal.trim()) {
      alert(lang === 'en' ? 'Please enter your name.' : 'कृपया तुमचे नाव प्रविष्ट करा.');
      return;
    }
    if (ageVal <= 0 || ageVal > 115) {
      alert(lang === 'en' ? 'Please enter a valid age (1-115).' : 'कृपया वैध वय प्रविष्ट करा (१-११५).');
      return;
    }
    if (heightVal <= 50 || heightVal > 250) {
      alert(lang === 'en' ? 'Please enter a valid height (50-250 cm).' : 'कृपया वैध उंची प्रविष्ट करा (५०-२५० सेमी).');
      return;
    }
    if (!genderVal) {
      alert(lang === 'en' ? 'Please select a gender.' : 'कृपया तुमचे लिंग निवडा.');
      return;
    }

    const newProfile = { name: nameVal, height: heightVal, age: ageVal, gender: genderVal };
    
    if (isTempChecked) {
      sessionStorage.setItem('prakriti_profile', JSON.stringify(newProfile));
      sessionStorage.setItem('prakriti_temp_save', 'true');
      sessionStorage.setItem('prakriti_auth', 'true');
      localStorage.removeItem('prakriti_auth');
      localStorage.removeItem('prakriti_profile');
      localStorage.removeItem('prakriti_baseline_scores');
      localStorage.removeItem('prakriti_retest_scores');
      setIsTempSave(true);
    } else {
      localStorage.setItem('prakriti_profile', JSON.stringify(newProfile));
      localStorage.setItem('prakriti_auth', 'true');
      sessionStorage.removeItem('prakriti_auth');
      sessionStorage.removeItem('prakriti_profile');
      sessionStorage.removeItem('prakriti_baseline_scores');
      sessionStorage.removeItem('prakriti_retest_scores');
      sessionStorage.removeItem('prakriti_temp_save');
      setIsTempSave(false);
    }

    setProfile(newProfile);
    setStep('intro');
  };

  // Trigger Sign Out
  const handleSignOut = () => {
    localStorage.removeItem('prakriti_auth');
    localStorage.removeItem('prakriti_profile');
    localStorage.removeItem('prakriti_baseline_scores');
    localStorage.removeItem('prakriti_retest_scores');
    sessionStorage.removeItem('prakriti_auth');
    sessionStorage.removeItem('prakriti_profile');
    sessionStorage.removeItem('prakriti_baseline_scores');
    sessionStorage.removeItem('prakriti_retest_scores');
    sessionStorage.removeItem('prakriti_temp_save');

    setIsAuthenticated(false);
    setProfile(null);
    setBaselineScores(null);
    setRetestScores(null);
    setAnalysis(null);
    setUsername('');
    setPassword('');
    setAnswers(Array(QUESTIONS.length).fill(undefined));
    setCurrentIdx(0);
    setIsTempSave(false);
    setStep('login');
  };

  // Simulate Retest and save
  const handleSimulateRetest = () => {
    if (!baselineScores) return;

    // Shift Vata, Pitta, Kapha 35% closer to perfect balanced equilibrium (Tridoshic, total/3)
    const total = baselineScores.vata + baselineScores.pitta + baselineScores.kapha;
    const balancedAvg = total / 3;

    const simulated = {
      vata: Math.max(1, Math.round(baselineScores.vata + (balancedAvg - baselineScores.vata) * 0.35)),
      pitta: Math.max(1, Math.round(baselineScores.pitta + (balancedAvg - baselineScores.pitta) * 0.35)),
      kapha: Math.max(1, Math.round(baselineScores.kapha + (balancedAvg - baselineScores.kapha) * 0.35)),
    };

    if (isTempSave) {
      sessionStorage.setItem('prakriti_retest_scores', JSON.stringify(simulated));
    } else {
      localStorage.setItem('prakriti_retest_scores', JSON.stringify(simulated));
    }
    setRetestScores(simulated);
    setActiveTab('summary');
  };

  const generateAnalysis = useCallback(async (currentAnswers: (number | undefined)[]) => {
    setStep('loading');
    const scores = { vata: 0, pitta: 0, kapha: 0 };
    currentAnswers.forEach((val, i) => {
      if (val !== undefined && QUESTIONS[i]) {
        const opt = QUESTIONS[i].options[val].scores;
        scores.vata += opt.vata;
        scores.pitta += opt.pitta;
        scores.kapha += opt.kapha;
      }
    });

    try {
      const response = await fetch("/api/prakriti/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scores, lang, profile }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || "Ayurvedic analysis process failed.");
      }

      const parsed = await response.json();
      if (parsed) {
        setAnalysis({ ...parsed, scores });
        if (isTempSave) {
          sessionStorage.setItem('prakriti_baseline_scores', JSON.stringify(scores));
        } else {
          localStorage.setItem('prakriti_baseline_scores', JSON.stringify(scores));
        }
        setBaselineScores(scores);
        setStep('results');
      } else {
        throw new Error("Empty analysis payload.");
      }
    } catch (err) {
      console.error("Clinical Blueprint Generation Error:", err);
      alert(t.error);
      setStep('quiz');
    }
  }, [lang, profile, t.error]);

  const handleSelect = useCallback((optionIdx: number) => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    let latestAnswers: (number | undefined)[] = [];
    
    setAnswers(prev => {
      const next = [...prev];
      next[currentIdx] = optionIdx;
      latestAnswers = next;
      return next;
    });

    setTimeout(() => {
      if (currentIdx < QUESTIONS.length - 1) {
        setCurrentIdx(prev => Math.min(prev + 1, QUESTIONS.length - 1));
        setIsTransitioning(false);
      } else {
        generateAnalysis(latestAnswers);
        setIsTransitioning(false);
      }
    }, 300); 
  }, [currentIdx, generateAnalysis, isTransitioning]);

  const handlePrev = useCallback(() => {
    if (isTransitioning) return;
    if (currentIdx > 0) setCurrentIdx(prev => prev - 1);
    else setStep('intro');
  }, [currentIdx, isTransitioning]);

  useEffect(() => {
    if (step !== 'quiz') return;
    const handleKey = (e: KeyboardEvent) => {
      if (isTransitioning) return;
      if (e.key === '1') handleSelect(0);
      else if (e.key === '2') handleSelect(1);
      else if (e.key === '3') handleSelect(2);
      else if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [step, handleSelect, handlePrev, isTransitioning]);

  const fallbackCopy = (text: string) => {
    try {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      if (successful) {
        setCopiedState(true);
        setTimeout(() => setCopiedState(false), 2000);
      }
    } catch (err) {
      console.error("Fallback copy failed:", err);
    }
  };

  const handleShare = () => {
    if (!analysis) return;

    const vata = analysis.scores?.vata || 0;
    const pitta = analysis.scores?.pitta || 0;
    const kapha = analysis.scores?.kapha || 0;
    const total = vata + pitta + kapha;
    const vataPercent = total > 0 ? Math.round((vata / total) * 100) : 0;
    const pittaPercent = total > 0 ? Math.round((pitta / total) * 100) : 0;
    const kaphaPercent = total > 0 ? Math.round((kapha / total) * 100) : 0;

    const mainHeader = lang === 'en' ? '🌿 My Ayurvedic Prakriti Profile' : '🌿 माझी आयुर्वेदिक प्रकृती';
    const doshaLabel = lang === 'en' ? 'Primary Constitution' : 'मुख्य प्रकृती';
    const breakdownLabel = lang === 'en' ? 'Dosha Breakdown' : 'दोषांचे विश्लेषण';
    const summaryLabel = lang === 'en' ? 'Holistic Summary' : 'सखोल मार्गदर्शक';

    const shareText = `${mainHeader}
User: ${profile?.name || 'Ayurveda Seeker'} (${profile?.gender || ''}, ${profile?.age || ''} yrs)

✨ ${doshaLabel}: ${analysis.dosha}

📊 ${breakdownLabel}:
- Vata: ${vataPercent}%
- Pitta: ${pittaPercent}%
- Kapha: ${kaphaPercent}%

📝 ${summaryLabel}:
${analysis.summary}

Explore your own Ayurvedic blueprint at ${window.location.origin}`;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(shareText)
        .then(() => {
          setCopiedState(true);
          setTimeout(() => setCopiedState(false), 2000);
        })
        .catch(err => {
          console.error("Clipboard copy failed, using fallback:", err);
          fallbackCopy(shareText);
        });
    } else {
      fallbackCopy(shareText);
    }
  };

  const playTTS = async () => {
    if (isAudioPlaying) {
      audioSourceRef.current?.stop();
      setIsAudioPlaying(false);
      return;
    }
    if (!analysis) return;
    try {
      const text = `${analysis.dosha || ''}. ${analysis.summary || ''}. ${analysis.detailed_explanation || ''}`;
      setIsAudioPlaying(true);

      const response = await fetch("/api/prakriti/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, lang }),
      });

      if (!response.ok) {
        throw new Error("Unable to synthesize audio from request.");
      }

      const data = await response.json();
      if (data && data.audio) {
        if (!audioContextRef.current) audioContextRef.current = new AudioContext({ sampleRate: 24000 });
        const binary = atob(data.audio);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
        const int16 = new Int16Array(bytes.buffer);
        const buffer = audioContextRef.current.createBuffer(1, int16.length, 24000);
        const channelData = buffer.getChannelData(0);
        for (let i = 0; i < int16.length; i++) channelData[i] = int16[i] / 32768.0;
        
        const source = audioContextRef.current.createBufferSource();
        source.buffer = buffer;
        source.connect(audioContextRef.current.destination);
        source.onended = () => setIsAudioPlaying(false);
        source.start();
        audioSourceRef.current = source;
      } else {
        throw new Error("Did not receive a valid audio payload.");
      }
    } catch (err) {
      console.error("Vocalizer synthesis error:", err);
      setIsAudioPlaying(false);
    }
  };

  return (
    <div className="app-container">
      <div className="language-selector-fixed">
        <button onClick={() => setLang('en')} className={`lang-pill ${lang === 'en' ? 'active' : ''}`}>English</button>
        <button onClick={() => setLang('mr')} className={`lang-pill ${lang === 'mr' ? 'active' : ''}`}>मराठी</button>
      </div>

      <header>
        <div className="logo">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>
          <h1>{t.title}</h1>
        </div>
        <p className="subtitle">{t.subtitle}</p>
      </header>

      {isAuthenticated && profile && (
        <div className="user-profile-bar">
          <span className="user-welcome-text">🌿 {profile.name}</span>
          <span className="user-metadata-badge">
            {profile.age} yrs • {profile.height} cm • {profile.gender === 'male' ? t.male : profile.gender === 'female' ? t.female : profile.gender === 'other' ? t.other : t.pnotSay}
          </span>
          <button 
            onClick={handleSignOut}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: '#d9534f',
              fontSize: '0.75rem',
              fontWeight: 700,
              fontFamily: 'var(--font-display)',
              textTransform: 'uppercase'
            }}
          >
            {lang === 'en' ? 'Sign Out' : 'बाहेर पडा'}
          </button>
        </div>
      )}

      <main>
        {/* Step: Login */}
        {step === 'login' && (
          <div className="auth-container">
            <h2 className="form-title">{t.loginTitle}</h2>
            <p className="form-subtitle">{t.loginDesc}</p>

            <details className="demo-credentials-box" style={{ marginBottom: '1.5rem', cursor: 'pointer' }}>
              <summary className="demo-credentials-title" style={{ fontWeight: 600, outline: 'none', userSelect: 'none' }}>🔑 {t.demoCreds} (Click to view)</summary>
              <div style={{ marginTop: '0.5rem', fontSize: '0.9rem', lineHeight: '1.4' }}>
                <p><strong>{t.username}:</strong> <code>user1@gmail.com</code></p>
                <p><strong>{t.password}:</strong> <code>123456</code></p>
              </div>
            </details>

            <form onSubmit={handleLoginSubmit}>
              <div className="form-group">
                <label className="form-label">{t.username}</label>
                <input 
                  type="text" 
                  className="input-field" 
                  value={username} 
                  onChange={(e) => setUsername(e.target.value)} 
                  required 
                  placeholder="e.g. user1@gmail.com"
                />
              </div>

              <div className="form-group">
                <label className="form-label">{t.password}</label>
                <input 
                  type="password" 
                  className="input-field" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                  placeholder="••••••••"
                />
              </div>

              <div className="form-group" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '0.5rem', marginTop: '1rem', marginBottom: '1rem' }}>
                <input 
                  type="checkbox" 
                  id="login-temp-save" 
                  checked={isTempSave}
                  onChange={(e) => setIsTempSave(e.target.checked)}
                  style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: 'var(--primary)' }}
                />
                <label htmlFor="login-temp-save" style={{ fontSize: '0.85rem', cursor: 'pointer', userSelect: 'none', color: '#666' }}>
                  {lang === 'en' ? 'Save temporarily (Session only, clears on tab close)' : 'तात्पुरते जतन करा (फक्त या सत्रासाठी, टॅब बंद केल्यावर हटवले जाईल)'}
                </label>
              </div>

              {loginError && <p className="auth-error">{loginError}</p>}

              <button type="submit" className="form-submit-btn">{t.signInBtn}</button>
            </form>
          </div>
        )}

        {/* Step: Profile */}
        {step === 'profile' && (
          <div className="profile-container">
            <h2 className="form-title">{t.profileTitle}</h2>
            <p className="form-subtitle">{t.profileDesc}</p>

            <form onSubmit={handleProfileSubmit}>
              <div className="form-group">
                <label className="form-label">{t.fullName}</label>
                <input 
                  id="profile-name" 
                  type="text" 
                  className="input-field" 
                  defaultValue={profile?.name || ''} 
                  required 
                  placeholder="e.g. Jane Doe"
                />
              </div>

              <div className="form-group" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="form-label">{t.age}</label>
                  <input 
                    id="profile-age" 
                    type="number" 
                    className="input-field" 
                    defaultValue={profile?.age || ''} 
                    required 
                    min="1" 
                    max="115"
                    placeholder="25"
                  />
                </div>
                <div>
                  <label className="form-label">{t.height}</label>
                  <input 
                    id="profile-height" 
                    type="number" 
                    className="input-field" 
                    defaultValue={profile?.height || ''} 
                    required 
                    min="50" 
                    max="250"
                    placeholder="165"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">{t.gender}</label>
                <select id="profile-gender" className="select-field" defaultValue={profile?.gender || ''} required>
                  <option value="" disabled>{t.selectGender}</option>
                  <option value="male">{t.male}</option>
                  <option value="female">{t.female}</option>
                  <option value="other">{t.other}</option>
                  <option value="pnotSay">{t.pnotSay}</option>
                </select>
              </div>

              <div className="form-group" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '0.5rem', marginTop: '1rem', marginBottom: '1rem' }}>
                <input 
                  type="checkbox" 
                  id="profile-temp-save" 
                  defaultChecked={isTempSave}
                  style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: 'var(--primary)' }}
                />
                <label htmlFor="profile-temp-save" style={{ fontSize: '0.85rem', cursor: 'pointer', userSelect: 'none', color: '#666' }}>
                  {lang === 'en' ? 'Save temporarily (Session only, clears on tab close)' : 'तात्पुरते जतन करा (फक्त या सत्रासाठी, टॅब बंद केल्यावर हटवले जाईल)'}
                </label>
              </div>

              <button type="submit" className="form-submit-btn">{t.saveProfile}</button>
            </form>
          </div>
        )}

        {/* Step: Intro */}
        {step === 'intro' && (
          <div className="intro-section section-lift-in" key="intro">
            <div className="dosha-indicators">
              <div className="dosha-item vata-bg">Vata</div>
              <div className="dosha-item pitta-bg">Pitta</div>
              <div className="dosha-item kapha-bg">Kapha</div>
            </div>
            <p className="intro-description">{t.desc}</p>
            <button id="start-button" onClick={() => setStep('quiz')}>{t.start}</button>
          </div>
        )}

        {/* Step: Quiz */}
        {step === 'quiz' && (
          <div className="quiz-container section-lift-in" key={`quiz-step`}>
            {QUESTIONS[currentIdx] ? (
              <div className="question-slide-in" key={`q-container-${currentIdx}`}>
                <div className="progress-bar-container"><div className="progress-bar-filler" style={{ width: `${((currentIdx + 1) / QUESTIONS.length) * 100}%` }} /></div>
                <div className="question-container">
                  <button className="back-action-btn" onClick={handlePrev} disabled={isTransitioning}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                    {t.previous}
                  </button>
                  
                  <div className="question-meta">
                    <span className="section-name">{t[QUESTIONS[currentIdx].section]}</span>
                    <span className="idx-info">{currentIdx + 1} / {QUESTIONS.length}</span>
                  </div>
                  <h2 className="question-text">{QUESTIONS[currentIdx].text[lang]}</h2>
                  <div className="options-list">
                    {QUESTIONS[currentIdx].options.map((opt, i) => (
                      <button 
                        key={i} 
                        className={`option-button ${answers[currentIdx] === i ? 'selected' : ''} ${isTransitioning ? 'transitioning' : ''}`} 
                        onClick={() => handleSelect(i)}
                        disabled={isTransitioning}
                      >
                        <span className="opt-key">{i+1}</span> 
                        <span className="opt-text">{opt.text[lang]}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        )}

        {/* Step: Loading */}
        {step === 'loading' && (
          <div className="loading-indicator section-lift-in" key="loading">
            <div className="loading-animation">
              <span className="loading-icon vata">💨</span>
              <span className="loading-icon pitta">🔥</span>
              <span className="loading-icon kapha">💧</span>
            </div>
            <p className="loading-text" key={loadingMsgIdx}>{LOADING_MESSAGES[lang][loadingMsgIdx]}</p>
          </div>
        )}

        {/* Step: Results */}
        {step === 'results' && analysis && (
          <div className="results-container section-lift-in" key="results">
            
            {/* Tabs Navigation */}
            <div className="tabs-navigation">
              <button onClick={() => setActiveTab('summary')} className={`tab-trigger-btn ${activeTab === 'summary' ? 'active' : ''}`}>{t.tabSummary}</button>
              <button onClick={() => setActiveTab('foods')} className={`tab-trigger-btn ${activeTab === 'foods' ? 'active' : ''}`}>{t.tabFoods}</button>
              <button onClick={() => setActiveTab('precautions')} className={`tab-trigger-btn ${activeTab === 'precautions' ? 'active' : ''}`}>{t.tabPrecautions}</button>
              <button onClick={() => setActiveTab('tips')} className={`tab-trigger-btn ${activeTab === 'tips' ? 'active' : ''}`}>{t.tabSuggestions}</button>
              <button onClick={() => setActiveTab('yoga')} className={`tab-trigger-btn ${activeTab === 'yoga' ? 'active' : ''}`}>{t.tabYoga}</button>
              <button onClick={() => setActiveTab('causes')} className={`tab-trigger-btn ${activeTab === 'causes' ? 'active' : ''}`}>{t.tabCauses}</button>
            </div>

            {/* TAB: Summary */}
            {activeTab === 'summary' && (
              <div className="tab-content-box" style={{ animation: 'sectionLiftIn 0.4s ease' }}>
                <div className={`dominant-dosha-card ${(analysis.dosha || '').toLowerCase().includes('vata') ? 'vata' : (analysis.dosha || '').toLowerCase().includes('pitta') ? 'pitta' : 'kapha'}`}>
                  <h2>{t.primary}</h2>
                  <p className="dosha-name">{analysis.dosha || 'Analysis Complete'}</p>
                  <p className="summary-text">{analysis.summary || ''}</p>
                  <DoshaChart scores={analysis.scores} />
                </div>

                <div className="results-buttons-row" style={{ marginBottom: '2rem' }}>
                  <button onClick={playTTS} className="audio-btn">
                    {isAudioPlaying ? <Square size={18} /> : <Volume2 size={18} />}
                    <span>{isAudioPlaying ? t.stop : t.listen}</span>
                  </button>

                  <button onClick={handleShare} className={`share-btn ${copiedState ? 'copied' : ''}`}>
                    {copiedState ? <Check size={18} /> : <Share2 size={18} />}
                    <span>{copiedState ? t.copied : t.share}</span>
                  </button>
                </div>

                {/* Retest Banner or Graph */}
                {!retestScores ? (
                  <div className="retest-banner-card">
                    <h3 className="retest-banner-title">🔄 {t.retestBannerTitle}</h3>
                    <p className="retest-banner-desc">{t.retestBannerDesc}</p>
                    <button onClick={handleSimulateRetest} className="retest-trigger-btn">
                      {t.retestBtn}
                    </button>
                  </div>
                ) : (
                  <ProgressGraph baseline={baselineScores} retest={retestScores} lang={lang} />
                )}

                {/* Constitutional Risk Dial */}
                {analysis.risk_percentage !== undefined && (
                  <RiskGauge percentage={analysis.risk_percentage} lang={lang} />
                )}

                {/* Main insights block */}
                {analysis.detailed_explanation && (
                  <details open className="insight-card" style={{ marginTop: '2rem' }}>
                    <summary className="detail-summary" style={{ borderRadius: '18px 18px 0 0' }}>{t.insight}</summary>
                    <div className="detailed-explanation" style={{ border: '1px solid rgba(45, 90, 39, 0.08)', borderRadius: '0 0 18px 18px' }}>
                      {analysis.detailed_explanation.split('\n').map((p: string, i: number) => <p key={i} style={{ marginBottom: '1rem' }}>{p}</p>)}
                    </div>
                  </details>
                )}
              </div>
            )}

            {/* TAB: Foods to Avoid */}
            {activeTab === 'foods' && (
              <div className="tab-content-box">
                <h3 className="tab-section-header">🚫 {t.tabFoods}</h3>
                <p className="tab-section-intro">
                  {lang === 'en' 
                    ? `Foods that significantly aggravate your current dominant dosha state. Strictly limit or avoid these to prevent structural and gastrointestinal imbalances.` 
                    : `तुमच्या शरीरातील दोषांचे प्रमाण वाढवणारे किंवा बिघडवणारे अन्नपदार्थ. पचनक्रिया आणि शारीरिक स्वास्थ्य बिघडू नये म्हणून या आहाराचे सेवन टाळावे.`}
                </p>
                <ul className="recommendation-list">
                  {(analysis.foods_to_avoid || []).map((food: string, i: number) => (
                    <li key={i} className="recommendation-item" style={{ fontSize: '1.1rem', padding: '0.6rem 0', borderBottom: '1px solid rgba(0,0,0,0.02)' }}>
                      ❌ {food}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* TAB: Precautions */}
            {activeTab === 'precautions' && (
              <div className="tab-content-box">
                <h3 className="tab-section-header">⚠️ {t.tabPrecautions}</h3>
                <p className="tab-section-intro">
                  {lang === 'en'
                    ? `Important lifestyle warnings, environmental factors, and clinical habits to look out for to maintain metabolic and constitutional equilibrium.`
                    : `शारीरिक आणि मानसिक संतुलन राखण्यासाठी आवश्यक असलेली जीवनशैलीतील काळजी आणि घ्यावयाची खबरदारी.`}
                </p>

                <h4 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--primary)', marginBottom: '1rem', marginTop: '1.5rem' }}>
                  {lang === 'en' ? 'Clinical Precautions & Cautions' : 'महत्त्वाची काळजी आणि सावधगिरी'}
                </h4>
                <ul className="recommendation-list">
                  {(analysis.precautions || []).map((prec: string, i: number) => (
                    <li key={i} className="recommendation-item" style={{ padding: '0.5rem 0' }}>
                      🔸 {prec}
                    </li>
                  ))}
                </ul>

                {analysis.risks && analysis.risks.length > 0 && (
                  <>
                    <h4 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: '#c94c4c', marginBottom: '1rem', marginTop: '2rem' }}>
                      {t.risks}
                    </h4>
                    <ul className="recommendation-list">
                      {analysis.risks.map((rk: string, i: number) => (
                        <li key={i} className="recommendation-item" style={{ padding: '0.5rem 0' }}>
                          ⚠️ {rk}
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            )}

            {/* TAB: Tips */}
            {activeTab === 'tips' && (
              <div className="tab-content-box">
                <h3 className="tab-section-header">💡 {t.tabSuggestions}</h3>
                <p className="tab-section-intro">
                  {lang === 'en'
                    ? `Actionable daily tips, custom lifestyle adjustments, and practical home remedies to keep your biological elements beautifully balanced.`
                    : `जैविक घटकांना संतुलित ठेवण्यासाठी दैनंदिन उपयुक्त टिप्स, जीवनशैलीतील बदल आणि व्यावहारिक घरगुती सल्ले.`}
                </p>

                <h4 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--primary)', marginBottom: '1rem', marginTop: '1.5rem' }}>
                  {lang === 'en' ? 'Lifestyle Suggestions & Tips' : 'जीवनशैली सल्ले व सोप्या टिप्स'}
                </h4>
                <ul className="recommendation-list">
                  {(analysis.suggestions_tips || []).map((tip: string, i: number) => (
                    <li key={i} className="recommendation-item" style={{ padding: '0.5rem 0' }}>
                      ✨ {tip}
                    </li>
                  ))}
                </ul>

                {analysis.advice && analysis.advice.length > 0 && (
                  <>
                    <h4 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--primary)', marginBottom: '1rem', marginTop: '2rem' }}>
                      {t.advice}
                    </h4>
                    <ul className="recommendation-list">
                      {analysis.advice.map((ad: string, i: number) => (
                        <li key={i} className="recommendation-item" style={{ padding: '0.5rem 0' }}>
                          🌱 {ad}
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            )}

            {/* TAB: Yoga & Exercises */}
            {activeTab === 'yoga' && (
              <div className="tab-content-box">
                <h3 className="tab-section-header">🧘 {t.tabYoga}</h3>
                <p className="tab-section-intro">
                  {lang === 'en'
                    ? `Exercises and specific yoga asanas tailored directly to your age (${profile?.age || 'N/A'}), gender, and body frame, ensuring natural revitalization without physical strain.`
                    : `तुमच्या वय (${profile?.age || 'N/A'}), लिंग आणि शरीरयष्टीनुसार डिझाइन केलेली योगासने आणि व्यायाम प्रकार, ज्यामुळे शरीराला थकवा न येता नैसर्गिक ताकद मिळेल.`}
                </p>
                <ul className="recommendation-list">
                  {(analysis.exercises_yoga || []).map((ex: string, i: number) => (
                    <li key={i} className="recommendation-item" style={{ padding: '0.6rem 0', borderBottom: '1px solid rgba(0,0,0,0.02)' }}>
                      🧘 {ex}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* TAB: Causes & Reasons */}
            {activeTab === 'causes' && (
              <div className="tab-content-box">
                <h3 className="tab-section-header">🧬 {t.tabCauses}</h3>
                <p className="tab-section-intro">
                  {lang === 'en'
                    ? `Understanding the underlying environmental, dietary, and metabolic reasons why these particular doshas fluctuate or dominate in your constitution.`
                    : `तुमच्या प्रकृतीमध्ये हे विशिष्ट दोष कमी-अधिक का होतात आणि त्याला कारणीभूत ठरणारे पर्यावरणीय व पचनक्रिया संबंधी मूळ घटक जाणून घ्या.`}
                </p>
                <ul className="recommendation-list">
                  {(analysis.causes_reasons || []).map((cause: string, i: number) => (
                    <li key={i} className="recommendation-item" style={{ padding: '0.6rem 0', borderBottom: '1px solid rgba(0,0,0,0.02)' }}>
                      🔬 {cause}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <button 
              onClick={() => { 
                setAnswers(Array(QUESTIONS.length).fill(undefined)); 
                setCurrentIdx(0); 
                setStep('intro'); 
                setIsTransitioning(false); 
                setActiveTab('summary');
              }} 
              className="restart-btn"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="restart-icon"><path d="M23 4v6h-6"></path><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path></svg>
              {t.restart}
            </button>
          </div>
        )}
      </main>

      <footer>© {new Date().getFullYear()} Ayurvedic Prakriti Blueprint • Efficient Clinical Analysis</footer>
    </div>
  );
};

const container = document.getElementById('root');
if (container) createRoot(container).render(<App />);