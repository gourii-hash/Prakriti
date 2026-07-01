# Prakriti Ayurvedic Blueprint Portal 🌿

An elegant, fully-responsive, and clinically-detailed Ayurvedic constitutional diagnosis portal with dynamic AI analysis, bilingual Marathi support, interactive 1-month progress charts, constitutional health risk evaluation, and personalized recommendations based on demographic measurements.

---

## ✨ Features

- **Secure Sign-In Interface:**
  - Standard secure login using private credential handling.
  - Hidden collapsible **Demo Credentials Box** containing secure login info:
    - **Username:** `user1@gmail.com`
    - **Password:** `123456`
  - Fully implements a **"Save Temporarily" Toggle (Session storage vs Local storage)** which dynamically prevents long-term storage and clears all session state immediately when closing the browser tab or signing out.

- **Demographic Measurement Integration:**
  - Prompts for **Full Name**, **Age**, **Height (cm)**, and **Gender** immediately upon signing in.
  - Passes these vital signs directly to the clinical AI engine to generate highly specific recommendations (e.g., customized exercises and yoga poses appropriate for the user's age, gender, and current physiological state).

- **Clinical Dual-Pass Analysis with Tabbed Interface:**
  - Runs advanced server-side Gemini 3.5 analysis using structured schema outputs to construct a beautiful multi-faceted prescription.
  - Organized elegantly into interactive navigation tabs:
    1. **Summary:** Displays dominant doshas, holistic descriptions, and a visual constitutional chart.
    2. **Avoid Foods:** Precise, dosha-aggravating foods that should be strictly avoided or limited.
    3. **Precautions:** Crucial daily warnings, habits, and environmental triggers to look out for.
    4. **Tips:** General helpful health suggestions, remedies, and wellness modifications.
    5. **Yoga & Exercise:** Specific yoga asanas, physical poses, and quick exercise movements optimized for your physical frame.
    6. **Causes:** Root physiological, metabolic, and metabolic reasons behind your doshic imbalances.

- **1-Month Comparative Progress Graph:**
  - Simulates a **1-Month Retest** showing how daily adherence to the lifestyle prescription successfully stabilizes and balances your baseline doshic proportions.
  - Dynamically calculates the drift of each dosha (Vata, Pitta, Kapha) towards optimal balance (the balanced equilibrium average) and reports individual improvement trends.

- **Constitutional Health Risk Percentage Dial:**
  - Calculates a demographic and constitution-based **Health Risk Percentage** (0% - 100%) indicating current vulnerability to developing dosha-specific physical or metabolic complications.
  - Illustrated with a visually polished circular progress gauge colored conditionally (Green for Low Risk, Amber for Moderate, Red for High Risk).

- **Full Marathi Bilingual Localization:**
  - Implements translation mechanisms to switch between English and Marathi for all UI elements, quiz steps, and generated analysis details.

---

## 🛠️ Tech Stack & Architecture

- **Frontend:** React 19, TypeScript, Lucide Icons
- **Backend:** Node.js (Express 5.x) serving static assets and proxying Gemini AI requests.
- **AI Integration:** Google GenAI SDK (`@google/genai` utilizing the hyper-fast `gemini-3.5-flash` model).
- **Styling:** Vanilla CSS Custom Variables + Modern CSS Grid and Flex layouts featuring smooth keyframe entrance animations and glassmorphism cards.
- **Port Constraints:** Fully configured to serve exclusively on internal port `3000` via the root reverse proxy.

---

## 🚀 Quick Start

1. Install dependencies:
   ```bash
   npm install
   ```
2. Build the production server and frontend:
   ```bash
   npm run build
   ```
3. Boot the development or production server:
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```
4. Access the application in your browser at `http://localhost:3000`.
