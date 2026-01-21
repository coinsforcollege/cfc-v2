# RFE App - Rewards For Education

A cross-platform mobile and web application for students, built with Expo and React Native.

## Required Assets

Before running the app, add the following images to the `assets/` folder:

- **icon.png** (1024x1024) - App icon for iOS and Android
- **splash-icon.png** (1024x1024) - Splash screen image
- **adaptive-icon.png** (1024x1024) - Android adaptive icon foreground
- **favicon.png** (32x32 or 48x48) - Web favicon

You can use images from `client/public/images/`:
- `CFC-blue-icon-square-transparent-bg.png` - Good for icon/adaptive-icon
- `rfe-logo-colored-bg.svg` - Convert to PNG for splash

## Tech Stack

- **Expo SDK 52** - React Native framework
- **Expo Router** - File-based navigation
- **Gluestack UI** - Component library
- **TypeScript** - Type safety
- **AsyncStorage** - Local data persistence

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)

### Installation

```bash
cd rfe-app
npm install
```

### Development

```bash
# Start development server
npm start

# Start on specific platform
npm run ios      # iOS Simulator
npm run android  # Android Emulator
npm run web      # Web browser
```

## Environment Configuration

Create a `.env` file in the `rfe-app` directory with the following variables:

```env
# API Configuration
# For local development:
# - Web/iOS Simulator: http://localhost:4000/api
# - Android Emulator: http://10.0.2.2:4000/api
# - Physical device: http://<YOUR_IP>:4000/api
EXPO_PUBLIC_API_URL=http://localhost:4000/api

# reCAPTCHA v3 Site Key (web only)
# Get your key from https://www.google.com/recaptcha/admin
# Leave empty to use Google's test key in development
EXPO_PUBLIC_RECAPTCHA_SITE_KEY=

# EAS Project ID (for production builds)
EAS_PROJECT_ID=
```

### Production Configuration

For production builds via EAS:

1. Set environment variables in EAS Secrets
2. Or use `eas.json` to configure per-profile environment variables

## Project Structure

```
rfe-app/
├── app/                    # Expo Router pages
│   ├── _layout.tsx        # Root layout with providers
│   ├── index.tsx          # Entry point (redirects based on auth)
│   ├── (auth)/            # Auth screens (public)
│   │   ├── login.tsx
│   │   ├── register.tsx
│   │   ├── verify-otp.tsx
│   │   ├── forgot-password.tsx
│   │   └── reset-password.tsx
│   └── (app)/             # App screens (protected)
│       └── index.tsx      # Dashboard
├── src/
│   ├── api/               # API client functions
│   ├── components/        # Reusable components
│   ├── config/            # App configuration
│   ├── contexts/          # React contexts
│   ├── hooks/             # Custom hooks
│   └── utils/             # Utility functions
├── assets/                # Images, fonts
├── app.config.ts          # Expo configuration
└── package.json
```

## Authentication Flow

1. **Login**: Email + Password + reCAPTCHA (web only)
2. **Registration**: 
   - Enter details (name, email, phone, password)
   - Verify email via OTP
   - Account created
3. **Forgot Password**:
   - Enter email
   - Verify via OTP
   - Set new password

### Student-Only Access

This app is restricted to student accounts only. Users with other roles (user, college_admin, platform_admin) are shown a message to use the main website at coinsforcollege.org.

## reCAPTCHA Handling

- **Web**: Uses Google reCAPTCHA v3 for bot protection
- **iOS/Android**: reCAPTCHA is skipped (backend accepts `platform: 'ios'|'android'`)

## Building for Production

### EAS Build

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Configure project
eas build:configure

# Build for platforms
eas build --platform ios
eas build --platform android
eas build --platform web
```

### Environment Variables for Production

Set these in EAS Secrets or your CI/CD:

- `EXPO_PUBLIC_API_URL`: Production API URL
- `EXPO_PUBLIC_RECAPTCHA_SITE_KEY`: Production reCAPTCHA key
- `EAS_PROJECT_ID`: Your EAS project ID

## CORS Configuration

For the backend to accept requests from the mobile apps:
- Native apps don't send Origin headers, so CORS doesn't apply
- For web, add your production domain to the server's `ALLOWED_ORIGINS`

## Troubleshooting

### Android Emulator can't connect to localhost

Use `10.0.2.2` instead of `localhost` in your API URL:
```env
EXPO_PUBLIC_API_URL=http://10.0.2.2:4000/api
```

### Physical device can't connect

Use your computer's local IP address:
```env
EXPO_PUBLIC_API_URL=http://192.168.x.x:4000/api
```

Find your IP:
- macOS: `ipconfig getifaddr en0`
- Windows: `ipconfig`
- Linux: `hostname -I`
