# GymTracker AI

A modern, intelligent workout tracker built with Angular and Tailwind CSS. Log your lifts, visualize your progress with D3.js, and get AI-powered coaching tips using Google's Gemini API.

## Features

- **Comprehensive Logging:** Track weight, reps, sets, RPE (Rate of Perceived Exertion), and rest times for every exercise.
- **Advanced Metrics:** Automatically calculates total volume and estimated 1RM (One Rep Max) for each logged set.
- **Professional Dashboard:** View your weekly training volume and session frequency at a glance, along with a feed of your most recent activity.
- **Data Visualization:** Interactive D3.js charts plot your weight, reps, and sets over time to help you visualize your progress.
- **AI Coaching:** Get personalized, motivating advice and technical tips based on your recent workout history using the Gemini API.
- **Local Storage:** All your workout data is securely stored locally in your browser.

## Tech Stack

- **Framework:** Angular (v21+)
- **Styling:** Tailwind CSS
- **Data Visualization:** D3.js
- **AI Integration:** `@google/genai` (Gemini API)
- **State Management:** Angular Signals

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd gymtracker-ai
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Environment Variables:
   Create a `.env.local` file in the root directory and add your Gemini API key:
   ```env
   API_KEY=your_gemini_api_key_here
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:3000`.

## Usage

1. **Dashboard:** Start on the home screen to see your weekly stats and recent activity.
2. **Select a Muscle Group:** Tap on a category (e.g., Chest, Back, Legs) to view or add workouts for that group.
3. **Log a Workout:** Select a specific exercise (e.g., Bench Press) and tap the floating action button to log a new set. Enter the weight, reps, sets, RPE, and rest time.
4. **View Progress:** The chart will automatically update to show your progress over time.
5. **Ask the Coach:** Tap the "Coach" button to get AI-generated advice based on your recent logs for that exercise.

## License

This project is open source and available under the MIT License.
