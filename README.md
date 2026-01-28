Pomodoro Timer - React Native Expo TypeScript
A feature-rich productivity timer built with React Native, Expo, and TypeScript. Features a bold retro-futuristic aesthetic with comprehensive customization options.
✨ Features
Core Timer Features

⏱️ Countdown Timer with precise second-by-second tracking
▶️ Start/Pause functionality with smooth animations
🔄 Reset Timer to default session duration
📊 Progress Ring visual indicator showing time completion

Pomodoro System

🍅 Focus Sessions (default: 25 minutes)
☕ Short Breaks (default: 5 minutes)
🌴 Long Breaks (default: 15 minutes)
🎯 Session Switching between Focus, Short Break, and Long Break
📈 Pomodoro Counter tracking completed focus sessions
🔢 Long Break Intervals (automatically triggers after X focus sessions)

Settings & Customization

🌓 Light/Dark Mode toggle with distinct color schemes
⚡ Auto-transition between sessions (optional)
⏲️ Customizable Session Times for all session types
🔢 Configurable Long Break Interval (how many pomodoros before long break)
💾 Settings Modal with easy-to-use interface

Design & UI

🎨 Retro-futuristic brutalist aesthetic
✨ Smooth animations including pulse effects and button interactions
🔄 Rotating background shapes for visual interest
🎭 Theme-aware colors adapting to light/dark mode
📱 Responsive design working on all screen sizes

🚀 Setup Instructions
Prerequisites

Node.js (v16 or higher)
npm or yarn
Expo CLI (optional)

Installation

Create new Expo project:

bash   npx create-expo-app pomodoro-timer --template blank-typescript
   cd pomodoro-timer

Replace App.tsx:

Copy the provided App.tsx into your project root


Install dependencies:

bash   npm install

Start the development server:

bash   npx expo start

Run on your platform:

iOS Simulator: Press i in the terminal
Android Emulator: Press a in the terminal
Web Browser: Press w in the terminal
Physical Device: Scan QR code with Expo Go app



📱 How to Use
Basic Usage

Start Timer: Tap the "▶ START" button to begin
Pause Timer: Tap "║║ PAUSE" to pause
Reset Timer: Tap "⟲ RESET" to restart current session
Clear Pomodoros: Tap "🍅 CLEAR" to reset pomodoro count

Session Management

Switch Sessions: Tap "Focus", "Short Break", or "Long Break" buttons
Auto-transition: When enabled, automatically starts next session
Session Flow: Focus → Short Break → Focus → Short Break → ... → Long Break

Settings Configuration

Tap the ⚙ icon in the top-right corner
Configure your preferences:

Dark Mode: Toggle between light and dark themes
Auto-transition: Enable/disable automatic session switching
Focus Time: Set duration for focus sessions (in minutes)
Short Break: Set duration for short breaks
Long Break: Set duration for long breaks
Long Break Interval: After how many focus sessions to take a long break


Tap "✓ SAVE" to apply changes or "✕ CANCEL" to discard

🎨 Theme Modes
Dark Mode (Default)

Focus: Deep blue background (#0a0e27) with cyan accents
Breaks: Purple-tinted background (#1a0f2e)
Primary color: Turquoise (#40E0D0)
Secondary color: Red (#FF4757)

Light Mode

Focus: Light blue-gray background (#f0f4f8)
Breaks: Soft pink background (#fdf4f5)
Primary color: Teal (#00897b)
Secondary color: Pink (#e91e63)

📂 Project Structure
pomodoro-timer/
├── App.tsx              # Main timer component with all features
├── package.json         # Dependencies
├── tsconfig.json        # TypeScript configuration
├── app.json            # Expo configuration
└── README.md           # Documentation
🔧 Customization
Default Timer Values
Modify these in the settings state:
typescriptconst [settings, setSettings] = useState<Settings>({
  focusTime: 25,           // Focus session duration (minutes)
  shortBreakTime: 5,       // Short break duration (minutes)
  longBreakTime: 15,       // Long break duration (minutes)
  autoTransition: true,    // Auto-start next session
  darkMode: true,          // Theme preference
  longBreakInterval: 4,    // Pomodoros before long break
});
Color Customization
Edit the getThemeColors() function to change color schemes for light/dark modes.
Animation Speed
Adjust animation durations in the useEffect hooks:

Pulse animation: Change duration values (default: 1000ms)
Background rotation: Change duration (default: 20000ms)

🎯 Pomodoro Technique
The traditional Pomodoro Technique workflow:

Choose a task
Work for 25 minutes (1 Pomodoro)
Take a 5-minute break
After 4 Pomodoros, take a longer 15-30 minute break

This app implements this technique with full customization!
🛠️ Technologies Used

React Native - Cross-platform mobile framework
Expo - Development and build platform
TypeScript - Type-safe JavaScript
React Hooks - State management (useState, useEffect, useRef)
Animated API - Smooth native animations
React Native Components - Modal, Switch, TextInput, ScrollView

📝 Feature Checklist

✅ Countdown timer
✅ Start/Pause/Reset functionality
✅ Focus, Short Break, and Long Break sessions
✅ Pomodoro counter
✅ Light/Dark mode settings
✅ Auto-transition between sessions
✅ Customizable session durations
✅ Progress indicator
✅ Session switching
✅ Settings persistence during session
✅ Smooth animations and transitions

🎨 Design Philosophy
The app features a retro-futuristic brutalist aesthetic inspired by:

1980s computer terminals and CRT displays
Cyberpunk neon aesthetics
Geometric minimalism
Monospace typography for technical feel
Bold color contrasts and glowing effects

📄 License
MIT License - Feel free to use this project for personal or commercial purposes.

Built for focus, productivity, and beautiful design 🍅⏱️✨
