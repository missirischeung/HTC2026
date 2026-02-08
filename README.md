# CookSmart — Voice-Guided Cooking Assistant

A voice-guided cooking assistant that uses AI vision to analyze your camera feed and help you cook recipes step-by-step.

## Features

- **Recipe Selection** — Browse and preview recipes with step-by-step instructions
- **Live Camera Feed** — Real-time camera integration (prefers rear camera) for visual analysis
- **Voice Interaction** — Talk to the assistant using ElevenLabs voice agents
- **AI Vision Feedback** — Gemini analyzes camera frames to assess your cooking progress and provide feedback
- **Auto-Advance** — Automatically moves to the next step when AI confirms you've completed the current one

## Tech Stack

- React 19 + TypeScript
- Vite
- React Router
- [ElevenLabs React SDK](https://www.npmjs.com/package/@elevenlabs/react) — voice agent
- [Google GenAI SDK](https://www.npmjs.com/package/@google/genai) — Gemini vision analysis

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a `.env` file in the project root:

   ```env
   VITE_GEMINI_API_KEY=your_gemini_api_key
   VITE_AGENT_ID=your_elevenlabs_agent_id
   ```

3. Start the dev server:

   ```bash
   npm run dev
   ```

4. Grant camera and microphone permissions when prompted by the browser.


## Project Structure

```
src/
├── components/
│   ├── Camera.tsx          # Camera feed with toggle
│   ├── Instructions.tsx    # Step-by-step instruction pills
│   └── TalkButton.tsx      # Voice button + Gemini integration
├── pages/
│   ├── RecipeSelect.tsx    # Recipe grid with preview modal
│   └── Cook.tsx            # Main cooking view
├── data/
│   └── recipes.ts          # Recipe definitions
├── App.tsx                 # Router config
└── main.tsx                # Entry point
```

## Available Recipes

1. Minimalist Cucumber Salad
2. Simple Tomato Sauce
3. Quick Veg Stir-Fry
4. Soft Scrambled Eggs
